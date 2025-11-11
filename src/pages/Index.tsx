import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { WorkSection } from "@/components/WorkSection";
import { LifeSection } from "@/components/LifeSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SecretRecipesModal } from "@/components/SecretRecipesModal";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { initConsoleMessages } from "@/utils/consoleMessages";

const Index = () => {
  const { success: konamiActivated, reset: resetKonami } = useKonamiCode();

  useEffect(() => {
    // Initialize console messages for curious developers
    initConsoleMessages();
  }, []);

  return (
    <>
      <div className="min-h-screen">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <WorkSection />
        {/* <LifeSection /> */}
        <ContactSection />
        <Footer />
      </div>

      {/* Konami Code Easter Egg - Hidden recipes and features */}
      <SecretRecipesModal isOpen={konamiActivated} onClose={resetKonami} />
    </>
  );
};

export default Index;
