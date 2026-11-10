import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import type { ExperienceStat } from "@/data/experience";

/** The logo as a printed halftone photo: multiplied into the paper, with a caption underneath. */
export const LogoPlate = ({ src, caption }: { src: string; caption?: string }) => (
  <span className="np-plate block">
    <span className="np-plate-img block">
      <img src={src} alt="" className="max-h-full max-w-full object-contain" />
    </span>
    {caption && <span className="np-cap mt-1.5 block">{caption}</span>}
  </span>
);

/** Counts a figure up from zero the first time it scrolls into view; "800+" or "+20%" keep their signs. */
const CountUp = ({ value }: { value: string }) => {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true });
  const calm = useReducedMotion();
  const [, pre = "", digits = "", post = ""] = value.match(/^(\D*)(\d[\d,]*)(.*)$/) ?? [];
  const end = Number(digits.replace(/,/g, ""));
  const [n, setN] = useState(end);

  useEffect(() => {
    if (!seen || calm || !digits) return;
    setN(0);
    const run = animate(0, end, { duration: 1.1, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => run.stop();
  }, [seen, calm, digits, end]);

  if (!digits) return <>{value}</>;
  return (
    <span
      ref={ref}
      aria-label={value}
      style={{
        fontVariantNumeric: "tabular-nums",
        // a marigold highlighter swipe, drawn left to right as the figure scrolls into view
        backgroundImage: "linear-gradient(#e9b43a, #e9b43a)",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 90%",
        backgroundSize: seen || calm ? "100% 36%" : "0% 36%",
        transition: calm ? undefined : "background-size 0.9s ease 0.25s",
      }}
    >
      {pre}
      {n.toLocaleString("en-US")}
      {post}
    </span>
  );
};

/** A boxed run of figures, ruled like the "by the numbers" box on an inside page. */
export const StatStrip = ({ stats }: { stats: ExperienceStat[] }) => (
  <dl className="np-stats mt-5 grid grid-cols-2 md:grid-cols-4">
    {stats.map((s) => (
      <div key={s.label} className="np-stat">
        <dd className="np-num">
          <CountUp value={s.value} />
        </dd>
        <dt className="np-cap">{s.label}</dt>
      </div>
    ))}
  </dl>
);
