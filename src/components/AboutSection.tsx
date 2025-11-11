import { ScrollReveal } from "./animations/ScrollReveal";
import { motion } from "framer-motion";
import { useState } from "react";

export const AboutSection = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  return (
    <section id="about" className="relative py-32 bg-background overflow-hidden">
      {/* Animated gradient orb */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle Vietnamese bamboo pattern with animation */}
      <motion.div
        className="absolute top-10 left-10 w-16 h-64 opacity-[0.02]"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="space-y-8">
          <div className="w-full h-24 border-l-2 border-accent/50"></div>
          <div className="w-full h-24 border-l-2 border-accent/50"></div>
          <div className="w-full h-24 border-l-2 border-accent/50"></div>
        </div>
      </motion.div>

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
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                I'm an international student from Vietnam pursuing Computer
                Engineering at Stony Brook University. My journey from Saigon to
                New York has shaped my perspective on how technology can bridge
                cultures and create meaningful change.
              </p>
              <p>
                With 2 hackathon wins under my belt, I've developed AI-powered
                solutions that address real-world challenges. Currently, I'm
                building an oral history website for the 9/11 Memorial & Museum,
                preserving the powerful stories of first responders.
              </p>
              <p>
                My passion lies in AI and robotics research with a focus on
                social good. I'm working toward a PhD to push the boundaries of
                how intelligent systems can serve humanity.
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive animated stats */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="mt-12 pt-12 border-t border-border">
              <div className="grid grid-cols-3 gap-8 text-center">
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  onHoverStart={() => setHoveredStat(0)}
                  onHoverEnd={() => setHoveredStat(null)}
                >
                  <motion.p
                    className="text-3xl font-bold text-foreground mb-1"
                    animate={hoveredStat === 0 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    2×
                  </motion.p>
                  <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
                    Hackathon Winner
                  </p>
                  <motion.div
                    className="w-8 h-0.5 bg-accent mx-auto mt-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredStat === 0 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  onHoverStart={() => setHoveredStat(1)}
                  onHoverEnd={() => setHoveredStat(null)}
                >
                  <motion.p
                    className="text-3xl font-bold text-foreground mb-1"
                    animate={hoveredStat === 1 ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    🇻🇳 → 🇺🇸
                  </motion.p>
                  <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
                    Cross-Cultural
                  </p>
                  <motion.div
                    className="w-8 h-0.5 bg-accent mx-auto mt-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredStat === 1 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
                <motion.div
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.1, y: -5 }}
                  onHoverStart={() => setHoveredStat(2)}
                  onHoverEnd={() => setHoveredStat(null)}
                >
                  <motion.p
                    className="text-3xl font-bold text-foreground mb-1"
                    animate={hoveredStat === 2 ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    AI
                  </motion.p>
                  <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
                    Social Good
                  </p>
                  <motion.div
                    className="w-8 h-0.5 bg-accent mx-auto mt-2"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredStat === 2 ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
