import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Show progress bar after scrolling 10% of the page
      setIsVisible(latest > 0.1);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <>
      {/* Top progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-accent origin-left z-50"
        style={{ scaleX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Vertical progress indicator on the side */}
      <motion.div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress line */}
        <div className="relative w-px h-32 bg-border">
          <motion.div
            className="absolute top-0 left-0 w-full bg-accent origin-top"
            style={{ scaleY: scrollYProgress }}
          />
        </div>

        {/* Percentage indicator */}
        <motion.div
          className="px-2 py-1 rounded-md bg-accent text-background text-xs font-mono font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: isVisible ? 1 : 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <motion.span>
            {scrollYProgress.get() !== undefined
              ? Math.round(scrollYProgress.get() * 100)
              : 0}
            %
          </motion.span>
        </motion.div>

        {/* Decorative Vietnamese accent */}
        <motion.div
          className="flex flex-col gap-1"
          animate={{
            y: [0, -3, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-1 h-1 rounded-full bg-accent/60" />
          <div className="w-1 h-1 rounded-full bg-yellow-500/60" />
        </motion.div>
      </motion.div>

      {/* Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-6 z-40 p-3 rounded-full bg-accent text-background shadow-lg hover:shadow-xl transition-shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 20,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>

        {/* Decorative ring animation */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-accent"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </motion.button>
    </>
  );
};
