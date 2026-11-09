import type { ReactNode } from "react";
import type { CommitMonth, ExperienceStat } from "@/data/experience";

/** The logo as a printed halftone photo: multiplied into the paper, with a caption underneath. */
export const LogoPlate = ({ src, caption }: { src: string; caption?: string }) => (
  <span className="np-plate block">
    <span className="np-plate-img block">
      <img src={src} alt="" className="max-h-full max-w-full object-contain" />
    </span>
    {caption && <span className="np-cap mt-1.5 block">{caption}</span>}
  </span>
);

/** A boxed run of figures, ruled like the "by the numbers" box on an inside page. */
export const StatStrip = ({ stats }: { stats: ExperienceStat[] }) => (
  <dl className="np-stats mt-5 grid grid-cols-2 md:grid-cols-4">
    {stats.map((s) => (
      <div key={s.label} className="np-stat">
        <dd className="np-num">{s.value}</dd>
        <dt className="np-cap">{s.label}</dt>
      </div>
    ))}
  </dl>
);

const Figure = ({ title, caption, children }: { title: string; caption: string; children: ReactNode }) => (
  <figure className="mt-6">
    <figcaption className="np-subhead mb-2 flex items-baseline justify-between gap-3 border-b border-card-foreground/40 pb-1">
      <span>{title}</span>
    </figcaption>
    {children}
    <p className="np-cap mt-2">{caption}</p>
  </figure>
);

const icon = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const Bucket = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden {...icon}>
    <path d="M6 9h20l-2 17H8z" />
    <ellipse cx="16" cy="9" rx="10" ry="3.5" />
    <path d="M10 16h12" />
  </svg>
);
const Chip = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden {...icon}>
    <rect x="8" y="8" width="16" height="16" rx="2" />
    <path d="M12 4v4M16 4v4M20 4v4M12 24v4M16 24v4M20 24v4M4 12h4M4 16h4M4 20h4M24 12h4M24 16h4M24 20h4" />
    <path d="M12 16h2l1.5-3 2 6 1.5-3h1" />
  </svg>
);
const Database = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden {...icon}>
    <ellipse cx="16" cy="8" rx="9" ry="3.5" />
    <path d="M7 8v16c0 2 4 3.5 9 3.5s9-1.5 9-3.5V8M7 16c0 2 4 3.5 9 3.5s9-1.5 9-3.5" />
  </svg>
);
const Bolt = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden {...icon}>
    <path d="M18 3L7 18h8l-2 11 11-15h-8z" />
  </svg>
);
const Screen = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden {...icon}>
    <rect x="4" y="6" width="24" height="17" rx="2" />
    <path d="M13 11.5v7l6-3.5zM11 27h10M16 23v4" />
  </svg>
);

const steps = [
  { icon: <Bucket />, name: "Store", note: "Interview video, audio and PDFs in S3" },
  { icon: <Chip />, name: "Transcribe", note: "WhisperX on EC2 gives word-level timing" },
  { icon: <Database />, name: "Index", note: "PostgreSQL full-text plus pgvector" },
  { icon: <Bolt />, name: "Search", note: "FastAPI merges keyword and semantic ranks" },
  { icon: <Screen />, name: "Watch", note: "React player with a synced transcript" },
];

const Arrow = () => (
  <svg viewBox="0 0 24 12" className="np-arrow" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 6h19M16 1.5L21 6l-5 4.5" />
  </svg>
);

/** How one interview travels from storage to a visitor's screen. */
export const PipelineFigure = () => (
  <Figure
    title="From the archive to your screen"
    caption="Each interview passes through five stages. The test site sits behind Cloudflare Access."
  >
    <ol className="np-pipeline">
      {steps.map((s, i) => (
        <li key={s.name} className="np-step">
          <span className="np-step-card">
            {s.icon}
            <span className="np-step-name">{s.name}</span>
            <span className="np-cap">{s.note}</span>
          </span>
          {i < steps.length - 1 && <Arrow />}
        </li>
      ))}
    </ol>
  </Figure>
);

const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

/** Commits per month as an engraved bar chart; the busiest month is picked out in red. */
export const CommitChart = ({ months }: { months: CommitMonth[] }) => {
  const W = 380;
  const H = 150;
  const top = 18;
  const base = H - 30;
  const slot = (W - 12) / months.length;
  const barW = slot - 4;
  const max = Math.max(...months.map((m) => m.count));
  const peak = months.findIndex((m) => m.count === max);
  const total = months.reduce((n, m) => n + m.count, 0);

  return (
    <Figure
      title="A year and a half of commits"
      caption={`${total} commits by month, April 2025 to November 2026. The September 2026 push was the staging deploy, security work and the vignette pages.`}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Bar chart of ${total} commits by month. The most active month was ${months[peak].label} with ${max}.`}
        className="block h-auto w-full max-w-[34rem]"
      >
        <defs>
          <pattern id="np-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="4" height="4" fill="none" />
            <path d="M0 0v4" stroke="currentColor" strokeWidth="1.6" />
          </pattern>
        </defs>
        <line x1="6" x2={W - 6} y1={base} y2={base} stroke="currentColor" strokeWidth="1.2" />
        {[0.5, 1].map((f) => (
          <line key={f} x1="6" x2={W - 6} y1={base - (base - top) * f} y2={base - (base - top) * f} stroke="currentColor" strokeOpacity="0.25" strokeDasharray="2 3" />
        ))}
        {months.map((m, i) => {
          const h = m.count ? Math.max(2, ((base - top) * m.count) / max) : 0;
          const x = 6 + i * slot + 2;
          const hot = i === peak;
          return (
            <g key={m.label}>
              <rect
                x={x}
                y={base - h}
                width={barW}
                height={h}
                fill={hot ? "hsl(var(--lantern))" : "url(#np-hatch)"}
                stroke={hot ? "none" : "currentColor"}
                strokeWidth="0.8"
              >
                <title>{`${m.label}: ${m.count} commits`}</title>
              </rect>
              {hot && (
                <text x={x + barW / 2} y={base - h - 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" style={{ fontFamily: '"Oswald", sans-serif' }}>
                  {m.count}
                </text>
              )}
              <text x={x + barW / 2} y={base + 12} textAnchor="middle" fontSize="9.5" fill="currentColor" style={{ fontFamily: '"Courier Prime", monospace' }}>
                {MONTHS[Number(m.label.slice(5, 7)) - 1]}
              </text>
              {(m.label.endsWith("-01") || i === 0) && (
                <text x={x} y={base + 25} fontSize="9.5" fontWeight="700" fill="currentColor" style={{ fontFamily: '"Courier Prime", monospace' }}>
                  {m.label.slice(0, 4)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </Figure>
  );
};
