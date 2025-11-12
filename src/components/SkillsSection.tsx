import { motion } from "framer-motion";
import { ScrollReveal } from "./animations/ScrollReveal";
import { Code, Database, Cloud, Cpu, Terminal, Palette } from "lucide-react";

const skillCategories = [
  {
    icon: Code,
    title: "Languages",
    skills: [
      { name: "Python", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "JavaScript", level: 90 },
      { name: "Swift", level: 85 },
      { name: "Java", level: 80 },
      { name: "C++", level: 75 },
    ],
  },
  {
    icon: Terminal,
    title: "Frameworks & Libraries",
    skills: [
      { name: "React", level: 95 },
      { name: "FastAPI", level: 90 },
      { name: "Spring Boot", level: 85 },
      { name: "SwiftUI", level: 85 },
      { name: "Node.js", level: 80 },
      { name: "PyTorch", level: 75 },
    ],
  },
  {
    icon: Database,
    title: "Databases & Tools",
    skills: [
      { name: "PostgreSQL", level: 90 },
      { name: "MongoDB", level: 85 },
      { name: "Redis", level: 80 },
      { name: "Kafka", level: 75 },
      { name: "Docker", level: 90 },
      { name: "Kubernetes", level: 70 },
    ],
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    skills: [
      { name: "AWS (S3, EC2)", level: 85 },
      { name: "Git", level: 95 },
      { name: "CI/CD", level: 85 },
      { name: "Linux", level: 80 },
      { name: "Nginx", level: 75 },
      { name: "Terraform", level: 65 },
    ],
  },
];

export const SkillsSection = () => {
  return (
    <section
      id="skills"
      className="relative py-32 bg-muted/20 overflow-hidden"
    >
      {/* Background decorative element */}
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/5 to-secondary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Skills & Technologies
              </h2>
              {/* Vietnamese accent */}
              <div className="flex gap-1 mt-2">
                <div className="w-1 h-1 rounded-full bg-accent/50"></div>
                <div className="w-1 h-1 rounded-full bg-yellow-500/50"></div>
              </div>
            </div>
            <p className="text-muted-foreground mb-16 text-lg">
              Technical expertise and proficiencies
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, catIndex) => (
              <ScrollReveal key={catIndex} direction="up" delay={catIndex * 0.1}>
                <motion.div
                  className="relative p-6 rounded-lg border border-border bg-background hover:border-accent/30 transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  {/* Vietnamese corner accents */}
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent/20" />
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent/20" />

                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-md bg-muted">
                      <category.icon className="h-5 w-5 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                      {category.title}
                    </h3>
                  </div>

                  {/* Skills Grid */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skillIndex}
                        className="group relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: skillIndex * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -2 }}
                      >
                        <div className="px-3 py-1.5 bg-muted hover:bg-accent hover:text-white rounded-md text-sm font-medium transition-all duration-200 cursor-default">
                          {skill.name}
                        </div>

                        {/* Tooltip showing proficiency level */}
                        <motion.div
                          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          initial={{ opacity: 0, y: 5 }}
                          whileHover={{ opacity: 1, y: 0 }}
                        >
                          Proficiency: {skill.level}%
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
