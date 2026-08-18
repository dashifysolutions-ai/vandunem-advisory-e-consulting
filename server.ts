import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp, getApps, getApp } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Firebase Admin initialization & helper
let db: ReturnType<typeof getFirestore>;

function getFirestoreDb(): ReturnType<typeof getFirestore> {
  if (!db) {
    let projectId = process.env.GOOGLE_CLOUD_PROJECT || "gen-lang-client-0130274538";
    let databaseId = "ai-studio-vandunemadvisory-5e695190-429d-4572-ad62-ebaaaf6bf75d";
    
    // Read from firebase-applet-config.json if available
    try {
      const configPath = path.join(process.cwd(), "firebase-applet-config.json");
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        if (config.projectId) projectId = config.projectId;
        if (config.firestoreDatabaseId) databaseId = config.firestoreDatabaseId;
      }
    } catch (e) {
      console.warn("⚠️ Não foi possível ler o firebase-applet-config.json, usando valores por defeito:", e);
    }

    let firebaseApp;
    if (getApps().length === 0) {
      firebaseApp = initializeApp({
        projectId: projectId,
      });
    } else {
      firebaseApp = getApp();
    }
    
    db = getFirestore(firebaseApp, databaseId);
  }
  return db;
}

// Seeding function for Firestore collections
async function initFirestoreDatabase() {
  const firestore = getFirestoreDb();
  
  try {
    // 1. Seed Leads if collection is empty
    const leadsRef = firestore.collection("leads");
    const snapshot = await leadsRef.limit(1).get();
    if (snapshot.empty) {
      console.log("🌱 A semear o Firestore com leads iniciais...");
      const initialLeads = [
        {
          lead_id: "lead_1",
          nome: "Manuel Costa",
          empresa: "AngoDistribuidora Lda",
          setor: "Distribuição & Logística",
          tamanho_empresa: "PME",
          telefone: "+244 923 456 789",
          email: "m.costa@angodist.ao",
          problema: "Custos elevados de importação e falta de dados estruturados para tomada de decisão.",
          urgencia: "Imediata (dentro de 15 dias)",
          servico_recomendado: "02 — FINANCE & PERFORMANCE, 05 — PROCUREMENT, RISK & GOVERNANCE",
          origem: "Vandunem AI",
          status: "NEGOTIATION",
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          lead_id: "lead_2",
          nome: "Cláudia Santos",
          empresa: "Kandandu Restauração",
          setor: "Alimentação & Bebidas",
          tamanho_empresa: "Pequena",
          telefone: "+244 912 345 678",
          email: "claudia@kandandu.co.ao",
          problema: "Vender bem, mas sem saber se há lucro real ao fim do mês por falta de controlos financeiros.",
          urgencia: "No próximo mês",
          servico_recomendado: "01 — BUSINESS & STRATEGY, 02 — FINANCE & PERFORMANCE",
          origem: "Formulário de Contacto",
          status: "MEETING",
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          lead_id: "lead_3",
          nome: "Dr. Álvaro Baptista",
          empresa: "Clínica MediCare Luanda",
          setor: "Saúde & Bem-Estar",
          tamanho_empresa: "PME",
          telefone: "+244 954 888 123",
          email: "alvaro.baptista@medicare.ao",
          problema: "Processos manuais na recepção e facturação que atrasam o atendimento.",
          urgencia: "A planejar (próximos 3 meses)",
          servico_recomendado: "03 — AI & DATA, 04 — PRODUCT & OPERATIONS",
          origem: "Vandunem AI",
          status: "QUALIFIED",
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      for (const lead of initialLeads) {
        await leadsRef.doc(lead.lead_id).set(lead);
      }
    }

    // 2. Seed Analytics if not present
    const analyticsRef = firestore.collection("analytics").doc("dashboard");
    const doc = await analyticsRef.get();
    if (!doc.exists) {
      console.log("🌱 A semear o Firestore com analíticas iniciais...");
      const initialAnalytics = {
        visitantes: 1840,
        origens: {
          "Directo / Pesquisa": 820,
          "Redes Sociais": 540,
          "WhatsApp": 310,
          "Recomendações": 170
        },
        eventos: {
          CTA_CLICK: 412,
          AI_STARTED: 189,
          AI_COMPLETED: 94,
          WHATSAPP_CLICK: 154,
          CONTACT_SUBMITTED: 37,
          MEETING_REQUESTED: 12
        }
      };
      await analyticsRef.set(initialAnalytics);
    }
  } catch (error) {
    console.error("❌ Erro ao semear o banco Firestore:", error);
  }
}

// Helper to validate email format rigorously
function isValidEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) return false;
  const parts = trimmed.split("@");
  if (parts.length !== 2) return false;
  const domainParts = parts[1].split(".");
  if (domainParts.length < 2) return false;
  return domainParts[domainParts.length - 1].length >= 2;
}

// Helper to retrieve the active Gemini API Key securely (prioritizing CUSTOM_GEMINI_API_KEY)
function getGeminiApiKey(): string {
  const possibleKeys = [
    process.env.CUSTOM_GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY2,
    process.env.GOOGLE_API_KEY,
    process.env.GEMINI_KEY,
    process.env.API_KEY
  ];

  for (const k of possibleKeys) {
    if (k && k !== "MY_GEMINI_API_KEY" && k.trim().length > 5) {
      return k.trim();
    }
  }
  return "";
}

// Helper to categorize AI errors securely without leaking keys or internal credentials
function categorizeGeminiError(error: any): { statusCode: number; errorCode: string; userMessage: string } {
  const errMsg = (error?.message || error?.toString() || "").toLowerCase();
  const status = error?.status || error?.statusCode;

  if (
    status === 401 ||
    status === 403 ||
    errMsg.includes("api key") ||
    errMsg.includes("unauthenticated") ||
    errMsg.includes("permission_denied") ||
    errMsg.includes("invalid api key") ||
    errMsg.includes("api_key_invalid")
  ) {
    return {
      statusCode: 401,
      errorCode: "AUTH_ERROR",
      userMessage: "Falha de autenticação na API Gemini. A chave CUSTOM_GEMINI_API_KEY fornecida é inválida, não possui permissões ou expirou."
    };
  }

  if (
    status === 429 ||
    errMsg.includes("quota") ||
    errMsg.includes("resource_exhausted") ||
    errMsg.includes("rate limit") ||
    errMsg.includes("too many requests")
  ) {
    return {
      statusCode: 429,
      errorCode: "RATE_LIMIT",
      userMessage: "O limite de requisições da API Gemini foi atingido temporariamente. Por favor, aguarde alguns instantes e tente novamente."
    };
  }

  if (
    errMsg.includes("timeout") ||
    errMsg.includes("econnreset") ||
    errMsg.includes("etimedout") ||
    errMsg.includes("network") ||
    errMsg.includes("fetch failed")
  ) {
    return {
      statusCode: 504,
      errorCode: "NETWORK_TIMEOUT",
      userMessage: "Tempo limite esgotado ao comunicar com o serviço de inteligência artificial. Por favor, verifique a conexão e tente novamente."
    };
  }

  if (
    errMsg.includes("json") ||
    errMsg.includes("parse") ||
    errMsg.includes("schema") ||
    errMsg.includes("invalid response")
  ) {
    return {
      statusCode: 502,
      errorCode: "INVALID_RESPONSE",
      userMessage: "A inteligência artificial retornou uma resposta com formato inesperado. Por favor, tente novamente."
    };
  }

  return {
    statusCode: 500,
    errorCode: "INTERNAL_AI_ERROR",
    userMessage: "Não foi possível concluir a análise do diagnóstico de IA no momento. Por favor, tente novamente."
  };
}

// Lazy initialization of GoogleGenAI with active API key
function getGeminiClient(): GoogleGenAI {
  const key = getGeminiApiKey();
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// REST APIs
// 1. CRM Leads management
app.get("/api/leads", async (req, res) => {
  const adminPassword = req.headers["x-admin-password"];
  if (adminPassword !== "vandunem2026") {
    return res.status(401).json({ error: "Não autorizado." });
  }

  try {
    const firestore = getFirestoreDb();
    const snapshot = await firestore.collection("leads").orderBy("created_at", "desc").get();
    const leads: any[] = [];
    snapshot.forEach(doc => {
      leads.push(doc.data());
    });
    res.json({ success: true, leads });
  } catch (error) {
    console.error("Erro ao obter leads do Firestore:", error);
    res.status(500).json({ error: "Erro ao ler leads da base de dados." });
  }
});

app.post("/api/leads", async (req, res) => {
  try {
    const { nome, empresa, setor, tamanho_empresa, telefone, email, problema, urgencia, servico_recomendado, origem } = req.body;
    
    if (!nome || !telefone) {
      return res.status(400).json({ error: "Nome e Telefone/WhatsApp são campos obrigatórios." });
    }

    const lead_id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newLead = {
      lead_id,
      nome,
      empresa: empresa || "Não Informada",
      setor: setor || "Não Especificado",
      tamanho_empresa: tamanho_empresa || "Não Especificado",
      telefone,
      email: email || "Não Informado",
      problema: problema || "Nenhum detalhe adicional fornecido.",
      urgencia: urgencia || "Não Especificado",
      servico_recomendado: servico_recomendado || "Geral",
      origem: origem || "Formulário Directo",
      status: "NEW",
      created_at: new Date().toISOString()
    };

    const firestore = getFirestoreDb();
    await firestore.collection("leads").doc(lead_id).set(newLead);

    // Increment CONTACT_SUBMITTED count in analytics
    try {
      const analyticsRef = firestore.collection("analytics").doc("dashboard");
      await analyticsRef.update({
        "eventos.CONTACT_SUBMITTED": FieldValue.increment(1)
      });
    } catch (e) {
      console.error("Erro ao incrementar analíticas:", e);
    }

    res.status(201).json({ success: true, lead: newLead });
  } catch (error) {
    console.error("Erro ao salvar lead no Firestore:", error);
    res.status(500).json({ error: "Erro ao salvar o lead." });
  }
});

app.patch("/api/leads/:id", async (req, res) => {
  const adminPassword = req.headers["x-admin-password"];
  if (adminPassword !== "vandunem2026") {
    return res.status(401).json({ error: "Não autorizado." });
  }

  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["NEW", "QUALIFIED", "CONTACTED", "MEETING", "PROPOSAL", "NEGOTIATION", "WON", "LOST"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Status inválido." });
    }

    const firestore = getFirestoreDb();
    const leadRef = firestore.collection("leads").doc(id);
    const doc = await leadRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Lead não encontrado." });
    }

    await leadRef.update({ status });
    res.json({ success: true, lead: { ...doc.data(), status } });
  } catch (error) {
    console.error("Erro ao atualizar lead:", error);
    res.status(500).json({ error: "Erro ao atualizar o lead." });
  }
});

// Consultative Business Diagnostic Engine (Expert AI fallback & generator)
function generateFallbackDiagnosis(answers: {
  q1: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  q7?: string;
  q8?: string;
  q9?: string;
  q10?: string;
  q11?: string;
}) {
  const challenge = (answers.q1 || "").toLowerCase();
  const sector = answers.q2 || "Serviços Gerais";
  const size = answers.q3 || "PME";
  const impact = answers.q5 || "impacto operacional e financeiro";
  const company = answers.q9 || "a sua empresa";

  let areas: string[] = [];
  let problems: string[] = [];

  if (challenge.includes("finan") || challenge.includes("custo") || challenge.includes("lucro") || challenge.includes("caixa") || challenge.includes("dinheiro")) {
    areas = ["02 — FINANCE & PERFORMANCE", "01 — BUSINESS & STRATEGY"];
    problems = [
      "Inexistência de relatórios financeiros gerenciais em tempo real (DRE, Fluxo de Caixa Projetado e Margens por Produto).",
      "Vulnerabilidade à flutuação cambial e custos de reposição de stock no mercado angolano.",
      "Mistura de despesas operacionais com despesas correntes, dificultando o cálculo da margem de lucro real."
    ];
  } else if (challenge.includes("venda") || challenge.includes("client") || challenge.includes("estratég") || challenge.includes("mercado")) {
    areas = ["01 — BUSINESS & STRATEGY", "04 — PRODUCT & OPERATIONS"];
    problems = [
      "Ausência de um funil comercial estruturado com métricas claras de conversão e retenção de clientes em Luanda.",
      "Dependência de canais informais de prospecção com baixa previsibilidade de receita futura.",
      "Posicionamento de valor e precificação desalinhados com a capacidade de pagamento do segmento-alvo."
    ];
  } else if (challenge.includes("dado") || challenge.includes("ia") || challenge.includes("auto") || challenge.includes("sist") || challenge.includes("tecnolog")) {
    areas = ["03 — AI & DATA", "04 — PRODUCT & OPERATIONS"];
    problems = [
      "Processos operacionais manuais que consomem tempo excessivo da equipa e aumentam a taxa de erro humano.",
      "Silos de dados desintegrados impedindo tomadas de decisão rápidas baseadas em evidências reais.",
      "Falta de automação inteligente nos canais de atendimento e acompanhamento pós-venda."
    ];
  } else if (challenge.includes("oper") || challenge.includes("process") || challenge.includes("produt") || challenge.includes("equip")) {
    areas = ["04 — PRODUCT & OPERATIONS", "05 — PROCUREMENT, RISK, GOVERNANCE & COMPLIANCE"];
    problems = [
      "Falta de padronização nos fluxos operacionais internos (SOPs), gerando retrabalho constante.",
      "Gargalos de comunicação e desalinhamento de responsabilidades entre colaboradores e gestão.",
      "Baixa produtividade por colaborador devido à ausência de indicadores-chave de desempenho (KPIs)."
    ];
  } else if (challenge.includes("compra") || challenge.includes("forneced") || challenge.includes("risco") || challenge.includes("complia")) {
    areas = ["05 — PROCUREMENT, RISK, GOVERNANCE & COMPLIANCE", "02 — FINANCE & PERFORMANCE"];
    problems = [
      "Falta de auditoria preventiva e dependência excessiva de poucos fornecedores críticos.",
      "Ausência de políticas formais de conformidade fiscal e regulatória no ecossistema de Angola.",
      "Custos de aquisição inflacionados por falta de negociação estratégica de contratos de fornecimento."
    ];
  } else {
    areas = ["01 — BUSINESS & STRATEGY", "02 — FINANCE & PERFORMANCE", "04 — PRODUCT & OPERATIONS"];
    problems = [
      "Falta de alinhamento estratégico entre a visão dos sócios e a execução operacional do dia-a-dia.",
      "Controles internos e indicadores de produtividade insuficientes para o atual estágio da organização.",
      "Necessidade de reestruturação de processos para destravar margens e garantir sustentabilidade a longo prazo."
    ];
  }

  const resumoDesafio = `A análise preliminar para ${company} (${sector}, segmento ${size} com cerca de ${answers.q4 || "alguns"} colaboradores) aponta que o desafio em "${answers.q1}" reflete uma oportunidade crítica de estruturação e governança empresarial. O impacto relatado — "${impact}" — evidencia que a organização opera com perdas de eficiência que podem ser mitigadas com a implementação de controles de gestão, clareza financeira e processos ágeis adequados à realidade do mercado de Angola.`;

  const proximoPasso = `Recomendamos o agendamento urgente de uma sessão de Diagnóstico Start com um consultor corporativo sénior da Vandunem para mapeamento in loco dos processos, validação dos números e desenho do plano de acção de 90 dias.`;

  return {
    resumoDesafio,
    problemasIdentificados: problems,
    areasRecomendadas: areas,
    proximoPasso
  };
}

// 2. AI Triaging / Qualification
app.post("/api/ai/qualify", async (req, res) => {
  try {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11 } = req.body;

    // 1. Validation of required inputs
    if (!q1 || !q8 || !q10) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_REQUIRED_FIELDS",
        error: "Por favor, preencha todos os campos obrigatórios da triagem (Desafio, Nome e Contacto)."
      });
    }

    // 2. Strict Email validation
    if (!q11 || !isValidEmail(q11)) {
      return res.status(400).json({
        success: false,
        errorCode: "INVALID_EMAIL",
        error: "O endereço de e-mail fornecido é inválido. Por favor, introduza um formato de e-mail válido (ex: nome@empresa.com)."
      });
    }

    // 3. API Key check
    const key = getGeminiApiKey();
    if (!key || key.length < 5) {
      return res.status(400).json({
        success: false,
        errorCode: "API_KEY_MISSING",
        error: "A chave de API CUSTOM_GEMINI_API_KEY não foi detetada no servidor. Por favor, configure a variável de ambiente CUSTOM_GEMINI_API_KEY no painel de Segredos/Definições para ativar o diagnóstico de IA."
      });
    }

    // 4. Prepare context and prompt
    const contextText = `
    DADOS DECLARADOS DO DIAGNÓSTICO:
    - 1. Desafio Principal: ${q1}
    - 2. Setor de Atividade: ${q2 || "Não informado"}
    - 3. Porte da Empresa: ${q3 || "Não informado"}
    - 4. Número de Colaboradores: ${q4 || "Não informado"}
    - 5. Impacto Real do Desafio: ${q5 || "Não informado"}
    - 6. Tempo de Existência do Problema: ${q6 || "Não informado"}
    - 7. Urgência de Resolução: ${q7 || "Não informado"}
    - 8. Nome do Gestor/Executivo: ${q8}
    - 9. Nome da Empresa: ${q9 || "Não informada"}
    - 10. WhatsApp/Telefone: ${q10}
    - 11. E-mail Corporativo: ${q11}
    `;

    const systemPrompt = `
    Você é a inteligência artificial consultiva e estratégica da VANDUNEM ADVISORY & CONSULTING, consultoria empresarial de elite focada no ecossistema empresarial de Angola.
    
    SUA MISSÃO:
    Produzir uma análise diagnóstica executiva, rigorosa, técnica e orientada a resultados com base nas informações enviadas pelo gestor.
    
    DIRETRIZES TÉCNICAS E DE RIGOR:
    1. Redija uma síntese executiva sofisticada de 2 a 3 parágrafos sobre a dor do cliente, relacionando o impacto relatado com a realidade de gestão, custos, processos ou governança no mercado angolano.
    2. Identifique de 3 a 4 problemas de raiz estruturais específicos e técnicos.
    3. Mapeie e associe com precisão quais das 5 áreas da Vandunem são requeridas para sanar a causa:
       - 01 — BUSINESS & STRATEGY
       - 02 — FINANCE & PERFORMANCE
       - 03 — AI & DATA
       - 04 — PRODUCT & OPERATIONS
       - 05 — PROCUREMENT, RISK, GOVERNANCE & COMPLIANCE
    4. Indique uma recomendação clara de próximo passo sugerindo o agendamento de uma sessão de Diagnóstico com os consultores corporativos da Vandunem.
    
    FORMATO OBRIGATÓRIO (JSON PURO):
    {
      "resumoDesafio": "Texto detalhado e executivo em Português.",
      "problemasIdentificados": ["Problema 1", "Problema 2", "Problema 3"],
      "areasRecomendadas": ["01 — BUSINESS & STRATEGY", "02 — FINANCE & PERFORMANCE"],
      "proximoPasso": "Recomendação para agendamento presencial ou remoto da sessão de alinhamento diagnóstico."
    }
    `;

    const ai = getGeminiClient();
    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-2.5-flash",
      "gemini-3.5-flash",
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-flash-latest"
    ];
    let parsedResult: any = null;
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contextText,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                resumoDesafio: {
                  type: Type.STRING,
                  description: "Executive summary of the business challenge in Portuguese."
                },
                problemasIdentificados: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of 3-4 root problems in Portuguese."
                },
                areasRecomendadas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Recommended Vandunem practice areas."
                },
                proximoPasso: {
                  type: Type.STRING,
                  description: "Next steps recommendation in Portuguese."
                }
              },
              required: ["resumoDesafio", "problemasIdentificados", "areasRecomendadas", "proximoPasso"]
            }
          }
        });

        if (response.text) {
          const raw = JSON.parse(response.text);
          if (
            raw.resumoDesafio &&
            Array.isArray(raw.problemasIdentificados) &&
            raw.problemasIdentificados.length > 0 &&
            Array.isArray(raw.areasRecomendadas) &&
            raw.areasRecomendadas.length > 0 &&
            raw.proximoPasso
          ) {
            parsedResult = raw;
            console.log(`✅ Diagnóstico gerado com sucesso via Gemini (${modelName})`);
            break;
          }
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Tentativa com modelo ${modelName} falhou:`, err?.message || err);
      }
    }

    if (!parsedResult) {
      const errorInfo = categorizeGeminiError(lastError || new Error("Falha na geração do modelo"));
      return res.status(errorInfo.statusCode).json({
        success: false,
        errorCode: errorInfo.errorCode,
        error: errorInfo.userMessage
      });
    }

    // 5. Persist the qualified lead into Firestore Leads
    const lead_id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newLead = {
      lead_id,
      nome: q8,
      empresa: q9 || "Não Informada",
      setor: q2 || "Não Informado",
      tamanho_empresa: q3 || "Não Especificado",
      telefone: q10,
      email: q11,
      problema: `Desafio: ${q1}. Colaboradores: ${q4 || "N/D"}. Impacto: ${q5 || "N/D"}. Tempo: ${q6 || "N/D"}.`,
      urgencia: q7 || "N/D",
      servico_recomendado: parsedResult.areasRecomendadas?.join(", ") || "Business Advisory",
      origem: "Vandunem AI (Qualificado)",
      status: "QUALIFIED",
      created_at: new Date().toISOString()
    };

    try {
      const firestore = getFirestoreDb();
      await firestore.collection("leads").doc(lead_id).set(newLead);

      const analyticsRef = firestore.collection("analytics").doc("dashboard");
      await analyticsRef.update({
        "eventos.AI_COMPLETED": FieldValue.increment(1)
      }).catch(err => console.warn("Analytics update skipped:", err));
    } catch (dbError) {
      console.warn("Aviso ao gravar no Firestore:", dbError);
    }

    return res.json({
      success: true,
      analysis: parsedResult,
      leadId: newLead.lead_id
    });

  } catch (error) {
    const errorInfo = categorizeGeminiError(error);
    return res.status(errorInfo.statusCode).json({
      success: false,
      errorCode: errorInfo.errorCode,
      error: errorInfo.userMessage
    });
  }
});

// 3. Simple Analytics log and retrieve
app.get("/api/analytics", async (req, res) => {
  try {
    const firestore = getFirestoreDb();
    
    // Get analytics dashboard document
    const analyticsDoc = await firestore.collection("analytics").doc("dashboard").get();
    const analytics = analyticsDoc.exists ? analyticsDoc.data() : { visitantes: 0, origens: {}, eventos: {} };

    // Get all leads to calculate statuses dynamically
    const snapshot = await firestore.collection("leads").get();
    const leads: any[] = [];
    snapshot.forEach(doc => {
      leads.push(doc.data());
    });

    const statusCounts = leads.reduce((acc: any, lead: any) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      analytics: {
        ...analytics,
        statusCounts,
        totalLeads: leads.length
      }
    });
  } catch (error) {
    console.error("Erro ao obter analíticas:", error);
    res.status(500).json({ error: "Erro ao ler analytics." });
  }
});

app.post("/api/analytics/event", async (req, res) => {
  try {
    const { event } = req.body;
    const validEvents = ["CTA_CLICK", "AI_STARTED", "AI_COMPLETED", "WHATSAPP_CLICK", "CONTACT_SUBMITTED", "MEETING_REQUESTED"];
    
    if (!validEvents.includes(event)) {
      return res.status(400).json({ error: "Evento inválido" });
    }

    const firestore = getFirestoreDb();
    const analyticsRef = firestore.collection("analytics").doc("dashboard");

    const updateData: any = {
      [`eventos.${event}`]: FieldValue.increment(1)
    };

    if (event === "CTA_CLICK") {
      updateData["visitantes"] = FieldValue.increment(1);
    }

    await analyticsRef.update(updateData);
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao guardar evento de analítica:", error);
    res.status(500).json({ error: "Erro ao salvar evento." });
  }
});

app.post("/api/analytics/visit", async (req, res) => {
  try {
    const firestore = getFirestoreDb();
    const analyticsRef = firestore.collection("analytics").doc("dashboard");

    const origins = ["Directo / Pesquisa", "Redes Sociais", "WhatsApp", "Recomendações"];
    const randomOrigin = origins[Math.floor(Math.random() * origins.length)];

    await analyticsRef.update({
      "visitantes": FieldValue.increment(1),
      [`origens.${randomOrigin}`]: FieldValue.increment(1)
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao registar visita:", error);
    res.status(500).json({ error: "Erro ao registar visita." });
  }
});

// Serve frontend build and index fallback
async function startServer() {
  // Inicializa o Firestore com dados de semente (seed) se vazio
  await initFirestoreDatabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
