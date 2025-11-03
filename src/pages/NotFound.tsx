import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, RefreshCcw, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    console.log("🤖 Beep boop... Robot lost in cyberspace...");
  }, [location.pathname]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setEyePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Floating particles in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Lost Robot */}
          <motion.div
            className="mb-8 inline-block"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative">
              {/* Robot body */}
              <div className="w-48 h-64 mx-auto bg-gradient-to-b from-accent/20 to-accent/10 border-4 border-accent/30 rounded-3xl relative">
                {/* Antenna */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-2 h-8 bg-accent/40 rounded-full">
                  <motion.div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-accent rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>

                {/* Eyes */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 flex gap-8">
                  {[0, 1].map((i) => (
                    <div key={i} className="relative w-12 h-12 bg-background rounded-full border-2 border-accent/50">
                      <motion.div
                        className="absolute w-6 h-6 bg-accent rounded-full top-1/2 left-1/2"
                        style={{
                          x: eyePosition.x + (i === 0 ? -24 : 24),
                          y: eyePosition.y,
                        }}
                        animate={{ scale: [1, 0.8, 1] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      />
                    </div>
                  ))}
                </div>

                {/* Mouth (sad) */}
                <div className="absolute top-36 left-1/2 -translate-x-1/2 w-20 h-10 border-b-4 border-accent/50 rounded-b-full" />

                {/* Control panel */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  <motion.div
                    className="w-3 h-3 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-3 h-3 rounded-full bg-yellow-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-3 h-3 rounded-full bg-green-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>

              {/* Arms */}
              <div className="absolute top-24 -left-12 w-10 h-32 bg-accent/20 border-4 border-accent/30 rounded-full transform -rotate-45" />
              <div className="absolute top-24 -right-12 w-10 h-32 bg-accent/20 border-4 border-accent/30 rounded-full transform rotate-45" />
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-accent via-primary to-secondary bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Beep Boop... Robot Lost! 🤖
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-2 max-w-md mx-auto">
              This robot was searching for: <code className="text-accent font-mono">{location.pathname}</code>
            </p>
            <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto">
              But it seems this page doesn't exist in my neural network. Maybe it's still in training? 🧠
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-8 py-3 bg-accent text-white rounded-full font-medium hover:shadow-[0_0_30px_hsl(var(--accent)/0.5)] transition-all hover:scale-105"
            >
              <Home className="h-5 w-5" />
              Take Me Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-8 py-3 bg-secondary/80 text-white rounded-full font-medium hover:shadow-[0_0_30px_hsl(var(--secondary)/0.5)] transition-all hover:scale-105"
            >
              <RefreshCcw className="h-5 w-5" />
              Retry
            </button>
          </motion.div>

          {/* Fun Messages */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 p-6 rounded-2xl bg-muted/50 border border-border max-w-md mx-auto"
          >
            <p className="text-sm text-muted-foreground italic">
              "In machine learning, we call this an 'unexpected output.' In web dev, we call it a 404. Either way, I'm lost." 🔍
            </p>
          </motion.div>

          {/* Hidden Easter Egg Hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-xs text-muted-foreground"
          >
            Psst... Try the Konami code on the homepage (↑↑↓↓←→←→BA) for a surprise! 🎮
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
