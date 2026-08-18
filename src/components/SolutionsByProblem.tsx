import React from "react";
import { ArrowRight, HelpCircle, AlertOctagon, HelpCircle as Help } from "lucide-react";
import { trackEvent } from "../utils/analytics.ts";

interface SolutionsByProblemProps {
  onNavigate: (section: string) => void;
  onSelectProblemForAI?: (problemText: string) => void;
}

export default function SolutionsByProblem({ onNavigate, onSelectProblemForAI }: SolutionsByProblemProps) {
  const problemCards = [
    {
      problem: "Estou a vender, mas não sei onde está o lucro.",
      mapping: "Finance + Data + Performance",
      desc: "Ideal para empresas com faturamento sólido, mas que sofrem com erosão de caixa, falta de visibilidade de margens e precificação incorreta.",
    },
    {
      problem: "Os meus custos estão muito altos.",
      mapping: "Finance + Procurement + Operations",
      desc: "Indicado para negócios com margens apertadas por ineficiências em contratos de terceiros, consumos desregulados e estrutura operacional inflacionada.",
    },
    {
      problem: "Compro muito caro.",
      mapping: "Procurement + Supplier Analysis + Cost Optimization",
      desc: "Focado em renegociações estratégicas de compras, auditoria de fornecedores locais/estrangeiros e desenho de políticas saudáveis de sourcing.",
    },
    {
      problem: "A empresa cresceu e ficou desorganizada.",
      mapping: "Strategy + Operations + Governance",
      desc: "Desenhado para empresas familiares ou PMEs em rápida expansão que precisam de estruturar organigramas, processos internos e relatórios executivos.",
    },
    {
      problem: "Tenho muitos processos manuais.",
      mapping: "AI + Data + Operations",
      desc: "Indicado para empresas que perdem centenas de horas em tarefas repetitivas de recolha de dados, planilhas duplicadas e conciliação de tabelas.",
    },
    {
      problem: "Não sei quais decisões devo tomar.",
      mapping: "Strategy + Finance + Data",
      desc: "Ideal para diretores e fundadores que operam no 'escuro', necessitando de dashboards executivos unificados e suporte consultivo estratégico.",
    },
    {
      problem: "Tenho riscos e falta de controles.",
      mapping: "Risk + Governance + Compliance",
      desc: "Focado na proteção patrimonial da empresa através do desenho de políticas de segurança, segregação de funções e adequação regulamentar.",
    },
    {
      problem: "Quero transformar várias áreas.",
      mapping: "Business Transformation",
      desc: "Um projeto amplo e multidisciplinar de reestruturação empresarial visando aumentar de forma drástica a eficiência global da operação.",
    }
  ];

  const handleResolveProblem = (problemText: string) => {
    trackEvent("CTA_CLICK");
    if (onSelectProblemForAI) {
      onSelectProblemForAI(problemText);
    }
    onNavigate("ai-diagnostic");
  };

  return (
    <section id="solucoes" className="py-24 bg-[#070b19] relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-950/10 blur-[100px] pointer-events-none rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded">
            Resolução Baseada em Sintomas
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-4 mb-3">
            “Diga-nos o problema. Nós encontramos a solução.”
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Não precisa de saber exactamente de qual serviço de consultoria a sua empresa precisa. Selecione o problema que mais se alinha com a sua dor atual e a nossa inteligência fará a ponte.
          </p>
        </div>

        {/* Problem-oriented grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problemCards.map((card, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between bg-[#0a0f24] border border-blue-950/60 hover:border-blue-500/80 rounded-lg p-6 hover:bg-[#0c132f] transition-all duration-300 shadow-xl shadow-black/10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none"></div>

              <div>
                <div className="flex items-center gap-2 text-red-400 mb-4 font-sans text-xs font-semibold tracking-wider uppercase">
                  <AlertOctagon size={14} className="text-red-500" />
                  <span>Sintoma Empresarial</span>
                </div>

                <h3 className="text-lg font-serif font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  “{card.problem}”
                </h3>

                <p className="text-gray-400 text-xs leading-relaxed mb-6 font-light font-sans">
                  {card.desc}
                </p>
              </div>

              <div>
                <div className="border-t border-blue-950/60 pt-4 mb-4 flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Foco Recomentado</span>
                  <span className="text-xs text-blue-400 font-semibold font-sans">
                    {card.mapping}
                  </span>
                </div>

                <button
                  onClick={() => handleResolveProblem(card.problem)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-slate-900 border border-slate-700 hover:border-blue-500 text-gray-200 hover:text-white font-semibold text-xs tracking-wide transition-all uppercase focus:outline-none cursor-pointer"
                >
                  <span>Quero resolver isto</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
