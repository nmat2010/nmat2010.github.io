import {
  ChevronLeft,
  ChevronRight,
  Github,
  ExternalLink,
  Brain,
  Bot,
  Cpu,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ProjectModal } from "./ProjectModal";

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
    youtubeId: "H3e_ZA9uGO8",
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
    youtubeId: "SHkn2FNm0J0",
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
    youtubeId: "8dmgMJcpn14",
  },
];

const researchAreas = [
  {
    icon: Brain,
    title: "Machine Learning",
    description:
      "Exploring neural networks, deep learning, and how machines can learn from data to make intelligent decisions.",
    details: [
      "Alignment and Mechanistic Interpretability",
      "Lifelong learning",
      "Reinforcement learning",
    ],
    color: "hsl(var(--accent))",
  },
  {
    icon: Bot,
    title: "Robotics",
    description:
      "Investigating human-robot interaction, autonomous systems, and how robots can assist in everyday life.",
    details: [
      "Swarm intelligence",
      "Vision language action models",
      "Autonomous system",
    ],
    color: "hsl(189 60% 45%)",
  },
];

export const WorkSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<
    (typeof projects)[0] | null
  >(null);
  const [expandedResearch, setExpandedResearch] = useState<number | null>(null);
  const [hoveredResearch, setHoveredResearch] = useState<number | null>(null);

  // Calculate max index based on number of projects
  // On desktop (lg): show 3 cards, so no scrolling needed
  // On tablet (md): show 2 cards, max index = projects.length - 2
  // On mobile: show 1 card, max index = projects.length - 1
  const getMaxIndex = () => {
    if (typeof window !== "undefined") {
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
    if (typeof window !== "undefined") {
      const handleResize = () => setMaxIndex(getMaxIndex());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
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
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Projects
                </h2>
                {/* Vietnamese accent */}
                <div className="flex gap-1 mt-2">
                  <div className="w-1 h-1 rounded-full bg-accent/50"></div>
                  <div className="w-1 h-1 rounded-full bg-yellow-500/50"></div>
                </div>
              </div>
              <p className="text-muted-foreground mb-12 text-lg">
                Building meaningful solutions through code
              </p>
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
                    x: maxIndex === 0 ? 0 : `${-currentIndex * 100}%`,
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
                        className="group relative bg-background rounded-2xl border-2 border-border hover:border-accent/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-2xl h-full cursor-pointer"
                        whileHover={{ y: -8, scale: 1.02 }}
                        onClick={() => setSelectedProject(project)}
                      >
                        {/* Shimmer effect on hover */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-20"
                          style={{ width: "200%" }}
                        />

                        {/* Project Image */}
                        {project.image && (
                          <div className="relative h-56 bg-gradient-to-br from-muted/50 to-muted/20 overflow-hidden">
                            {/* Gradient overlay for better text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Image */}
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.currentTarget.parentElement!.style.display =
                                  "none";
                              }}
                            />

                            {/* Decorative corner accent */}
                            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Subtle vignette effect */}
                            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.3)] pointer-events-none" />
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors flex items-center gap-2">
                                {project.title}
                                <span className="text-xs px-2 py-0.5 bg-accent/10 text-accent rounded-md font-normal">
                                  {project.subtitle}
                                </span>
                              </h3>
                            </div>
                            <div className="flex gap-2">
                              <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all"
                                onClick={(e) => e.stopPropagation()}
                                title="View on GitHub"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                              <a
                                href={project.devpost}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all"
                                onClick={(e) => e.stopPropagation()}
                                title="View on Devpost"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
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
                                className="text-xs px-3 py-1.5 bg-muted/80 border border-border/50 rounded-full text-foreground/90 font-medium hover:bg-accent/10 hover:border-accent/30 transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>

                          {/* Stats Bar */}
                          <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: project.languageColor,
                                }}
                              />
                              <span>{project.language}</span>
                            </div>
                            <button className="text-xs px-3 py-1.5 bg-accent/10 text-accent hover:bg-accent/20 rounded-md font-medium transition-all group-hover:scale-105 flex items-center gap-1">
                              Watch Demo
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ring-2 ring-accent/20 blur-sm" />

                        {/* Vietnamese corner accents */}
                        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-accent/30 group-hover:border-accent/70 transition-colors" />
                        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-accent/30 group-hover:border-accent/70 transition-colors" />
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
                {/* Animated Vietnamese accent */}
                <motion.div
                  className="flex gap-1 mt-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="w-1 h-1 rounded-full bg-accent/50"></div>
                  <div className="w-1 h-1 rounded-full bg-yellow-500/50"></div>
                </motion.div>
              </div>
              <p className="text-muted-foreground mb-12 text-lg">
                Exploring the intersection of AI, robotics, and human impact
              </p>
            </ScrollReveal>

            {/* Interactive connection lines between research areas */}
            <div className="relative">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
                style={{ zIndex: 0 }}
              >
                <motion.line
                  x1="25%"
                  y1="30%"
                  x2="75%"
                  y2="30%"
                  stroke="hsl(var(--accent))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                <motion.line
                  x1="25%"
                  y1="70%"
                  x2="75%"
                  y2="70%"
                  stroke="hsl(var(--accent))"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2, delay: 0.7 }}
                />
              </svg>

              <div className="grid md:grid-cols-2 gap-6 relative z-10">
                {researchAreas.map((area, index) => {
                  const Icon = area.icon;
                  const isExpanded = expandedResearch === index;
                  const isHovered = hoveredResearch === index;

                  return (
                    <ScrollReveal
                      key={index}
                      direction="up"
                      delay={index * 0.1}
                    >
                      <motion.div
                        className="relative p-6 rounded-xl border border-border bg-background cursor-pointer overflow-hidden"
                        whileHover={{ scale: 1.03, y: -5 }}
                        animate={{
                          borderColor: isHovered
                            ? area.color
                            : "hsl(var(--border))",
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                        onClick={() =>
                          setExpandedResearch(isExpanded ? null : index)
                        }
                        onHoverStart={() => setHoveredResearch(index)}
                        onHoverEnd={() => setHoveredResearch(null)}
                      >
                        {/* Glow effect */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: `radial-gradient(circle at 50% 0%, ${area.color}15, transparent 70%)`,
                          }}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        />

                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                              {/* Animated icon */}
                              <motion.div
                                className="p-3 rounded-lg shrink-0"
                                style={{
                                  backgroundColor: `${area.color}20`,
                                }}
                                animate={{
                                  scale: isHovered ? [1, 1.1, 1] : 1,
                                  rotate: isHovered ? [0, 5, -5, 0] : 0,
                                }}
                                transition={{ duration: 0.5 }}
                              >
                                <Icon
                                  className="h-6 w-6"
                                  style={{ color: area.color }}
                                />
                              </motion.div>

                              <div className="flex-1">
                                <h3 className="text-lg font-bold mb-2 text-foreground">
                                  {area.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {area.description}
                                </p>
                              </div>
                            </div>

                            {/* Expand/Collapse button */}
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                              )}
                            </motion.div>
                          </div>

                          {/* Expandable details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 border-t border-border space-y-2">
                                  <p className="text-xs font-semibold text-muted-foreground mb-3">
                                    Key Focus Areas:
                                  </p>
                                  {area.details.map((detail, i) => (
                                    <motion.div
                                      key={i}
                                      className="flex items-center gap-2"
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: i * 0.1 }}
                                    >
                                      <motion.div
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: area.color }}
                                        animate={{
                                          scale: [1, 1.5, 1],
                                        }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                          delay: i * 0.2,
                                        }}
                                      />
                                      <span className="text-sm text-foreground">
                                        {detail}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Corner accents */}
                        <motion.div
                          className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
                          style={{ borderColor: area.color }}
                          animate={{
                            opacity: isHovered ? 1 : 0.2,
                          }}
                        />
                        <motion.div
                          className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
                          style={{ borderColor: area.color }}
                          animate={{
                            opacity: isHovered ? 1 : 0.2,
                          }}
                        />
                      </motion.div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>

            <ScrollReveal direction="up" delay={0.4}>
              <motion.div
                className="mt-12 p-8 rounded-xl border border-border bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Animated background elements */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-6 h-6 text-accent" />
                    <h3 className="text-xl font-bold text-foreground">
                      The Path Ahead
                    </h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    I'm committed to pursuing a PhD in AI and Robotics after
                    graduation, with a focus on developing technologies that
                    address real-world challenges and create positive social
                    impact. My research will bridge the gap between cutting-edge
                    AI innovations and practical applications that improve
                    people's lives.
                  </p>

                  {/* Progress timeline
                  <div className="mt-6 flex items-center gap-4">
                    {["Research", "Publish", "Apply", "PhD"].map((step, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <motion.div
                          className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            delay: i * 0.2,
                            type: "spring",
                            stiffness: 200,
                          }}
                        >
                          <span className="text-xs font-bold text-accent">
                            {i + 1}
                          </span>
                        </motion.div>
                        <span className="text-sm text-muted-foreground">
                          {step}
                        </span>
                        {i < 3 && (
                          <motion.div
                            className="w-8 h-0.5 bg-accent/30"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 + 0.1 }}
                          />
                        )}
                      </div>
                    ))}
                  </div> */}
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </section>
  );
};
