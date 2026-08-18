import React, { useState } from "react";
import { ArrowRight, ChevronRight, CheckCircle2, TrendingUp, DollarSign, Cpu, Hammer, ShieldAlert } from "lucide-react";
import { trackEvent } from "../utils/analytics.ts";

interface AreasProps {
  onNavigate: (section: string) => void;
  onSelectAreaForAI?: (areaName: string) => void;
}

export default function Areas({ onNavigate, onSelectAreaForAI }: AreasProps) {
  const [activeArea, setActiveArea] = useState<number>(0);

  const areasData = [
    {
      id: "01",
      title: "BUSINESS & STRATEGY",
      subtitle: "Estratégia, crescimento, modelos de negócio e performance.",
      icon: <TrendingUp size={24} />,
      desc: "Apoiamos empresas e empreendedores no desenvolvimento de estratégias vencedoras para capturar oportunidades de crescimento sustentável em Angola. Redefinimos modelos de negócio para aumentar a rentabilidade e a eficiência corporativa, garantindo clareza na execução.",
      problemas: [
        "Falta de clareza estratégica e de visão de longo prazo.",
        "Crescimento desorganizado que consome recursos sem gerar margem.",
        "Dificuldade em identificar novos mercados e canais de distribuição.",
        "Dificuldade em adaptar o modelo de negócio à concorrência."
      ],
      solucoes: [
        "Planeamento Estratégico Integrado e KPIs de Crescimento.",
        "Desenho de Modelos de Negócio Escaláveis.",
        "Otimização da Performance de Vendas e Go-to-Market.",
        "Mentoria Estratégica para Fundadores e Administradores."
      ],
      whatsappMsg: "Olá, Vandunem. Gostaria de falar sobre a solução de Business & Strategy."
    },
    {
      id: "02",
      title: "FINANCE & PERFORMANCE",
      subtitle: "Rentabilidade, custos, fluxo de caixa, KPIs e performance financeira.",
      icon: <DollarSign size={24} />,
      desc: "Implementamos análises financeiras rigorosas e controlos de tesouraria para restaurar a rentabilidade do seu negócio. Traduzimos dados financeiros complexos em decisões de negócio simples, práticas e focadas na maximização de margem.",
      problemas: [
        "Empresa vende bem, mas o dinheiro 'desaparece' no final do mês.",
        "Dificuldade crónica de tesouraria ou falta de planeamento de fluxo de caixa.",
        "Ausência de KPIs financeiros claros para monitorizar o negócio.",
        "Desconhecimento dos custos reais por produto ou serviço vendido."
      ],
      solucoes: [
        "Modelagem Financeira Avançada & FP&A.",
        "Estruturação de Processo de Gestão de Fluxo de Caixa.",
        "Análise de Rentabilidade de Produtos, Serviços e Clientes.",
        "Desenho e Implementação de Dashboards de Performance (KPIs)."
      ],
      whatsappMsg: "Olá, Vandunem. Gostaria de falar sobre a solução de Finance & Performance."
    },
    {
      id: "03",
      title: "AI & DATA",
      subtitle: "Dados, Business Intelligence, IA, automação e decisão orientada por dados.",
      icon: <Cpu size={24} />,
      desc: "A tecnologia deve servir as metas de negócio. Ajudamos a sua empresa a transitar de processos puramente manuais para uma operação orientada por dados, integrando dashboards de Business Intelligence (BI), automações e inteligência artificial prática.",
      problemas: [
        "Decisões baseadas no 'feeling' e intuição, sem dados reais.",
        "Equipas sobrecarregadas com recolha e tratamento manual de dados.",
        "Sistemas de informação isolados que não comunicam entre si.",
        "Atraso crónico no acesso a relatórios de vendas ou operacionais."
      ],
      solucoes: [
        "Implantação de Dashboards de Business Intelligence (Power BI/custom).",
        "Automação Inteligente de Processos de Trabalho.",
        "Consultoria e Integração de Soluções de IA para Produtividade.",
        "Governança de Dados para Tomada de Decisão em Tempo Real."
      ],
      whatsappMsg: "Olá, Vandunem. Gostaria de falar sobre a solução de AI & Data."
    },
    {
      id: "04",
      title: "PRODUCT & OPERATIONS",
      subtitle: "Produtos, processos, produtividade, operações e melhoria contínua.",
      icon: <Hammer size={24} />,
      desc: "Desenhamos operações ágeis e simplificadas que reduzem custos e aumentam a produtividade da sua equipa. Alinhamos os seus produtos e serviços ao comportamento de compra dos clientes angolanos, garantindo entrega consistente de valor.",
      problemas: [
        "Processos de trabalho confusos, redundantes ou excessivamente lentos.",
        "Baixa produtividade da equipa operacional e erros constantes.",
        "Dificuldade em manter a consistência e qualidade do serviço/produto.",
        "Gargalos operacionais crónicos que causam insatisfação de clientes."
      ],
      solucoes: [
        "Mapeamento, Diagnóstico e Redesenho de Processos (Lean/Six Sigma).",
        "Otimização de Portfólio de Produtos e Pricing Estratégico.",
        "Gestão Ágil de Operações e Redução de Gargalos.",
        "Capacitação Operacional de Equipas de Alto Desempenho."
      ],
      whatsappMsg: "Olá, Vandunem. Gostaria de falar sobre a solução de Product & Operations."
    },
    {
      id: "05",
      title: "PROCUREMENT, RISK, GOVERNANCE & COMPLIANCE",
      subtitle: "Compras, fornecedores, redução de custos, riscos, controles, governance e compliance.",
      icon: <ShieldAlert size={24} />,
      desc: "Protegemos a integridade e aumentamos as margens da sua empresa através de processos de compras otimizados e governança corporativa robusta. Mitigamos riscos operacionais, tributários e de cadeia de suprimentos, criando controlos saudáveis.",
      problemas: [
        "Margem de lucro erodida devido a compras caras de fornecedores.",
        "Inexistência de políticas claras de compras e dependência de um só parceiro.",
        "Riscos operacionais, fiscais ou regulamentares não monitorizados.",
        "Desorganização na governança que dificulta a captação de investimento."
      ],
      solucoes: [
        "Strategic Sourcing & Auditoria à Cadeia de Compras/Fornecedores.",
        "Modelagem de Políticas de Compras e Redução Estrutural de Custos.",
        "Estruturação de Controlos Internos e Gestão Integrada de Risco.",
        "Desenho de Políticas de Governança Corporativa e Compliance."
      ],
      whatsappMsg: "Olá, Vandunem. Gostaria de falar sobre a solução de Procurement, Risk, Governance & Compliance."
    }
  ];

  const handleCTA = (areaName: string, msg: string) => {
    trackEvent("CTA_CLICK");
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/244953203997?text=${encoded}`, "_blank");
  };

  const handleAIClick = (areaName: string) => {
    trackEvent("AI_STARTED");
    if (onSelectAreaForAI) {
      onSelectAreaForAI(areaName);
    }
    onNavigate("ai-diagnostic");
  };

  return (
    <section id="areas" className="py-24 bg-[#0a0f24] relative border-y border-blue-950/60">
      {/* Design elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-900/5 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-indigo-900/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded">
            Nossas Áreas de Atuação
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-4 mb-5">
            Soluções estruturadas para liderar o mercado.
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Abordamos a gestão de forma holística. Cada área opera de forma integrada para assegurar que a melhoria de um processo fortaleça a saúde financeira e estratégica da empresa como um todo.
          </p>
        </div>

        {/* Areas Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Area Navigation Selector */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {areasData.map((area, index) => (
              <button
                key={area.id}
                onClick={() => setActiveArea(index)}
                className={`text-left p-5 rounded border transition-all flex items-start gap-4 focus:outline-none cursor-pointer ${
                  activeArea === index
                    ? "bg-[#111A3E] border-blue-500 text-white shadow-lg shadow-black/30"
                    : "bg-[#0c122e]/40 border-blue-950/60 text-gray-400 hover:text-white hover:bg-[#0f183c]/50"
                }`}
              >
                <div className={`p-2.5 rounded transition-all ${
                  activeArea === index ? "bg-blue-600 text-white" : "bg-slate-900 border border-slate-800 text-blue-400"
                }`}>
                  {area.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-blue-400 font-bold">{area.id}</span>
                    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Practice Area</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold tracking-wide uppercase font-serif">
                    {area.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-1 mt-1 font-sans font-light">
                    {area.subtitle}
                  </p>
                </div>
                <ChevronRight size={18} className={`mt-4 transition-transform ${activeArea === index ? "translate-x-1 text-blue-400" : "text-gray-600"}`} />
              </button>
            ))}
          </div>

          {/* Right Active Detail Viewer */}
          <div className="lg:col-span-7 bg-[#0d1330] border border-blue-950/60 rounded-lg p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-fade-in">
            {/* Corner numbers */}
            <div className="absolute top-0 right-0 p-4 font-mono text-7xl font-bold text-blue-500/5 select-none pointer-events-none">
              {areasData[activeArea].id}
            </div>

            <div className="flex items-center gap-3 text-blue-400 mb-4">
              <span className="p-2 bg-blue-950/40 border border-blue-900/30 rounded">
                {areasData[activeArea].icon}
              </span>
              <span className="font-mono text-sm tracking-wider font-semibold">ÁREA DE ATUAÇÃO {areasData[activeArea].id}</span>
            </div>

            <h3 className="text-2xl font-serif font-bold text-white mb-3">
              {areasData[activeArea].title}
            </h3>
            <p className="text-blue-300 text-sm font-medium tracking-wide mb-6">
              {areasData[activeArea].subtitle}
            </p>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
              {areasData[activeArea].desc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pt-6 border-t border-blue-950/60">
              {/* Pain Points */}
              <div>
                <h4 className="text-xs font-bold tracking-widest text-red-400 uppercase mb-3">Problemas Típicos</h4>
                <ul className="space-y-2">
                  {areasData[activeArea].problemas.map((prob, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400 leading-normal">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span>{prob}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Solutions */}
              <div>
                <h4 className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">Nossas Soluções</h4>
                <ul className="space-y-2">
                  {areasData[activeArea].solucoes.map((sol, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-normal">
                      <CheckCircle2 size={12} className="text-blue-500 mt-0.5 shrink-0" />
                      <span>{sol}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-blue-950/40">
              <button
                onClick={() => handleCTA(areasData[activeArea].title, areasData[activeArea].whatsappMsg)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-950 cursor-pointer"
              >
                <span>Falar sobre esta área</span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => handleAIClick(areasData[activeArea].title)}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded border border-slate-700 hover:border-blue-400 text-gray-300 hover:text-white font-semibold text-sm transition-all cursor-pointer"
              >
                <span>Diagnosticar com a IA</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
