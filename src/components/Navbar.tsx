import React, { useState, useEffect } from "react";
import Logo from "./Logo.tsx";
import { trackEvent } from "../utils/analytics.ts";
import { Menu, X, ShieldAlert, MessageSquare } from "lucide-react";

interface NavbarProps {
  onNavigate: (section: string) => void;
  currentSection: string;
  onOpenAdmin: () => void;
}

export default function Navbar({ onNavigate, currentSection, onOpenAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { id: "home", label: "Início" },
    { id: "areas", label: "Áreas" },
    { id: "solucoes", label: "Soluções" },
    { id: "servicos", label: "Serviços" },
    { id: "metodologia", label: "Metodologia" },
    { id: "ai-diagnostic", label: "Vandunem AI" },
    { id: "sobre", label: "Sobre" },
    { id: "insights", label: "Insights" },
    { id: "contacto", label: "Contacto" },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  const handleWhatsAppCTA = () => {
    trackEvent("WHATSAPP_CLICK");
    window.open("https://wa.me/244953203997?text=Olá,%20Vandunem.%20Gostaria%20de%20falar%20sobre%20um%20problema%20empresarial.", "_blank");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 border-b ${
        scrolled
          ? "bg-[#070B19]/90 backdrop-blur-md border-blue-900/40 py-3 shadow-lg shadow-black/20"
          : "bg-transparent border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <button onClick={() => handleLinkClick("home")} className="focus:outline-none h-12 flex items-center">
          <Logo className="h-10 sm:h-12" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className={`text-sm tracking-wide transition-colors duration-200 focus:outline-none font-medium cursor-pointer ${
                currentSection === item.id
                  ? "text-blue-400 font-semibold"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTAs */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-700 hover:border-blue-500 hover:bg-blue-950/40 text-xs text-gray-300 hover:text-blue-400 font-medium transition-all"
            title="Acesso Administrador"
          >
            <ShieldAlert size={14} />
            <span>CRM Admin</span>
          </button>

          <button
            onClick={handleWhatsAppCTA}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-md shadow-blue-900/30 font-sans tracking-wide cursor-pointer"
          >
            <MessageSquare size={16} />
            <span>Falar com a Vandunem</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className="p-1.5 rounded border border-slate-800 text-gray-400 hover:text-blue-400 hover:border-blue-500 transition-all"
            title="Admin CRM"
          >
            <ShieldAlert size={16} />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded border border-slate-800 bg-slate-900/60 text-gray-300 hover:text-white hover:bg-slate-800 transition-all focus:outline-none"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#090E20]/98 border-b border-blue-950/80 shadow-2xl backdrop-blur-lg animate-fade-in">
          <div className="px-4 py-6 space-y-4 max-w-lg mx-auto">
            <div className="flex flex-col gap-3">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item.id)}
                  className={`text-left py-2.5 px-3 rounded-md text-base font-medium transition-all ${
                    currentSection === item.id
                      ? "bg-blue-950/50 text-blue-400 border-l-2 border-blue-500 pl-4"
                      : "text-gray-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded border border-slate-700 bg-slate-900/50 text-gray-300 text-sm font-semibold"
              >
                <ShieldAlert size={16} />
                <span>Painel Administrador CRM</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleWhatsAppCTA();
                }}
                className="flex items-center justify-center gap-2 w-full py-3 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-950/50"
              >
                <MessageSquare size={16} />
                <span>Falar com a Vandunem</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
