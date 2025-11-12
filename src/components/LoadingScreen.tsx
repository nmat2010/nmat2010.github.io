import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

export const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show text after initial delay
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 300);

    // Complete loading sequence
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // Wait for exit animation to complete before notifying
      setTimeout(() => {
        onLoadingComplete?.();
      }, 800); // Match exit animation duration
    }, 2500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(loadingTimer);
    };
  }, [onLoadingComplete]);

  // Animation variants for text reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  const name = "Hello".split("");
  // const subtitle = "AI & Robotics Innovator";

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Subtle background gradient that moves */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-transparent"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 3,
              ease: "linear",
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{ backgroundSize: "200% 200%" }}
          />

          {/* Main content */}
          <div className="relative z-10 text-center">
            {/* Logo with elegant entrance */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 1,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="mb-12 flex justify-center"
            >
              <div className="relative">
                <img
                  src="/logo-nav.svg"
                  alt="Thu Nguyen"
                  className="w-32 h-32 md:w-40 md:h-40"
                />

                {/* Subtle rotating ring around logo */}
                <motion.div
                  className="absolute inset-0 -m-4"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  <svg
                    className="w-full h-full opacity-20"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      strokeDasharray="2,4"
                      className="text-accent"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Name with letter-by-letter reveal */}
            {showText && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex justify-center mb-4 overflow-hidden">
                  {name.map((char, index) => (
                    <motion.span
                      key={index}
                      variants={itemVariants}
                      className="text-5xl md:text-7xl font-bold text-foreground inline-block"
                      style={{
                        marginRight: char === " " ? "0.5em" : "0",
                      }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </div>

                {/* Subtitle with smooth fade
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.8,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                  className="overflow-hidden"
                >
                  <p className="text-base md:text-lg text-muted-foreground font-light tracking-wider">
                    {subtitle}
                  </p>
                </motion.div> */}

                {/* Minimal accent line */}
                <motion.div
                  className="mt-8 mx-auto"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 1,
                    delay: 1,
                    ease: [0.76, 0, 0.24, 1],
                  }}
                >
                  <div className="h-px w-32 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto" />
                </motion.div>

                {/* Minimal loading indicator */}
                <motion.div
                  className="mt-12 flex justify-center gap-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-accent/60"
                      animate={{
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Corner accent decorations - subtle Vietnamese touch */}
          <motion.div
            className="absolute top-12 left-12 w-12 h-12 opacity-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="w-full h-full border-t-2 border-l-2 border-accent" />
          </motion.div>
          <motion.div
            className="absolute bottom-12 right-12 w-12 h-12 opacity-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="w-full h-full border-b-2 border-r-2 border-accent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
