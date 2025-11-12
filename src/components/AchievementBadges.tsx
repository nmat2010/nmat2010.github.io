import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  Rocket,
  Award,
  Star,
  Zap,
  Heart,
  Code,
} from "lucide-react";

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  achieved: boolean;
}

const badges: Badge[] = [
  {
    id: "hackathon-winner",
    title: "Hackathon Champion",
    description: "Won multiple hackathons with impactful projects",
    icon: Trophy,
    color: "hsl(45 93% 47%)",
    achieved: true,
  },
  {
    id: "research-aspirant",
    title: "Research Aspirant",
    description: "Committed to pursuing PhD in AI & Robotics",
    icon: Target,
    color: "hsl(var(--accent))",
    achieved: true,
  },
  {
    id: "full-stack",
    title: "Full Stack Engineer",
    description: "Proficient in frontend, backend, and ML",
    icon: Code,
    color: "hsl(189 60% 45%)",
    achieved: true,
  },
  {
    id: "innovator",
    title: "Innovator",
    description: "Created unique solutions for accessibility",
    icon: Rocket,
    color: "hsl(280 65% 60%)",
    achieved: true,
  },
  {
    id: "rapid-learner",
    title: "Rapid Learner",
    description: "Quickly adapts and masters new technologies",
    icon: Zap,
    color: "hsl(50 98% 64%)",
    achieved: true,
  },
  {
    id: "social-impact",
    title: "Social Impact",
    description: "Focused on technology that helps people",
    icon: Heart,
    color: "hsl(356 75% 58%)",
    achieved: true,
  },
  {
    id: "excellence",
    title: "Academic Excellence",
    description: "Maintaining high standards at Stony Brook",
    icon: Award,
    color: "hsl(189 55% 48%)",
    achieved: true,
  },
  {
    id: "cultural-bridge",
    title: "Cultural Bridge",
    description: "Connecting Vietnamese & American innovation",
    icon: Star,
    color: "hsl(45 100% 51%)",
    achieved: true,
  },
];

export const AchievementBadges = () => {
  return (
    <section className="relative py-24 bg-muted/20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]">
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-accent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-bold">Achievements</h2>
            <div className="flex gap-1 mt-2">
              <div className="w-1 h-1 rounded-full bg-accent/50" />
              <div className="w-1 h-1 rounded-full bg-yellow-500/50" />
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Milestones in my journey as an engineer
          </p>
        </motion.div>

        {/* Badges Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, index) => {
            const Icon = badge.icon;

            return (
              <motion.div
                key={badge.id}
                className="group relative"
                initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="relative p-6 rounded-xl border border-border bg-background hover:border-accent/30 transition-all duration-300 flex flex-col items-center text-center h-full">
                  {/* Badge icon with glow effect */}
                  <motion.div
                    className="relative mb-4"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <div
                      className="absolute inset-0 rounded-full blur-xl opacity-40"
                      style={{ backgroundColor: badge.color }}
                    />
                    <div
                      className="relative w-16 h-16 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: `${badge.color}15`,
                        border: `2px solid ${badge.color}40`,
                      }}
                    >
                      <Icon
                        className="w-8 h-8"
                        style={{ color: badge.color }}
                      />
                    </div>

                    {/* Achievement sparkle */}
                    {badge.achieved && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: index * 0.1 + 0.5,
                          type: "spring",
                          stiffness: 500,
                        }}
                      >
                        <Star className="w-3 h-3 fill-white text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Badge title */}
                  <h3 className="text-sm font-bold mb-2 text-foreground">
                    {badge.title}
                  </h3>

                  {/* Badge description - shown on hover */}
                  <motion.p
                    className="text-xs text-muted-foreground leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ height: 0 }}
                    whileHover={{ height: "auto" }}
                  >
                    {badge.description}
                  </motion.p>

                  {/* Corner accent */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-accent/20 group-hover:border-accent/50 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-accent/20 group-hover:border-accent/50 transition-colors" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Achievement stats */}
        <motion.div
          className="max-w-2xl mx-auto mt-12 p-6 rounded-lg border border-border bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <motion.p
                className="text-3xl font-bold text-accent mb-1"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.6,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {badges.filter((b) => b.achieved).length}
              </motion.p>
              <p className="text-sm text-muted-foreground">
                Achievements Unlocked
              </p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <motion.p
                className="text-3xl font-bold text-secondary mb-1"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.7,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                100%
              </motion.p>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
            </div>
            <div className="w-px h-12 bg-border" />
            <div className="text-center">
              <motion.p
                className="text-3xl font-bold text-yellow-500 mb-1"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.8,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                ∞
              </motion.p>
              <p className="text-sm text-muted-foreground">More to Come</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
