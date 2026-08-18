import React, { useState, useEffect } from "react";
import { trackEvent } from "../utils/analytics.ts";
import { isValidEmail } from "../utils/validation.ts";
import { AIAnalysis } from "../types.ts";
import { 
  ArrowRight, ArrowLeft, Send, CheckCircle2, AlertTriangle, 
  Sparkles, Loader2, MessageSquare, RefreshCw, RotateCcw, Lock 
} from "lucide-react";

interface VandunemAIProps {
  preselectedProblem?: string;
  onClearPreselection?: () => void;
  onNavigate: (section: string) => void;
}

export default function VandunemAI({ preselectedProblem, onClearPreselection, onNavigate }: VandunemAIProps) {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIAnalysis | null>(null);

  // 11 answers stored in local state
  const [answers, setAnswers] = useState({
    q1: "",  // Desafio
    q2: "",  // Setor
    q3: "",  // Tamanho
    q4: "",  // Pessoas
    q5: "",  // Impacto
    q6: "",  // Há quanto tempo
    q7: "",  // Quando resolver
    q8: "",  // Nome
    q9: "",  // Nome empresa
    q10: "", // WhatsApp
    q11: "", // Email
  });

  // Automatically react to preselected problems from symptoms page
  useEffect(() => {
    if (preselectedProblem) {
      setAnswers(prev => ({ ...prev, q1: preselectedProblem }));
      setStep(2); // Directly jump to step 2 as challenge is pre-filled!
      trackEvent("AI_STARTED");
      if (onClearPreselection) {
        onClearPreselection();
      }
    }
  }, [preselectedProblem]);

  const handleStart = () => {
    trackEvent("AI_STARTED");
    setStep(1);
    setResult(null);
    setError(null);
  };

  const handleNext = () => {
    if (step < 11) {
      setStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleChange = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleSelectOption = (field: string, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    // Auto-advance for multi-choice questions to improve UX flow!
    setTimeout(() => {
      setStep(prev => prev + 1);
    }, 200);
  };

  const handleSubmit = async () => {
    // 1. Strict frontend email validation before any network request
    if (!isValidEmail(answers.q11)) {
      setError("Por favor, introduza um endereço de e-mail corporativo válido (ex: nome@empresa.com) antes de prosseguir com a análise.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Não foi possível gerar a qualificação de IA. Por favor, tente novamente.");
      }

      if (data.success && data.analysis && data.analysis.resumoDesafio) {
        setResult(data.analysis);
        trackEvent("AI_COMPLETED");
      } else {
        throw new Error("Resposta da inteligência artificial em formato inesperado.");
      }
    } catch (err: any) {
      setError(err.message || "Erro de comunicação ao processar o diagnóstico por IA.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    trackEvent("WHATSAPP_CLICK");
    if (!result) return;

    const leadInfoText = `
*VANDUNEM DIAGNÓSTICO IA - RELATÓRIO*
--------------------------------------------------
*Nome:* ${answers.q8}
*Empresa:* ${answers.q9 || "Não Informada"}
*Setor:* ${answers.q2}
*Tamanho:* ${answers.q3} (${answers.q4} pessoas)
*Desafio Principal:* ${answers.q1}
*Tempo de Existência do Problema:* ${answers.q6}
*Impacto do Desafio:* ${answers.q5}
*Urgência de Resolução:* ${answers.q7}
--------------------------------------------------
*Recomendação Vandunem AI:*
${result.areasRecomendadas?.join(", ")}

*Gostaria de agendar o Diagnóstico Start com um consultor corporativo.*
    `;

    const encoded = encodeURIComponent(leadInfoText.trim());
    window.open(`https://wa.me/244921780191?text=${encoded}`, "_blank");
  };

  const handleReset = () => {
    setAnswers({
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
      q9: "",
      q10: "",
      q11: "",
    });
    setResult(null);
    setStep(1);
    setError(null);
  };

  // Check if current step has a valid value to unlock next button
  const isNextDisabled = () => {
    if (step === 11) {
      // Strict email format validation: rejects "EDTHGFGFGFG", "teste", etc.
      return !isValidEmail(answers.q11);
    }
    if (step === 10) {
      // Validate phone/whatsapp minimally
      return !answers.q10 || answers.q10.trim().length < 8;
    }
    if (step === 8) {
      // Name
      return !answers.q8 || answers.q8.trim().length < 2;
    }
    const currentVal = (answers as any)[`q${step}`];
    return !currentVal || currentVal.trim() === "";
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              1. Qual é o principal desafio empresarial que a sua empresa enfrenta hoje?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {[
                "Vendas",
                "Finanças",
                "Custos",
                "Operações",
                "Compras",
                "Dados",
                "IA/Automação",
                "Produto",
                "Risco/Compliance",
                "Estratégia",
                "Outro"
              ].map((opt) => (
                <button
                  key={opt}
                  onClick={() => handleSelectOption("q1", opt)}
                  className={`text-left p-4 rounded border text-sm transition-all focus:outline-none cursor-pointer ${
                    answers.q1 === opt
                      ? "bg-blue-950 border-blue-500 text-white"
                      : "bg-[#090e24] border-blue-950 hover:border-blue-900 text-gray-300 hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              2. Qual é o setor de atividade da sua empresa?
            </h3>
            <p className="text-xs text-gray-400">Exemplos: Restauração, Clínica, Comércio Geral, Logística, Serviços Profissionais...</p>
            <input
              type="text"
              value={answers.q2}
              onChange={(e) => handleChange("q2", e.target.value)}
              placeholder="Digite o setor da empresa"
              className="w-full bg-[#090e25] border border-blue-950 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3.5 text-base"
              onKeyDown={(e) => e.key === "Enter" && !isNextDisabled() && handleNext()}
            />
          </div>
        );

      case 3:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              3. Qual é o tamanho aproximado da empresa hoje?
            </h3>
            <div className="flex flex-col gap-3 mt-2">
              {[
                { val: "Micro", desc: "Microempresa (Facturação reduzida, poucos processos)" },
                { val: "Pequena", desc: "Pequena Empresa (Foco em estruturação e crescimento)" },
                { val: "Média/PME", desc: "Média Empresa ou PME (Foco em performance e governança)" }
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => handleSelectOption("q3", opt.val)}
                  className={`text-left p-4 rounded border text-sm transition-all focus:outline-none cursor-pointer ${
                    answers.q3 === opt.val
                      ? "bg-blue-950 border-blue-500 text-white"
                      : "bg-[#090e24] border-blue-950 hover:border-blue-900 text-gray-300 hover:text-white"
                  }`}
                >
                  <span className="font-bold block text-sm">{opt.val}</span>
                  <span className="text-xs text-gray-400 mt-1 block">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              4. Quantas pessoas trabalham atualmente na sua empresa?
            </h3>
            <input
              type="text"
              value={answers.q4}
              onChange={(e) => handleChange("q4", e.target.value)}
              placeholder="Exemplo: 5 pessoas, 25 colaboradores, etc."
              className="w-full bg-[#090e25] border border-blue-950 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3.5 text-base"
              onKeyDown={(e) => e.key === "Enter" && !isNextDisabled() && handleNext()}
            />
          </div>
        );

      case 5:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              5. Qual é o impacto real desse problema no dia-a-dia do negócio?
            </h3>
            <p className="text-xs text-gray-400">Exemplos: 'Perda constante de dinheiro', 'Trabalho manual excessivo que gera erros', 'Dificuldade de pagar fornecedores'...</p>
            <textarea
              value={answers.q5}
              onChange={(e) => handleChange("q5", e.target.value)}
              placeholder="Descreva brevemente o impacto deste problema no caixa ou na equipa..."
              rows={4}
              className="w-full bg-[#090e25] border border-blue-950 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3.5 text-base resize-none"
            />
          </div>
        );

      case 6:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              6. Há quanto tempo existe este desafio na empresa?
            </h3>
            <input
              type="text"
              value={answers.q6}
              onChange={(e) => handleChange("q6", e.target.value)}
              placeholder="Exemplo: Há mais de 6 meses, Desde o início do ano, Há 2 anos..."
              className="w-full bg-[#090e25] border border-blue-950 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3.5 text-base"
              onKeyDown={(e) => e.key === "Enter" && !isNextDisabled() && handleNext()}
            />
          </div>
        );

      case 7:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              7. Quando gostaria de ter este problema definitivamente resolvido?
            </h3>
            <input
              type="text"
              value={answers.q7}
              onChange={(e) => handleChange("q7", e.target.value)}
              placeholder="Exemplo: Imediatamente (próximos 15 dias), No próximo mês, Em 3 meses..."
              className="w-full bg-[#090e25] border border-blue-950 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3.5 text-base"
              onKeyDown={(e) => e.key === "Enter" && !isNextDisabled() && handleNext()}
            />
          </div>
        );

      case 8:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              8. Qual é o seu nome completo?
            </h3>
            <input
              type="text"
              value={answers.q8}
              onChange={(e) => handleChange("q8", e.target.value)}
              placeholder="Digite o seu nome completo"
              className="w-full bg-[#090e25] border border-blue-950 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3.5 text-base"
              onKeyDown={(e) => e.key === "Enter" && !isNextDisabled() && handleNext()}
            />
          </div>
        );

      case 9:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              9. Qual é o nome da sua empresa?
            </h3>
            <input
              type="text"
              value={answers.q9}
              onChange={(e) => handleChange("q9", e.target.value)}
              placeholder="Digite o nome legal ou comercial da empresa"
              className="w-full bg-[#090e25] border border-blue-950 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3.5 text-base"
              onKeyDown={(e) => e.key === "Enter" && !isNextDisabled() && handleNext()}
            />
          </div>
        );

      case 10:
        return (
          <div className="animate-fade-in flex flex-col gap-5 w-full">
            <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
              10. Qual é o seu número de Telefone / WhatsApp?
            </h3>
            <p className="text-xs text-gray-400">Canal onde partilharemos o contacto com um especialista sénior.</p>
            <input
              type="tel"
              value={answers.q10}
              onChange={(e) => handleChange("q10", e.target.value)}
              placeholder="Exemplo: +244 921 780 191"
              className="w-full bg-[#090e25] border border-blue-950 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none rounded-md px-4 py-3.5 text-base"
              onKeyDown={(e) => e.key === "Enter" && !isNextDisabled() && handleNext()}
            />
          </div>
        );

      case 11:
        const emailValue = answers.q11.trim();
        const hasTyped = emailValue.length > 0;
        const emailValid = isValidEmail(emailValue);

        return (
          <div className="animate-fade-in flex flex-col gap-4 w-full">
            <div>
              <h3 className="text-lg sm:text-xl font-serif text-white font-semibold">
                11. Qual é o seu endereço de E-mail corporativo?
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                O resumo executivo da análise da IA será associado a este e-mail para contacto dos nossos consultores.
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="email"
                value={answers.q11}
                onChange={(e) => handleChange("q11", e.target.value)}
                placeholder="Exemplo: nome@empresa.com ou gestao@empresa.ao"
                className={`w-full bg-[#090e25] border text-white placeholder-gray-500 rounded-md px-4 py-3.5 text-base transition-colors focus:outline-none ${
                  hasTyped
                    ? emailValid
                      ? "border-green-500/70 focus:border-green-400"
                      : "border-red-500/70 focus:border-red-400"
                    : "border-blue-950 focus:border-blue-500"
                }`}
                onKeyDown={(e) => e.key === "Enter" && !isNextDisabled() && handleNext()}
                autoComplete="email"
              />

              {/* Real-time Email Validation Feedback */}
              {hasTyped && !emailValid && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 animate-fade-in">
                  <AlertTriangle size={13} className="shrink-0 text-red-400" />
                  <span>Por favor, insira um e-mail válido (ex: nome@empresa.com). Formatos como &quot;EDTHGFGFGFG&quot; ou incompletos não são aceites.</span>
                </div>
              )}

              {hasTyped && emailValid && (
                <div className="flex items-center gap-1.5 text-xs text-green-400 animate-fade-in">
                  <CheckCircle2 size={13} className="shrink-0 text-green-400" />
                  <span>E-mail válido para envio da triagem executiva.</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="ai-diagnostic" className="py-24 bg-[#070b19] relative">
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded inline-flex items-center gap-1.5 mb-4">
            <Sparkles size={12} className="text-blue-400 animate-pulse" />
            <span>Ferramenta de Triagem Inteligente</span>
          </span>
          <h2 className="text-3xl font-serif font-bold text-white mb-3">
            Vandunem AI
          </h2>
          <p className="text-gray-400 text-sm">
            Não tem a certeza sobre qual serviço ou solução técnica a sua empresa precisa? Converse com a Vandunem AI para mapeamento inicial.
          </p>
        </div>

        {/* Core Wizard Container */}
        <div className="bg-[#0a0f24] border border-blue-950/60 rounded-xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Decorative design lines */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900"></div>

          {/* Error handling with Retry Option */}
          {error && (
            <div className="mb-6 p-4 rounded-lg border border-red-900/40 bg-red-950/30 text-red-300 flex items-start gap-3 text-sm animate-fade-in shadow-inner">
              <AlertTriangle className="shrink-0 mt-0.5 text-red-400" size={18} />
              <div className="flex-1">
                <p className="font-semibold text-red-200">Falha no Processamento do Diagnóstico:</p>
                <p className="text-xs text-red-300 mt-1 leading-relaxed">{error}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <button 
                    onClick={handleSubmit} 
                    className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium px-3.5 py-1.5 rounded transition-all focus:outline-none shadow-sm cursor-pointer"
                  >
                    <RefreshCw size={12} />
                    <span>Tentar Novamente</span>
                  </button>
                  <button 
                    onClick={handleReset} 
                    className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-gray-300 hover:text-white px-3 py-1.5 rounded transition-all focus:outline-none border border-slate-700 cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    <span>Reiniciar Diagnóstico</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LOADING STATE - ANALYSIS */}
          {loading ? (
            <div className="py-16 flex flex-col items-center text-center animate-fade-in">
              <Loader2 className="animate-spin text-blue-500 mb-6" size={48} />
              <h3 className="text-xl font-serif text-white font-semibold mb-2">Vandunem AI está a analisar as suas respostas...</h3>
              <p className="text-sm text-gray-400 max-w-md">
                Cruzando dados financeiros, operacionais e de sourcing com as nossas 5 principais áreas de actuação em Angola. Isto pode demorar alguns segundos.
              </p>
              <div className="mt-8 flex gap-2 justify-center">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          ) : result ? (
            /* COMPLETED STATE - RENDER ANALYSIS */
            <div className="animate-fade-in flex flex-col text-left">
              <div className="flex items-center gap-3 text-blue-400 border-b border-blue-950 pb-5 mb-6">
                <CheckCircle2 size={24} className="text-blue-500 shrink-0" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">Triagem Comercial Concluída</h3>
                  <p className="text-xs text-gray-400">Com base nos dados declarados de {answers.q9 || "Sua Empresa"}</p>
                </div>
              </div>

              {/* Challenge summary */}
              <div className="mb-6">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold block mb-2">Resumo do Desafio</span>
                <div className="p-4 bg-slate-900/60 border border-blue-950/60 rounded-md text-sm text-gray-200 leading-relaxed font-light">
                  {result.resumoDesafio}
                </div>
              </div>

              {/* Split Problems and Areas in columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Identified root problems */}
                <div>
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest font-bold block mb-2">Problemas Identificados</span>
                  <div className="bg-[#0d122e]/40 border border-blue-950/60 rounded-md p-4 space-y-2 h-full">
                    {result.problemasIdentificados?.map((prob, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-gray-300 leading-snug">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{prob}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Areas */}
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold block mb-2">Áreas de Prática Vandunem Recomendadas</span>
                  <div className="bg-[#0d122e]/40 border border-blue-950/60 rounded-md p-4 space-y-2.5 h-full">
                    {result.areasRecomendadas?.map((area, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-200 font-semibold font-sans">
                        <CheckCircle2 size={12} className="text-blue-500 shrink-0" />
                        <span>{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next step directive */}
              <div className="mb-8 p-4 bg-blue-950/20 border border-blue-900/30 rounded-md">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold block mb-1">Próximo Passo</span>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {result.proximoPasso}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="mb-8 p-3 bg-yellow-950/10 border border-yellow-900/20 text-[10px] text-gray-400 rounded flex gap-2">
                <AlertTriangle className="shrink-0 text-yellow-500" size={14} />
                <p className="leading-normal">
                  <strong>Aviso:</strong> Esta análise preliminar é gerada por inteligência artificial e serve estritamente como triagem diagnóstica inicial. Não substitui, sob qualquer pretexto, o diagnóstico técnico e profissional detalhado de 3 a 7 dias realizado presencialmente pelos consultores corporativos da Vandunem. A IA não promete resultados financeiros, não inventa informações e não firma contratos comerciais de forma automatizada.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t border-blue-950/60 pt-6">
                <button
                  onClick={handleWhatsAppRedirect}
                  className="flex-1 flex items-center justify-center gap-2.5 px-6 py-4 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide transition-all shadow-lg shadow-blue-950 cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>Falar com um consultor no WhatsApp</span>
                </button>

                <button
                  onClick={handleReset}
                  className="flex items-center justify-center gap-1.5 px-6 py-4 rounded border border-slate-700 hover:border-white hover:bg-slate-900/50 text-gray-300 hover:text-white font-semibold text-sm transition-all cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Novo Diagnóstico</span>
                </button>
              </div>
            </div>
          ) : (
            /* WIZARD QUESTION STEPS */
            <div className="flex flex-col text-left">
              {/* Top Progress bar and steps count */}
              <div className="flex justify-between items-center mb-8 border-b border-blue-950 pb-4">
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-400">
                  Step {step} of 11
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {Math.round((step / 11) * 100)}% Completado
                </span>
              </div>

              {/* Bar background */}
              <div className="w-full bg-[#070b19] h-1.5 rounded-full overflow-hidden mb-8">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300" 
                  style={{ width: `${(step / 11) * 100}%` }}
                ></div>
              </div>

              {/* Active question renderer */}
              <div className="min-h-[220px] flex items-center justify-start py-4">
                {renderStep()}
              </div>

              {/* Navigation button controls */}
              <div className="border-t border-blue-950/60 pt-6 mt-6 flex justify-between items-center">
                <button
                  onClick={handlePrev}
                  disabled={step === 1}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded text-xs font-bold tracking-wider uppercase transition-all ${
                    step === 1
                      ? "opacity-35 cursor-not-allowed text-gray-600"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ArrowLeft size={14} />
                  <span>Voltar</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className={`flex items-center gap-1.5 px-6 py-3 rounded text-xs font-bold tracking-wider uppercase transition-all focus:outline-none cursor-pointer ${
                    isNextDisabled()
                      ? "opacity-50 cursor-not-allowed bg-slate-800 text-gray-500 border border-slate-900"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-950"
                  }`}
                >
                  <span>{step === 11 ? "Concluir & Analisar" : "Seguinte"}</span>
                  {step === 11 ? <Send size={14} /> : <ArrowRight size={14} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
