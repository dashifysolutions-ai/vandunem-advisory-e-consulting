import React, { useState } from "react";
import { trackEvent } from "../utils/analytics.ts";
import { isValidEmail } from "../utils/validation.ts";
import { 
  Mail, Phone, MessageSquare, ShieldAlert, CheckCircle2, 
  Loader2, ArrowRight, User, Building, MapPin, Send 
} from "lucide-react";

interface ContactProps {
  prefilledService?: string;
}

export default function Contact({ prefilledService }: ContactProps) {
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    setor: "",
    email: "",
    telefone: "",
    problema: prefilledService ? `Interesse no serviço: ${prefilledService}` : "",
    mensagem: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.telefone) {
      setError("Nome e Telefone/WhatsApp são obrigatórios.");
      return;
    }

    if (formData.email && !isValidEmail(formData.email)) {
      setError("Por favor, introduza um endereço de e-mail válido (ex: nome@empresa.com).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          empresa: formData.empresa,
          setor: formData.setor,
          email: formData.email,
          telefone: formData.telefone,
          problema: `${formData.problema} ${formData.mensagem ? `| Mensagem: ${formData.mensagem}` : ""}`.trim(),
          urgencia: "Não Especificado",
          servico_recomendado: prefilledService || "Geral",
          origem: "Formulário de Contacto"
        }),
      });

      if (!response.ok) {
        throw new Error("Erro na gravação dos dados do lead.");
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        trackEvent("CONTACT_SUBMITTED");
      } else {
        throw new Error("Resposta inesperada do servidor.");
      }
    } catch (err: any) {
      setError(err.message || "Não foi possível enviar o formulário. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    trackEvent("WHATSAPP_CLICK");
    const text = `Olá, Vandunem. Sou ${formData.nome} da empresa ${formData.empresa || "Não Informada"}. Gostaria de agendar uma reunião comercial para falar sobre um problema empresarial no setor de ${formData.setor || "Serviços"}.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/244921780191?text=${encoded}`, "_blank");
  };

  return (
    <section id="contacto" className="py-24 bg-[#070b19] relative">
      <div className="absolute top-1/2 left-10 w-80 h-80 bg-blue-500/5 rounded-full blur-[110px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-400 text-xs font-bold tracking-widest uppercase bg-blue-950/40 border border-blue-900/30 px-3 py-1 rounded">
            Fale Connosco
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-4 mb-4">
            Solicitar Contacto Executivo
          </h2>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Preencha as informações da sua empresa. Um especialista da Vandunem entrará em contacto directo para agendamento de um Diagnóstico Start inicial.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* Left panel: Info Details */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-[#0a0f24] border border-blue-950 p-8 rounded-lg shadow-xl text-left flex flex-col gap-6">
              <h3 className="text-lg font-serif font-bold text-white mb-2 uppercase tracking-wide border-b border-blue-950 pb-3">
                Informações de Contacto
              </h3>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-950/40 border border-blue-900/30 rounded text-blue-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-mono text-gray-500">Endereço de E-mail</h4>
                  <a href="mailto:tiltsontchilico@gmail.com" className="text-sm font-semibold text-gray-200 hover:text-blue-400 transition-colors">
                    tiltsontchilico@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-950/40 border border-blue-900/30 rounded text-blue-400 shrink-0">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-mono text-gray-500">Canal Principal WhatsApp</h4>
                  <a href="https://wa.me/244921780191" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-200 hover:text-blue-400 transition-colors">
                    921 780 191
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-950/40 border border-blue-900/30 rounded text-blue-400 shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-mono text-gray-500">Contacto de Telefone</h4>
                  <a href="tel:+244953203997" className="text-sm font-semibold text-gray-200 hover:text-blue-400 transition-colors">
                    953 203 997
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-950/40 border border-blue-900/30 rounded text-blue-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-mono text-gray-500">Localização Inicial</h4>
                  <p className="text-sm font-semibold text-gray-200">
                    Luanda, Angola
                  </p>
                </div>
              </div>
            </div>

            {/* Note on focus and zero-spam */}
            <div className="p-5 border border-blue-950/40 bg-blue-950/10 rounded flex items-start gap-3 text-left">
              <ShieldAlert className="text-blue-400 shrink-0 mt-0.5" size={16} />
              <p className="text-[11px] text-gray-400 leading-relaxed">
                A Vandunem Advisory & Consulting respeita estritamente o sigilo comercial e a privacidade dos seus dados. Toda a informação aqui descrita será protegida e utilizada única e exclusivamente para a fundamentação diagnóstica do seu negócio.
              </p>
            </div>
          </div>

          {/* Right panel: Live Form */}
          <div className="lg:col-span-7 bg-[#0a0f24] border border-blue-950 p-8 rounded-lg shadow-xl text-left relative">
            <div className="absolute top-0 right-0 p-3 text-blue-500/5 font-mono text-[70px] font-bold leading-none select-none pointer-events-none uppercase">
              Vandunem
            </div>

            {success ? (
              <div className="py-12 flex flex-col items-center text-center animate-fade-in">
                <CheckCircle2 size={54} className="text-blue-500 mb-6" />
                <h3 className="text-xl font-serif font-bold text-white mb-2">Pedido Enviado com Sucesso!</h3>
                <p className="text-sm text-gray-400 max-w-sm mb-8">
                  Os dados foram armazenados no CRM da Vandunem. Um dos nossos consultores executivos séniores entrará em contacto dentro de 24 horas úteis.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <button
                    onClick={handleWhatsAppRedirect}
                    className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm rounded transition-all shadow-md cursor-pointer"
                  >
                    <MessageSquare size={16} />
                    <span>Iniciar conversa no WhatsApp</span>
                  </button>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setFormData({
                        nome: "",
                        empresa: "",
                        setor: "",
                        email: "",
                        telefone: "",
                        problema: "",
                        mensagem: ""
                      });
                    }}
                    className="w-full py-3 px-6 border border-slate-700 hover:border-white text-gray-300 hover:text-white rounded text-sm transition-all cursor-pointer"
                  >
                    Novo Envio
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {error && (
                  <div className="p-3 bg-red-950/20 border border-red-900/40 rounded text-red-400 text-xs font-semibold flex items-center gap-2">
                    <ShieldAlert size={14} className="text-red-500 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {prefilledService && (
                  <div className="p-3 rounded bg-blue-950/30 border border-blue-900/40 text-blue-400 text-xs flex justify-between items-center">
                    <span>A solicitar contacto para: <strong>{prefilledService}</strong></span>
                    <button 
                      type="button" 
                      onClick={() => setFormData(prev => ({ ...prev, problema: "" }))} 
                      className="hover:underline font-bold"
                    >
                      Limpar
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-mono">Nome Gestor / Responsável *</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3.5 top-4 text-gray-500" />
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        placeholder="Nome completo"
                        className="w-full bg-[#070b19] border border-blue-950 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none rounded pl-10 pr-4 py-3.5 text-sm"
                      />
                    </div>
                  </div>

                  {/* Empresa */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-mono">Nome da Empresa</label>
                    <div className="relative">
                      <Building size={14} className="absolute left-3.5 top-4 text-gray-500" />
                      <input
                        type="text"
                        name="empresa"
                        value={formData.empresa}
                        onChange={handleChange}
                        placeholder="Ex: AngoCorp Lda"
                        className="w-full bg-[#070b19] border border-blue-950 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none rounded pl-10 pr-4 py-3.5 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Setor */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-mono">Setor de Atividade</label>
                    <input
                      type="text"
                      name="setor"
                      value={formData.setor}
                      onChange={handleChange}
                      placeholder="Ex: Retalho, Saúde, Restaurantes"
                      className="w-full bg-[#070b19] border border-blue-950 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none rounded px-4 py-3.5 text-sm"
                    />
                  </div>

                  {/* Telefone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-mono">Contacto Telefónico / WhatsApp *</label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      placeholder="Ex: +244 921 780 191"
                      className="w-full bg-[#070b19] border border-blue-950 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none rounded px-4 py-3.5 text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-mono">Endereço de E-mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ex: gestao@empresa.ao"
                    className="w-full bg-[#070b19] border border-blue-950 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none rounded px-4 py-3.5 text-sm"
                  />
                </div>

                {/* Principal Desafio */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-mono">Principal Desafio Empresarial</label>
                  <input
                    type="text"
                    name="problema"
                    value={formData.problema}
                    onChange={handleChange}
                    placeholder="Descreva sinteticamente o problema"
                    className="w-full bg-[#070b19] border border-blue-950 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none rounded px-4 py-3.5 text-sm"
                  />
                </div>

                {/* Mensagem */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 font-mono">Mensagem Adicional (Opcional)</label>
                  <textarea
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    placeholder="Escreva detalhes adicionais..."
                    rows={4}
                    className="w-full bg-[#070b19] border border-blue-950 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none rounded p-4 text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm uppercase tracking-widest rounded transition-all shadow-md flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>A processar...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Solicitar contacto</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
