import React from "react";
import { BookOpen, Calendar, ArrowUpRight, User, Hash } from "lucide-react";

export default function Insights() {
  const articles = [
    {
      title: "Como reduzir custos operacionais em Angola sem comprometer a qualidade.",
      category: "Finance & Sourcing",
      date: "14 Ago 2026",
      author: "Geral Vandunem",
      readTime: "5 min",
      desc: "Estratégias práticas de strategic sourcing e renegociação com fornecedores locais para preservar a caixa em ambientes macroeconómicos complexos."
    },
    {
      title: "O papel dos dados na tomada de decisão empresarial.",
      category: "AI & Data",
      date: "08 Ago 2026",
      author: "AI Specialist",
      readTime: "4 min",
      desc: "Como a implementação de dashboards de BI e a cultura data-driven mudam a velocidade e segurança de gestores de PMEs em Angola."
    },
    {
      title: "Automação de processos: o caminho para a produtividade.",
      category: "Operations & Tech",
      date: "02 Ago 2026",
      author: "Operations Lead",
      readTime: "6 min",
      desc: "Mapeamento de tarefas manuais repetitivas e ferramentas práticas de automação para liberar o potencial de foco comercial da sua equipa."
    },
    {
      title: "Como preparar a sua empresa para a governação corporativa.",
      category: "Governance & Risk",
      date: "25 Jul 2026",
      author: "Governance Partner",
      readTime: "7 min",
      desc: "Guia introdutório para estruturar o seu organigrama, segregar funções administrativas de risco e atrair investimento estratégico externo."
    }
  ];

  return (
    <section id="insights" className="py-24 bg-[#070b19] relative">
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded">
            Artigos & Insights
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-4 mb-4">
            Vandunem Insights
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Partilhamos análises estratégicas, tendências de mercado angolano e conselhos de gestão para capacitar líderes empresariais de forma contínua.
          </p>
        </div>

        {/* Articles Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {articles.map((art, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between bg-[#0a0f24] border border-blue-950 hover:border-blue-500 rounded-lg p-6 hover:bg-[#0d1330] transition-all duration-300 shadow-lg relative group"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900/40 text-[9px] font-mono tracking-widest uppercase font-bold">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                    <Calendar size={10} />
                    <span>{art.date}</span>
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-serif font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-relaxed">
                  “{art.title}”
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed font-light mb-6">
                  {art.desc}
                </p>
              </div>

              <div className="border-t border-blue-950/60 pt-4 flex justify-between items-center">
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
                  <User size={10} className="text-blue-500" />
                  <span>{art.author}</span>
                </div>
                <span className="text-[10px] text-blue-400 font-mono tracking-wide">
                  {art.readTime} leitura
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to newsletter or info */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-500">
            Fique por dentro das melhores práticas empresariais em Angola. Artigos publicados mensalmente.
          </p>
        </div>
      </div>
    </section>
  );
}
