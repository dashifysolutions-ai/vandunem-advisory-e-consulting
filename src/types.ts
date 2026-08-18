export type LeadStatus = "NEW" | "QUALIFIED" | "CONTACTED" | "MEETING" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";

export interface Lead {
  lead_id: string;
  nome: string;
  empresa: string;
  setor: string;
  tamanho_empresa: string;
  telefone: string;
  email: string;
  problema: string;
  urgencia: string;
  servico_recomendado: string;
  origem: string;
  status: LeadStatus;
  created_at: string;
}

export interface AnalyticsData {
  visitantes: number;
  origens: { [key: string]: number };
  eventos: {
    CTA_CLICK: number;
    AI_STARTED: number;
    AI_COMPLETED: number;
    WHATSAPP_CLICK: number;
    CONTACT_SUBMITTED: number;
    MEETING_REQUESTED: number;
  };
  statusCounts: { [key in LeadStatus]?: number };
  totalLeads: number;
}

export interface AIAnalysis {
  resumoDesafio: string;
  problemasIdentificados: string[];
  areasRecomendadas: string[];
  proximoPasso: string;
}
