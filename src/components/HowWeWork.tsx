import React from "react";
import { Eye, Layers, BarChart, Settings, Award, RefreshCw, ChevronRight } from "lucide-react";

export default function HowWeWork() {
  const steps = [
    {
      id: "01",
      name: "DIAGNOSE",
      desc: "Entendemos o negócio em profundidade e identificamos o problema real de raiz.",
      icon: <Eye size={18} />
    },
    {
      id: "02",
      name: "ANALYZE",
      desc: "Analisamos rigorosamente dados transacionais, processos, finanças, operações e riscos.",
      icon: <Layers size={18} />
    },
    {
      id: "03",
      name: "DESIGN",
      desc: "Criamos uma solução executiva perfeitamente adaptada à realidade da empresa e do mercado.",
      icon: <Settings size={18} />
    },
    {
      id: "04",
      name: "IMPLEMENT",
      desc: "Ajudamos o cliente na execução física, colocando a solução desenhada em prática.",
      icon: <Award size={18} />
    },
    {
      id: "05",
      name: "MEASURE",
      desc: "Medimos indicadores de performance operacional e resultados financeiros.",
      icon: <BarChart size={18} />
    },
    {
      id: "06",
      name: "IMPROVE",
      desc: "Refinamos continuamente processos com base em dados empíricos de performance.",
      icon: <RefreshCw size={18} />
    }
  ];

  return (
    <section id="metodologia" className="py-24 bg-[#070b19] relative overflow-hidden">
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-blue-900/5 rounded-full blur-[90px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded">
            Nossa Metodologia
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-4 mb-4">
            Como Trabalhamos
          </h2>
          <p className="text-xl italic text-blue-300 font-light max-w-2xl mx-auto font-sans">
            “Não entregamos apenas recomendações. Trabalhamos para transformar recomendações em resultados.”
          </p>
        </div>

        {/* Timeline Desktop horizontal representation */}
        <div className="hidden lg:grid grid-cols-6 gap-6 relative">
          {/* Connecting Line */}
          <div className="absolute top-[40px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-blue-900 via-blue-500 to-blue-900 z-0"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center relative z-10 group">
              {/* Step indicator node */}
              <div className="w-14 h-14 rounded-full bg-slate-900 border-2 border-blue-950/80 group-hover:border-blue-500 flex items-center justify-center text-blue-400 group-hover:text-white group-hover:bg-blue-950 transition-all duration-300 shadow-lg mb-6">
                {step.icon}
              </div>

              <div className="flex items-center gap-1.5 mb-2 justify-center">
                <span className="font-mono text-xs font-bold text-blue-400">{step.id}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Stage</span>
              </div>

              <h3 className="text-sm font-serif font-bold text-white mb-3 tracking-wider uppercase group-hover:text-blue-400 transition-colors">
                {step.name}
              </h3>

              <p className="text-xs text-gray-400 leading-relaxed font-light px-2">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Timeline Mobile vertical list representation */}
        <div className="lg:hidden flex flex-col gap-8 relative pl-6 border-l border-blue-900/40 max-w-lg mx-auto">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-start text-left">
              {/* Node indicator */}
              <div className="absolute -left-[45px] top-0 w-9 h-9 rounded-full bg-slate-900 border-2 border-blue-600 flex items-center justify-center text-blue-400 text-xs">
                {step.id}
              </div>

              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-blue-400 font-bold">{step.name}</span>
                <span className="text-[9px] text-gray-500 uppercase tracking-widest font-mono">Fase</span>
              </div>

              <p className="text-sm text-gray-300 font-sans leading-relaxed mt-1">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
