import React from "react";
import { Users, Building, Target, Compass, Network } from "lucide-react";

export default function WhoWeServe() {
  const segments = [
    {
      title: "MICROEMPRESAS",
      focus: "Soluções acessíveis e práticas.",
      desc: "Suporte dedicado a pequenos negócios locais ou negócios em início de percurso que requerem um rumo claro para as finanças e vendas sem custos proibitivos.",
      icon: <Users size={20} className="text-blue-400" />
    },
    {
      title: "PEQUENAS EMPRESAS",
      focus: "Estruturação e crescimento.",
      desc: "Processos eficientes de sourcing, precificação de produtos e automatizações que eliminam tarefas manuais redundantes da equipa administrativa.",
      icon: <Building size={20} className="text-blue-400" />
    },
    {
      title: "PMEs",
      focus: "Performance, transformação e eficiência.",
      desc: "Integração total de dashboards de Business Intelligence, otimização completa de contratos de suprimentos e reengenharia de processos integrados.",
      icon: <Target size={20} className="text-blue-400" />
    },
    {
      title: "PRESTADORES DE SERVIÇOS",
      focus: "Processos, clientes, finanças e crescimento.",
      desc: "Focado em estabelecer processos de atendimento impecáveis, controlo rigoroso de margem horária de serviço e automação inteligente de facturação.",
      icon: <Compass size={20} className="text-blue-400" />
    }
  ];

  const industries = [
    "Comércio & Retalho",
    "Distribuição & Logística",
    "Restaurantes & Catering",
    "Clínicas & Saúde",
    "Escolas & Educação",
    "Construção Civil & Engenharia",
    "Serviços Profissionais",
    "Indústria & Manufatura",
    "Empresas Digitais & Tech",
    "Outros Negócios Locais"
  ];

  return (
    <section className="py-24 bg-[#0a0f24] relative border-y border-blue-950/60">
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded">
            Nossos Clientes Alvo
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-4 mb-4">
            Para Quem Trabalhamos
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Oferecemos metodologias adaptadas para cada estágio de maturação corporativa. Desde a microempresa local até a PME estabelecida em expansão nacional.
          </p>
        </div>

        {/* 4 Segments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {segments.map((seg, idx) => (
            <div
              key={idx}
              className="bg-[#090e25] border border-blue-950/60 p-6 rounded-lg hover:border-blue-500 transition-colors duration-300 shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded bg-blue-950/40 border border-blue-900/30">
                    {seg.icon}
                  </div>
                  <h3 className="font-serif font-bold text-sm tracking-widest text-white uppercase">{seg.title}</h3>
                </div>

                <p className="text-xs font-semibold text-blue-400 tracking-wide mb-3">
                  {seg.focus}
                </p>

                <p className="text-xs text-gray-400 leading-relaxed font-light">
                  {seg.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Sectors supported (We do not limit to specific fields) */}
        <div className="pt-8 border-t border-blue-950/60">
          <div className="text-center max-w-xl mx-auto mb-10 flex flex-col items-center">
            <Network size={20} className="text-blue-400 mb-2" />
            <h3 className="font-serif text-lg font-bold text-white mb-2">Setores de Atuação</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Atendemos negócios em múltiplos setores da economia angolana. A nossa metodologia foca-se nas regras de negócio e eficiência, não se limitando a nichos específicos.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {industries.map((ind, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-full border border-blue-950/50 bg-[#090f23]/60 text-xs text-gray-300 font-sans tracking-wide hover:border-blue-500/50 hover:text-white transition-all cursor-default"
              >
                {ind}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
