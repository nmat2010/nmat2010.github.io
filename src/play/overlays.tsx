import { useCallback, useEffect, useRef, useState } from "react";
import { Check, FileDown, FileText, ScrollText, Swords, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { dishes } from "@/data/food";
import { aboutParagraphs, aboutStatement, awayParagraph, focusAreas } from "@/data/about";
import { tileBackground } from "@/components/shared/tilePattern";
import { ResumeDialog } from "@/components/shared/ResumeDialog";

/** Types text out one character at a time; call finish() to show it all */
const useTypewriter = (text: string, speed: number, restartKey: string) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const start = window.setTimeout(() => {
      const id = window.setInterval(() => setN((v) => (v >= text.length ? (window.clearInterval(id), v) : v + 1)), speed);
      cleanup = () => window.clearInterval(id);
    }, 250);
    let cleanup = () => undefined as void;
    return () => {
      window.clearTimeout(start);
      cleanup();
    };
  }, [text, speed, restartKey]);
  const finish = useCallback(() => setN(text.length), [text]);
  return { shown: text.slice(0, n), done: n >= text.length, finish };
};

type WinId = "about" | "background" | "sheet" | "quests" | "bin";

const ICONS: { id: WinId; label: string; Icon: typeof FileText }[] = [
  { id: "about", label: "about.txt", Icon: FileText },
  { id: "background", label: "background.txt", Icon: FileText },
  { id: "sheet", label: "character-sheet", Icon: ScrollText },
  { id: "quests", label: "side-quests.txt", Icon: Swords },
  { id: "bin", label: "recycle bin", Icon: Trash2 },
];

const TEXTS: Record<"about" | "background", string> = {
  about: aboutStatement,
  background: aboutParagraphs[0],
};

const TITLES: Record<WinId, string> = {
  about: "about.txt",
  background: "background.txt",
  sheet: "character-sheet",
  quests: "side-quests.txt",
  bin: "recycle bin",
};

const QUESTS = ["Cooking", "Lifting", "Swimming", "Guitar, acoustic and electric", "Music, all of it", "Dogs and cats, most of all"];

const TextWindow = ({ id }: { id: "about" | "background" }) => {
  const { shown, done, finish } = useTypewriter(TEXTS[id], 18, id);
  return (
    <p onClick={finish} className="whitespace-pre-wrap font-serif text-lg leading-snug sm:text-xl">
      {shown}
      <span className={`ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-[#2a2118] ${done ? "animate-pulse" : ""}`} />
    </p>
  );
};

const WindowBody = ({ id }: { id: WinId }) => {
  if (id === "about" || id === "background") return <TextWindow id={id} />;
  if (id === "sheet")
    return (
      <div className="space-y-4">
        <div className="flex items-baseline justify-between gap-4 border-b-2 border-[#2a2118] pb-2">
          <p className="font-display text-2xl font-bold uppercase tracking-wide">Thu Nguyen</p>
          <p className="text-sm font-semibold">Lv. junior</p>
        </div>
        <p className="text-sm">
          <b>Class:</b> Computer Engineering, Stony Brook University
        </p>
        <div>
          <p className="mb-1.5 font-display text-sm font-semibold uppercase tracking-widest">Skill tree</p>
          <ul className="space-y-2">
            {focusAreas.map((a, i) => (
              <li key={a.title} className="text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{a.title}</span>
                  <span className="text-xs text-[#6a5a3a]">unlocked</span>
                </div>
                <div className="mt-1 h-2.5 overflow-hidden rounded-sm border border-[#2a2118] bg-[#e2d6b4]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 0.25 + i * 0.25, duration: 0.9, ease: "easeOut" }}
                    className="h-full bg-[#990000]"
                  />
                </div>
                <p className="mt-1 text-xs text-[#4a3a20]">{a.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm">
          <b>Achievements:</b> several hackathon wins
        </p>
      </div>
    );
  if (id === "quests")
    return (
      <div>
        <p className="mb-3 font-display text-sm font-semibold uppercase tracking-widest">Side quests, all in progress</p>
        <ul className="space-y-2 font-serif text-lg">
          {QUESTS.map((q, i) => (
            <motion.li
              key={q}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}
              className="flex items-center gap-3"
            >
              <span className="grid h-5 w-5 place-items-center rounded-[3px] border-2 border-[#2a2118] bg-[#f6eed8]">
                <Check className="h-3.5 w-3.5 text-[#990000]" strokeWidth={3} aria-hidden="true" />
              </span>
              {q}
            </motion.li>
          ))}
        </ul>
      </div>
    );
  return (
    <div className="text-center">
      <Trash2 className="mx-auto h-10 w-10" aria-hidden="true" />
      <p className="mt-3 font-display text-xl font-semibold uppercase tracking-wide">0 items</p>
      <p className="mt-2 font-serif text-lg">Nothing in here. Bugs get fixed, not deleted.</p>
    </div>
  );
};

const bootLines = ["THU.OS 1.0", "checking coffee levels... ok", "loading side quests... ok", "waking the Seawolf... ok"];

/** The laptop screen taking over the whole view: a little retro desktop of Thu's, with files to open, a skill tree and a Seawolf who says hi */
export const LaptopScreen = ({ onClose }: { onClose: () => void }) => {
  const [boot, setBoot] = useState(0);
  const [open, setOpen] = useState<WinId[]>([]);
  const [now, setNow] = useState(() => new Date());
  const [resumeOpen, setResumeOpen] = useState(false);
  const area = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setBoot((b) => Math.min(100, b + 5)), 70);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (boot >= 100) {
      const t = window.setTimeout(() => setOpen((o) => (o.length ? o : ["about"])), 450);
      return () => window.clearTimeout(t);
    }
  }, [boot]);
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);

  const booted = boot >= 100;
  const raise = (id: WinId) => setOpen((o) => [...o.filter((x) => x !== id), id]);
  const closeWin = (id: WinId) => setOpen((o) => o.filter((x) => x !== id));

  return (
    <motion.div
      role="dialog"
      aria-label="Laptop: About"
      initial={{ clipPath: "inset(34% 30% 26% 30% round 14px)", opacity: 0.4 }}
      animate={{ clipPath: "inset(0% 0% 0% 0% round 0px)", opacity: 1 }}
      exit={{ clipPath: "inset(34% 30% 26% 30% round 14px)", opacity: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#1c2a26] text-[#2a2118]"
      style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
    >
      {/* menu bar */}
      <header className="relative z-30 flex items-center justify-between bg-[#f1e6cf] px-4 py-1.5 text-sm font-semibold shadow">
        <span className="font-display tracking-widest">THU.OS</span>
        <button onClick={onClose} className="rounded border-2 border-[#2a2118] bg-[#f6eed8] px-3 py-0.5 hover:bg-[#990000] hover:text-white">
          Close laptop<span className="hidden sm:inline"> (Esc)</span>
        </button>
      </header>

      {!booted ? (
        <div className="relative flex flex-1 flex-col items-center justify-center bg-black px-6 text-[#ffb347]" style={{ fontFamily: "'Courier Prime', monospace" }}>
          <div className="w-full max-w-md space-y-1 text-base sm:text-lg">
            {bootLines.map((l, i) => (
              <p key={l} className={boot > i * 22 ? "opacity-100" : "opacity-0"}>
                &gt; {l}
              </p>
            ))}
          </div>
          <div className="mt-6 h-4 w-full max-w-md border-2 border-[#ffb347] p-[2px]">
            <div className="h-full bg-[#ffb347]" style={{ width: `${boot}%` }} />
          </div>
        </div>
      ) : (
        <>
          {/* desktop with the old cement-tile wallpaper */}
          <div ref={area} className="relative flex-1 overflow-hidden bg-[#2f7a6d]">
            <div className="absolute inset-0 opacity-25" style={{ backgroundImage: tileBackground, backgroundSize: "120px 120px" }} aria-hidden="true" />

            <nav className="absolute left-3 top-3 z-10 grid max-h-[calc(100%-1.5rem)] gap-2 overflow-y-auto sm:left-5 sm:top-5">
              {ICONS.map(({ id, label, Icon }, i) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 16 }}
                  onClick={() => (open.includes(id) ? raise(id) : setOpen((o) => [...o, id]))}
                  className="group flex w-24 flex-col items-center gap-1 rounded p-1.5 text-center text-xs font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] hover:bg-white/15 sm:w-28 sm:text-sm"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-md border-2 border-[#2a2118] bg-[#f6eed8] text-[#2a2118] transition-transform group-hover:-translate-y-0.5 sm:h-12 sm:w-12">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  {label}
                </motion.button>
              ))}
              <button
                onClick={() => setResumeOpen(true)}
                className="flex w-24 flex-col items-center gap-1 rounded p-1.5 text-center text-xs font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)] hover:bg-white/15 sm:w-28 sm:text-sm"
              >
                <span className="grid h-11 w-11 place-items-center rounded-md border-2 border-[#2a2118] bg-[#f6eed8] text-[#2a2118] sm:h-12 sm:w-12">
                  <FileDown className="h-6 w-6" aria-hidden="true" />
                </span>
                resume.pdf
              </button>
            </nav>

            {open.map((id, i) => (
              <motion.div
                key={id}
                drag
                dragConstraints={area}
                dragMomentum={false}
                dragElastic={0}
                onPointerDown={() => raise(id)}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ zIndex: 10 + i, left: `calc(8.5rem + ${(i % 4) * 2.2}rem)`, top: `${1.2 + (i % 4) * 2.4}rem` }}
                className="absolute w-[min(calc(100vw-9.5rem),32rem)] max-sm:!left-[7rem] cursor-grab overflow-hidden rounded-md border-[3px] border-[#2a2118] bg-[#f1e6cf] shadow-[0_14px_26px_-10px_rgba(0,0,0,0.7)] active:cursor-grabbing"
              >
                <div className="flex items-center justify-between bg-[#1b4b9b] px-2.5 py-1 text-sm font-semibold text-white">
                  <span className="font-display tracking-wide">{TITLES[id]}</span>
                  <button
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => closeWin(id)}
                    aria-label={`Close ${TITLES[id]}`}
                    className="grid h-5 w-5 place-items-center rounded-sm border border-white/80 text-xs hover:bg-[#990000]"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
                <div className="max-h-[56vh] overflow-y-auto p-4 sm:p-5">
                  <WindowBody id={id} />
                </div>
              </motion.div>
            ))}

            {/* the Seawolf says hi */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="pointer-events-none absolute bottom-3 right-3 z-40 flex items-end gap-2"
            >
              <div className="relative mb-6 hidden max-w-[13rem] rounded-lg border-2 border-[#2a2118] bg-[#f6eed8] px-3 py-2 text-sm font-semibold sm:block">
                Hi! Click a file to get to know Thu.
                <span className="absolute -right-2 bottom-3 h-3 w-3 rotate-45 border-b-2 border-r-2 border-[#2a2118] bg-[#f6eed8]" />
              </div>
              <img src="/seawolves-logo.svg" alt="Stony Brook Seawolf" className="seawolf-bob h-16 w-auto drop-shadow-[0_3px_0_rgba(255,255,255,0.9)] sm:h-24" />
            </motion.div>
          </div>

          {resumeOpen && <ResumeDialog onClose={() => setResumeOpen(false)} />}

          {/* taskbar */}
          <footer className="relative z-30 flex items-center gap-2 bg-[#f1e6cf] px-3 py-1.5 text-sm font-semibold shadow-[0_-2px_0_#2a2118]">
            <span className="rounded border-2 border-[#2a2118] bg-[#990000] px-3 py-0.5 font-display uppercase tracking-widest text-white">Start</span>
            <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto">
              {open.map((id) => (
                <button key={id} onClick={() => raise(id)} className="shrink-0 rounded border-2 border-[#2a2118] bg-[#f6eed8] px-2.5 py-0.5 hover:bg-[#e8d9ae]">
                  {TITLES[id]}
                </button>
              ))}
            </div>
            <span className="shrink-0 tabular-nums">{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
          </footer>
        </>
      )}
    </motion.div>
  );
};

const RECIPE = [
  { t: "I cook," },
  { t: "lift and swim," },
  { t: "and play guitar, acoustic and electric." },
  { t: "I love music in general," },
  { t: "and dogs and cats even more." },
];

/** A school-notebook page that fills the screen and writes itself in handwriting, while the wok sizzles behind */
export const RecipePage = ({ onClose }: { onClose: () => void }) => {
  const full = RECIPE.map((r) => r.t).join("\n");
  const { shown, done, finish } = useTypewriter(full, 42, "recipe");
  const [openDish, setOpenDish] = useState<number | null>(null);
  void awayParagraph;
  return (
    <motion.div
      role="dialog"
      aria-label="Kitchen: away from the screen"
      initial={{ y: "100%", rotate: 3 }}
      animate={{ y: 0, rotate: -0.6 }}
      exit={{ y: "100%", rotate: 3 }}
      transition={{ type: "spring", stiffness: 60, damping: 16 }}
      className="fixed inset-x-3 bottom-3 top-14 z-50 overflow-hidden rounded-md shadow-2xl sm:inset-x-[8%] sm:top-12 sm:bottom-6"
      style={{
        background: "#f4ecd6",
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent 0 31px, rgba(60,110,170,0.35) 31px 32px), repeating-linear-gradient(to right, transparent 0 31px, rgba(60,110,170,0.22) 31px 32px)",
        fontFamily: "'Patrick Hand', 'Be Vietnam Pro', cursive",
      }}
      onClick={finish}
    >
      <div className="absolute inset-y-0 left-12 w-0.5 bg-[#c23b2e]/70 sm:left-24" />
      <div className="absolute left-3 top-0 flex h-full flex-col justify-around py-6 sm:left-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-4 w-4 rounded-full bg-[#3a2a1a]/70 shadow-inner" />
        ))}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute right-3 top-3 z-10 rounded bg-[#2a1d12] px-3 py-1.5 text-sm font-bold text-[#f4ecd6] hover:bg-[#a8392b]"
        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
      >
        Close<span className="hidden sm:inline"> notebook (Esc)</span>
      </button>
      <div className="relative h-full overflow-y-auto pl-16 pr-6 pt-14 sm:pl-36 sm:pr-16 sm:pt-8 text-[#1f2a44]">
        <p className="text-sm text-[#c23b2e] sm:text-lg" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          Name: Thu Nguyen &nbsp;·&nbsp; Subject: the kitchen
        </p>
        <h3 className="mt-6 text-4xl font-bold leading-tight sm:text-6xl" style={{ textDecoration: "underline wavy #c23b2e 2px", textUnderlineOffset: "8px" }}>
          Away from the screen
        </h3>
        <p className="mt-10 max-w-[28ch] whitespace-pre-wrap text-3xl leading-[32px] sm:text-5xl sm:leading-[64px]">
          {shown}
          <span className={`ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] bg-[#1f2a44] ${done ? "animate-pulse" : ""}`} />
        </p>

        {done && (
          <div className="pb-16">
            <h4 className="mt-14 text-3xl font-bold sm:text-5xl" style={{ textDecoration: "underline wavy #c23b2e 2px", textUnderlineOffset: "7px" }}>
              From my kitchen
            </h4>
            <p className="mt-3 text-xl text-[#1f2a44]/80 sm:text-2xl">Things I've cooked and baked. Tap a photo.</p>
            <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
              {dishes.map((d, i) => (
                <motion.li
                  key={d.file}
                  initial={{ opacity: 0, y: -40, rotate: 0, scale: 1.1 }}
                  animate={{ opacity: 1, y: 0, rotate: [-3.2, 2.4, -1.6, 3.1, -2.2, 1.4][i % 6], scale: 1 }}
                  transition={{ delay: i * 0.12, type: "spring", stiffness: 120, damping: 14 }}
                  className="relative"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDish(i);
                    }}
                    className="block w-full bg-white p-2 pb-9 text-left shadow-[0_10px_18px_-10px_rgba(40,25,10,0.6)] transition-transform duration-200 hover:-translate-y-1 hover:rotate-0"
                    aria-label={`Open photo: ${d.name}`}
                  >
                    <span className="absolute -top-3 left-1/2 h-5 w-14 -translate-x-1/2 rotate-[-4deg] bg-[#f4d98a]/80" aria-hidden="true" />
                    <img src={d.src} alt={d.name} loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
                    <span className="absolute inset-x-2 bottom-1.5 truncate text-center text-lg text-[#1f2a44] sm:text-xl">{d.name}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <AnimatePresence>
        {openDish !== null && (
          <motion.div
            key="dish"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#2a1d12]/85 p-4"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDish(null);
            }}
          >
            <img src={dishes[openDish].src} alt={dishes[openDish].name} className="max-h-[78%] max-w-full rounded-sm border-[10px] border-white object-contain shadow-2xl" />
            <p className="text-3xl text-[#f4ecd6] sm:text-4xl">{dishes[openDish].name}</p>
            <div className="flex gap-3" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDish((openDish + dishes.length - 1) % dishes.length);
                }}
                className="rounded bg-[#f4ecd6] px-3 py-1.5 text-sm font-bold text-[#2a1d12]"
              >
                Previous
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDish((openDish + 1) % dishes.length);
                }}
                className="rounded bg-[#f4ecd6] px-3 py-1.5 text-sm font-bold text-[#2a1d12]"
              >
                Next
              </button>
              <button onClick={() => setOpenDish(null)} className="rounded border border-[#f4ecd6] px-3 py-1.5 text-sm font-bold text-[#f4ecd6]">
                Close photo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

