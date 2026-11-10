import { motion } from "framer-motion";
import { PLACES } from "./World";

const KEY = "alley-guide-seen";

/** Whether this browser has already been welcomed. Storage can be blocked, so a failure counts as "not yet". */
export const guideSeen = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

export const rememberGuide = () => {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    /* private window: the card just shows again next time */
  }
};

/** A first-visit welcome: what this place is, how to move, and which door holds what. Also what the "?" button shows. */
export const Guide = ({ touch, onStart, onView }: { touch: boolean; onStart: () => void; onView: () => void }) => {
  const steps: [string, string][] = [
    ["Walk", touch ? "Drag the stick on the right, or tap the street." : "WASD or the arrow keys, or click the street."],
    ["Go in", "Walk up to a door, or use the yellow signs at the top."],
    ["Do things", touch ? "When a button appears at the bottom, tap it." : "When a prompt appears, press E or click it."],
  ];
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto bg-[#2a1c0e]/55 p-3">
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28 }}
        className="board my-auto w-[min(100%,30rem)] p-5 sm:p-7"
      >
        <span className="plate mb-3 text-sm">Welcome</span>
        <h2 id="guide-title" className="font-display text-3xl font-extrabold leading-tight">
          My little Saigon alley
        </h2>
        <p className="mt-1 font-serif text-lg leading-snug text-card-foreground/85">
          A tiny walkable version of my portfolio. Every door opens a part of it.
        </p>

        <ol className="mt-5 space-y-2.5">
          {steps.map(([title, text], i) => (
            <li key={title} className="flex items-baseline gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lantern text-xs font-bold text-white">{i + 1}</span>
              <span className="text-sm leading-snug">
                <b className="font-display text-base">{title}.</b> {text}
              </span>
            </li>
          ))}
        </ol>

        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 border-t border-card-foreground/25 pt-4 text-sm">
          {PLACES.map((p) => (
            <div key={p.id} className="contents">
              <dt className="font-bold">{p.label}</dt>
              <dd className="text-card-foreground/80">{p.sub}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            autoFocus
            onClick={onStart}
            className="rounded-md bg-card-foreground px-5 py-2.5 text-sm font-bold text-card hover:bg-lantern"
          >
            Start exploring
          </button>
          <button onClick={onView} className="text-sm font-semibold underline decoration-lantern decoration-2 underline-offset-4 hover:text-lantern">
            Prefer a plain page? View mode
          </button>
        </div>
        <p className="mt-4 text-xs text-card-foreground/70">The ? button at the top brings this back any time.</p>
      </motion.div>
    </div>
  );
};
