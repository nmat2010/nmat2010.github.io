import { ExternalLink, Trophy, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";

const projects = [
  {
    title: "AI-Powered Hackathon Project 1",
    description:
      "Developed an innovative AI solution that won first place at a major hackathon. Leveraged machine learning to solve real-world problems with measurable impact.",
    category: "AI/ML",
    achievements: ["🏆 1st Place Winner", "Built in 24 hours", "Team of 4"],
    tech: ["Python", "TensorFlow", "React", "Flask"],
    icon: Trophy,
  },
  {
    title: "AI-Powered Hackathon Project 2",
    description:
      "Created an AI-driven platform that secured top honors at another competitive hackathon. Focused on accessibility and user-centric design.",
    category: "AI/ML",
    achievements: ["🏆 1st Place Winner", "100+ users tested", "Open-sourced"],
    tech: ["PyTorch", "Next.js", "PostgreSQL", "Docker"],
    icon: Trophy,
  },
  {
    title: "9/11 Memorial Oral History Website",
    description:
      "Building a powerful digital archive showcasing first responder interviews for the 9/11 Memorial & Museum. Preserving critical historical narratives for future generations.",
    category: "Web Development",
    achievements: [
      "In Progress",
      "Partnership with 9/11 Museum",
      "Historical preservation",
    ],
    tech: ["React", "TypeScript", "Video Processing", "AWS"],
    icon: Heart,
  },
];

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building solutions that combine technical innovation with social impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--accent)/0.2)] hover:-translate-y-2 bg-card/50 backdrop-blur-sm animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="p-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <project.icon className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-secondary/10 text-secondary rounded-full">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                <div className="space-y-3 mb-4">
                  {project.achievements.map((achievement, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span className="text-muted-foreground">{achievement}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-muted rounded-md text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <button className="flex items-center gap-2 text-accent font-medium text-sm hover:gap-3 transition-all group-hover:text-accent/80">
                  Learn more
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
