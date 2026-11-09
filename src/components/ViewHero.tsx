import profileImg from "@/assets/profile.jpeg";

export const ViewHero = ({ onPlay }: { onPlay: () => void }) => (
  <section id="hero" className="relative overflow-hidden px-6">
    <div className="max-w-5xl mx-auto pt-28 pb-16 md:pt-36 md:pb-24 grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
      <div>
        <h1
          className="rise-in font-script font-normal tracking-normal leading-[1.05] text-[clamp(3.5rem,12vw,6rem)] text-lantern"
          style={{ ["--d" as string]: "0.1s" }}
        >
          Thu Nguyen
        </h1>
        <p
          className="rise-in mt-6 font-serif text-xl md:text-2xl leading-snug max-w-[30ch]"
          style={{ ["--d" as string]: "0.25s" }}
        >
          Computer engineering at Stony Brook. Building AI infrastructure, and studying the policy and law around it.
        </p>
        <div className="rise-in mt-8 flex flex-wrap items-center gap-x-8 gap-y-4" style={{ ["--d" as string]: "0.4s" }}>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-lantern hover:text-white"
          >
            View resume
          </a>
          <a href="#contact" className="link-ink text-sm font-semibold">
            Get in touch
          </a>
          <button onClick={onPlay} className="link-ink text-sm font-semibold">
            My little Saigon alley
          </button>
        </div>
      </div>
      <img
        src={profileImg}
        alt="Portrait of Thu Nguyen"
        className="rise-in mx-auto h-56 w-56 md:h-72 md:w-72 rounded-full object-cover object-[50%_15%] ring-[6px] ring-lantern ring-offset-[6px] ring-offset-background"
        style={{ ["--d" as string]: "0.3s" }}
      />
    </div>
  </section>
);
