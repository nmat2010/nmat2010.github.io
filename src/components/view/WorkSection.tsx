import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Section } from "@/components/view/Section";
import { projects } from "@/data/projects";

/** A project photograph pasted to the card; it tips toward the pointer. */
const Photo = ({ src, alt, flip }: { src: string; alt: string; flip: boolean }) => {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 200, damping: 22 });
  const sy = useSpring(py, { stiffness: 200, damping: 22 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [7, -7]);

  return (
    <div style={{ perspective: 900 }} className={flip ? "md:order-2" : ""}>
      <motion.div
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`bg-white p-2 pb-8 border border-card-foreground/20 shadow-[0_14px_24px_-14px_hsl(30_30%_10%/0.55)] ${
          flip ? "rotate-[1.2deg]" : "-rotate-[1.2deg]"
        }`}
      >
        <img src={src} alt={alt} className="w-full aspect-[16/10] object-cover" loading="lazy" />
      </motion.div>
    </div>
  );
};

export const ProjectsBody = () => (
  <>
    <ul className="border-t border-card-foreground/25">
      {projects.map((project, i) => (
        <li key={project.title} className="border-b border-card-foreground/25 py-10 md:py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-12 gap-y-8 items-center">
            <div className="md:col-span-5">
              <Photo src={project.image} alt={`${project.title} screenshot`} flip={i % 2 === 1} />
            </div>
            <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-first" : ""}`}>
              <p className="text-sm text-card-foreground/75">{project.subtitle}</p>
              <h3 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-bold tracking-[-0.035em] [font-stretch:88%] mt-1">
                {project.title}
              </h3>
              <p className="font-serif text-lg leading-relaxed mt-5 max-w-[48ch] text-card-foreground/90">
                {project.description}
              </p>
              <p className="text-sm text-card-foreground/75 mt-4 leading-relaxed">
                {project.language}. {project.tech.join(", ")}.
              </p>
              <div className="flex gap-6 pt-5 text-sm font-semibold">
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-card">
                  GitHub
                </a>
                <a href={project.devpost} target="_blank" rel="noopener noreferrer" className="link-card">
                  Devpost
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </>
);

export const WorkSection = () => (
  <Section id="projects" title="Projects">
    <ProjectsBody />
  </Section>
);
