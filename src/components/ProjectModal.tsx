import { motion, AnimatePresence } from "framer-motion";
import { X, Github, ExternalLink } from "lucide-react";
import { useEffect } from "react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    subtitle: string;
    description: string;
    language: string;
    languageColor: string;
    tech: string[];
    image: string;
    github: string;
    devpost: string;
    youtubeId: string;
    features?: string[];
    challenges?: string[];
  } | null;
}

export const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[201] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                className="relative bg-background border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                {/* Vietnamese corner accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/30" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/30" />

                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-muted/50 hover:bg-muted text-foreground hover:text-accent transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>

                {/* Scrollable content */}
                <div className="overflow-y-auto max-h-[85vh] custom-scrollbar">
                  {/* YouTube Video Embed */}
                  {project.youtubeId && (
                    <div className="relative w-full aspect-video bg-muted/30">
                      <iframe
                        src={`https://www.youtube.com/embed/${project.youtubeId}`}
                        title={`${project.title} Demo`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8 md:p-10">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                            {project.title}
                          </h2>
                          <p className="text-accent font-medium">{project.subtitle}</p>
                        </div>
                        <div className="flex gap-2">
                          <motion.a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="View on GitHub"
                          >
                            <Github className="h-5 w-5" />
                          </motion.a>
                          <motion.a
                            href={project.devpost}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-muted hover:bg-accent hover:text-white transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="View on Devpost"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </motion.a>
                        </div>
                      </div>

                      {/* Minimal accent line */}
                      <div className="flex items-center gap-2 mb-6">
                        <div className="h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
                        <div className="w-1 h-1 rounded-full bg-accent/50" />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-foreground mb-3">About</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-foreground mb-3">Tech Stack</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, i) => (
                          <motion.span
                            key={i}
                            className="px-3 py-1.5 bg-muted hover:bg-accent hover:text-white rounded-md text-sm font-medium transition-colors cursor-default"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Language */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.languageColor }}
                      />
                      <span className="font-medium">{project.language}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
