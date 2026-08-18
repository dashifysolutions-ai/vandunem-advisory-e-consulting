import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar.tsx";
import Hero from "./components/Hero.tsx";
import Areas from "./components/Areas.tsx";
import SolutionsByProblem from "./components/SolutionsByProblem.tsx";
import Services from "./components/Services.tsx";
import HowWeWork from "./components/HowWeWork.tsx";
import WhoWeServe from "./components/WhoWeServe.tsx";
import VandunemAI from "./components/VandunemAI.tsx";
import About from "./components/About.tsx";
import Insights from "./components/Insights.tsx";
import Contact from "./components/Contact.tsx";
import Footer from "./components/Footer.tsx";
import Dashboard from "./components/Dashboard.tsx";
import { trackEvent } from "./utils/analytics.ts";

export default function App() {
  const [currentSection, setCurrentSection] = useState("home");
  const [adminOpen, setAdminOpen] = useState(false);
  const [preselectedProblem, setPreselectedProblem] = useState<string>("");
  const [prefilledService, setPrefilledService] = useState<string>("");

  // Track initial unique visitor on app startup
  useEffect(() => {
    const registerVisit = async () => {
      try {
        await fetch("/api/analytics/visit", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
      } catch (err) {
        console.warn("Falha ao registrar visita de analítica.");
      }
    };
    registerVisit();
  }, []);

  // Set up intersection observer to highlight navbar links on scroll
  useEffect(() => {
    const sections = ["home", "areas", "solucoes", "servicos", "metodologia", "ai-diagnostic", "sobre", "insights", "contacto"];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleSelectProblemForAI = (problemText: string) => {
    setPreselectedProblem(problemText);
  };

  const handleSelectServiceForContact = (serviceName: string) => {
    setPrefilledService(serviceName);
  };

  return (
    <div id="root-container" className="bg-[#070B19] text-white min-h-screen font-sans flex flex-col relative antialiased selection:bg-blue-600 selection:text-white">
      {/* Premium Glassmorphic Navbar */}
      <Navbar 
        onNavigate={handleNavigate} 
        currentSection={currentSection} 
        onOpenAdmin={() => setAdminOpen(true)} 
      />

      {/* Main Content Layout */}
      <main className="flex-1">
        {/* Section: Home & Hero */}
        <Hero 
          onNavigate={handleNavigate} 
          onSelectProblem={handleSelectProblemForAI} 
        />

        {/* Section: Areas of Actuation */}
        <Areas 
          onNavigate={handleNavigate} 
          onSelectAreaForAI={(area) => setPreselectedProblem(`Desafio em: ${area}`)} 
        />

        {/* Section: Problem Symptom Cards */}
        <SolutionsByProblem 
          onNavigate={handleNavigate} 
          onSelectProblemForAI={handleSelectProblemForAI} 
        />

        {/* Section: Services & Value Ladder */}
        <Services 
          onNavigate={handleNavigate} 
          onSelectServiceForContact={handleSelectServiceForContact} 
        />

        {/* Section: Methodology Timeline */}
        <HowWeWork />

        {/* Section: Client Segments */}
        <WhoWeServe />

        {/* Section: Vandunem AI Triage Assistant */}
        <VandunemAI 
          preselectedProblem={preselectedProblem} 
          onClearPreselection={() => setPreselectedProblem("")} 
          onNavigate={handleNavigate}
        />

        {/* Section: About the Company */}
        <About />

        {/* Section: Insights Previews */}
        <Insights />

        {/* Section: Lead Generation Contact Form */}
        <Contact 
          prefilledService={prefilledService} 
        />
      </main>

      {/* Footer Details */}
      <Footer onNavigate={handleNavigate} />

      {/* ADMIN CRM PORTAL OVERLAY */}
      {adminOpen && (
        <Dashboard onClose={() => setAdminOpen(false)} />
      )}
    </div>
  );
}
