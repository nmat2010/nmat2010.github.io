import { Mail, Linkedin, Github } from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "thunma2010@gmail.com",
    href: "mailto:thunma2010@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "/in/thu-tech",
    href: "https://www.linkedin.com/in/thu-tech/",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "@nmat2010",
    href: "https://github.com/nmat2010",
  },
];

export const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative py-32 bg-muted/20 overflow-hidden"
    >
      {/* Subtle Vietnamese wave pattern */}
      <div className="absolute bottom-10 left-10 w-40 h-16 opacity-[0.03]">
        <svg viewBox="0 0 200 50" className="w-full h-full text-accent">
          <path
            d="M0,25 Q25,10 50,25 T100,25 T150,25 T200,25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M0,35 Q25,20 50,35 T100,35 T150,35 T200,35"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Get in Touch
              </h2>
              {/* Vietnamese star accent */}
              <div className="flex gap-1 mt-2">
                <div className="w-1 h-1 rounded-full bg-accent/50"></div>
                <div className="w-1 h-1 rounded-full bg-yellow-500/50"></div>
              </div>
            </div>
            <p className="text-muted-foreground mb-12 text-lg">
              Open to research opportunities, collaborations, and conversations
              about AI
            </p>
          </ScrollReveal>

          <div className="space-y-4">
            {contactLinks.map((link, index) => (
              <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-4 p-6 rounded-lg border border-border hover:border-accent/30 transition-all duration-200 bg-background"
                >
                  {/* Vietnamese corner accent */}
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-accent/20 group-hover:border-accent/50 transition-colors"></div>
                  <div className="p-2 rounded-md bg-muted">
                    <link.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-1">
                      {link.label}
                    </p>
                    <p className="text-sm text-foreground font-medium">
                      {link.value}
                    </p>
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    →
                  </span>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
