import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ResearchSection } from "@/components/ResearchSection";
import { PersonalSection } from "@/components/PersonalSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { GlobeJourney } from "@/components/GlobeJourney";
import { FailuresSection } from "@/components/FailuresSection";
import { CurrentlySection } from "@/components/CurrentlySection";
import { CookWithMeSection } from "@/components/CookWithMeSection";
import { SecretRecipesModal } from "@/components/SecretRecipesModal";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { initConsoleMessages } from "@/utils/consoleMessages";

const Index = () => {
  const [showGlobe, setShowGlobe] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const { success: konamiActivated, reset: resetKonami } = useKonamiCode();

  useEffect(() => {
    // Initialize console messages for curious developers
    initConsoleMessages();

    // Check if user has already seen the intro
    const hasSeenIntro = sessionStorage.getItem("hasSeenGlobeIntro");

    if (!hasSeenIntro) {
      setShowGlobe(true);
      sessionStorage.setItem("hasSeenGlobeIntro", "true");
    } else {
      setShowMainContent(true);
    }
  }, []);

  const handleGlobeComplete = () => {
    setShowGlobe(false);
    setShowMainContent(true);
  };

  return (
    <>
      {showGlobe && <GlobeJourney onComplete={handleGlobeComplete} />}

      <div className={`min-h-screen transition-opacity duration-1000 ${
        showMainContent ? "opacity-100" : "opacity-0"
      }`}>
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <ResearchSection />
        <FailuresSection />
        <CurrentlySection />
        <CookWithMeSection />
        <PersonalSection />
        <ContactSection />
        <Footer />
      </div>

      {/* Konami Code Easter Egg */}
      <SecretRecipesModal isOpen={konamiActivated} onClose={resetKonami} />
    </>
  );
};

export default Index;
