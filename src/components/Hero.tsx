import React from "react";
import { ArrowRight, AlertTriangle, Play, HelpCircle, MessageSquare, Database, TrendingUp, Settings } from "lucide-react";
import { trackEvent } from "../utils/analytics.ts";
import bgImage from "../assets/images/corporate_advisory_desk_1787050613000.jpg";

interface HeroProps {
  onNavigate: (section: string) => void;
  onSelectProblem?: (problemText: string) => void;
}

export default function Hero({ onNavigate, onSelectProblem }: HeroProps) {
  const problems = [
    "Custos elevados",
    "Baixa rentabilidade",
    "Processos ineficientes",
    "Falta de dados",
    "Decisões sem informação",
    "Problemas de fornecedores",
    "Riscos operacionais",
    "Falta de estratégia",
    "Processos manuais",
    "Crescimento desorganizado",
  ];

  const handleCTA = (event: "CTA_CLICK", section: string) => {
    trackEvent(event);
    onNavigate(section);
  };

  const handleWhatsApp = () => {
    trackEvent("WHATSAPP_CLICK");
    window.open("https://wa.me/244953203997?text=Olá,%20Vandunem.%20Gostaria%20de%20falar%20sobre%20um%20problema%20empresarial.", "_blank");
  };

  const handleProblemClick = (prob: string) => {
    trackEvent("CTA_CLICK");
    if (onSelectProblem) {
      onSelectProblem(prob);
    }
    onNavigate("solucoes");
  };

  return (
    <section id="home" className="pt-32 pb-24 md:pt-40 md:pb-32 bg-[#070B19] relative overflow-hidden">
      {/* Background Image with Dark Premium Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <img 
          src={bgImage} 
          alt="Vandunem Corporate Strategy Background" 
          className="w-full h-full object-cover object-center opacity-40 filter brightness-[0.5] contrast-[1.1] saturate-[0.9]"
          referrerPolicy="no-referrer"
        />
        {/* Subtle gradient masks to merge the image seamlessly into the deep navy canvas while keeping the center vibrant */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#070B19] via-transparent to-[#070B19]/80"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B19]/70 via-transparent to-[#070B19]/70"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#070B19_95%)]"></div>
      </div>

      {/* Background visual geometric grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15 z-0 pointer-events-none"></div>
      
      {/* Visual glowing radial background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-900/20 via-indigo-950/5 to-transparent blur-[120px] rounded-full z-0 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-blue-900/40 bg-blue-950/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in drop-shadow-md">
              <Database size={12} />
              <span>BUSINESS INTEGRITY & VALUE IN ANGOLA</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1] mb-2 uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              VANDUNEM
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-sans text-blue-400 font-semibold tracking-[0.18em] mb-6 uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              ADVISORY & CONSULTING
            </h2>

            <p className="text-xl md:text-2xl text-gray-100 font-light tracking-wide leading-relaxed max-w-2xl border-l-2 border-blue-500 pl-4 mb-6 italic drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              “Transforming Businesses. Driving Performance. Creating Value.”
            </p>

            <p className="text-base sm:text-lg text-gray-200 font-normal leading-relaxed max-w-xl mb-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Transformamos problemas complexos em decisões corporativas fundamentadas, eficiência operacional e resultados mensuráveis. Desenhado para PMEs e prestadores de serviços angolanos.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all shadow-xl shadow-blue-950/50 cursor-pointer"
              >
                <MessageSquare size={18} />
                <span>Falar com a Vandunem</span>
              </button>

              <button
                onClick={() => handleCTA("CTA_CLICK", "areas")}
                className="flex items-center justify-center gap-2 px-8 py-4 rounded border border-slate-700 hover:border-white hover:bg-slate-900/50 text-gray-200 hover:text-white font-semibold text-base transition-all cursor-pointer"
              >
                <span>Explorar soluções</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* SOPHISTICATED PERFORMANCE GRAPHICS (SVG) */}
          <div className="lg:col-span-5 relative w-full aspect-square max-w-md mx-auto">
            <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
            
            {/* Elegant thin lines, graphs, strategy node visual */}
            <div className="w-full h-full bg-[#090F24]/40 border border-blue-950/60 rounded-xl p-6 relative backdrop-blur-sm shadow-2xl flex flex-col justify-between overflow-hidden group">
              <div className="absolute top-0 right-0 p-3 text-blue-500/10 font-mono text-[120px] font-bold leading-none select-none pointer-events-none">
                VA
              </div>
              
              <div className="flex justify-between items-start border-b border-blue-950/60 pb-4 mb-4">
                <div>
                  <h3 className="font-serif text-sm font-semibold text-white tracking-widest uppercase">Estratégia & Métricas</h3>
                  <p className="text-xs text-gray-400 font-sans">Business Performance Index</p>
                </div>
                <TrendingUp className="text-blue-400" size={18} />
              </div>

              {/* Graphic Plot Area */}
              <div className="flex-1 min-h-[180px] flex items-end justify-between relative py-2">
                {/* Thin background line graph grid */}
                <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
                  <div className="border-b border-blue-400 w-full"></div>
                  <div className="border-b border-blue-400 w-full"></div>
                  <div className="border-b border-blue-400 w-full"></div>
                  <div className="border-b border-blue-400 w-full"></div>
                </div>

                {/* Simulated corporate trend-lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Before consulting line (declining/stagnating) */}
                  <path d="M 0 45 L 20 42 L 40 50 L 60 55 L 80 52 L 100 58" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2" />
                  
                  {/* Vandunem Intervention Line (growing, stable) */}
                  <path d="M 0 45 L 20 42 L 40 30 L 60 22 L 80 15 L 100 8" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="40" cy="30" r="3" fill="#3b82f6" />
                  <circle cx="80" cy="15" r="3" fill="#60a5fa" />
                  <circle cx="100" cy="8" r="4" fill="#93c5fd" />
                </svg>

                <div className="z-10 bg-black/60 backdrop-blur-md border border-red-900/30 rounded px-2.5 py-1.5 absolute left-2 bottom-12 flex flex-col">
                  <span className="text-[9px] uppercase font-semibold text-red-400 tracking-wider">Cenário Inicial</span>
                  <span className="text-xs text-gray-200 font-semibold font-mono">Ineficiência & Desperdício</span>
                </div>

                <div className="z-10 bg-blue-950/80 backdrop-blur-md border border-blue-900/50 rounded px-2.5 py-1.5 absolute right-2 top-4 flex flex-col animate-pulse">
                  <span className="text-[9px] uppercase font-semibold text-blue-400 tracking-wider">Vandunem Advisory</span>
                  <span className="text-xs text-white font-semibold font-mono">+42% Lucro & Eficiência</span>
                </div>
              </div>

              {/* Lower info */}
              <div className="border-t border-blue-950/60 pt-4 mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase">Processos</span>
                  <span className="text-sm text-white font-bold font-mono">Otimizados</span>
                </div>
                <div className="flex flex-col border-x border-blue-950/60">
                  <span className="text-[10px] text-gray-400 uppercase">Margem</span>
                  <span className="text-sm text-blue-400 font-bold font-mono">+18.4%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase">Decisão</span>
                  <span className="text-sm text-white font-bold font-mono">Baseada em Dados</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION: COMMON BUSINESS PROBLEMS */}
        <div className="mt-32 pt-16 border-t border-blue-950/40">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-serif text-white tracking-wide mb-4">
              “Problemas complexos exigem uma visão integrada.”
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              Mapeamos as principais ineficiências que silenciosamente impedem o crescimento e corroem o lucro das empresas em Angola. Qual delas a sua empresa enfrenta hoje?
            </p>
          </div>

          {/* Grid of the 10 problems */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {problems.map((prob, idx) => (
              <button
                key={idx}
                onClick={() => handleProblemClick(prob)}
                className="flex flex-col items-center justify-between text-center p-5 rounded border border-blue-950/40 bg-[#090F23]/60 hover:border-blue-500 hover:bg-blue-950/20 transition-all duration-300 h-36 group focus:outline-none cursor-pointer"
              >
                <div className="p-2 rounded-full bg-slate-900 border border-slate-800 text-red-400 group-hover:text-blue-400 transition-all">
                  <AlertTriangle size={16} />
                </div>
                <span className="text-xs sm:text-sm text-gray-300 font-medium tracking-wide group-hover:text-white transition-all">
                  {prob}
                </span>
                <span className="text-[10px] text-blue-400 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all font-sans">
                  <span>Resolver</span>
                  <ArrowRight size={10} />
                </span>
              </button>
            ))}
          </div>

          {/* CTA: Diagnosticar o meu negócio */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => handleCTA("CTA_CLICK", "ai-diagnostic")}
              className="group flex items-center gap-3 px-8 py-4 rounded bg-slate-900 border-2 border-blue-500 hover:bg-blue-950/30 text-white font-semibold text-base transition-all shadow-xl shadow-black/40 cursor-pointer"
            >
              <Settings size={18} className="text-blue-400 group-hover:rotate-45 transition-transform duration-300" />
              <span>Diagnosticar o meu negócio</span>
              <ArrowRight size={16} className="text-blue-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
