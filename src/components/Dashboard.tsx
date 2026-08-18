import React, { useState, useEffect } from "react";
import { Lead, LeadStatus, AnalyticsData } from "../types.ts";
import { 
  Users, TrendingUp, CheckCircle, Clock, Search, Filter, 
  RefreshCw, ShieldAlert, X, ChevronDown, Award, Trash2, Calendar
} from "lucide-react";

interface DashboardProps {
  onClose: () => void;
}

export default function Dashboard({ onClose }: DashboardProps) {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [passError, setPassError] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "vandunem2026") {
      setAuthenticated(true);
      setPassError("");
      fetchData();
    } else {
      setPassError("Palavra-passe administrativa incorreta.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch leads
      const leadsRes = await fetch("/api/leads", {
        headers: { "x-admin-password": "vandunem2026" }
      });
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (leadsData.success) {
          setLeads(leadsData.leads);
        }
      }

      // Fetch analytics
      const analyticsRes = await fetch("/api/analytics", {
        headers: { "x-admin-password": "vandunem2026" }
      });
      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        if (analyticsData.success) {
          setAnalytics(analyticsData.analytics);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar dados administrativos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: LeadStatus) => {
    setActionLoading(leadId);
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": "vandunem2026"
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update local state
          setLeads(prev => prev.map(l => l.lead_id === leadId ? { ...l, status: newStatus } : l));
          // Refresh analytics count
          fetchData();
        }
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm) ||
      (lead.problema && lead.problema.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = statusFilter === "ALL" || lead.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusStyle = (status: LeadStatus) => {
    switch (status) {
      case "NEW":
        return "bg-blue-950 text-blue-400 border border-blue-900";
      case "QUALIFIED":
        return "bg-purple-950 text-purple-400 border border-purple-900";
      case "CONTACTED":
        return "bg-yellow-950 text-yellow-400 border border-yellow-900";
      case "MEETING":
        return "bg-indigo-950 text-indigo-400 border border-indigo-900";
      case "PROPOSAL":
        return "bg-orange-950 text-orange-400 border border-orange-900";
      case "NEGOTIATION":
        return "bg-amber-950 text-amber-400 border border-amber-900";
      case "WON":
        return "bg-green-950 text-green-400 border border-green-900";
      case "LOST":
        return "bg-red-950 text-red-400 border border-red-900";
      default:
        return "bg-slate-900 text-slate-400";
    }
  };

  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050814]/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#0a0f24] border border-blue-950/80 rounded-xl p-8 max-w-md w-full shadow-2xl relative text-left">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="p-3 bg-blue-950/40 border border-blue-900/30 text-blue-400 rounded-full mb-3">
              <ShieldAlert size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-white uppercase">Acesso Restrito CRM</h3>
            <p className="text-xs text-gray-400 mt-1">Insira a credencial administrativa para visualizar dados de leads e análises em tempo real.</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono uppercase text-gray-400">Palavra-passe Admin</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Introduza a chave de acesso"
                className="w-full bg-[#070b19] border border-blue-950 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                required
                autoFocus
              />
            </div>

            {passError && <p className="text-xs text-red-400 font-semibold">{passError}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
            >
              Autenticar Administrador
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050814] overflow-y-auto p-4 sm:p-6 lg:p-8 text-left">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#0a0f24] border border-blue-950 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950 border border-blue-900 rounded text-blue-400">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold text-white uppercase tracking-wider">Vandunem CRM</h1>
              <p className="text-xs text-blue-400 font-mono">Consola Administrativa & Gestão de Leads</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="p-2 bg-slate-900 border border-slate-800 text-gray-400 hover:text-white rounded transition-colors"
              title="Actualizar dados"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-gray-300 hover:text-white text-xs font-bold uppercase rounded tracking-wider flex items-center gap-1.5 cursor-pointer"
            >
              <X size={14} />
              <span>Sair do CRM</span>
            </button>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0a0f24] border border-blue-950 rounded-lg p-5 flex items-center justify-between shadow">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Total Leads</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">{leads.length}</p>
            </div>
            <div className="p-3 bg-blue-950/50 border border-blue-900/30 rounded text-blue-400">
              <Users size={18} />
            </div>
          </div>

          <div className="bg-[#0a0f24] border border-blue-950 rounded-lg p-5 flex items-center justify-between shadow">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Leads Ganhos</span>
              <p className="text-2xl font-bold font-mono text-green-400 mt-1">
                {leads.filter(l => l.status === "WON").length}
              </p>
            </div>
            <div className="p-3 bg-green-950/40 border border-green-900/30 rounded text-green-400">
              <CheckCircle size={18} />
            </div>
          </div>

          <div className="bg-[#0a0f24] border border-blue-950 rounded-lg p-5 flex items-center justify-between shadow">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Visitantes Únicos</span>
              <p className="text-2xl font-bold font-mono text-blue-400 mt-1">
                {analytics?.visitantes || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-950/50 border border-blue-900/30 rounded text-blue-400">
              <TrendingUp size={18} />
            </div>
          </div>

          <div className="bg-[#0a0f24] border border-blue-950 rounded-lg p-5 flex items-center justify-between shadow">
            <div>
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Aguardando Contacto</span>
              <p className="text-2xl font-bold font-mono text-yellow-400 mt-1">
                {leads.filter(l => l.status === "NEW" || l.status === "QUALIFIED").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-950/40 border border-yellow-900/30 rounded text-yellow-400">
              <Clock size={18} />
            </div>
          </div>
        </div>

        {/* ANALYTICS EVENT GRAPHS (CSS/SVG) */}
        {analytics && (
          <div className="bg-[#0a0f24] border border-blue-950 rounded-xl p-6 shadow-lg">
            <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider mb-5 border-b border-blue-950 pb-3">
              Métricas de Conversão (Eventos)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Event conversion list */}
              <div className="space-y-4">
                {[
                  { name: "Cliques em CTAs (CTA_CLICK)", value: analytics.eventos.CTA_CLICK },
                  { name: "Diagnósticos IA Iniciados (AI_STARTED)", value: analytics.eventos.AI_STARTED },
                  { name: "Diagnósticos IA Concluídos (AI_COMPLETED)", value: analytics.eventos.AI_COMPLETED },
                  { name: "Encaminhamentos WhatsApp (WHATSAPP_CLICK)", value: analytics.eventos.WHATSAPP_CLICK },
                  { name: "Formulários Enviados (CONTACT_SUBMITTED)", value: analytics.eventos.CONTACT_SUBMITTED },
                ].map((evt, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-gray-300 font-medium">{evt.name}</span>
                      <span className="text-white font-mono font-bold">{evt.value}</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-[#070b19] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (evt.value / (analytics.visitantes || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Lead Pipeline Funnel view */}
              <div className="flex flex-col justify-between p-4 bg-[#0d1330] rounded-lg border border-blue-950/60 text-xs">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500 font-bold mb-3 block">Pipeline do Funil Comercial</span>
                <div className="space-y-2">
                  {[
                    { label: "Visitas Únicas ao Site", count: analytics.visitantes, color: "bg-gray-700" },
                    { label: "Ações de Interesse (CTAs)", count: analytics.eventos.CTA_CLICK, color: "bg-blue-800" },
                    { label: "Qualificação por IA", count: analytics.eventos.AI_COMPLETED, color: "bg-purple-800" },
                    { label: "Inscrições / Leads Totais", count: leads.length, color: "bg-yellow-800" },
                    { label: "Leads Ganhos (Won)", count: leads.filter(l => l.status === "WON").length, color: "bg-green-800" }
                  ].map((pipe, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-32 text-gray-400 font-medium">{pipe.label}</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-3 bg-black/40 rounded overflow-hidden">
                          <div 
                            className={`h-full ${pipe.color}`} 
                            style={{ width: `${Math.min(100, (pipe.count / (analytics.visitantes || 1)) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-right font-mono text-white font-bold">{pipe.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADS LIST WITH INLINE EDIT CONTROLS */}
        <div className="bg-[#0a0f24] border border-blue-950 rounded-xl shadow-lg">
          
          {/* Controls Bar */}
          <div className="p-6 border-b border-blue-950 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <div>
              <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider">Leads Registados</h3>
              <p className="text-xs text-gray-400 mt-1">Exibindo {filteredLeads.length} de {leads.length} leads</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar leads..."
                  className="bg-[#070b19] border border-blue-950 rounded pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 w-full sm:w-48"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-3.5 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#070b19] border border-blue-950 rounded pl-9 pr-8 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer appearance-none"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="NEW">Novos</option>
                  <option value="QUALIFIED">Qualificados</option>
                  <option value="CONTACTED">Contactados</option>
                  <option value="MEETING">Reunião Agendada</option>
                  <option value="PROPOSAL">Proposta Enviada</option>
                  <option value="NEGOTIATION">Em Negociação</option>
                  <option value="WON">Ganho (Contrato)</option>
                  <option value="LOST">Perdido</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            {filteredLeads.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs text-gray-500 font-mono">Nenhum lead encontrado com os filtros atuais.</p>
              </div>
            ) : (
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-blue-950 bg-[#0d1330]/40 text-gray-400 font-mono uppercase tracking-wider">
                    <th className="p-4 font-semibold">Cliente / Empresa</th>
                    <th className="p-4 font-semibold">Setor</th>
                    <th className="p-4 font-semibold">Telemóvel & Email</th>
                    <th className="p-4 font-semibold">Problema / Desafio</th>
                    <th className="p-4 font-semibold">Urgência</th>
                    <th className="p-4 font-semibold">Status do Funil</th>
                    <th className="p-4 font-semibold">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-950/60">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.lead_id} className="hover:bg-slate-900/30 transition-colors">
                      {/* Name & Company */}
                      <td className="p-4">
                        <div className="font-semibold text-white">{lead.nome}</div>
                        <div className="text-[10px] text-blue-400 font-medium mt-0.5">{lead.empresa || "Pessoa Física"}</div>
                      </td>

                      {/* Sector */}
                      <td className="p-4 text-gray-300">
                        {lead.setor || "Não Informado"}
                      </td>

                      {/* Contact details */}
                      <td className="p-4 font-mono">
                        <div>{lead.telefone}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{lead.email || "Sem email"}</div>
                      </td>

                      {/* Problem summary */}
                      <td className="p-4 max-w-xs truncate text-gray-400 font-light" title={lead.problema}>
                        {lead.problema}
                      </td>

                      {/* Urgency */}
                      <td className="p-4 font-semibold text-gray-300 uppercase">
                        {lead.urgencia}
                      </td>

                      {/* Status Badges */}
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusStyle(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>

                      {/* Dropdown status update */}
                      <td className="p-4">
                        <select
                          value={lead.status}
                          disabled={actionLoading === lead.lead_id}
                          onChange={(e) => handleUpdateStatus(lead.lead_id, e.target.value as LeadStatus)}
                          className="bg-[#070b19] border border-blue-950 text-[10px] font-bold text-gray-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
                        >
                          <option value="NEW">Novo</option>
                          <option value="QUALIFIED">Qualificado</option>
                          <option value="CONTACTED">Contactado</option>
                          <option value="MEETING">Reunião</option>
                          <option value="PROPOSAL">Proposta</option>
                          <option value="NEGOTIATION">Negociação</option>
                          <option value="WON">WON (Ganho)</option>
                          <option value="LOST">LOST (Perdido)</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
