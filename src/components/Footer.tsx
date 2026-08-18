import React from "react";
import Logo from "./Logo.tsx";
import { Mail, Phone, MessageSquare, MapPin, ArrowUp } from "lucide-react";

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const links = [
    { id: "home", label: "Início" },
    { id: "areas", label: "Áreas" },
    { id: "solucoes", label: "Soluções" },
    { id: "servicos", label: "Serviços" },
    { id: "metodologia", label: "Metodologia" },
    { id: "ai-diagnostic", label: "Vandunem AI" },
    { id: "sobre", label: "Sobre" },
    { id: "insights", label: "Insights" },
    { id: "contacto", label: "Contacto" }
  ];

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#050814] border-t border-blue-950/80 pt-16 pb-12 relative overflow-hidden text-left">
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-b border-blue-950 pb-12 mb-10">
          
          {/* Logo & Description */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <Logo className="h-10 sm:h-12" />
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mt-2">
              A Vandunem Advisory & Consulting é uma consultoria empresarial integrada focada no desenvolvimento e eficiência de micro, pequenas empresas e PMEs no mercado angolano.
            </p>
            <span className="text-[10px] tracking-widest text-blue-400 font-mono font-bold uppercase mt-2 block">
              Transforming Businesses. Driving Performance. Creating Value.
            </span>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white font-mono">Links Rápidos</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className="text-left text-xs text-gray-400 hover:text-white transition-colors py-1 cursor-pointer focus:outline-none font-medium"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact details */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h4 className="text-xs uppercase font-bold tracking-widest text-white font-mono">Contactos Directos</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <Mail size={12} className="text-blue-500 shrink-0" />
                <a href="mailto:tiltsontchilico@gmail.com" className="hover:text-blue-400 transition-colors">
                  tiltsontchilico@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <MessageSquare size={12} className="text-blue-500 shrink-0" />
                <a href="https://wa.me/244921780191" className="hover:text-blue-400 transition-colors">
                  WhatsApp: 921 780 191
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <Phone size={12} className="text-blue-500 shrink-0" />
                <a href="tel:+244953203997" className="hover:text-blue-400 transition-colors">
                  Telefone: 953 203 997
                </a>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <MapPin size={12} className="text-blue-500 shrink-0" />
                <span>Luanda, Angola</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright and back to top */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-gray-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} VANDUNEM Advisory & Consulting. Todos os direitos reservados.
          </p>

          <button
            onClick={handleScrollTop}
            className="p-2 bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-blue-950 text-gray-400 hover:text-white rounded-full transition-all focus:outline-none flex items-center justify-center cursor-pointer"
            title="Voltar ao Topo"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
