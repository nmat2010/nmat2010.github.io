import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  Brain,
  Code,
  Cpu,
  Database,
  Layers,
  Zap,
  GitBranch,
  Sparkles,
} from "lucide-react";

interface Skill {
  name: string;
  level: number; // 0-100
  icon: React.ElementType;
  color: string;
  category: string;
}

const skills: Skill[] = [
  { name: "Machine Learning", level: 85, icon: Brain, color: "hsl(var(--accent))", category: "AI/ML" },
  { name: "Python", level: 90, icon: Code, color: "hsl(189 60% 45%)", category: "Languages" },
  { name: "React/TypeScript", level: 88, icon: Layers, color: "hsl(189 50% 50%)", category: "Frontend" },
  { name: "Computer Vision", level: 80, icon: Cpu, color: "hsl(var(--accent))", category: "AI/ML" },
  { name: "Swift/SwiftUI", level: 75, icon: Zap, color: "hsl(25 95% 53%)", category: "Mobile" },
  { name: "Neural Networks", level: 82, icon: Sparkles, color: "hsl(var(--accent))", category: "AI/ML" },
  { name: "Git/GitHub", level: 85, icon: GitBranch, color: "hsl(189 45% 42%)", category: "Tools" },
  { name: "Databases", level: 78, icon: Database, color: "hsl(189 55% 48%)", category: "Backend" },
];

export const InteractiveSkills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-gradient-to-b from-background via-muted/10 to-background overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full">
          <defs>
            <pattern
              id="skillGrid"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#skillGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">Technical Skills</h2>
            <div className="flex gap-1 mt-2">
              <div className="w-1 h-1 rounded-full bg-accent/50" />
              <div className="w-1 h-1 rounded-full bg-yellow-500/50" />
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Continuous learning and hands-on experience
          </p>
        </motion.div>

        {/* Skills Grid with Interactive Bars */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            const isHovered = hoveredSkill === skill.name;

            return (
              <motion.div
                key={skill.name}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                <div className="relative p-6 rounded-lg border border-border hover:border-accent/30 transition-all duration-300 bg-background/80 backdrop-blur-sm">
                  {/* Skill header */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className="p-2 rounded-md"
                      style={{ backgroundColor: `${skill.color}15` }}
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                        rotate: isHovered ? 5 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: skill.color }}
                      />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {skill.category}
                      </p>
                    </div>
                    <motion.span
                      className="text-sm font-bold"
                      style={{ color: skill.color }}
                      animate={{
                        scale: isHovered ? 1.2 : 1,
                      }}
                    >
                      {skill.level}%
                    </motion.span>
                  </div>

                  {/* Animated progress bar */}
                  <div className="relative h-2 bg-muted/30 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{
                        backgroundColor: skill.color,
                      }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1,
                        delay: index * 0.1 + 0.3,
                        ease: "easeOut",
                      }}
                    >
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Hover glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${skill.color}40`,
                    }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Corner accent */}
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent/20 group-hover:border-accent/50 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Skill categories visualization */}
        <motion.div
          className="max-w-3xl mx-auto mt-16 p-8 rounded-lg border border-border bg-muted/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-xl font-bold mb-6 text-center">Focus Areas</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from(new Set(skills.map((s) => s.category))).map(
              (category, index) => (
                <motion.div
                  key={category}
                  className="px-4 py-2 rounded-full bg-background border border-border hover:border-accent/30 transition-all cursor-default"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1 + 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-medium">{category}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({skills.filter((s) => s.category === category).length})
                  </span>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 rounded-full bg-accent/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-32 h-32 rounded-full bg-secondary/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 2.5 }}
      />
    </section>
  );
};
