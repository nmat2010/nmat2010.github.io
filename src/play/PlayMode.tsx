import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Volume2, VolumeX, House } from "lucide-react";
import { aboutStatement, focusAreas, researchInterests } from "@/data/about";
import { ExperienceBody } from "@/components/ExperienceSection";
import { projects } from "@/data/projects";
import { ContactBody } from "@/components/ContactSection";
import { bark, chime, meow, playBallad, playRiff, setMuted, stopMusic } from "./audio";
import { Fx, Goal, HOME_ITEMS, PLACES, Place, STREET_ITEMS } from "./World";
import { LaptopScreen, RecipePage } from "./overlays";

const World = lazy(() => import("./World"));

const BOOK_AREAS: Record<string, string> = {
  "Robotics & Vision-Language-Action models": "AI research",
  "AI interpretability": "AI research",
  "Lifelong learning systems": "AI research",
  "AI ethics & responsible AI": "Policy & governance",
  "Political philosophy & governance": "Policy & governance",
  "AI law & policy": "Policy & governance",
};

const KEYS: Record<string, [number, number]> = {
  KeyW: [0, -1],
  ArrowUp: [0, -1],
  KeyS: [0, 1],
  ArrowDown: [0, 1],
  KeyA: [-1, 0],
  ArrowLeft: [-1, 0],
  KeyD: [1, 0],
  ArrowRight: [1, 0],
};

type Note = { title: string; body: React.ReactNode } | null;

const CloseBtn = ({ onClick, label = "Close" }: { onClick: () => void; label?: string }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className="absolute right-3 top-3 z-10 rounded-md bg-card-foreground/90 p-1.5 text-card hover:bg-lantern"
  >
    <X className="h-4 w-4" />
  </button>
);

export default function PlayMode({ onExit, onHome }: { onExit: () => void; onHome: () => void }) {
  const input = useRef({ x: 0, z: 0 });
  const keys = useRef(new Set<string>());
  const stick = useRef({ x: 0, z: 0 });
  const goal = useRef<Goal | null>(null);
  const fx = useRef<Fx>({ meow: -9, bark: -9, strum: -9, riff: -9 });
  const cafeBegin = useRef(-1);
  const turn = useRef(0);
  const clock = useRef(performance.now());
  const nearRef = useRef<string | null>(null);

  const [place, setPlace] = useState<Place | null>(null);
  const [fade, setFade] = useState(false);
  const [near, setNear] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [muted, setMutedState] = useState(false);
  const [hint, setHint] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [touch, setTouch] = useState(false);
  const [ready, setReady] = useState(false);
  const [note, setNote] = useState<Note>(null);
  const [paper, setPaper] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [project, setProject] = useState(-1);
  const [book, setBook] = useState(-1);
  const [letter, setLetter] = useState(false);
  const [focus, setFocus] = useState<"laptop" | "kitchen" | null>(null);
  const [screen, setScreen] = useState<"laptop" | "kitchen" | null>(null);

  const overlay = !!note || paper || project >= 0 || book >= 0 || letter || !!screen || !!focus;

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    Promise.all([
      document.fonts.load("700 40px 'Oswald'"),
      document.fonts.load("400 40px 'Lobster'"),
      document.fonts.load("600 20px 'Be Vietnam Pro'"),
      document.fonts.load("700 20px 'Be Vietnam Pro'"),
    ])
      .catch(() => undefined)
      .then(() => setReady(true));
    return () => stopMusic();
  }, []);

  const say = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast((t) => (t === msg ? null : t)), 2200);
  }, []);

  const now = () => (performance.now() - clock.current) / 1000;
  const clearOverlays = () => {
    setNote(null);
    setPaper(false);
    setGreeting(false);
    setProject(-1);
    setBook(-1);
    setLetter(false);
    setScreen(null);
    setFocus(null);
  };

  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const go = useCallback((next: Place | null) => {
    setFade(true);
    window.setTimeout(() => {
      stopMusic();
      timers.current.splice(0).forEach((t) => window.clearTimeout(t));
      clearOverlays();
      cafeBegin.current = -1;
      setPlace(next);
      setNear(null);
      nearRef.current = null;
      if (next) {
        setVisited((v) => {
          if (v.has(next)) return v;
          chime();
          return new Set(v).add(next);
        });
      }
      window.setTimeout(() => setFade(false), 120);
      if (next === "gate") later(() => setLetter(true), 1300);
      if (next === "cafe") {
        later(() => setGreeting(true), 900);
        later(() => setPaper(true), 3600);
      }
    }, 380);
  }, []);

  const interact = useCallback(
    (id: string) => {
      setHint(false);
      const t = now();
      if (place === null) {
        const it = STREET_ITEMS.find((i) => i.id === id);
        if (it?.enter) return go(it.enter);
        if (id === "dog") {
          fx.current.bark = t;
          bark();
          say("Yip yip!");
        }
        return;
      }
      if (place === "home") {
        switch (id) {
          case "portrait":
            return setNote({ title: "About", body: <p className="font-display text-2xl md:text-3xl font-extrabold leading-tight">{aboutStatement}</p> });
          case "laptop":
            setFocus("laptop");
            later(() => setScreen("laptop"), 1700);
            return;
          case "kitchen":
            setFocus("kitchen");
            later(() => setScreen("kitchen"), 1500);
            return;
          case "shelf":
            return setNote({
              title: "On the shelf",
              body: (
                <dl>
                  {focusAreas.map((a) => (
                    <div key={a.title} className="border-b border-card-foreground/25 py-2.5">
                      <dt className="font-bold">{a.title}</dt>
                      <dd className="text-sm text-card-foreground/80">{a.description}</dd>
                    </div>
                  ))}
                </dl>
              ),
            });
          case "guitar": {
            const len = playBallad(() => (fx.current.strum = now()));
            say(len ? "Strumming an Andalusian ballad…" : "Unmute to hear the guitar.");
            return;
          }
          case "electric": {
            const len = playRiff(() => (fx.current.riff = now()));
            say(len ? "Plugged in. Turn it up." : "Unmute to hear the guitar.");
            return;
          }
          case "cat":
            fx.current.meow = t;
            meow();
            say("Meow.");
            return;
          case "door":
            return go(null);
        }
        return;
      }
      if (place === "workshop" && id.startsWith("project-")) return setProject(Number(id.slice(8)));
      if (place === "books" && id.startsWith("book-")) return setBook(Number(id.slice(5)));
      if (place === "gate" && id === "letter") return setLetter(true);
    },
    [go, place, say],
  );

  const onNear = useCallback((id: string | null) => {
    nearRef.current = id;
    setNear(id);
  }, []);

  const closeScreen = useCallback(() => {
    setScreen(null);
    later(() => setFocus(null), 450);
  }, []);

  const walkTo = (placeId: string) => {
    const pl = PLACES.find((p) => p.id === placeId)!;
    goal.current = { x: pl.pos[0], z: pl.pos[1], id: placeId };
    setHint(false);
  };

  // keyboard
  useEffect(() => {
    const recompute = () => {
      let x = stick.current.x;
      let z = stick.current.z;
      keys.current.forEach((k) => {
        const v = KEYS[k];
        if (v) {
          x += v[0];
          z += v[1];
        }
      });
      input.current.x = Math.max(-1, Math.min(1, x));
      input.current.z = Math.max(-1, Math.min(1, z));
    };
    const down = (e: KeyboardEvent) => {
      const back = e.code === "KeyS" || e.code === "ArrowDown";
      if (e.code === "Escape" || (back && (overlay || (place && place !== "home")))) {
        e.preventDefault();
        if (back && place && place !== "home") {
          go(null);
          return;
        }
        if (screen || focus) {
          closeScreen();
        } else if (overlay) {
          setNote(null);
          setPaper(false);
          setProject(-1);
          setBook(-1);
          setLetter(false);
        } else if (place) go(null);
        return;
      }
      if (overlay) return;
      if (place === "home" && (e.code === "ArrowLeft" || e.code === "ArrowRight")) {
        e.preventDefault();
        turn.current = e.code === "ArrowLeft" ? -1 : 1;
        return;
      }
      if (e.code in KEYS) {
        e.preventDefault();
        keys.current.add(e.code);
        setHint(false);
        recompute();
      } else if ((e.code === "KeyE" || e.code === "Enter" || e.code === "Space") && nearRef.current) {
        e.preventDefault();
        interact(nearRef.current);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "ArrowRight") turn.current = 0;
      keys.current.delete(e.code);
      recompute();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [interact, overlay, place, go, screen, focus, closeScreen]);

  useEffect(() => {
    if (overlay) {
      keys.current.clear();
      input.current = { x: 0, z: 0 };
    }
  }, [overlay]);

  // virtual joystick
  const base = useRef<HTMLDivElement>(null);
  const knob = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const r = base.current!.getBoundingClientRect();
    let dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    let dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const m = Math.hypot(dx, dy);
    if (m > 1) {
      dx /= m;
      dy /= m;
    }
    stick.current = { x: dx, z: dy };
    input.current = { x: dx, z: dy };
    if (knob.current) knob.current.style.transform = `translate(${dx * 34}px, ${dy * 34}px)`;
    setHint(false);
  };
  const release = () => {
    stick.current = { x: 0, z: 0 };
    input.current = { x: 0, z: 0 };
    if (knob.current) knob.current.style.transform = "translate(0,0)";
  };

  const items = place === "home" ? HOME_ITEMS : place === null ? STREET_ITEMS : [];
  const nearItem = items.find((i) => i.id === near);
  const walking = place === null || place === "home";
  const selected = place === "workshop" ? project : place === "books" ? book : -1;

  const sceneHint: Record<string, string> = {
    workshop: "Click a screen to open the project",
    books: "Click a book on the shelf to read it",
    gate: "Click the letter to open it",
  };

  return (
    <div className="fixed inset-0 z-40 bg-background select-none touch-none">
      <div className="absolute inset-0" style={{ filter: "sepia(0.16) saturate(0.95) contrast(1.02)" }}>
      {ready ? (
        <Suspense fallback={null}>
          <World
            place={place}
            input={input}
            goal={goal}
            paused={overlay || fade}
            visited={visited}
            onNear={onNear}
            onInteract={interact}
            fx={fx}
            selected={selected}
            letterOpen={letter}
            turn={turn}
            focus={focus}
            cafeBegin={cafeBegin}
          />
        </Suspense>
      ) : null}
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(70,45,20,0.28) 100%)" }} />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-5">
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5">
          {place ? (
            <button onClick={() => go(null)} className="rounded-md bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground hover:bg-lantern hover:text-white">
              ← Back to the alley
            </button>
          ) : (
            PLACES.map((p) => (
              <button
                key={p.id}
                onClick={() => walkTo(p.id)}
                title={`Walk to ${p.label}`}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition-colors ${
                  visited.has(p.id) ? "bg-tile text-white" : "bg-marigold text-[#1c1410] hover:bg-lantern hover:text-white"
                }`}
              >
                {p.label}
                <span className="ml-1 font-medium opacity-80">{p.sub}</span>
              </button>
            ))
          )}
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => {
              setMutedState(!muted);
              setMuted(!muted);
              if (!muted) stopMusic();
            }}
            className="rounded-md bg-secondary p-2 text-foreground hover:bg-muted"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onHome}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-secondary px-3 py-2 text-sm font-bold text-foreground hover:bg-muted"
          >
            <House className="h-4 w-4" aria-hidden="true" />
            Homepage
          </button>
          <button onClick={onExit} className="shrink-0 whitespace-nowrap rounded-md bg-secondary px-3.5 py-2 text-sm font-bold text-foreground hover:bg-muted">
            View mode
          </button>
        </div>
      </div>

      {place === "home" && !overlay && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full border-2 border-white/80" style={{ background: nearItem ? "hsl(var(--marigold))" : "transparent" }} />
      )}

      {/* prompts */}
      <div className="pointer-events-none absolute inset-x-0 bottom-28 sm:bottom-10 flex flex-col items-center gap-3 px-4">
        {toast && <div className="rounded-md bg-card px-3 py-1.5 text-sm font-semibold text-card-foreground">{toast}</div>}
        {place === "home" && !overlay && !nearItem && (
          <div className="rounded-md bg-secondary/90 px-4 py-2 text-center text-sm text-foreground">
            {touch ? "Drag the stick to walk, drag the room to look around" : "WASD to walk · drag or ←/→ to look · walk up to the laptop, the stove or the shelf"}
          </div>
        )}
        {hint && !nearItem && place === null && (
          <div className="rounded-md bg-secondary/90 px-4 py-2 text-center text-sm text-foreground">
            {touch ? "Drag the stick or tap the street to walk. Tap a yellow sign to go there." : "WASD or click the street to walk · walk up to a doorway to go in · or use the yellow signs"}
          </div>
        )}
        {place && !walking && !overlay && sceneHint[place] && (
          <div className="rounded-md bg-secondary/90 px-4 py-2 text-sm text-foreground">{sceneHint[place]}</div>
        )}
        {walking && nearItem && !overlay && (
          <button
            onClick={() => interact(nearItem.id)}
            className="pointer-events-auto rounded-md bg-card px-4 py-2.5 text-sm font-bold text-card-foreground shadow-lg ring-2 ring-marigold hover:bg-white"
          >
            <span className="mr-2 rounded bg-card-foreground px-1.5 py-0.5 text-xs text-card">{touch ? "Tap" : "E"}</span>
            {nearItem.label}
          </button>
        )}
      </div>

      {touch && walking && !overlay && (
        <div
          ref={base}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            move(e);
          }}
          onPointerMove={(e) => e.buttons && move(e)}
          onPointerUp={release}
          onPointerCancel={release}
          className="absolute bottom-6 left-6 h-28 w-28 rounded-full bg-secondary/70 ring-2 ring-border"
          aria-label="Walk"
        >
          <div ref={knob} className="absolute left-1/2 top-1/2 -ml-6 -mt-6 h-12 w-12 rounded-full bg-marigold/90" />
        </div>
      )}

      {/* the vendor speaks */}
      <AnimatePresence>
        {greeting && !paper && (
          <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center"><motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="board px-5 py-3 text-center"
          >
            <p className="font-display text-xl font-bold">Here's your iced milk coffee, dear!</p>
            <p className="text-xs text-card-foreground/70">Cà phê sữa đá của con nè!</p>
          </motion.div></div>
        )}
      </AnimatePresence>

      {/* home notes */}
      <AnimatePresence>
        {note && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center"><motion.div
            key="note"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            role="dialog"
            aria-label={note.title}
            className="board pointer-events-auto relative w-[min(92vw,38rem)] max-h-[60vh] overflow-y-auto p-6 pt-8 sm:p-8 sm:pt-10"
          >
            <CloseBtn onClick={() => setNote(null)} />
            <span className="plate mb-4 text-lg">{note.title}</span>
            <div className="mt-3">{note.body}</div>
          </motion.div></div>
        )}
      </AnimatePresence>

      {/* the newspaper you read over coffee */}
      <AnimatePresence>
        {paper && (
          <motion.div
            key="paper"
            initial={{ y: "110%", rotate: 4 }}
            animate={{ y: 0, rotate: -1.2 }}
            exit={{ y: "110%", rotate: 4 }}
            transition={{ type: "spring", stiffness: 70, damping: 16 }}
            role="dialog"
            aria-label="Experience, in the newspaper"
            className="vintage-paper absolute inset-x-2 bottom-2 top-[34%] overflow-y-auto rounded-[2px] p-5 shadow-2xl sm:inset-x-auto sm:left-[3%] sm:top-[9%] sm:w-[58%] sm:p-9"
            style={{ transformOrigin: "50% 100%" }}
          >
            <CloseBtn onClick={() => setPaper(false)} label="Put the paper down" />
            <div className="flex items-end justify-between gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.16em] sm:text-xs">
              <span className="border border-[#2a2118] px-2 py-1">Special edition</span>
              <span className="hidden sm:inline">Saigon · Alley No. 1</span>
              <span className="border border-[#2a2118] px-2 py-1">Price: one coffee</span>
            </div>
            <div className="mt-2 border-y-[4px] border-double border-[#2a2118] py-1 text-center">
              <p className="font-display text-[2.4rem] font-bold uppercase leading-none tracking-[0.1em] sm:text-[3.9rem]">The Alley Times</p>
            </div>
            <div className="flex items-center justify-between border-b border-[#2a2118] py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] sm:text-xs">
              <span>★ Experience news ★</span>
              <span>Báo Hẻm · read over coffee</span>
              <span>★ Experience news ★</span>
            </div>
            <div className="mt-5">
              <ExperienceBody />
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#2a2118] pt-3 text-[0.65rem] uppercase tracking-[0.18em]">
              <span>Printed in Saigon</span>
              <button onClick={() => setPaper(false)} className="rounded-sm bg-[#2a2118] px-3 py-1.5 text-sm font-bold normal-case tracking-normal text-[#e8d9ae] hover:bg-lantern hover:text-white">
                Put the paper down
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* a project, on the monitor */}
      <AnimatePresence>
        {project >= 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3">
          <motion.div
            key="project"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            role="dialog"
            aria-label={projects[project].title}
            className="pointer-events-auto relative max-h-[86vh] w-[min(94vw,46rem)] overflow-y-auto rounded-xl border-[10px] border-[#14111a] bg-[#0f1226] p-5 text-[#f4ecd6] shadow-2xl sm:p-7"
          >
            <button onClick={() => setProject(-1)} aria-label="Close" className="absolute right-3 top-3 z-10 rounded-md bg-[#2a2e4a] p-1.5 text-[#f4ecd6] hover:bg-lantern">
              <X className="h-4 w-4" />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-md bg-black">
              <iframe
                key={projects[project].video}
                title={`${projects[project].title} demo video`}
                src={`https://www.youtube-nocookie.com/embed/${projects[project].video}?autoplay=1&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
            <p className="mt-4 text-sm font-semibold text-[#d9cfae]">{projects[project].subtitle}</p>
            <h3 className="font-display text-4xl font-bold tracking-tight text-[#f4b73f] sm:text-5xl">{projects[project].title}</h3>
            <p className="mt-3 font-serif text-xl leading-relaxed text-[#f7f0dc]">{projects[project].description}</p>
            <p className="mt-3 text-sm text-[#d9cfae]">
              {projects[project].language}. {projects[project].tech.join(", ")}.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-6 text-sm font-semibold">
              <a href={projects[project].github} target="_blank" rel="noopener noreferrer" className="link-ink [text-decoration-color:currentColor] text-[#f4ecd6] hover:text-[#f4b73f]">
                GitHub
              </a>
              <a href={projects[project].devpost} target="_blank" rel="noopener noreferrer" className="link-ink [text-decoration-color:currentColor] text-[#f4ecd6] hover:text-[#f4b73f]">
                Devpost
              </a>
              <a href={`https://www.youtube.com/watch?v=${projects[project].video}`} target="_blank" rel="noopener noreferrer" className="link-ink [text-decoration-color:currentColor] text-[#f4ecd6] hover:text-[#f4b73f]">
                Watch on YouTube
              </a>
              <span className="ml-auto flex gap-2">
                {projects.map((p, i) => (
                  <button
                    key={p.title}
                    onClick={() => setProject(i)}
                    className={`rounded px-2.5 py-1 text-xs font-bold ${i === project ? "bg-[#f4b73f] text-[#1c1410]" : "bg-[#2a2e4a] text-[#f4ecd6] hover:bg-[#3a3f66]"}`}
                  >
                    {p.title}
                  </button>
                ))}
              </span>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* a book from the shelf */}
      <AnimatePresence>
        {book >= 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3">
          <motion.div
            key="book"
            initial={{ opacity: 0, rotateX: 30, y: 40 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            role="dialog"
            aria-label={researchInterests[book]}
            className="board pointer-events-auto relative grid w-[min(94vw,46rem)] gap-0 overflow-hidden p-0 sm:grid-cols-2"
          >
            <CloseBtn onClick={() => setBook(-1)} />
            <div className="flex min-h-[12rem] items-center border-b border-card-foreground/20 p-7 sm:border-b-0 sm:border-r">
              <h3 className="font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{researchInterests[book]}</h3>
            </div>
            <div className="p-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-lantern">{BOOK_AREAS[researchInterests[book]]}</p>
              <p className="mt-3 font-serif text-xl leading-relaxed">
                {focusAreas.find((f) => f.title === BOOK_AREAS[researchInterests[book]])?.description}
              </p>
              <div className="mt-6 flex gap-2">
                <button disabled={book === 0} onClick={() => setBook(book - 1)} className="rounded-md bg-card-foreground px-3 py-1.5 text-sm font-bold text-card disabled:opacity-30">
                  Previous
                </button>
                <button disabled={book === researchInterests.length - 1} onClick={() => setBook(book + 1)} className="rounded-md bg-card-foreground px-3 py-1.5 text-sm font-bold text-card disabled:opacity-30">
                  Next
                </button>
              </div>
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* the letter */}
      <AnimatePresence>
        {letter && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3">
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 60, rotate: 3 }}
            animate={{ opacity: 1, y: 0, rotate: -0.8 }}
            exit={{ opacity: 0, y: 60 }}
            role="dialog"
            aria-label="Contact"
            className="pointer-events-auto relative max-h-[88vh] w-[min(94vw,40rem)] overflow-y-auto bg-[#f3ead7] p-7 text-card-foreground shadow-2xl sm:p-10"
            style={{
              border: "12px solid transparent",
              borderImage: "repeating-linear-gradient(135deg, #d8342b 0 14px, #f3ead7 14px 24px, #1b4b9b 24px 38px, #f3ead7 38px 48px) 12",
            }}
          >
            <CloseBtn onClick={() => setLetter(false)} />
            <div>
              <ContactBody />
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>{screen === "laptop" && <LaptopScreen key="laptop" onClose={closeScreen} />}</AnimatePresence>
      <AnimatePresence>{screen === "kitchen" && <RecipePage key="recipe" onClose={closeScreen} />}</AnimatePresence>

      {/* scene change */}
      <div className={`pointer-events-none absolute inset-0 bg-[#f2e6c9] transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
