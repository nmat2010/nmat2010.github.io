import { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

/** A section is a painted shop board hung under its enamel street-name plate. */
export const Section = ({ id, title, children }: SectionProps) => (
  <section id={id} className="px-4 sm:px-6">
    <div className="max-w-5xl mx-auto py-12 md:py-20">
      <h2 className="plate relative z-10 -mb-4 ml-4 md:ml-8 text-[clamp(1.6rem,4vw,2.5rem)]">{title}</h2>
      <div className="board p-6 pt-12 sm:p-10 sm:pt-14 md:p-14 md:pt-16">{children}</div>
    </div>
  </section>
);
