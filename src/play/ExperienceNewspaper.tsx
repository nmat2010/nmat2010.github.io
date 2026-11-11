import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject, type TouchEvent } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { experiences, isCategorised, type Experience, type ExperienceCategory } from "@/data/experience";
import { LogoPlate, StatStrip } from "@/components/shared/ExperienceGraphics";

type Page = { label: string; exp: Experience; kind: "story" | "highlights" | "details" };

/** One page per idea: the story, then (for a role with a long record) its highlights and its details. */
const pages: Page[] = experiences.flatMap((exp, i): Page[] => [
  { label: i === 0 ? "Front page" : exp.company, exp, kind: "story" },
  ...(exp.tldr ? [{ label: "Highlights", exp, kind: "highlights" as const }] : []),
  ...(isCategorised(exp.highlights) ? [{ label: "The details", exp, kind: "details" as const }] : []),
]);

/** The alley's own colours, printed as three spot inks on cream newsprint. */
const RED = "#c8402b";
const BLUE = "#1f4e8c";
const TEAL = "#20766a";
const GOLD = "#e9b43a";
const CREAM = "#f6ebcf";

/** One dominant ink per page, with a second ink for the off-register shadow and a faint tint over the sheet. */
const themeOf = (page: Page, at: number) => {
  if (page.kind === "highlights") return { ink: BLUE, ink2: "rgba(200,64,43,0.5)", tint: "rgba(31,78,140,0.07)" };
  if (page.kind === "details") return { ink: TEAL, ink2: "rgba(200,64,43,0.4)", tint: "rgba(32,118,106,0.09)" };
  if (at === 0) return { ink: RED, ink2: "rgba(31,78,140,0.5)", tint: "transparent" };
  return { ink: RED, ink2: "rgba(31,78,140,0.5)", tint: "rgba(233,180,58,0.16)" };
};

const Masthead = () => (
  <header className="mb-4 sm:mb-6">
    <div className="hidden items-end justify-between gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] sm:flex sm:text-xs">
      <span className="border px-2 py-1" style={{ borderColor: BLUE, color: BLUE }}>
        Special edition
      </span>
      <span className="hidden sm:inline">Saigon · Alley No. 1</span>
      <span className="border px-2 py-1" style={{ borderColor: BLUE, color: BLUE }}>
        Price: one coffee
      </span>
    </div>
    <div className="px-3 py-1.5 text-center sm:mt-2" style={{ background: RED }}>
      <p
        className="font-display text-[clamp(1.7rem,9.5cqw,3.9rem)] font-bold uppercase leading-none tracking-[0.06em]"
        style={{ color: CREAM, textShadow: `2px 1.5px 0 ${BLUE}` }}
      >
        The Alley Times
      </p>
    </div>
    <div
      className="flex items-center justify-center px-3 py-1 text-center text-[0.6rem] font-semibold uppercase tracking-[0.14em] sm:text-[0.68rem]"
      style={{ background: BLUE, color: CREAM, textShadow: "none" }}
    >
      <span>Experience news · Báo Hẻm · read over coffee</span>
    </div>
    <div className="h-1.5" style={{ background: `repeating-linear-gradient(90deg, ${RED} 0 14px, ${CREAM} 14px 28px, ${BLUE} 28px 42px)` }} />
  </header>
);

/** A date, struck in red like a rubber stamp. */
const DateStamp = ({ children }: { children: string }) => (
  <span
    className="inline-block -rotate-3 border-2 px-2 py-0.5 font-display text-xs font-bold uppercase tracking-[0.14em]"
    style={{ borderColor: RED, color: RED, textShadow: "none" }}
  >
    {children}
  </span>
);

const Story = ({ exp, first }: { exp: Experience; first: boolean }) => (
  <article>
    {first && <Masthead />}
    {!first && (
      <div
        className="mb-4 h-2"
        style={{ background: `repeating-linear-gradient(135deg, ${RED} 0 10px, ${CREAM} 10px 20px, ${BLUE} 20px 30px, ${CREAM} 30px 40px)` }}
      />
    )}
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <DateStamp>{exp.period}</DateStamp>
      <span className="np-dateline text-sm">{exp.location}</span>
      {exp.localTitle && (
        <span className="np-dateline ml-auto text-xs tracking-[0.16em]" style={{ color: BLUE }}>
          Tin từ Sài Gòn
        </span>
      )}
    </div>
    <div className="np-story mt-3 grid gap-x-6 gap-y-5">
      <div>
        {exp.localTitle && (
          <p className="font-display text-sm font-bold uppercase tracking-[0.14em] sm:text-base" style={{ color: BLUE, textShadow: "none" }}>
            {exp.localTitle}
          </p>
        )}
        <h2 className="np-headline">{exp.title}</h2>
        <p className="np-deck mt-1">{exp.company}</p>
        <p className="np-body np-dropcap mt-4 font-serif text-lg leading-snug">{exp.description}</p>
      </div>
      <div className="np-story-plate">
        <LogoPlate src={exp.logo} caption={exp.logoCaption} />
      </div>
    </div>
    {exp.stats && <StatStrip stats={exp.stats} />}
    {!isCategorised(exp.highlights) && (
      <section className="mt-6">
        <h3 className="np-subhead mb-3 border-b-2 pb-1 font-semibold" style={{ borderColor: "var(--ink)" }}>
          Key highlights
        </h3>
        <NumberedList items={exp.highlights} />
      </section>
    )}
  </article>
);

/** "Shipped CI/CD: automated deploys…" reads as a bold lead-in, then the sentence. */
const splitLead = (item: string): [string | null, string] => {
  const at = item.indexOf(": ");
  if (at < 8 || at > 60) return [null, item];
  const rest = item.slice(at + 2);
  return [item.slice(0, at), rest.charAt(0).toUpperCase() + rest.slice(1)];
};

const NumberedList = ({ items }: { items: string[] }) => (
  <ol className="space-y-4">
    {items.map((item, i) => {
      const [lead, rest] = splitLead(item);
      return (
        <li key={i} className="grid grid-cols-[2rem_1fr] items-start gap-3 border-b border-[#2a2118]/20 pb-4 last:border-b-0">
          <span
            className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full font-display text-lg font-bold leading-none"
            style={{ background: RED, color: CREAM, textShadow: "none" }}
          >
            {i + 1}
          </span>
          <span className="font-serif text-lg leading-snug sm:text-xl">
            {lead && (
              <b className="mb-0.5 block font-display text-sm font-semibold uppercase tracking-[0.08em] sm:text-base" style={{ color: "var(--ink)", textShadow: "none" }}>
                {lead}
              </b>
            )}
            {rest}
          </span>
        </li>
      );
    })}
  </ol>
);

const Highlights = ({ exp }: { exp: Experience }) => (
  <article>
    <p className="np-dateline text-sm">{exp.company}</p>
    <h2 className="np-headline mt-1 mb-6">Key highlights</h2>
    {exp.pullQuote && (
      <blockquote className="relative mb-7 border-y-2 py-5" style={{ borderColor: "var(--ink)" }}>
        <span
          className="absolute -top-3 left-0 -rotate-2 px-2 py-0.5 font-display text-xs font-bold uppercase tracking-[0.18em]"
          style={{ background: RED, color: CREAM, textShadow: "none" }}
        >
          Breaking
        </span>
        <p className="font-serif text-2xl font-medium italic leading-snug sm:text-[1.7rem]" style={{ color: "var(--ink)", textShadow: "none" }}>
          {exp.pullQuote}
        </p>
      </blockquote>
    )}
    <NumberedList items={exp.tldr ?? []} />
  </article>
);

const AD_INKS = [RED, BLUE, TEAL, "#b9861a"];

/** The long record as a page of classified ads, one open at a time so the page stays calm. */
const Details = ({ sections }: { sections: ExperienceCategory[] }) => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <article>
      <p className="np-dateline text-sm">Everything else, in full</p>
      <h2 className="np-headline mt-1 mb-5">Classifieds</h2>
      <div className="space-y-3">
        {sections.map((section, i) => {
          const ink = AD_INKS[i % AD_INKS.length];
          return (
            <div key={section.category} className="border-2 border-dashed" style={{ borderColor: ink, background: open === i ? "rgba(246,235,207,0.6)" : undefined }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 px-3 py-2.5 text-left transition-colors hover:bg-[#f6ebcf]/60"
              >
                <span>
                  <span className="block font-display text-[0.65rem] font-semibold uppercase tracking-[0.2em]" style={{ color: ink, textShadow: "none" }}>
                    Ad no. {i + 1}
                  </span>
                  <span className="np-subhead block font-semibold">{section.category}</span>
                </span>
                <Plus className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open === i ? "rotate-45" : ""}`} style={{ color: ink }} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 px-3 pb-4">
                      {section.items.map((item, j) => (
                        <div key={j}>
                          {item.subtitle && <h5 className="np-subhead mb-1.5 text-sm font-semibold">{item.subtitle}</h5>}
                          <ul className="np-copy list-disc space-y-1.5 pl-5 text-sm text-card-foreground/80">
                            {item.points.map((point, k) => (
                              <li key={k} className="leading-relaxed marker:text-[color:var(--ad)]" style={{ ["--ad" as string]: ink }}>
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
    </article>
  );
};

/** One printed page: a running head, then the page itself in a scroller. `side` is set when it sits in a two-page spread. */
const PageSheet = ({
  at,
  side,
  scrollTop = 0,
  scrollRef,
}: {
  at: number;
  side?: "left" | "right";
  scrollTop?: number;
  scrollRef?: RefObject<HTMLDivElement>;
}) => {
  const page = pages[at];
  const own = useRef<HTMLDivElement>(null);
  const el = scrollRef ?? own;
  useLayoutEffect(() => {
    if (el.current) el.current.scrollTop = scrollTop;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!page) return <div className="h-full" />;

  const theme = themeOf(page, at);
  return (
    <div
      className={`flex h-full min-h-0 flex-col pt-3 [container-type:inline-size] sm:pt-7 ${side ? "px-5 sm:px-7" : "px-4 sm:px-9"}`}
      style={{ "--ink": theme.ink, "--ink2": theme.ink2, background: theme.tint } as CSSProperties}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b-[3px] border-double pb-1 text-[0.62rem] font-semibold uppercase tracking-[0.16em] sm:text-xs ${side === "left" ? "" : "pr-9"}`}
        style={{ borderColor: theme.ink }}
      >
        <span>{side === "right" ? `Page ${at + 1}` : "The Alley Times"}</span>
        <span>{side === "left" ? `Page ${at + 1}` : side === "right" ? "The Alley Times" : `Page ${at + 1} of ${pages.length}`}</span>
      </div>
      <div ref={el} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-4 pr-1 pt-4 sm:pt-5">
        {page.kind === "story" && <Story exp={page.exp} first={at === 0} />}
        {page.kind === "highlights" && <Highlights exp={page.exp} />}
        {page.kind === "details" && isCategorised(page.exp.highlights) && <Details sections={page.exp.highlights} />}
      </div>
    </div>
  );
};

/** true when the viewport is wide enough to open the paper flat, as two pages */
const useSpread = () => {
  const query = "(min-width: 900px)";
  const [on, setOn] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setOn(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return on;
};

type Turn = { from: number; to: number; dir: 1 | -1 };

/**
 * One sheet in the air. In a spread it is the outgoing half, pivoting on the spine: the right page swings left (dir 1)
 * or the left page swings right (dir -1), and its back is the first page of the next spread. On a phone it is the whole
 * page, hinged on its left edge, with a blank back. `front` is what you see until it passes edge-on.
 */
const Leaf = ({
  dir,
  spread,
  front,
  back,
  onDone,
  calm,
}: {
  dir: 1 | -1;
  spread: boolean;
  front: ReactNode;
  back?: ReactNode;
  onDone: () => void;
  calm: boolean;
}) => {
  /** how far the sheet has swung, 0 = lying flat, 1 = turned all the way over */
  const prog = useMotionValue(spread || dir > 0 ? 0 : 1);
  const sign = spread && dir < 0 ? 1 : -1;
  const rotateY = useTransform(prog, (v) => sign * 180 * v);
  const fades = useTransform(prog, [0, 0.67, 0.83, 1], [1, 1, 0, 0]);
  const frontOpacity = useTransform(prog, (v) => (v < 0.5 ? 1 : 0));
  const backOpacity = useTransform(prog, (v) => (v < 0.5 ? 0 : 1));
  const frontShade = useTransform(prog, [0, 0.5], [0, 0.45]);
  const backShade = useTransform(prog, [0.5, 1], [0.4, 0]);
  const cast = useTransform(prog, [0, 0.4, 0.8, 1], [0, 0.55, 0.25, 0]);

  useLayoutEffect(() => {
    const run = animate(prog, spread || dir > 0 ? 1 : 0, { duration: calm ? 0.01 : 0.95, ease: [0.4, 0.05, 0.25, 1], onComplete: onDone });
    return () => run.stop();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** which side of the spine the sheet starts on */
  const right = !spread || dir > 0;
  const half = spread ? (right ? "right-0 w-1/2" : "left-0 w-1/2") : "inset-0";
  const castHalf = spread ? (right ? "left-0 w-1/2" : "right-0 w-1/2") : "inset-0";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0" style={{ perspective: 2200 }}>
      <motion.div
        className={`absolute inset-y-0 ${castHalf}`}
        style={{
          opacity: cast,
          background: `linear-gradient(${right ? 90 : 270}deg, rgba(40,25,10,0.6), rgba(40,25,10,0.18) 35%, transparent 70%)`,
        }}
      />
      <motion.div
        className={`vintage-paper newsprint absolute inset-y-0 ${half}`}
        style={{
          rotateY,
          opacity: spread ? 1 : fades,
          transformOrigin: right ? "0% 50%" : "100% 50%",
          boxShadow: "0 0 24px rgba(40,25,10,0.35)",
        }}
      >
        <motion.div className="absolute inset-0" style={{ opacity: frontOpacity }}>
          {front}
          <motion.div
            className="absolute inset-0"
            style={{ opacity: frontShade, background: `linear-gradient(${right ? 90 : 270}deg, transparent 20%, rgba(40,25,10,0.8))` }}
          />
        </motion.div>
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: backOpacity,
            background: back
              ? undefined
              : "repeating-linear-gradient(0deg, transparent 0 15px, rgba(42,33,24,0.1) 15px 16px), linear-gradient(90deg, #cdb98a, #dccb9c 40%, #d2bf90)",
          }}
        >
          {/* the back of a turning sheet is seen mirrored, so print it mirrored */}
          {back && <div className="absolute inset-0 [transform:scaleX(-1)]">{back}</div>}
          <motion.div className="absolute inset-0" style={{ opacity: backShade, background: "rgba(40,25,10,0.85)" }} />
        </motion.div>
      </motion.div>
    </div>
  );
};

/**
 * Experience as a small newspaper. Wide screens open it flat as a two-page spread; phones read one page at a time.
 * Pages turn like real sheets over the spine: with the buttons, the arrow keys, a swipe, or the page tabs.
 * `onTurn` lets the host play a paper sound, `onClose` ends the last page with "Put the paper down".
 */
export const ExperienceNewspaper = ({ onTurn, onClose }: { onTurn?: () => void; onClose?: () => void }) => {
  const calm = !!useReducedMotion();
  const spread = useSpread();
  const [at, setAt] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const scrollL = useRef<HTMLDivElement>(null);
  const scrollR = useRef<HTMLDivElement>(null);
  const kept = useRef({ l: 0, r: 0 });

  const step = spread ? 2 : 1;
  /** the left page of the open spread, or the page itself on a phone */
  const L = spread ? at - (at % 2) : at;
  const last = L + step >= pages.length;

  const go = (target: number) => {
    const next = spread ? target - (target % 2) : target;
    if (turn || next === L || next < 0 || next >= pages.length) return;
    onTurn?.();
    kept.current = { l: scrollL.current?.scrollTop ?? 0, r: scrollR.current?.scrollTop ?? 0 };
    if (calm) return setAt(next);
    setTurn({ from: L, to: next, dir: next > L ? 1 : -1 });
  };
  const finish = () => {
    if (!turn) return;
    setAt(turn.to);
    setTurn(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(L + step);
      if (e.key === "ArrowLeft") go(L - step);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onTouchEnd = (e: TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 2) return;
    go(dx < 0 ? L + step : L - step);
  };

  /** what lies beneath the turning sheet: in a spread, the pages that stay put and the pages being uncovered */
  const showL = turn ? (turn.dir > 0 ? L : turn.to) : L;
  const showR = turn ? (turn.dir > 0 ? turn.to + 1 : L + 1) : L + 1;

  let leaf: { front: ReactNode; back?: ReactNode } | null = null;
  if (turn && spread) {
    leaf =
      turn.dir > 0
        ? { front: <PageSheet at={L + 1} side="right" scrollTop={kept.current.r} />, back: <PageSheet at={turn.to} side="left" /> }
        : { front: <PageSheet at={L} side="left" scrollTop={kept.current.l} />, back: <PageSheet at={turn.to + 1} side="right" /> };
  } else if (turn) {
    leaf = turn.dir > 0 ? { front: <PageSheet at={turn.from} scrollTop={kept.current.l} /> } : { front: <PageSheet at={turn.to} /> };
  }
  const single = turn ? (turn.dir > 0 ? turn.to : turn.from) : L;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className="relative min-h-0 flex-1"
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchEnd={onTouchEnd}
      >
        {spread ? (
          <>
            <div className="absolute inset-y-0 left-0 w-1/2">
              <PageSheet key={showL} at={showL} side="left" scrollRef={turn ? undefined : scrollL} scrollTop={turn && turn.dir > 0 ? kept.current.l : 0} />
            </div>
            <div className="absolute inset-y-0 right-0 w-1/2">
              <PageSheet key={showR} at={showR} side="right" scrollRef={turn ? undefined : scrollR} scrollTop={turn && turn.dir < 0 ? kept.current.r : 0} />
            </div>
            {/* the gutter where the sheets fold */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 w-12 -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(60,38,14,0.1) 40%, rgba(60,38,14,0.26) 50%, rgba(255,245,215,0.18) 52%, transparent)",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0">
            <PageSheet key={single} at={single} scrollRef={turn ? undefined : scrollL} scrollTop={turn && turn.dir < 0 ? kept.current.l : 0} />
          </div>
        )}
        {turn && leaf && <Leaf key={`${turn.from}-${turn.to}`} dir={turn.dir} spread={spread} front={leaf.front} back={leaf.back} onDone={finish} calm={calm} />}
      </div>

      <nav aria-label="Pages" className="flex items-center gap-2 border-t border-[#2a2118] px-4 pb-3 pt-2 sm:px-9 sm:pb-7 sm:pt-3">
        <button
          onClick={() => go(L - step)}
          disabled={L === 0}
          aria-label="Previous page"
          className="rounded-sm border border-[#2a2118] p-1.5 hover:bg-[#2a2118] hover:text-[#e8d9ae] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-inherit"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <ol className="hidden min-w-0 flex-1 justify-center gap-1 sm:flex">
          {pages.map((p, i) => {
            const here = spread ? i === L || i === L + 1 : i === L;
            return (
              <li key={i}>
                <button
                  onClick={() => go(i)}
                  aria-current={here ? "page" : undefined}
                  className={`whitespace-nowrap px-2 py-1 font-display text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                    here ? "border-b-2 border-lantern text-lantern" : "text-[#2a2118]/85 hover:text-[#2a2118]"
                  }`}
                >
                  {p.label}
                </button>
              </li>
            );
          })}
        </ol>
        <span className="min-w-0 flex-1 truncate text-center font-display text-xs font-semibold uppercase tracking-[0.1em] sm:hidden">{pages[L].label}</span>
        <button
          onClick={() => (last ? (onClose ? onClose() : go(0)) : go(L + step))}
          className="flex items-center gap-1.5 rounded-sm bg-[#2a2118] px-3 py-1.5 text-sm font-bold text-[#e8d9ae] hover:bg-lantern hover:text-white"
        >
          {last ? (onClose ? "Put the paper down" : "Back to page 1") : "Turn the page"}
          {!last && <ArrowRight className="h-4 w-4" />}
        </button>
      </nav>
    </div>
  );
};
