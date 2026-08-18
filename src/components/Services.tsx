import React from "react";
import { Check, Calendar, ArrowUpRight, HelpCircle } from "lucide-react";
import { trackEvent } from "../utils/analytics.ts";

interface ServicesProps {
  onNavigate: (section: string) => void;
  onSelectServiceForContact?: (serviceName: string) => void;
}

export default function Services({ onNavigate, onSelectServiceForContact }: ServicesProps) {
  const services = [
    {
      id: "01",
      name: "DIAGNÓSTICO START",
      price: "25.000 – 75.000 Kz",
      timeline: "3–7 dias",
      desc: "Diagnóstico empresarial completo de curta duração. Mapeamento rápido de ineficiências com relatórios estratégicos práticos.",
      features: [
        "Mapeamento rápido de processos",
        "Análise preliminar de fluxo de caixa",
        "Identificação de pontos de desperdício",
        "Relatório executivo técnico",
        "Plano de acção imediata estruturado"
      ],
      ctaText: "Solicitar diagnóstico",
      popular: false
    },
    {
      id: "02",
      name: "PROJETO ESSENCIAL",
      price: "100.000 – 300.000 Kz",
      timeline: "2–4 semanas",
      desc: "Projeto focado na resolução de um desafio operacional ou financeiro específico em até 1–2 áreas selecionadas.",
      features: [
        "Focado em 1 ou 2 áreas de actuação",
        "Desenho detalhado de soluções sob medida",
        "Implementação assistida por consultores",
        "Modelagem financeira ou BI básica",
        "Avaliação pós-implementação"
      ],
      ctaText: "Iniciar projeto essencial",
      popular: true
    },
    {
      id: "03",
      name: "PROJETO PROFISSIONAL",
      price: "350.000 – 900.000 Kz",
      timeline: "1–3 meses",
      desc: "Projeto integrado envolvendo múltiplas áreas simultâneas, focado em performance operacional, compliance e crescimento de vendas.",
      features: [
        "Abordagem integrada multi-departamental",
        "Otimização completa de cadeia de custos",
        "Governança, compliance e risco incluídos",
        "Integração profunda de dashboards de BI",
        "Suporte diário na execução operacional"
      ],
      ctaText: "Iniciar projeto profissional",
      popular: false
    },
    {
      id: "04",
      name: "BUSINESS TRANSFORMATION",
      price: "1.000.000 – 3.000.000+ Kz",
      timeline: "3–6 meses",
      desc: "Ampla transformação empresarial multidisciplinar para PMEs maduras. Reestruturação do core business com apoio constante.",
      features: [
        "Reengenharia total de processos core",
        "Integração de inteligência artificial prática",
        "Consultoria e readequação tributária/sourcing",
        "Capacitação exaustiva de gestores",
        "Direccionamento estratégico semanal com sócios"
      ],
      ctaText: "Solicitar transformação",
      popular: false
    },
    {
      id: "05",
      name: "MANAGED SERVICES",
      price: "150.000 – 750.000+ Kz/mês",
      timeline: "Recorrente mensal",
      desc: "Acompanhamento profissional recorrente de funções de gestão cruciais, atuando como o seu braço direito consultivo.",
      features: [
        "Apoio e assessoria contínua",
        "Reuniões semanais de performance (KPIs)",
        "Gestão externa de compras/fornecedores",
        "Supervisão e auditoria financeira mensal",
        "Canal de suporte prioritário 24/7"
      ],
      ctaText: "Contratar assessoria",
      popular: false
    }
  ];

  const handleServiceSelect = (serviceName: string) => {
    trackEvent("CTA_CLICK");
    if (onSelectServiceForContact) {
      onSelectServiceForContact(serviceName);
    }
    onNavigate("contacto");
  };

  return (
    <section id="servicos" className="py-24 bg-[#0a0f24] relative border-y border-blue-950/60">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded">
            Escada de Valor
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-4 mb-4">
            Estrutura Comercial & Produtos Corporativos
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Apresentamos referências de valores comerciais iniciais transparentes. O valor de investimento final de cada projeto depende exclusivamente do diagnóstico de complexidade, dimensão e escopo.
          </p>
        </div>

        {/* Pricing Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-stretch">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between rounded-lg p-6 border transition-all duration-300 relative ${
                service.popular
                  ? "bg-[#11193d] border-blue-500 shadow-xl shadow-blue-950/40 xl:-translate-y-2"
                  : "bg-[#090e25] border-blue-950/80 hover:border-blue-900 shadow-lg shadow-black/20"
              }`}
            >
              {service.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 rounded-full text-[10px] text-white font-bold uppercase tracking-wider shadow-md">
                  Mais Procurado
                </span>
              )}

              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-xs text-blue-400 font-bold tracking-widest">{service.id}</span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs font-mono">
                    <Calendar size={12} className="text-blue-500" />
                    <span>{service.timeline}</span>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-2 uppercase tracking-wide">
                  {service.name}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed mb-6 font-light">
                  {service.desc}
                </p>

                {/* Price Display */}
                <div className="mb-6 pb-6 border-b border-blue-950/60">
                  <span className="text-[10px] text-blue-400 uppercase tracking-wider font-mono block mb-1">Investimento Estimado</span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
                    {service.price}
                  </span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-gray-300 leading-snug">
                      <Check size={12} className="text-blue-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleServiceSelect(service.name)}
                className={`w-full py-3 px-4 rounded text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
                  service.popular
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-950"
                    : "bg-slate-900 border border-slate-700 hover:border-blue-500 text-gray-300 hover:text-white"
                }`}
              >
                <span>{service.ctaText}</span>
                <ArrowUpRight size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* Note on pricing scope */}
        <div className="mt-12 p-4 rounded border border-blue-950/60 bg-blue-950/10 max-w-3xl mx-auto text-center">
          <p className="text-xs text-gray-400 leading-relaxed">
            * <strong>Nota importante:</strong> Os preços apresentados acima são estimativas de referência comercial para o mercado angolano. O custo final depende da complexidade detectada na fase de <strong>Diagnóstico</strong>, do volume de dados a tratar, do tamanho real do quadro de colaboradores da empresa e do nível de implementação de equipas necessário.
          </p>
        </div>
      </div>
    </section>
  );
}
