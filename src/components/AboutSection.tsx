import { Sparkles, Globe, Heart } from "lucide-react";
import profileImg from "@/assets/profile.jpeg";
import { ScrollReveal, StaggerContainer, StaggerItem } from "./animations/ScrollReveal";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="order-2 md:order-1">
            <ScrollReveal direction="right">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                About Me
              </h2>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={0.1}>
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  I'm an international student from Vietnam pursuing Computer
                  Engineering at Stony Brook University. My journey from Saigon to
                  New York has shaped my perspective on how technology can bridge
                  cultures and create meaningful change.
                </p>
                <p>
                  With 2 hackathon wins under my belt, I've developed AI-powered
                  solutions that address real-world challenges. Currently, I'm
                  building an oral history website for the 9/11 Memorial & Museum,
                  preserving the powerful stories of first responders.
                </p>
                <p>
                  My passion lies in AI and robotics research with a focus on
                  social good. I'm working toward a PhD to push the boundaries of
                  how intelligent systems can serve humanity.
                </p>
              </div>
            </ScrollReveal>

            <StaggerContainer className="mt-8 grid grid-cols-3 gap-4" staggerDelay={0.15}>
              <StaggerItem>
                <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm border border-border hover:shadow-lg transition-all group">
                  <Sparkles className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">2× Winner</p>
                  <p className="text-xs text-muted-foreground">Hackathons</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm border border-border hover:shadow-lg transition-all group">
                  <Globe className="h-6 w-6 text-secondary mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">Vietnam</p>
                  <p className="text-xs text-muted-foreground">to USA</p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="p-4 rounded-lg bg-muted/50 backdrop-blur-sm border border-border hover:shadow-lg transition-all group">
                  <Heart className="h-6 w-6 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">AI for</p>
                  <p className="text-xs text-muted-foreground">Social Good</p>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>

          <div className="order-1 md:order-2">
            <ScrollReveal direction="scale" delay={0.2}>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-accent to-secondary rounded-full opacity-20 blur-2xl animate-glow-pulse" />
                <img
                  src={profileImg}
                  alt="Profile"
                  className="relative rounded-2xl w-full max-w-md mx-auto shadow-2xl border-4 border-white/10"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
