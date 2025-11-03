import { Mail, Linkedin, Github, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "your.email@stonybrook.edu",
    href: "mailto:your.email@stonybrook.edu",
    color: "hover:text-accent",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Connect with me",
    href: "https://linkedin.com/in/yourprofile",
    color: "hover:text-secondary",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "Check out my code",
    href: "https://github.com/yourusername",
    color: "hover:text-accent",
  },
];

export const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <p className="text-xl text-muted-foreground">
              Always open to discussing research opportunities, collaborations, or
              just chatting about AI and robotics
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {contactLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-2xl border-2 border-border hover:border-accent/50 transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-[0_0_30px_hsl(var(--accent)/0.15)] hover:-translate-y-1 animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full group-hover:scale-110 transition-transform">
                    <link.icon className={`h-8 w-8 ${link.color} transition-colors`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{link.label}</h3>
                    <p className="text-sm text-muted-foreground">{link.value}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-r from-accent/5 to-secondary/5 border border-accent/20 animate-fade-in-up">
            <h3 className="text-2xl font-bold mb-4">Ready to collaborate?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're interested in research collaboration, have a project
              idea, or just want to discuss the latest in AI and robotics, I'd love
              to hear from you.
            </p>
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-[0_0_30px_hsl(var(--accent)/0.3)] transition-all group"
              asChild
            >
              <a href="mailto:your.email@stonybrook.edu">
                <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                Send me an email
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
