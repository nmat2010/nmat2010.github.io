import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Plane, MapPin } from "lucide-react";

export const JourneyMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const pathProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = pathProgress.on("change", (latest) => {
      setProgress(latest);
    });
    return () => unsubscribe();
  }, [pathProgress]);

  // SVG path for journey curve (Saigon to New York)
  const journeyPath = "M 100,150 Q 250,50 400,100 T 700,120";

  return (
    <div
      ref={containerRef}
      className="relative py-24 bg-gradient-to-b from-background via-muted/10 to-background overflow-hidden"
    >
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" viewBox="0 0 800 400">
          <defs>
            <pattern
              id="journeyGrid"
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
          <rect width="100%" height="100%" fill="url(#journeyGrid)" />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Journey</h2>
          <p className="text-muted-foreground text-lg">
            From the vibrant streets of Saigon to the innovation hubs of New
            York
          </p>
        </motion.div>

        {/* Journey Map SVG */}
        <motion.div
          className="relative w-full max-w-4xl mx-auto"
          style={{ height: "300px" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <svg
            viewBox="0 0 800 200"
            className="w-full h-full"
            style={{ overflow: "visible" }}
          >
            {/* Background path (grayed out) */}
            <motion.path
              d={journeyPath}
              fill="none"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="2"
              strokeOpacity="0.2"
              strokeDasharray="8,8"
            />

            {/* Animated progress path */}
            <motion.path
              d={journeyPath}
              fill="none"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              style={{ pathLength: pathProgress }}
            />

            {/* Start location - Saigon */}
            <g transform="translate(100, 150)">
              <motion.circle
                r="8"
                fill="hsl(var(--accent))"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              />
              <motion.circle
                r="12"
                fill="none"
                stroke="hsl(var(--accent))"
                strokeWidth="2"
                strokeOpacity="0.4"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </g>

            {/* End location - New York */}
            <g transform="translate(700, 120)">
              <motion.circle
                r="8"
                fill="hsl(var(--secondary))"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              />
              <motion.circle
                r="12"
                fill="none"
                stroke="hsl(var(--secondary))"
                strokeWidth="2"
                strokeOpacity="0.4"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </g>

            {/* Animated plane icon */}
            <motion.g
              style={{
                offsetPath: `path('${journeyPath}')`,
                offsetDistance: `${progress * 100}%`,
              }}
            >
              <circle r="6" fill="hsl(var(--foreground))" opacity="0.1" />
              <foreignObject x="-12" y="-12" width="24" height="24">
                <Plane
                  className="w-6 h-6 text-foreground"
                  style={{ transform: `rotate(${progress * 20}deg)` }}
                />
              </foreignObject>
            </motion.g>
          </svg>

          {/* Location labels */}
          <motion.div
            className="absolute left-[5%] top-[85%] flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <MapPin className="w-4 h-4 text-accent" />
            <div>
              <p className="text-sm font-semibold">Saigon</p>
              <p className="text-xs text-muted-foreground">Vietnam</p>
            </div>
          </motion.div>

          <motion.div
            className="absolute right-[5%] top-[70%] flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-right">
              <p className="text-sm font-semibold">New York</p>
              <p className="text-xs text-muted-foreground">United States</p>
            </div>
            <MapPin className="w-4 h-4 text-secondary" />
          </motion.div>
        </motion.div>

        {/* Journey stats
        <motion.div
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
        >
          {[
            { label: "Distance", value: "9,500 mi" },
            { label: "Time Zones", value: "12 hours" },
            { label: "Cultures", value: "2 worlds" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center p-4 rounded-lg bg-muted/30 border border-border"
              whileHover={{ scale: 1.05, borderColor: "hsl(var(--accent) / 0.3)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div> */}
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 right-20 w-20 h-20 opacity-[0.03]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-accent">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
        </svg>
      </motion.div>
    </div>
  );
};
