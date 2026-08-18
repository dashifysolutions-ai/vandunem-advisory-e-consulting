import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to storage files
const LEADS_FILE = path.join(process.cwd(), "leads.json");
const ANALYTICS_FILE = path.join(process.cwd(), "analytics.json");

// Helper to ensure database files exist with mock data
function initDatabase() {
  if (!fs.existsSync(LEADS_FILE)) {
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
    fs.writeFileSync(LEADS_FILE, JSON.stringify(initialLeads, null, 2));
  }

  if (!fs.existsSync(ANALYTICS_FILE)) {
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
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(initialAnalytics, null, 2));
  }
}

initDatabase();

// Lazy initialization of GoogleGenAI
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === "MY_GEMINI_API_KEY") {
      console.warn("⚠️ GEMINI_API_KEY is not configured or uses default template value.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// REST APIs
// 1. CRM Leads management
app.get("/api/leads", (req, res) => {
  const adminPassword = req.headers["x-admin-password"];
  if (adminPassword !== "vandunem2026") {
    return res.status(401).json({ error: "Não autorizado." });
  }

  try {
    const leadsData = fs.readFileSync(LEADS_FILE, "utf-8");
    const leads = JSON.parse(leadsData);
    res.json({ success: true, leads });
  } catch (error) {
    res.status(500).json({ error: "Erro ao ler leads." });
  }
});

app.post("/api/leads", (req, res) => {
  try {
    const { nome, empresa, setor, tamanho_empresa, telefone, email, problema, urgencia, servico_recomendado, origem } = req.body;
    
    if (!nome || !telefone) {
      return res.status(400).json({ error: "Nome e Telefone/WhatsApp são campos obrigatórios." });
    }

    const leadsData = fs.readFileSync(LEADS_FILE, "utf-8");
    const leads = JSON.parse(leadsData);

    const newLead = {
      lead_id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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

    leads.unshift(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    // Also increment ANALYTICS for CONTACT_SUBMITTED
    try {
      const analyticsData = fs.readFileSync(ANALYTICS_FILE, "utf-8");
      const analytics = JSON.parse(analyticsData);
      analytics.eventos.CONTACT_SUBMITTED = (analytics.eventos.CONTACT_SUBMITTED || 0) + 1;
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
    } catch (e) {
      console.error("Erro ao incrementar analytics durante criação de lead", e);
    }

    res.status(201).json({ success: true, lead: newLead });
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar o lead." });
  }
});

app.patch("/api/leads/:id", (req, res) => {
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

    const leadsData = fs.readFileSync(LEADS_FILE, "utf-8");
    const leads = JSON.parse(leadsData);

    const leadIndex = leads.findIndex((l: any) => l.lead_id === id);
    if (leadIndex === -1) {
      return res.status(404).json({ error: "Lead não encontrado." });
    }

    leads[leadIndex].status = status;
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    res.json({ success: true, lead: leads[leadIndex] });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar lead." });
  }
});

// 2. AI Triaging / Qualification
app.post("/api/ai/qualify", async (req, res) => {
  try {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11 } = req.body;

    if (!q1 || !q8 || !q10) {
      return res.status(400).json({ error: "Respostas incompletas." });
    }

    // Build the diagnostic data context
    const contextText = `
    Respostas do questionário de triagem empresarial da Vandunem:
    1. Desafio principal: ${q1}
    2. Setor da empresa: ${q2}
    3. Tamanho da empresa: ${q3}
    4. Número de colaboradores: ${q4}
    5. Impacto do problema: ${q5}
    6. Há quanto tempo existe: ${q6}
    7. Quando gostaria de resolver: ${q7}
    8. Nome do gestor/responsável: ${q8}
    9. Nome da empresa: ${q9}
    10. WhatsApp/Contacto: ${q10}
    11. E-mail: ${q11}
    `;

    const systemPrompt = `
    Você é a inteligência artificial analista da VANDUNEM ADVISORY & CONSULTING, uma consultoria empresarial premium de elite focada no mercado angolano.
    Sua missão é fornecer uma avaliação preliminar de altíssima qualidade técnica para o potencial cliente baseado nas respostas enviadas.
    
    DIRETRIZES DE ESTILO:
    - Linguagem formal, técnica, executiva e altamente persuasiva.
    - Foco na realidade de Angola (Luanda, PMEs angolanas, microempresas e prestadores de serviços).
    - Jamais prometa resultados financeiros específicos (ex: 'vamos duplicar sua margem em 5 dias') ou invente dados.
    - Explique de forma madura que isso é uma triagem comercial inicial e que um diagnóstico profissional completo de 3 a 7 dias é indispensável.
    - Associe o problema com as 5 áreas de prática da Vandunem:
      01 — BUSINESS & STRATEGY
      02 — FINANCE & PERFORMANCE
      03 — AI & DATA
      04 — PRODUCT & OPERATIONS
      05 — PROCUREMENT, RISK, GOVERNANCE & COMPLIANCE

    Você DEVE retornar a resposta EXCLUSIVAMENTE em formato JSON que siga o seguinte schema:
    {
      "resumoDesafio": "Uma análise sofisticada (2-3 parágrafos) sintetizando a dor relatada sob uma ótica empresarial madura.",
      "problemasIdentificados": ["Problema de raiz 1 estruturado", "Problema de raiz 2 estruturado", "Problema de raiz 3 estruturado"],
      "areasRecomendadas": ["01 — BUSINESS & STRATEGY", "02 — FINANCE & PERFORMANCE", "etc..."],
      "proximoPasso": "Uma recomendação executiva elegante indicando o agendamento urgente de um diagnóstico presencial ou remoto para detalhamento do plano de acção."
    }
    `;

    const ai = getGeminiClient();
    
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: [
        { text: systemPrompt },
        { text: contextText }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            resumoDesafio: {
              type: Type.STRING,
              description: "A highly sophisticated executive summary of the business challenge in Portuguese."
            },
            problemasIdentificados: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3-4 specific root problems identified from the answers in Portuguese."
            },
            areasRecomendadas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Recommended Vandunem areas of practice."
            },
            proximoPasso: {
              type: Type.STRING,
              description: "Practical next steps advising a professional diagnostic meeting in Portuguese."
            }
          },
          required: ["resumoDesafio", "problemasIdentificados", "areasRecomendadas", "proximoPasso"]
        }
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");

    // Persist this qualified lead into Leads
    const leadsData = fs.readFileSync(LEADS_FILE, "utf-8");
    const leads = JSON.parse(leadsData);

    const newLead = {
      lead_id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nome: q8,
      empresa: q9 || "Não Informada",
      setor: q2 || "Não Informado",
      tamanho_empresa: q3 || "Não Especificado",
      telefone: q10,
      email: q11 || "Não Informado",
      problema: `Desafio: ${q1}. Colaboradores: ${q4}. Impacto: ${q5}. Tempo: ${q6}.`,
      urgencia: q7,
      servico_recomendado: parsedResult.areasRecomendadas?.join(", ") || "Business Advisory",
      origem: "Vandunem AI (Qualificado)",
      status: "QUALIFIED",
      created_at: new Date().toISOString()
    };

    leads.unshift(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));

    // Increment ANALYTICS for AI_COMPLETED and LEADS
    try {
      const analyticsData = fs.readFileSync(ANALYTICS_FILE, "utf-8");
      const analytics = JSON.parse(analyticsData);
      analytics.eventos.AI_COMPLETED = (analytics.eventos.AI_COMPLETED || 0) + 1;
      fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
    } catch (e) {
      console.error(e);
    }

    res.json({ success: true, analysis: parsedResult, leadId: newLead.lead_id });

  } catch (error) {
    console.error("Erro na qualificação de IA:", error);
    res.status(500).json({ error: "Erro ao processar análise da IA. Por favor, tente novamente." });
  }
});

// 3. Simple Analytics log and retrieve
app.get("/api/analytics", (req, res) => {
  try {
    const analyticsData = fs.readFileSync(ANALYTICS_FILE, "utf-8");
    const analytics = JSON.parse(analyticsData);
    
    // Add current lead counts by status
    const leadsData = fs.readFileSync(LEADS_FILE, "utf-8");
    const leads = JSON.parse(leadsData);
    
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
    res.status(500).json({ error: "Erro ao ler analytics." });
  }
});

app.post("/api/analytics/event", (req, res) => {
  try {
    const { event } = req.body;
    const validEvents = ["CTA_CLICK", "AI_STARTED", "AI_COMPLETED", "WHATSAPP_CLICK", "CONTACT_SUBMITTED", "MEETING_REQUESTED"];
    
    if (!validEvents.includes(event)) {
      return res.status(400).json({ error: "Evento inválido" });
    }

    const analyticsData = fs.readFileSync(ANALYTICS_FILE, "utf-8");
    const analytics = JSON.parse(analyticsData);
    
    analytics.eventos[event] = (analytics.eventos[event] || 0) + 1;
    if (event === "CTA_CLICK") {
      analytics.visitantes = (analytics.visitantes || 0) + 1; // Increment visitor simulated count too
    }

    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar evento." });
  }
});

// Serve frontend build and index fallback
async function startServer() {
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
