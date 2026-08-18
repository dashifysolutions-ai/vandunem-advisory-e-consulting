import React from "react";
import { CheckCircle2, Award, Users, Target, ShieldCheck } from "lucide-react";

export default function About() {
  const pillars = [
    {
      title: "Visão Integrada",
      desc: "Não analisamos processos isolados. Acreditamos que a saúde financeira, a eficiência de compras e a automação tecnológica devem caminhar juntas."
    },
    {
      title: "Impacto Local Real",
      desc: "Toda a nossa atuação está desenhada para os desafios práticos de Luanda e províncias angolanas, adaptando metodologias de topo à nossa realidade."
    },
    {
      title: "Orientação a Resultados",
      desc: "Não entregamos relatórios teóricos gavetáveis. Trabalhamos em conjunto na execução prática de processos e no acompanhamento contínuo."
    },
    {
      title: "Integridade & Confiança",
      desc: "Operamos com confidencialidade absoluta, ética técnica corporativa e foco obsessivo na criação de valor líquido real para os sócios."
    }
  ];

  return (
    <section id="sobre" className="py-24 bg-[#0a0f24] relative border-y border-blue-950/60">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-indigo-950/10 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Institutional text and Core Values */}
          <div className="lg:col-span-7 text-left flex flex-col items-start">
            <span className="text-blue-400 text-xs font-bold tracking-widest uppercase bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded mb-4">
              Quem Somos
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-6">
              Sobre a Vandunem
            </h2>

            <p className="text-base sm:text-lg text-gray-200 leading-relaxed font-light mb-8 border-l-2 border-blue-500 pl-4 italic">
              “A Vandunem Advisory & Consulting é uma consultoria empresarial integrada que combina estratégia, finanças, tecnologia, dados, produto, procurement, operações, risco, governance e compliance para ajudar empresas a resolver problemas, melhorar performance e criar valor sustentável.”
            </p>

            <p className="text-sm sm:text-base text-gray-400 leading-relaxed mb-10">
              A nossa marca pauta-se pelo rigor analítico absoluto e pela execução pragmática. Em vez de vender jargões vazios de marketing digital ou promessas irreais de multiplicação de capital, fornecemos o suporte técnico e estrutural indispensável para que as empresas consolidem as suas operações, reduzam despesas de compras com fornecedores e qualifiquem a tomada de decisão com dados estruturados.
            </p>

            {/* Core Pillars List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {pillars.map((pil, idx) => (
                <div key={idx} className="flex gap-3">
                  <ShieldCheck className="text-blue-400 shrink-0 mt-1" size={16} />
                  <div>
                    <h3 className="font-serif font-bold text-sm text-white uppercase tracking-wider mb-1">{pil.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-light">{pil.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Philosophy representation */}
          <div className="lg:col-span-5 bg-[#090f23]/60 border border-blue-950/80 rounded-xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-4 font-mono text-8xl font-bold text-blue-500/5 select-none pointer-events-none uppercase">
              Vandunem
            </div>

            <h3 className="font-serif text-sm font-semibold tracking-wider text-white uppercase border-b border-blue-950 pb-4 mb-6">
              Nossa Filosofia de Entrega
            </h3>

            <div className="space-y-6">
              {[
                { term: "PROBLEM", def: "Identificação cirúrgica dos gargalos reais e ineficiências no negócio." },
                { term: "INSIGHT", def: "Tratamento de dados, finanças e processos para traduzir caos em clareza." },
                { term: "STRATEGY", def: "Desenho executivo da solução técnica sob medida para a empresa." },
                { term: "IMPLEMENTATION", def: "Apoio prático na execução operacional ao lado dos seus gestores." },
                { term: "PERFORMANCE", def: "Resultados tangíveis e sustentáveis mensurados por KPIs financeiros." }
              ].map((philo, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <span className="w-6 h-6 rounded-full bg-blue-950 border border-blue-900/60 text-[10px] font-bold font-mono text-blue-400 flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    {idx < 4 && <div className="w-0.5 h-8 bg-blue-950/60 mt-1"></div>}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-400 tracking-wider block uppercase mb-0.5">{philo.term}</span>
                    <p className="text-xs text-gray-400 font-light">{philo.def}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
