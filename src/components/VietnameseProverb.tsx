import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface Proverb {
  vietnamese: string;
  english: string;
  meaning: string;
}

const proverbs: Proverb[] = [
  {
    vietnamese: "Có công mài sắt có ngày nên kim",
    english: "With effort, an iron bar can be ground into a needle",
    meaning: "Persistent effort leads to success",
  },
  {
    vietnamese: "Học, học nữa, học mãi",
    english: "Study, study more, study forever",
    meaning: "The pursuit of knowledge is endless",
  },
  {
    vietnamese: "Đi một ngày đàng, học một sàng khôn",
    english: "Travel a day's journey, gain a basket of wisdom",
    meaning: "Experience teaches valuable lessons",
  },
  {
    vietnamese: "Cái khó ló cái khôn",
    english: "Difficulty reveals wisdom",
    meaning: "Challenges bring out intelligence and creativity",
  },
];

interface VietnameseProverbProps {
  index?: number;
}

export const VietnameseProverb = ({ index = 0 }: VietnameseProverbProps) => {
  const proverb = proverbs[index % proverbs.length];

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
        <svg viewBox="0 0 200 200" className="w-64 h-64 text-accent">
          <path
            d="M100,20 Q120,50 100,80 Q80,50 100,20 M100,80 Q130,100 100,140 Q70,100 100,80 M100,80 Q150,90 130,100 M100,80 Q50,90 70,100"
            fill="currentColor"
          />
        </svg>
      </div>

      <motion.div
        className="container mx-auto px-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {/* Decorative quote icon */}
            <motion.div
              className="absolute -top-6 -left-4 text-accent/20"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <Quote className="w-12 h-12" />
            </motion.div>

            {/* Vietnamese text */}
            <motion.p
              className="text-2xl md:text-3xl font-light text-center mb-4 text-foreground/90 italic"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              "{proverb.vietnamese}"
            </motion.p>

            {/* English translation */}
            <motion.p
              className="text-lg md:text-xl text-center mb-2 text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              {proverb.english}
            </motion.p>

            {/* Meaning */}
            <motion.div
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-accent/50 to-accent/50" />
              <p className="text-sm text-muted-foreground/70 italic">
                {proverb.meaning}
              </p>
              <div className="w-8 h-px bg-gradient-to-r from-accent/50 to-transparent" />
            </motion.div>

            {/* Vietnamese flag accent dots */}
            <motion.div
              className="flex items-center justify-center gap-2 mt-6"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Decorative corner elements */}
      <motion.div
        className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-accent/10"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-accent/10"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      />
    </div>
  );
};
