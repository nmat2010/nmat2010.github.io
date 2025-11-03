import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ResearchSection } from "@/components/ResearchSection";
import { PersonalSection } from "@/components/PersonalSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ResearchSection />
      <PersonalSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
