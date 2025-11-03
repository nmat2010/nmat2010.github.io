import { Brain, Bot, Cpu, GraduationCap } from "lucide-react";

const researchAreas = [
  {
    icon: Brain,
    title: "Machine Learning",
    description:
      "Exploring neural networks, deep learning, and how machines can learn from data to make intelligent decisions.",
    color: "from-accent to-accent/80",
  },
  {
    icon: Bot,
    title: "Robotics",
    description:
      "Investigating human-robot interaction, autonomous systems, and how robots can assist in everyday life.",
    color: "from-secondary to-secondary/80",
  },
  {
    icon: Cpu,
    title: "Computer Vision",
    description:
      "Working on image recognition, object detection, and enabling machines to understand visual information.",
    color: "from-primary to-primary/80",
  },
  {
    icon: GraduationCap,
    title: "PhD Aspirations",
    description:
      "Planning to pursue doctoral research in AI/Robotics, focusing on applications that create meaningful social impact.",
    color: "from-accent to-secondary",
  },
];

export const ResearchSection = () => {
  return (
    <section id="research" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Research Interests
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Exploring the intersection of AI, robotics, and human impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          {researchAreas.map((area, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl border-2 border-border hover:border-transparent transition-all duration-300 bg-card/50 backdrop-blur-sm hover:shadow-[0_0_40px_hsl(var(--accent)/0.15)] animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity`}
              />
              
              <div className="relative">
                <div className="mb-4 p-3 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-lg w-fit group-hover:scale-110 transition-transform">
                  <area.icon className="h-8 w-8 text-accent" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {area.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {area.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto text-center p-8 rounded-2xl bg-gradient-to-r from-accent/5 to-secondary/5 border border-accent/20 animate-fade-in-up">
          <h3 className="text-2xl font-bold mb-4">The Path Ahead</h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            I'm committed to pursuing a PhD in AI and Robotics after graduation,
            with a focus on developing technologies that address real-world
            challenges and create positive social impact. My research will bridge
            the gap between cutting-edge AI innovations and practical applications
            that improve people's lives.
          </p>
        </div>
      </div>
    </section>
  );
};
