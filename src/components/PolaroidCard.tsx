import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PolaroidCardProps {
  children: ReactNode;
  rotation?: number;
  caption?: string;
  index?: number;
}

export const PolaroidCard = ({
  children,
  rotation = 0,
  caption,
  index = 0,
}: PolaroidCardProps) => {
  // Random-ish rotation for authentic polaroid feel
  const randomRotation = rotation || (index % 2 === 0 ? -2 : 2);

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50, rotate: randomRotation + 10 }}
      whileInView={{ opacity: 1, y: 0, rotate: randomRotation }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{
        rotate: 0,
        scale: 1.05,
        zIndex: 10,
        transition: { duration: 0.3 },
      }}
    >
      {/* Polaroid frame */}
      <div className="relative bg-white rounded-sm p-3 pb-12 shadow-2xl cursor-pointer">
        {/* Photo area with vintage effect */}
        <div className="relative overflow-hidden bg-muted">
          {/* Vintage filter overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/20 via-transparent to-blue-50/10 pointer-events-none z-10" />

          {/* Content */}
          <div className="relative">{children}</div>

          {/* Tape effect on corners */}
          <motion.div
            className="absolute -top-2 right-8 w-16 h-6 bg-yellow-100/60 opacity-50 blur-[1px]"
            style={{
              transform: "rotate(-5deg)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.5 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
          />
        </div>

        {/* Caption area */}
        {caption && (
          <motion.div
            className="absolute bottom-3 left-3 right-3 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <p
              className="text-sm font-handwriting text-gray-700"
              style={{ fontFamily: "'Shadows Into Light', cursive" }}
            >
              {caption}
            </p>
          </motion.div>
        )}

        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.4' /%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Shadow that reacts to hover */}
      <motion.div
        className="absolute inset-0 -z-10 bg-black/20 blur-xl rounded-sm"
        initial={{ opacity: 0.3, y: 10 }}
        whileHover={{
          opacity: 0.5,
          y: 15,
          transition: { duration: 0.3 },
        }}
        style={{
          transform: `rotate(${randomRotation}deg)`,
        }}
      />

      {/* Subtle paper edge highlight */}
      <div className="absolute inset-0 rounded-sm border border-gray-200/50 pointer-events-none" />
    </motion.div>
  );
};

// Helper component for using Polaroid style with project images
export const PolaroidProjectCard = ({
  image,
  title,
  index = 0,
}: {
  image: string;
  title: string;
  index?: number;
}) => {
  return (
    <PolaroidCard caption={title} index={index}>
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </PolaroidCard>
  );
};
