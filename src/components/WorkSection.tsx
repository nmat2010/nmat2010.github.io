import {
  ChevronLeft,
  ChevronRight,
  Github,
  Brain,
  Bot,
  Cpu,
  GraduationCap,
} from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const projects = [
  {
    title: "Percepta",
    subtitle: "HackPrinceton'25",
    description:
      "Developed an innovative AI solution that won first place. Leveraged machine learning to solve real-world problems with measurable impact.",
    language: "Python",
    languageColor: "#3572A5",
    tech: ["Python", "TensorFlow", "React", "Flask"],
    image: "/projects/percepta.png",
    github: "https://github.com/han-hangoc-le/percepta",
  },
  {
    title: "SeeSay",
    subtitle: "HopperHacks'25",
    description:
      "AI-driven platform that secured top honors at competitive hackathon. Focused on accessibility and user-centric design.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    tech: ["Next.js", "PostgreSQL", "Docker"],
    image: "/projects/seesay.jpg",
    github: "https://github.com/nmat2010/seesay-hopperhacks-25",
  },
  {
    title: "SkinGuard",
    subtitle: "HackNYU'25",
    description:
      "AI-powered platform for skin health monitoring. Winner at HackNYU with innovative ML approach to medical diagnostics.",
    language: "Python",
    languageColor: "#3572A5",
    tech: ["PyTorch", "Next.js", "FastAPI"],
    image: "/projects/skinguard.jpg",
    github: "https://github.com/nmat2010/skinguard-hacknyu-25",
  },
];

const researchAreas = [
  {
    icon: Brain,
    title: "Machine Learning",
    description:
      "Exploring neural networks, deep learning, and how machines can learn from data to make intelligent decisions.",
  },
  {
    icon: Bot,
    title: "Robotics",
    description:
      "Investigating human-robot interaction, autonomous systems, and how robots can assist in everyday life.",
  },
  {
    icon: Cpu,
    title: "Computer Vision",
    description:
      "Working on image recognition, object detection, and enabling machines to understand visual information.",
  },
  {
    icon: GraduationCap,
    title: "PhD Aspirations",
    description:
      "Planning to pursue doctoral research in AI/Robotics, focusing on applications that create meaningful social impact.",
  },
];

export const WorkSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate max index based on number of projects
  // On desktop (lg): show 3 cards, so no scrolling needed
  // On tablet (md): show 2 cards, max index = projects.length - 2
  // On mobile: show 1 card, max index = projects.length - 1
  const getMaxIndex = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 0; // lg breakpoint - show all 3
      if (window.innerWidth >= 768) return Math.max(0, projects.length - 2); // md breakpoint
      return Math.max(0, projects.length - 1); // mobile
    }
    return 0;
  };

  const [maxIndex, setMaxIndex] = useState(getMaxIndex());

  const scroll = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else {
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    }
  };

  // Update maxIndex on window resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setMaxIndex(getMaxIndex());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <section
      id="projects"
      className="relative py-32 bg-muted/20 overflow-hidden"
    >
      {/* Subtle Vietnamese decorative elements */}
      <div className="absolute top-20 right-10 w-24 h-24 opacity-[0.03]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* Projects Carousel Section */}
          <div className="mb-24">
            <ScrollReveal direction="up">
              <div className="text-center mb-12">
                <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">
                  Projects
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  My GitHub Repositories
                </h2>
              </div>
            </ScrollReveal>

            {/* Carousel Container */}
            <div className="relative">
              {/* Navigation Buttons - Only show if needed */}
              {maxIndex > 0 && (
                <>
                  <motion.button
                    onClick={() => scroll("left")}
                    disabled={currentIndex === 0}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-accent text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-6 h-6 mx-auto" />
                  </motion.button>

                  <motion.button
                    onClick={() => scroll("right")}
                    disabled={currentIndex >= maxIndex}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-accent text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-6 h-6 mx-auto" />
                  </motion.button>
                </>
              )}

              {/* Projects Grid - Horizontal Scroll */}
              <div className="overflow-hidden">
                <motion.div
                  ref={scrollContainerRef}
                  className="flex gap-6 px-4 lg:justify-center"
                  animate={{
                    x: maxIndex === 0 ? 0 : `${-currentIndex * 100}%`
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {projects.map((project, index) => (
                    <motion.div
                      key={index}
                      className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.div
                        className="group relative bg-background rounded-xl border border-border hover:border-accent/30 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl h-full"
                        whileHover={{ y: -8 }}
                      >
                        {/* Project Image */}
                        {project.image && (
                          <div className="relative h-48 bg-muted/30 overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.parentElement!.style.display =
                                  "none";
                              }}
                            />
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                                {project.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {project.subtitle}
                              </p>
                            </div>
                            <a
                              href={project.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-accent transition-colors"
                            >
                              <Github className="h-5 w-5" />
                            </a>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                            {project.description}
                          </p>

                          {/* Tech Stack Pills */}
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

                          {/* Stats Bar */}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: project.languageColor,
                                }}
                              />
                              <span>{project.language}</span>
                            </div>
                            {/* <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              <span>{project.stars}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitCommit className="h-4 w-4" />
                              <span>{project.commits}</span>
                            </div> */}
                          </div>
                        </div>

                        {/* Vietnamese corner accents */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/20 group-hover:border-accent/60 transition-colors" />
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/20 group-hover:border-accent/60 transition-colors" />
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Pagination Dots - Only show if navigation is needed */}
              {maxIndex > 0 && (
                <div className="flex justify-center gap-2 mt-8">
                  {[...Array(maxIndex + 1)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? "bg-accent w-8"
                          : "bg-border hover:bg-muted-foreground"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Research Interests */}
          <div className="pt-12 border-t border-border">
            <ScrollReveal direction="up">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Research Interests
                </h2>
                {/* Subtle Vietnamese accent */}
                <div className="flex gap-1 mt-2">
                  <div className="w-1 h-1 rounded-full bg-accent/50"></div>
                  <div className="w-1 h-1 rounded-full bg-yellow-500/50"></div>
                </div>
              </div>
              <p className="text-muted-foreground mb-12 text-lg">
                Exploring the intersection of AI, robotics, and human impact
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6">
              {researchAreas.map((area, index) => (
                <ScrollReveal key={index} direction="up" delay={index * 0.1}>
                  <div className="relative p-6 rounded-lg border border-border hover:border-accent/30 transition-all duration-200 bg-background group">
                    {/* Subtle Vietnamese corner accent */}
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-accent/20 group-hover:border-accent/50 transition-colors"></div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-md bg-muted shrink-0">
                        <area.icon className="h-5 w-5 text-foreground" />
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-2 text-foreground">
                          {area.title}
                        </h3>

                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {area.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal direction="up" delay={0.4}>
              <div className="mt-12 p-8 rounded-lg border border-border bg-background">
                <h3 className="text-xl font-bold mb-3 text-foreground">
                  The Path Ahead
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  I'm committed to pursuing a PhD in AI and Robotics after
                  graduation, with a focus on developing technologies that
                  address real-world challenges and create positive social
                  impact. My research will bridge the gap between cutting-edge
                  AI innovations and practical applications that improve
                  people's lives.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
