export type AnalyticsEvent = 
  | "CTA_CLICK" 
  | "AI_STARTED" 
  | "AI_COMPLETED" 
  | "WHATSAPP_CLICK" 
  | "CONTACT_SUBMITTED" 
  | "MEETING_REQUESTED";

export async function trackEvent(event: AnalyticsEvent) {
  try {
    const response = await fetch("/api/analytics/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
    });
    if (!response.ok) {
      console.warn("Falha ao registrar evento de analítica no servidor.");
    }
  } catch (error) {
    console.error("Erro na comunicação com a API de analítica:", error);
  }
}
