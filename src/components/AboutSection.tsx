import { motion } from "framer-motion";
import { Code, Cpu, Scale, Brain, BookOpen, Sparkles } from "lucide-react";

const interests = [
  {
    icon: Code,
    title: "Infrastructure & AI Systems",
    description: "Building scalable systems at the intersection of cloud infrastructure and AI/ML",
  },
  {
    icon: Cpu,
    title: "Hardware Design",
    description: "System design and architecture from coursework and hands-on projects",
  },
  {
    icon: Brain,
    title: "AI Research",
    description: "Robotics, VLA, interpretability, lifelong learning, and AI ethics",
  },
  {
    icon: Scale,
    title: "Policy & Governance",
    description: "How AI intersects with law, policy, and political philosophy",
  },
];

const researchInterests = [
  "Robotics & Vision-Language-Action Models (VLA)",
  "AI Interpretability & Explainability",
  "Lifelong Learning Systems",
  "AI Ethics & Responsible AI",
  "Political Philosophy & Governance",
  "AI Law & Policy",
];

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-6 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-12 text-foreground">About Me</h2>

          {/* Introduction */}
          <div className="space-y-6 mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-foreground/90 leading-relaxed"
            >
              I'm a junior studying <span className="font-semibold text-accent">Computer Engineering at Stony Brook University</span>,
              working at the intersection of <span className="font-semibold">infrastructure engineering and AI research</span> — with
              a longer-term interest in how AI intersects with policy and law.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              I'm the primary developer on the <span className="font-semibold text-foreground">WTC Oral Histories Project</span>,
              a system built in partnership with the Library of Congress and the WTC Health Program (see more in the Experience
              section below).
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              My background includes hardware system design coursework and several hackathon wins. I'm also broadly
              interested in robotics, VLA, interpretability, lifelong learning, AI ethics, political philosophy, and the law
              and governance questions AI raises — which is part of what's pulling me toward research and policy work long-term.
            </motion.p>
          </div>

          {/* Key Focus Areas */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-accent" />
              Focus Areas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {interests.map((interest, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 rounded-lg border border-border bg-card hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                      <interest.icon className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {interest.title}
                      </h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {interest.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Research Interests */}
          <div>
            <h3 className="text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-accent" />
              Research Interests
            </h3>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-lg border border-border bg-card"
            >
              <div className="flex flex-wrap gap-3">
                {researchInterests.map((topic, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 text-sm rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all cursor-default font-medium"
                  >
                    {topic}
                  </motion.span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6 italic">
                These interests are pulling me toward research and policy work long-term, where I can contribute
                to both the technical and governance challenges that AI presents.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
