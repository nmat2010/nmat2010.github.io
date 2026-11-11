import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Volume2, VolumeX, House, CircleHelp } from "lucide-react";
import { aboutStatement, bookshelf, focusAreas } from "@/data/about";
import { radioSong } from "@/data/music";
import { ExperienceNewspaper } from "@/components/ExperienceNewspaper";
import { projects } from "@/data/projects";
import { ContactBody } from "@/components/ContactSection";
import { bark, chime, meow, paperTurn, setMuted } from "./audio";
import { Fx, Goal, HOME_ITEMS, PLACES, Place, STREET_ITEMS } from "./World";
import { Guide, guideSeen, rememberGuide } from "./Guide";
import { LaptopScreen, RecipePage } from "./overlays";

const World = lazy(() => import("./World"));

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
  const [radio, setRadio] = useState(false);
  const radioRef = useRef(false);
  const mutedRef = useRef(false);
  const [hint, setHint] = useState(true);
  const [guide, setGuide] = useState(() => !guideSeen());
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

  useEffect(() => {
    radioRef.current = radio;
  }, [radio]);

  const overlay = guide || !!note || paper || project >= 0 || book >= 0 || letter || !!screen || !!focus;

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
      window.setTimeout(() => setFade(false), 450); // hold the cover while the new scene mounts and its models load
      if (next === "cafe") {
        later(() => setGreeting(true), 900);
      }
    }, 420);
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
          say("Cậu Vàng says: woof woof!");
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
          case "radio": {
            if (mutedRef.current) return say("Unmute to hear the radio.");
            setRadio(!radioRef.current);
            say(radioRef.current ? "Radio off." : "Radio on: Diễm Xưa, Khánh Ly.");
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
      if (place === "cafe" && id === "paper") {
        setGreeting(false);
        return setPaper(true);
      }
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

  const closeGuide = useCallback(() => {
    rememberGuide();
    setGuide(false);
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
          closeGuide();
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
  }, [interact, overlay, place, go, screen, focus, closeScreen, closeGuide]);

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
    if (knob.current) knob.current.style.transform = `translate(${dx * 40}px, ${dy * 40}px)`;
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
  const nextStop = PLACES.find((p) => !visited.has(p.id));
  const selected = place === "workshop" ? project : place === "books" ? book : -1;

  const sceneHint: Record<string, string> = {
    workshop: touch ? "Swipe along the bench, tap a screen to open the project" : "Click a screen to open the project",
    books: touch ? "Swipe along the shelf, tap a book to read it" : "Click a book on the shelf to read it",
    gate: touch ? "Tap the letter to open it" : "Click the letter to open it",
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
            reading={paper}
            radio={radio}
            turn={turn}
            focus={focus}
            cafeBegin={cafeBegin}
          />
        </Suspense>
      ) : null}
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(70,45,20,0.28) 100%)" }} />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-start justify-between gap-2 p-3 sm:flex-nowrap sm:gap-3 sm:p-5">
        {/* on a phone the places sit in a swipeable strip under the buttons instead of wrapping over the view */}
        <div
          className={`pointer-events-auto flex items-center gap-1.5 ${
            place ? "order-1" : "order-2 -mx-3 w-[calc(100%+1.5rem)] flex-nowrap overflow-x-auto px-3 pb-1 [scrollbar-width:none] sm:order-1 sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
          }`}
        >
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
                className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-bold transition-colors ${
                  visited.has(p.id) ? "bg-tile text-white" : "bg-marigold text-[#1c1410] hover:bg-lantern hover:text-white"
                }`}
              >
                {p.label}
                <span className="ml-1 font-medium opacity-80">{p.sub}</span>
              </button>
            ))
          )}
        </div>
        <div className="pointer-events-auto order-1 ml-auto flex items-center gap-2 sm:order-2">
          <button aria-label="How to play" title="How to play" onClick={() => setGuide(true)} className="rounded-md bg-secondary p-2 text-foreground hover:bg-muted">
            <CircleHelp className="h-4 w-4" />
          </button>
          <button
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={() => {
              setMutedState(!muted);
              setMuted(!muted);
              mutedRef.current = !muted;
              if (!muted) setRadio(false);
            }}
            className="rounded-md bg-secondary p-2 text-foreground hover:bg-muted"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button
            onClick={onHome}
            aria-label="Homepage"
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md bg-secondary px-2.5 py-2 text-sm font-bold text-foreground hover:bg-muted sm:px-3"
          >
            <House className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Homepage</span>
          </button>
          <button onClick={onExit} className="shrink-0 whitespace-nowrap rounded-md bg-secondary px-3 py-2 text-sm font-bold text-foreground hover:bg-muted sm:px-3.5">
            <span className="sm:hidden">View</span>
            <span className="hidden sm:inline">View mode</span>
          </button>
        </div>
      </div>

      {place === "home" && !overlay && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full border-2 border-white/80" style={{ background: nearItem ? "hsl(var(--marigold))" : "transparent" }} />
      )}

      {/* prompts */}
      <div className="pointer-events-none absolute inset-x-0 bottom-44 sm:bottom-10 flex flex-col items-center gap-3 px-4">
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
        {!hint && !nearItem && place === null && !overlay && nextStop && (
          <button
            onClick={() => walkTo(nextStop.id)}
            className="pointer-events-auto rounded-md bg-secondary/90 px-4 py-2 text-sm text-foreground shadow hover:bg-card"
          >
            <span className="mr-2 font-semibold text-foreground/70">{visited.size} of {PLACES.length} places</span>
            <b>Next: {nextStop.label}</b> · {nextStop.sub} →
          </button>
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
          className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 h-32 w-32 rounded-full bg-secondary/70 ring-2 ring-border"
          aria-label="Walk"
        >
          <div ref={knob} className="absolute left-1/2 top-1/2 -ml-7 -mt-7 h-14 w-14 rounded-full bg-marigold/90" />
        </div>
      )}

      {guide && (
        <Guide
          touch={touch}
          onStart={closeGuide}
          onView={() => {
            closeGuide();
            onExit();
          }}
        />
      )}

      {/* the radio: what is playing. It carries on as you walk the alley and step into the shops, and only stops when you turn it off (or mute). The song itself comes from YouTube's embedded player, which has to stay visible while it plays. */}
      {radio && (
        <div className="board absolute left-3 top-28 z-10 w-[min(90vw,20rem)] p-3 sm:top-16 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="plate text-sm">Radio · Sài Gòn</p>
            <button onClick={() => setRadio(false)} className="rounded-md bg-card-foreground px-2.5 py-1 text-xs font-bold text-card hover:bg-lantern">
              Turn off
            </button>
          </div>
          <h3 className="font-display text-2xl font-extrabold leading-tight">{radioSong.title}</h3>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-lantern">
            {radioSong.composer} · sung by {radioSong.singer}
          </p>
          <p className="mt-2 hidden font-serif text-sm leading-relaxed sm:block">{radioSong.blurb}</p>
          <div className="mt-3 w-[200px] overflow-hidden rounded-sm bg-black">
            <iframe
              title={`${radioSong.title}, ${radioSong.singer}`}
              width={200}
              height={113}
              src={`https://www.youtube-nocookie.com/embed/${radioSong.video}?autoplay=1&loop=1&playlist=${radioSong.video}&rel=0`}
              allow="autoplay; encrypted-media; picture-in-picture"
              className="block border-0"
            />
          </div>
          <p className="mt-1 text-[0.68rem] text-card-foreground/70">Playing from {radioSong.singer}'s official YouTube channel.</p>
        </div>
      )}

      {/* the vendor speaks */}
      <AnimatePresence>
        {greeting && !paper && (
          <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center px-4"><motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="board max-w-full px-5 py-3 text-center"
          >
            <p className="font-display text-xl font-bold">Here's your iced milk coffee, dear. And today's paper!</p>
            <p className="text-xs text-card-foreground/70">Cà phê sữa đá và tờ báo của con nè! Tap the paper to unfold it.</p>
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
            animate={{ y: 0, rotate: -0.5 }}
            exit={{ y: "110%", rotate: 4 }}
            transition={{ type: "spring", stiffness: 70, damping: 16 }}
            role="dialog"
            aria-label="Experience, in the newspaper"
            className="vintage-paper newsprint absolute inset-x-2 bottom-2 top-[11%] rounded-[2px] shadow-2xl sm:inset-x-auto sm:left-[3%] sm:top-[6%] sm:w-[min(68%,62rem)] min-[900px]:left-[2%] min-[900px]:w-[min(96%,82rem)]"
            style={{ transformOrigin: "50% 100%" }}
          >
            <CloseBtn onClick={() => setPaper(false)} label="Put the paper down" />
            <ExperienceNewspaper onTurn={paperTurn} onClose={() => setPaper(false)} />
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
            aria-label={bookshelf[book].title}
            className="board pointer-events-auto relative grid max-h-[88vh] w-[min(94vw,48rem)] gap-0 overflow-y-auto p-0 sm:grid-cols-[0.8fr_1.2fr]"
          >
            <CloseBtn onClick={() => setBook(-1)} />
            <div
              className="flex min-h-[12rem] flex-col justify-end p-7"
              style={{ background: bookshelf[book].cover.bg, color: bookshelf[book].cover.fg }}
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">{bookshelf[book].area}</p>
              <h3 className="mt-2 font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">{bookshelf[book].title}</h3>
              <p className="mt-2 text-sm opacity-90">{bookshelf[book].subtitle}</p>
            </div>
            <div className="p-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-lantern">Why I love this</p>
              <p className="mt-3 font-serif text-lg leading-relaxed sm:text-xl">{bookshelf[book].why}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {bookshelf[book].tags.map((t) => (
                  <li key={t} className="rounded-full border border-card-foreground/40 px-3 py-0.5 text-xs font-semibold">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex gap-2">
                <button disabled={book === 0} onClick={() => setBook(book - 1)} className="rounded-md bg-card-foreground px-3 py-1.5 text-sm font-bold text-card disabled:opacity-30">
                  Previous
                </button>
                <button disabled={book === bookshelf.length - 1} onClick={() => setBook(book + 1)} className="rounded-md bg-card-foreground px-3 py-1.5 text-sm font-bold text-card disabled:opacity-30">
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
      <div className={`pointer-events-none absolute inset-0 bg-[#f2e6c9] transition-opacity duration-[380ms] ease-in-out ${fade ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
