import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";
import { Code, Award, Users, Coffee } from "lucide-react";

interface StatProps {
  value: number;
  label: string;
  icon: React.ElementType;
  suffix?: string;
  delay?: number;
}

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = `${Math.floor(latest)}${suffix}`;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const StatCard = ({ value, label, icon: Icon, suffix = "", delay = 0 }: StatProps) => {
  return (
    <motion.div
      className="group relative p-6 rounded-lg border border-border bg-background/50 backdrop-blur-sm hover:border-accent/40 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      {/* Vietnamese corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent/20 group-hover:border-accent/60 transition-colors" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent/20 group-hover:border-accent/60 transition-colors" />

      <div className="flex flex-col items-center text-center space-y-3">
        <motion.div
          className="p-3 rounded-lg bg-accent/10 text-accent"
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>

        <div>
          <motion.div className="text-4xl md:text-5xl font-bold text-foreground mb-1">
            <AnimatedCounter value={value} suffix={suffix} />
          </motion.div>
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

const stats: StatProps[] = [
  {
    value: 3,
    label: "Years of Experience",
    icon: Code,
    suffix: "+",
  },
  {
    value: 15,
    label: "Projects Completed",
    icon: Award,
    suffix: "+",
  },
  {
    value: 800,
    label: "Hours of Content Processed",
    icon: Users,
    suffix: "+",
  },
  {
    value: 9999,
    label: "Cups of Coffee",
    icon: Coffee,
    suffix: "+",
  },
];

export const StatsSection = () => {
  return (
    <section className="relative py-20 bg-background">
      {/* Subtle background gradient */}
      <motion.div
        className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-accent/5 to-secondary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} delay={index * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
