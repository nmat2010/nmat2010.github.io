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
      text: "Saigon",
      icon: Globe,
      color: "hsl(var(--accent))",
      description: "Where it all started",
    },
    {
      text: "AI and robotics",
      icon: Sparkles,
      color: "hsl(189 60% 45%)",
      description: "My happy place",
    },
    {
      text: "9/11 Memorial & Museum",
      icon: Heart,
      color: "hsl(356 75% 58%)",
      description: "Tech that matters",
    },
    {
      text: "PhD",
      icon: Rocket,
      color: "hsl(45 93% 47%)",
      description: "The big goal",
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
          {/* Short intro */}
          <ScrollReveal direction="up" delay={0.1}>
            <p className="text-xl md:text-2xl text-foreground/90 font-light leading-relaxed mb-12 text-center max-w-3xl mx-auto">
              From Saigon to NYC. Building AI & robotics that actually help
              people.
              <span className="text-accent font-normal">
                {" "}
                Currently preserving 9/11 stories through tech.
              </span>
            </p>
          </ScrollReveal>

          {/* Visual highlight cards */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Card 1 - Journey */}
              <motion.div
                className="relative p-6 rounded-xl border-2 border-border bg-gradient-to-br from-accent/5 to-transparent hover:border-accent/50 transition-all group cursor-pointer"
                onHoverStart={() => setActiveHighlight(0)}
                onHoverEnd={() => setActiveHighlight(null)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-lg bg-accent/10"
                    animate={{ rotate: activeHighlight === 0 ? 360 : 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Globe className="w-6 h-6 text-accent" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      🇻🇳 → 🇺🇸
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Computer Engineering @ Stony Brook. Learning that the best
                      solutions come from different perspectives (and lots of
                      coffee).
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 - Passion */}
              <motion.div
                className="relative p-6 rounded-xl border-2 border-border bg-gradient-to-br from-secondary/5 to-transparent hover:border-secondary/50 transition-all group cursor-pointer"
                onHoverStart={() => setActiveHighlight(1)}
                onHoverEnd={() => setActiveHighlight(null)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-lg bg-secondary/10"
                    animate={{
                      scale: activeHighlight === 1 ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Sparkles className="w-6 h-6 text-secondary" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      AI & Robotics 🤖
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Not the flashy stuff - tech that actually matters.
                      Hackathons winner who codes for impact, not just for
                      demos.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 3 - Current Work */}
              <motion.div
                className="relative p-6 rounded-xl border-2 border-border bg-gradient-to-br from-red-500/5 to-transparent hover:border-red-500/30 transition-all group cursor-pointer"
                onHoverStart={() => setActiveHighlight(2)}
                onHoverEnd={() => setActiveHighlight(null)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-lg bg-red-500/10"
                    animate={{
                      y: activeHighlight === 2 ? [-2, 2, -2] : 0,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: activeHighlight === 2 ? Infinity : 0,
                    }}
                  >
                    <Heart className="w-6 h-6 text-red-500/70" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      9/11 Memorial Project
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Building an oral history platform to preserve first
                      responders' stories. Technology meets humanity.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Card 4 - Future */}
              <motion.div
                className="relative p-6 rounded-xl border-2 border-border bg-gradient-to-br from-yellow-500/5 to-transparent hover:border-yellow-500/30 transition-all group cursor-pointer"
                onHoverStart={() => setActiveHighlight(3)}
                onHoverEnd={() => setActiveHighlight(null)}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className="p-3 rounded-lg bg-yellow-500/10"
                    animate={{
                      y: activeHighlight === 3 ? [0, -10, 0] : 0,
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <Rocket className="w-6 h-6 text-yellow-500/70" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Eyeing a PhD 🎓
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Research is where the magic happens. Big goal: intelligent
                      systems that work for everyone.
                    </p>
                  </div>
                </div>
              </motion.div>
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
