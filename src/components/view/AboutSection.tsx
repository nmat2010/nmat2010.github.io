import { Section } from "@/components/view/Section";
import { focusAreas, researchInterests } from "@/data/about";

export const AboutBody = () => (
  <>
    <p className="text-[clamp(1.75rem,4.2vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.025em] [font-stretch:92%] max-w-[24ch]">
      I'm a junior studying Computer Engineering at Stony Brook University, working between infrastructure engineering
      and AI research.
    </p>

    <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10">
      <div className="md:col-span-5 font-serif text-lg leading-relaxed space-y-5 text-card-foreground/85 max-w-[52ch]">
        <p>
          My background includes hardware system design coursework and several hackathon wins. I'm drawn to robotics,
          interpretability, ethics, and the governance questions AI raises, which is pulling me toward research and
          policy work.
        </p>
        <p>
          Away from the screen I cook, lift and swim, and play guitar, acoustic and electric. I love music in general,
          and dogs and cats even more.
        </p>
      </div>

      <dl className="md:col-span-6 md:col-start-7 border-t border-card-foreground/25">
        {focusAreas.map((area) => (
          <div key={area.title} className="py-4 border-b border-card-foreground/25">
            <dt className="font-bold text-base">{area.title}</dt>
            <dd className="text-sm text-card-foreground/75 mt-1 leading-relaxed">{area.description}</dd>
          </div>
        ))}
      </dl>
    </div>

    <h3 className="mt-20 md:mt-28 mb-4 text-sm font-bold uppercase tracking-[0.12em] text-card-foreground/75">
      Research interests
    </h3>
    <ul className="border-t border-card-foreground/25 grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
      {researchInterests.map((topic) => (
        <li
          key={topic}
          className="py-4 border-b border-card-foreground/25 text-xl md:text-2xl font-semibold tracking-[-0.015em] [font-stretch:92%] transition-colors hover:text-lantern"
        >
          {topic}
        </li>
      ))}
    </ul>
  </>
);

export const AboutSection = () => (
  <Section id="about" title="About">
    <AboutBody />
  </Section>
);
