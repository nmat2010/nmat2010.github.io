import { useState, useEffect } from "react";
import { Book, Music, Code, ChefHat, Plane, Brain } from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";

const currentActivities = [
  {
    icon: Book,
    label: "Reading",
    value: "Life 3.0 by Max Tegmark",
  },
  {
    icon: Music,
    label: "Listening",
    value: "Golden Hour - JVKE",
  },
  {
    icon: Code,
    label: "Building",
    value: "9/11 Memorial oral history platform",
  },
  {
    icon: Brain,
    label: "Learning",
    value: "Transformer Architectures",
  },
  {
    icon: ChefHat,
    label: "Cooking",
    value: "Vietnamese Phở",
  },
  {
    icon: Plane,
    label: "Dreaming",
    value: "Iceland & Norway",
  },
];

export const LifeSection = () => {
  const [days, setDays] = useState(0);

  useEffect(() => {
    // Calculate days since arriving in USA (adjust this date to your actual arrival date)
    const arrivalDate = new Date("2023-08-20");
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
    setDays(daysSince);
  }, []);

  return (
    <section id="life" className="relative py-32 bg-background overflow-hidden">
      {/* Subtle Vietnamese lantern pattern */}
      <div className="absolute bottom-20 right-20 w-20 h-32 opacity-[0.03]">
        <svg viewBox="0 0 50 100" className="w-full h-full text-secondary">
          <ellipse cx="25" cy="30" rx="20" ry="25" fill="none" stroke="currentColor" strokeWidth="1"/>
          <ellipse cx="25" cy="70" rx="20" ry="25" fill="none" stroke="currentColor" strokeWidth="1"/>
          <line x1="25" y1="5" x2="25" y2="95" stroke="currentColor" strokeWidth="1"/>
        </svg>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Life
              </h2>
              {/* Vietnamese coffee cup accent */}
              <div className="flex gap-1 mt-2">
                <div className="w-1 h-1 rounded-full bg-accent/50"></div>
                <div className="w-1 h-1 rounded-full bg-yellow-500/50"></div>
              </div>
            </div>
            <p className="text-muted-foreground mb-12 text-lg">
              Beyond the code, what keeps me inspired
            </p>
          </ScrollReveal>

          {/* Currently grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {currentActivities.map((activity, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.05}>
                <div className="group relative space-y-3 p-4 rounded-lg hover:bg-muted/20 transition-all duration-200">
                  {/* Subtle Vietnamese accent dot */}
                  <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-accent/30 group-hover:bg-accent/60 transition-colors"></div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <activity.icon className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-wider font-medium">
                      {activity.label}
                    </span>
                  </div>
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    {activity.value}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Days counter */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="relative pt-12 border-t border-border text-center">
              {/* Vietnamese decorative elements */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-2 opacity-20">
                <div className="w-1 h-1 rounded-full bg-accent"></div>
                <div className="w-1 h-1 rounded-full bg-yellow-500"></div>
                <div className="w-1 h-1 rounded-full bg-accent"></div>
              </div>
              <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-4">
                Days Since Moving to USA
              </p>
              <p className="text-5xl md:text-6xl font-bold text-foreground mb-2">
                {days.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Every day is a new adventure
              </p>
            </div>
          </ScrollReveal>

          {/* Philosophy quote */}
          <ScrollReveal direction="up" delay={0.4}>
            <div className="relative mt-12 p-8 rounded-lg border border-border bg-muted/20">
              {/* Vietnamese quote marks */}
              <div className="absolute top-4 left-4 text-4xl text-accent/10 font-serif">"</div>
              <div className="absolute bottom-4 right-4 text-4xl text-accent/10 font-serif">"</div>
              <p className="text-muted-foreground italic leading-relaxed">
                "The best innovations come from understanding both the technical and human aspects
                of a problem. Whether I'm cooking a new recipe or debugging code, I'm always
                learning and exploring."
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
