import { Plus } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "./Section";
import { experiences, isCategorised } from "@/data/experience";

export const ExperienceBody = () => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [expandedSubsections, setExpandedSubsections] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const toggleSubsection = (expIndex: number, sectionIndex: number) => {
    const key = `${expIndex}-${sectionIndex}`;
    setExpandedSubsections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <ul className="border-t border-card-foreground/25">
        {experiences.map((exp, index) => {
          const open = expandedItems.includes(index);
          return (
            <li key={index} className="border-b border-card-foreground/25">
              <button
                onClick={() => toggleItem(index)}
                aria-expanded={open}
                className="w-full py-7 text-left grid grid-cols-[auto_1fr_auto] md:grid-cols-[3rem_12rem_1fr_auto] gap-x-5 gap-y-1 items-start group"
              >
                <span className="w-12 h-12 bg-white border border-card-foreground/25 overflow-hidden flex items-center justify-center">
                  <img src={exp.logo} alt="" className="w-full h-full object-contain p-1" />
                </span>
                <span className="np-dateline text-sm text-card-foreground/75 leading-relaxed order-last col-span-3 col-start-1 md:order-none md:col-span-1 md:col-start-auto">
                  {exp.period}
                  <span className="block">{exp.location}</span>
                </span>
                <span className="block">
                  <span className="np-headline block text-xl md:text-2xl font-bold tracking-[-0.02em] [font-stretch:92%] group-hover:text-lantern transition-colors">
                    {exp.title}
                  </span>
                  <span className="np-deck block font-medium mt-0.5">{exp.company}</span>
                  <span className="np-body block font-serif text-lg leading-snug text-card-foreground/80 mt-3 max-w-[52ch]">
                    {exp.description}
                  </span>
                </span>
                <Plus
                  className={`h-5 w-5 mt-1 text-card-foreground/70 transition-transform duration-300 ${open ? "rotate-45" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 md:pl-[4.25rem] space-y-8">
                      {exp.tldr && (
                        <div className="border-l border-card-foreground/40 pl-5">
                          <h4 className="np-subhead font-semibold mb-3">Key highlights</h4>
                          <ul className="np-copy space-y-2 font-serif text-lg leading-snug">
                            {exp.tldr.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {isCategorised(exp.highlights) ? (
                        <div className="border-t border-card-foreground/25">
                          {exp.highlights.map((section, sectionIndex) => {
                            const isOpen = expandedSubsections[`${index}-${sectionIndex}`];
                            return (
                              <div key={sectionIndex} className="border-b border-card-foreground/25">
                                <button
                                  onClick={() => toggleSubsection(index, sectionIndex)}
                                  aria-expanded={!!isOpen}
                                  className="np-subhead w-full py-3 flex items-center justify-between gap-4 text-left font-semibold hover:text-lantern transition-colors"
                                >
                                  {section.category}
                                  <Plus
                                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                                  />
                                </button>
                                <AnimatePresence initial={false}>
                                  {isOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pb-4 space-y-4">
                                        {section.items.map((item, itemIndex) => (
                                          <div key={itemIndex}>
                                            {item.subtitle && <h5 className="np-subhead text-sm font-semibold mb-1.5">{item.subtitle}</h5>}
                                            <ul className="np-copy space-y-1.5 text-sm text-card-foreground/75 list-disc pl-5 marker:text-lantern">
                                              {item.points.map((point, pointIndex) => (
                                                <li key={pointIndex} className="leading-relaxed">
                                                  {point}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="border-l border-card-foreground/40 pl-5">
                          <h4 className="np-subhead font-semibold mb-3">Key highlights</h4>
                          <ul className="np-copy space-y-2 font-serif text-lg leading-snug">
                            {exp.highlights.map((highlight, i) => (
                              <li key={i}>{highlight}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export const ExperienceSection = () => (
  <Section id="experience" title="Experience">
    <ExperienceBody />
  </Section>
);
