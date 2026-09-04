import { Github, ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Percepta",
    subtitle: "HackPrinceton'25",
    description:
      "An iOS camera app that reveals everyday scenes through mathematician, physicist, biologist, or artist perspectives.",
    language: "Swift",
    languageColor: "#F05138",
    tech: ["SwiftUI", "YOLO", "Python", "AVFoundation"],
    image: "/projects/percepta.png",
    github: "https://github.com/han-hangoc-le/percepta",
    devpost: "https://devpost.com/software/percepta-4jfs8b",
  },
  {
    title: "SeeSay",
    subtitle: "HopperHacks'25",
    description:
      "A web app enabling hands-free navigation and control using advanced voice and eye-tracking for accessible, intuitive user interaction.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    tech: ["React", "WebGazer.js", "Web Speech API"],
    image: "/projects/seesay.jpg",
    github: "https://github.com/nmat2010/seesay-hopperhacks-25",
    devpost: "https://devpost.com/software/seesay-1r8svc",
  },
  {
    title: "SkinGuard",
    subtitle: "HackNYU'25",
    description:
      "SkinGuard uses OpenAI and EfficientNet-B3 to detect skin diseases, provide diagnoses, and promote affordable, accessible skincare awareness.",
    language: "Python",
    languageColor: "#3572A5",
    tech: ["React", "MERN", "Efficient-Net-B3", "OpenAI API"],
    image: "/projects/skinguard.jpg",
    github: "https://github.com/nmat2010/skinguard-hacknyu-25",
    devpost: "https://devpost.com/software/skinguard-ai-dermatologist",
  },
];

export const WorkSection = () => {
  return (
    <section id="projects" className="py-20 px-6 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 text-foreground">Projects</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden bg-background hover:border-accent/50 transition-colors h-full flex flex-col"
            >
              {project.image && (
                <div className="relative h-48 bg-muted/50 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {project.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {project.subtitle}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-colors"
                      title="View on GitHub"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                    <a
                      href={project.devpost}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-colors"
                      title="View on Devpost"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-1 bg-muted border border-border rounded-full text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-auto">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: project.languageColor }}
                  />
                  <span>{project.language}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
