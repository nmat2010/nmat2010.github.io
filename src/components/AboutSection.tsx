import { ScrollReveal } from "./animations/ScrollReveal";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef } from "react";
import { Sparkles, Globe, Code, Heart, Rocket } from "lucide-react";

export const AboutSection = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for 3D card effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const highlights = [
    {
      text: "international student from Vietnam",
      icon: Globe,
      color: "hsl(var(--accent))",
      description: "Bringing global perspective",
    },
    {
      text: "AI-powered solutions",
      icon: Sparkles,
      color: "hsl(189 60% 45%)",
      description: "Machine learning expertise",
    },
    {
      text: "9/11 Memorial & Museum",
      icon: Heart,
      color: "hsl(356 75% 58%)",
      description: "Meaningful impact",
    },
    {
      text: "PhD",
      icon: Rocket,
      color: "hsl(45 93% 47%)",
      description: "Research ambition",
    },
  ];

  return (
    <section
      id="about"
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent/30"
          style={{
            left: `${20 + i * 10}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                About
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
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1}>
            {/* 3D Interactive Card */}
            <motion.div
              ref={containerRef}
              className="relative p-8 rounded-2xl border border-border bg-background/80 backdrop-blur-sm"
              style={{
                rotateX: springRotateX,
                rotateY: springRotateY,
                transformStyle: "preserve-3d",
              }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 bg-gradient-to-br from-accent/10 via-transparent to-secondary/10 pointer-events-none"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed relative z-10">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  I'm an{" "}
                  <motion.span
                    className="relative inline-block cursor-pointer"
                    onHoverStart={() => setActiveHighlight(0)}
                    onHoverEnd={() => setActiveHighlight(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span
                      className={`font-semibold transition-colors ${
                        activeHighlight === 0 ? "text-foreground" : ""
                      }`}
                    >
                      international student from Vietnam
                    </span>
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeHighlight === 0 ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>{" "}
                  pursuing Computer Engineering at Stony Brook University. My
                  journey from Saigon to New York has shaped my perspective on
                  how technology can bridge cultures and create meaningful
                  change.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  With 2 hackathon wins under my belt, I've developed{" "}
                  <motion.span
                    className="relative inline-block cursor-pointer"
                    onHoverStart={() => setActiveHighlight(1)}
                    onHoverEnd={() => setActiveHighlight(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span
                      className={`font-semibold transition-colors ${
                        activeHighlight === 1 ? "text-foreground" : ""
                      }`}
                    >
                      AI-powered solutions
                    </span>
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-secondary"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeHighlight === 1 ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>{" "}
                  that address real-world challenges. Currently, I'm building an
                  oral history website for the{" "}
                  <motion.span
                    className="relative inline-block cursor-pointer"
                    onHoverStart={() => setActiveHighlight(2)}
                    onHoverEnd={() => setActiveHighlight(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span
                      className={`font-semibold transition-colors ${
                        activeHighlight === 2 ? "text-foreground" : ""
                      }`}
                    >
                      9/11 Memorial & Museum
                    </span>
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500/70"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeHighlight === 2 ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>
                  , preserving the powerful stories of first responders.
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  My passion lies in AI and robotics research with a focus on
                  social good. I'm working toward a{" "}
                  <motion.span
                    className="relative inline-block cursor-pointer"
                    onHoverStart={() => setActiveHighlight(3)}
                    onHoverEnd={() => setActiveHighlight(null)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span
                      className={`font-semibold transition-colors ${
                        activeHighlight === 3 ? "text-foreground" : ""
                      }`}
                    >
                      PhD
                    </span>
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-500/70"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: activeHighlight === 3 ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.span>{" "}
                  to push the boundaries of how intelligent systems can serve
                  humanity.
                </motion.p>
              </div>

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/30" />
            </motion.div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon;
                const isActive = activeHighlight === index;

                return (
                  <motion.div
                    key={index}
                    className="relative p-4 rounded-lg border border-border bg-muted/30 cursor-pointer"
                    onHoverStart={() => setActiveHighlight(index)}
                    onHoverEnd={() => setActiveHighlight(null)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    animate={{
                      borderColor: isActive
                        ? highlight.color
                        : "hsl(var(--border))",
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="flex items-center justify-center w-10 h-10 rounded-full mb-3 mx-auto"
                      style={{
                        backgroundColor: isActive
                          ? `${highlight.color}20`
                          : "hsl(var(--muted))",
                      }}
                      animate={{
                        scale: isActive ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{
                          color: isActive
                            ? highlight.color
                            : "hsl(var(--muted-foreground))",
                        }}
                      />
                    </motion.div>
                    <p className="text-xs text-center text-muted-foreground">
                      {highlight.description}
                    </p>

                    {/* Glow effect when active */}
                    <motion.div
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        boxShadow: isActive
                          ? `0 0 20px ${highlight.color}40`
                          : "none",
                      }}
                      animate={{
                        opacity: isActive ? 1 : 0,
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </ScrollReveal>
          {/* <ScrollReveal direction="up" delay={0.4}>
            <div className="mt-12 pt-12 border-t border-border">
              <div className="grid grid-cols-3 gap-8 text-center">
                <motion.div
                  className="group cursor-pointer relative"
                  whileHover={{ scale: 1.1, y: -5 }}
                  onHoverStart={() => setHoveredStat(0)}
                  onHoverEnd={() => setHoveredStat(null)}
                >
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-accent/5 blur-xl"
                    animate={{
                      opacity: hoveredStat === 0 ? 1 : 0,
                    }}
                  />
                  <motion.p
                    className="text-4xl font-bold text-foreground mb-2"
                    animate={
                      hoveredStat === 0 ? { scale: [1, 1.2, 1] } : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    2×
                  </motion.p>
                  <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
                    Hackathon Winner
                  </p>
                  <motion.div
                    className="w-12 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredStat === 0 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                <motion.div
                  className="group cursor-pointer relative"
                  whileHover={{ scale: 1.1, y: -5 }}
                  onHoverStart={() => setHoveredStat(1)}
                  onHoverEnd={() => setHoveredStat(null)}
                >
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-secondary/5 blur-xl"
                    animate={{
                      opacity: hoveredStat === 1 ? 1 : 0,
                    }}
                  />
                  <motion.p
                    className="text-4xl mb-2"
                    animate={
                      hoveredStat === 1
                        ? { rotate: [0, 10, -10, 0] }
                        : { rotate: 0 }
                    }
                    transition={{ duration: 0.5 }}
                  >
                    🇻🇳 → 🇺🇸
                  </motion.p>
                  <p className="text-sm text-muted-foreground group-hover:text-secondary transition-colors">
                    Cross-Cultural
                  </p>
                  <motion.div
                    className="w-12 h-0.5 bg-gradient-to-r from-transparent via-secondary to-transparent mx-auto mt-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredStat === 1 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                <motion.div
                  className="group cursor-pointer relative"
                  whileHover={{ scale: 1.1, y: -5 }}
                  onHoverStart={() => setHoveredStat(2)}
                  onHoverEnd={() => setHoveredStat(null)}
                >
                  <motion.div
                    className="absolute inset-0 -z-10 rounded-lg bg-accent/5 blur-xl"
                    animate={{
                      opacity: hoveredStat === 2 ? 1 : 0,
                    }}
                  />
                  <motion.div className="flex items-center justify-center gap-2 mb-2">
                    <motion.p
                      className="text-4xl font-bold text-foreground"
                      animate={
                        hoveredStat === 2
                          ? { scale: [1, 1.2, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.3 }}
                    >
                      AI
                    </motion.p>
                    <motion.div
                      animate={
                        hoveredStat === 2
                          ? { rotate: 360 }
                          : { rotate: 0 }
                      }
                      transition={{ duration: 0.5 }}
                    >
                      <Code className="w-6 h-6 text-accent" />
                    </motion.div>
                  </motion.div>
                  <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
                    Social Good
                  </p>
                  <motion.div
                    className="w-12 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredStat === 2 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </div>
            </div>
          </ScrollReveal> */}
        </div>
      </div>
    </section>
  );
};
