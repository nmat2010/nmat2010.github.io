import { Briefcase, Calendar, MapPin } from "lucide-react";
import { ScrollReveal } from "./animations/ScrollReveal";
import { motion } from "framer-motion";

const experiences = [
  {
    title: "Research Assistant",
    company: "Stony Brook University",
    location: "Stony Brook, NY",
    period: "Nov 2025 - Present",
    description:
      "Conducting research in LLM alignment mechanistic interpretability under Professor Paola Cascante-Bonilla.",
    highlights: [
      "Published research on transformer architectures",
      "Developed novel NLP pipeline",
      "Mentored 3 undergraduate students",
    ],
    color: "from-accent to-accent/80",
    logo: "/logos/sbu.png",
  },
  {
    title: "Lead Student Developer",
    company: "World Trade Center Health & Wellness Program",
    location: "Stony Brook, NY",
    period: "April 2025 - Present",
    description:
      "Building an oral history digital archive platform to preserve first responder testimonies. Implementing video processing, search functionality, and accessible UI/UX design.",
    highlights: [
      "Built full-stack web application",
      "Processed 100+ hours of video content",
      "Improved site accessibility to WCAG AA standards",
    ],
    color: "from-secondary to-secondary/80",
    logo: "/logos/wtc.png",
  },
  {
    title: "Software Engineer Intern",
    company: "FPT Software",
    location: "Ho Chi Minh City, Vietnam",
    period: "June 2025 - August 2025",
    description:
      "Assisted in Data Structures & Algorithms course. Held weekly office hours, graded assignments, and mentored students on complex algorithmic concepts.",
    highlights: [
      "Supported 150+ students",
      "Conducted weekly recitations",
      "Created supplementary learning materials",
    ],
    color: "from-accent to-secondary",
    logo: "/logos/fpt.jpg",
  },
];

export const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/5 to-secondary/5 rounded-full blur-3xl"
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

      {/* Vietnamese decorative element - conical hat pattern */}
      <div className="absolute bottom-20 left-10 w-32 h-32 opacity-[0.03]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <line
            x1="50"
            y1="5"
            x2="50"
            y2="95"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <line
            x1="5"
            y1="50"
            x2="95"
            y2="50"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal direction="up">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Experience
              </h2>
              {/* Vietnamese accent */}
              <div className="flex gap-1 mt-2">
                <div className="w-1 h-1 rounded-full bg-accent/50"></div>
                <div className="w-1 h-1 rounded-full bg-yellow-500/50"></div>
              </div>
            </div>
            <p className="text-muted-foreground mb-16 text-lg">
              Building impact through hands-on work and collaboration
            </p>
          </ScrollReveal>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line with gradient */}
            <motion.div
              className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-secondary/50 to-accent/50"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
            />

            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <ScrollReveal
                  key={index}
                  direction="right"
                  delay={index * 0.15}
                >
                  <motion.div
                    className="relative pl-8 md:pl-20"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 8 }}
                  >
                    {/* Timeline dot with animation */}
                    <motion.div
                      className="absolute left-0 md:left-6 top-6 w-5 h-5 rounded-full border-2 border-accent bg-background"
                      whileHover={{ scale: 1.5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <motion.div
                        className="absolute inset-1 rounded-full bg-accent"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.2,
                        }}
                      />
                    </motion.div>

                    {/* Experience card */}
                    <motion.div
                      className="group relative p-6 md:p-8 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:border-accent/40 transition-all duration-300 hover:shadow-xl"
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Vietnamese corner accents */}
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/20 group-hover:border-accent/60 transition-colors"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/20 group-hover:border-accent/60 transition-colors"></div>

                      {/* Gradient glow on hover */}
                      <div
                        className={`absolute inset-0 rounded-lg bg-gradient-to-br ${exp.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                      ></div>

                      <div className="relative">
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Company Logo */}
                            {exp.logo && (
                              <motion.div
                                className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden bg-muted/50 p-2 flex items-center justify-center"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <img
                                  src={exp.logo}
                                  alt={`${exp.company} logo`}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    // Fallback if image fails to load
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              </motion.div>
                            )}

                            <div className="flex-1">
                              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 group-hover:text-accent transition-colors">
                                {exp.title}
                              </h3>
                              <div className="flex items-center gap-2 text-foreground/80 font-medium">
                                <Briefcase className="h-4 w-4 text-accent" />
                                <span>{exp.company}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>{exp.period}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4" />
                              <span>{exp.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Highlights */}
                        <div className="space-y-2">
                          {exp.highlights.map((highlight, i) => (
                            <motion.div
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              viewport={{ once: true }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></div>
                              <span>{highlight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
