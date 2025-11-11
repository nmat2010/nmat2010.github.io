import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import profileImg from "@/assets/profile.jpeg";
import { useRef } from "react";

export const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const scrollToNext = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-muted/20"
    >
      {/* Animated background gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-secondary/10 to-accent/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, -30, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Subtle background grid with parallax */}
      <motion.div
        className="absolute inset-0 bg-grid-pattern opacity-[0.02]"
        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
      />

      {/* Vietnamese decorative elements - animated lotus petals */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 opacity-[0.03]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
          <path d="M50,10 Q60,30 50,50 Q40,30 50,10 M50,50 Q70,60 50,90 Q30,60 50,50 M50,50 Q90,40 70,60 M50,50 Q10,40 30,60" fill="currentColor"/>
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-32 left-20 w-24 h-24 opacity-[0.03]"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-secondary">
          <path d="M50,10 Q60,30 50,50 Q40,30 50,10 M50,50 Q70,60 50,90 Q30,60 50,50 M50,50 Q90,40 70,60 M50,50 Q10,40 30,60" fill="currentColor"/>
        </svg>
      </motion.div>

      <motion.div
        className="container mx-auto px-6 relative z-10"
        style={{ opacity, scale }}
      >
        <div className="max-w-5xl mx-auto text-center space-y-10 py-20">
          {/* Profile picture with Vietnamese-inspired frame */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              delay: 0.2,
            }}
          >
            <div className="relative">
              {/* Subtle lotus-inspired decorative rings with pulse */}
              <motion.div
                className="absolute -inset-6 rounded-full border border-accent/10"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -inset-8 rounded-full border border-secondary/10"
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />

              {/* Profile image with subtle Vietnamese color accent */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/20 via-secondary/10 to-transparent blur-xl"></div>
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-border shadow-lg">
                  <img
                    src={profileImg}
                    alt="Thu Nguyen"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Small Vietnamese flag colors accent with animation */}
              <motion.div
                className="absolute -bottom-2 -right-2 flex gap-1"
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="w-2 h-2 rounded-full bg-accent/80"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* Minimal accent line with Vietnamese pattern */}
          <motion.div
            className="flex items-center justify-center gap-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-accent/50 to-accent/50"></div>
            <motion.div
              className="w-1 h-1 rounded-full bg-accent/50"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="w-8 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
          </motion.div>

          {/* Name with clean typography and animation */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.span
              className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Thu Nguyen
            </motion.span>
          </motion.h1>

          {/* Subtitle with Vietnamese touch */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <p className="text-xl md:text-2xl text-muted-foreground font-light">
              Computer Engineering @ Stony Brook
            </p>
            <div className="flex items-center justify-center gap-2 text-sm md:text-base text-muted-foreground/60">
              <motion.span
                whileHover={{ scale: 1.1, color: "hsl(var(--accent))" }}
              >
                Saigon
              </motion.span>
              <motion.span
                className="text-accent"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.span>
              <motion.span
                whileHover={{ scale: 1.1, color: "hsl(var(--accent))" }}
              >
                New York
              </motion.span>
            </div>
          </motion.div>

          {/* Single powerful statement */}
          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            Building AI systems that preserve human stories and amplify human potential
          </motion.p>

          {/* Clean CTA buttons with subtle Vietnamese accent */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.a
              href="#projects"
              className="group px-8 py-3 bg-foreground text-background rounded-md font-medium relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">View Projects</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.a>
            <motion.a
              href="#contact"
              className="px-8 py-3 border border-border text-foreground rounded-md font-medium"
              whileHover={{ scale: 1.05, borderColor: "hsl(var(--accent) / 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </div>
      </motion.div>

      {/* Minimal scroll indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-all"
        aria-label="Scroll to next section"
      >
        <ChevronDown className="h-5 w-5 animate-float" />
      </button>
    </section>
  );
};
