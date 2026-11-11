import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import profileImg from "@/assets/profile.jpeg";
import { tileBackground } from "@/components/shared/tilePattern";

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
};

export const ModeGate = ({ onChoose }: { onChoose: (m: "play" | "view") => void }) => {
  const [gl, setGl] = useState(true);
  useEffect(() => setGl(hasWebGL()), []);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-background">
      {/* old Saigon cement floor tiles (gạch bông), fading into the page */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-full opacity-70 md:w-[62%] md:[mask-image:linear-gradient(90deg,transparent_0%,#000_38%)]"
        style={{ backgroundImage: tileBackground, backgroundSize: "150px 150px" }}
      />
      <div
        className="absolute inset-0 md:hidden"
        style={{ background: "linear-gradient(180deg, hsl(42 58% 89% / 0.97) 0%, hsl(42 58% 89% / 0.93) 60%, hsl(42 58% 89% / 0.7) 100%)" }}
      />

      <div className="relative z-10 mx-auto grid min-h-[100svh] w-full max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-[minmax(0,34rem)_1fr] md:gap-12 md:py-20">
        {/* portrait, layered over the tile decoration */}
        <div className="rise-in order-first mx-auto w-[min(58vw,15rem)] md:order-last md:w-[min(34vw,27rem)]" style={{ ["--d" as string]: "0.2s" }}>
          <div className="relative aspect-square">
            <div className="absolute inset-0 translate-x-[7%] translate-y-[7%] rounded-full bg-marigold" />
            <div className="absolute inset-0 -translate-x-[5%] -translate-y-[4%] rounded-full border-[6px] border-enamel" />
            <div className="absolute -right-[4%] top-[6%] h-[22%] w-[22%] rounded-full bg-lantern" />
            <img
              src={profileImg}
              alt="Portrait of Thu Nguyen"
              className="relative h-full w-full rounded-full object-cover ring-[8px] ring-card shadow-[0_24px_40px_-18px_rgba(40,25,10,0.7)]"
            />
          </div>
        </div>

        <div className="max-w-[34rem]">
          <h1
            className="rise-in font-script text-[clamp(3.75rem,13vw,6.5rem)] font-normal leading-[1.02] tracking-normal text-lantern"
            style={{ ["--d" as string]: "0.1s" }}
          >
            Thu Nguyen
          </h1>
          <p className="rise-in mt-4 max-w-[30ch] font-serif text-xl leading-snug md:text-2xl" style={{ ["--d" as string]: "0.25s" }}>
            Computer engineering, AI infrastructure, and the policy around it.
          </p>

          <div className="mt-9 grid gap-4">
            <button
              onClick={() => onChoose("play")}
              disabled={!gl}
              className="rise-in group board p-6 text-left transition-transform duration-300 hover:-translate-y-1 disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ ["--d" as string]: "0.4s" }}
            >
              <span className="flex items-center justify-between gap-4">
                <span className="plate text-lg">Play</span>
                <ArrowRight className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
              </span>
              <span className="mt-4 block font-display text-3xl font-bold leading-tight">My little Saigon alley</span>
              <span className="mt-2 block font-serif text-lg leading-snug text-card-foreground/85">
                {gl
                  ? "A tiny walkable alley. Each door opens a part of my portfolio: about, experience, projects, interests and contact."
                  : "This browser doesn't support WebGL, so the alley can't open here. View mode has everything."}
              </span>
            </button>

            <button
              onClick={() => onChoose("view")}
              className="rise-in group flex items-center justify-between gap-4 rounded-[14px] border-2 border-foreground/70 bg-background/70 px-6 py-4 text-left backdrop-blur-[2px] transition-colors duration-300 hover:bg-card"
              style={{ ["--d" as string]: "0.5s" }}
            >
              <span>
                <span className="block font-display text-2xl font-bold leading-tight">Just show me</span>
                <span className="mt-0.5 block text-sm text-foreground/80">One fast, simple page. Resume and contact are right there.</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
