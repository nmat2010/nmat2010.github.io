import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { StatsSection } from "@/components/StatsSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { SkillsSection } from "@/components/SkillsSection";
import { WorkSection } from "@/components/WorkSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { SecretRecipesModal } from "@/components/SecretRecipesModal";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ScrollProgress } from "@/components/ScrollProgress";
import { JourneyMap } from "@/components/JourneyMap";
import { AchievementBadges } from "@/components/AchievementBadges";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { initConsoleMessages } from "@/utils/consoleMessages";

const Index = () => {
  const { success: konamiActivated, reset: resetKonami } = useKonamiCode();
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    // Initialize console messages for curious developers
    initConsoleMessages();
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen onLoadingComplete={() => setLoadingComplete(true)} />

      <motion.div
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: loadingComplete ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <ScrollProgress />
        <Navigation />
        <HeroSection />
        <AboutSection />
        <JourneyMap />
        {/* <StatsSection /> */}
        <ExperienceSection />
        {/* <AchievementBadges /> */}
        <WorkSection />
        <ContactSection />
        <Footer />
      </motion.div>

      {/* Konami Code Easter Egg - Hidden recipes and features */}
      <SecretRecipesModal isOpen={konamiActivated} onClose={resetKonami} />
    </>
  );
};

export default Index;
