import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useCursor, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "@/data/projects";
import { bookshelf } from "@/data/about";
import { bookCoverTexture, comingSoonTexture, CoverArt, envelopeTexture, foldedPaperTexture, landmarkPoster, planksTexture, rugTexture, wainscotTexture, postcardTexture, postHallTexture, signTexture, tileTexture } from "./textures";
import { Box, Glow, Tube } from "./kit";
import { Model } from "./gfx";
import { CoffeeStall, PlasticTable } from "./Street";
import { Hotspot } from "./home";
import { CoffeeGlass, Fx, clamp, lerp } from "./parts";

/** Ease the camera towards a pose, but start every scene already on it: otherwise it sweeps in from wherever the last scene left it */
const useGlide = () => {
  const first = useRef(true);
  const { camera } = useThree();
  return (target: THREE.Vector3, k: number) => {
    if (first.current) {
      camera.position.copy(target);
      first.current = false;
    } else camera.position.lerp(target, k);
  };
};

/**
 * On a phone the bench and the shelf are wider than the screen, so the camera slides along them as you drag sideways.
 * `px` is how far the camera moves per pixel dragged; `dragged()` tells a tap from a swipe.
 */
const usePan = (limit: number, px: number, active: boolean) => {
  const { gl } = useThree();
  const target = useRef(0);
  const eased = useRef(0);
  const moved = useRef(0);
  useEffect(() => {
    target.current = 0;
    if (!active) return;
    const el = gl.domElement;
    let down = false;
    let last = 0;
    const pd = (e: PointerEvent) => {
      down = true;
      last = e.clientX;
      moved.current = 0;
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      moved.current += Math.abs(e.clientX - last);
      target.current = clamp(target.current - (e.clientX - last) * px, -limit, limit);
      last = e.clientX;
    };
    const pu = () => {
      down = false;
    };
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    window.addEventListener("pointercancel", pu);
    return () => {
      el.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
      window.removeEventListener("pointercancel", pu);
    };
  }, [gl, limit, px, active]);
  return {
    next: () => (eased.current = lerp(eased.current, target.current, 0.14)),
    dragged: () => moved.current > 8,
  };
};

const ease = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

/* ================= CAFÉ ================= */

const TABLE_SCALE = 1.6;
const TABLE_TOP = 0.5175 * TABLE_SCALE;

export const CafeScene = ({ begin, onPick, reading }: { fx: MutableRefObject<Fx>; onPick: (id: string) => void; begin: MutableRefObject<number>; reading: boolean }) => {
  const serve = useRef(0);
  const glass = useRef<THREE.Group>(null);
  const paper = useRef<THREE.Group>(null);
  const [hover, setHover] = useState(false);
  const [served, setServed] = useState(false);
  const hoverId = useRef<string | null>(null);
  hoverId.current = hover ? "paper" : null;
  useCursor(hover && !reading);
  const news = useMemo(() => foldedPaperTexture(), []);
  const { camera, size } = useThree();
  const glide = useGlide();
  const look = useMemo(() => new THREE.Vector3(), []);
  const campos = useMemo(() => new THREE.Vector3(), []);
  const wall = useMemo(() => {
    const t = tileTexture();
    t.repeat.set(1, 1);
    return t;
  }, []);
  void wall;

  useFrame((s) => {
    if (begin.current < 0) begin.current = s.clock.elapsedTime;
    const t = s.clock.elapsedTime - begin.current;
    serve.current = ease((t - 1.0) / 0.9);
    if (glass.current) {
      const k = ease((t - 1.7) / 1.0);
      glass.current.position.set(lerp(0.2, -0.14, k), lerp(1.2, TABLE_TOP + 0.03, k), lerp(-2.75, -0.95, k));
    }
    if (paper.current) {
      // she slides the folded paper across right after the glass; it lifts a little when you point at it
      const k = ease((t - 2.4) / 0.9);
      const lift = hover && !reading ? 0.03 : 0;
      paper.current.position.set(lerp(0.3, 0.3, k), lerp(1.2, TABLE_TOP, k) + lift, lerp(-2.75, -0.85, k));
      paper.current.rotation.y = lerp(0.9, -0.12, k);
      paper.current.visible = !reading && k > 0;
      if (k >= 1 && !served) setServed(true);
    }
    const wide = size.width / size.height > 1.15;
    const dolly = ease(t / 1.4);
    campos.set(wide ? -0.5 : 0, lerp(2.0, 1.6, dolly), lerp(2.6, 2.1, dolly));
    look.set(wide ? -1.0 : 0, 1.0, -2.4);
    glide(campos, 0.1);
    camera.lookAt(look);
  });

  return (
    <group>
      <color attach="background" args={["#bfe0ee"]} />
      <fog attach="fog" args={["#e6dcc4", 10, 30]} />
      <hemisphereLight args={["#d6ecfa", "#b89f78", 1.4]} />
      <directionalLight position={[3, 8, 5]} intensity={1.6} color="#fff0cc" />
      <pointLight position={[0, 2.6, -1]} intensity={22} distance={10} decay={2} color="#ffd9a0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]}>
        <planeGeometry args={[18, 12]} />
        <meshStandardMaterial color="#2a2a36" roughness={0.95} />
      </mesh>
      {/* the shop wall behind the stall */}
      <Box p={[0, 2.5, -3.5]} s={[12, 5, 0.3]} c="#e0a63a" />
      <Box p={[0, 0.6, -3.32]} s={[12, 1.2, 0.06]} c="#2c8c7e" />
      <Box p={[-4, 1.8, -3.25]} s={[2.2, 2.6, 0.1]} c="#6f7d78" />
      <mesh position={[0, 3.7, -3.3]}>
        <planeGeometry args={[3.9, 1.2]} />
        <meshBasicMaterial map={useMemo(() => signTexture("ICED MILK COFFEE", "Cà phê sữa đá", "red"), [])} toneMapped={false} />
      </mesh>
      {/* the same stall as in the alley, turned to face us */}
      <group position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <CoffeeStall vendor={serve} />
      </group>
      {/* the table where the glass lands */}
      <group position={[0, 0, -0.95]} scale={TABLE_SCALE}>
        <PlasticTable p={[0, 0, 0]} c="#1b4b9b" glass={false} />
      </group>
      <group ref={glass} position={[0.2, 1.2, -2.75]} scale={1.6}>
        <CoffeeGlass />
      </group>
      <Hotspot id="paper" p={[0.3, TABLE_TOP + 0.18, -0.85]} hover={hoverId} hide={reading || !served} />
      {/* the folded newspaper: click it to open it, and put it down to fold it again */}
      <group
        ref={paper}
        visible={false}
        scale={0.9}
        onClick={(e) => {
          e.stopPropagation();
          onPick("paper");
        }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <Box p={[0, 0.012, 0]} s={[0.36, 0.024, 0.25]} c="#d9c894" />
        <mesh position={[0, 0.0245, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.35, 0.245]} />
          <meshStandardMaterial map={news} roughness={0.95} />
        </mesh>
        <Box p={[0, 0.0255, 0]} s={[0.003, 0.001, 0.25]} c="#b9a572" />
      </group>
    </group>
  );
};

/* ================= WORKSHOP ================= */

export const WorkshopScene = ({ onPick, selected }: { onPick: (id: string) => void; selected: number }) => {
  const tex = useTexture(projects.map((p) => p.image));
  tex.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  const [hover, setHover] = useState<number | null>(null);
  useCursor(hover !== null);
  const { camera, size } = useThree();
  const glide = useGlide();
  const pan = usePan(2.5, 0.009, size.width / size.height <= 1.15);
  const look = useMemo(() => new THREE.Vector3(0, 1.45, -1), []);
  const posts = useMemo(
    () => projects.map((p) => signTexture(p.title.toUpperCase(), p.subtitle, (["yellow", "teal", "red"] as const)[projects.indexOf(p) % 3])),
    [],
  );
  useFrame((s) => {
    const wide = size.width / size.height > 1.15;
    const t = Math.min(1, s.clock.elapsedTime * 0.8);
    const x = wide ? 0 : pan.next();
    look.x = x;
    glide(new THREE.Vector3(x, 1.7, wide ? 3.6 : 5.6 - t * 0.2), 0.08);
    camera.lookAt(look);
  });
  const n = projects.length;
  const xs = projects.map((_, i) => (i - (n - 1) / 2) * 1.62);
  return (
    <group>
      <color attach="background" args={["#bfe0ee"]} />
      <hemisphereLight args={["#d6ecfa", "#b89f78", 1.3]} />
      <Tube p={[0, 3.2, -0.5]} w={1.8} />
      <pointLight position={[0, 3, 0.5]} intensity={40} distance={12} decay={2} color="#dcefff" />
      <pointLight position={[-2, 1.8, 1.5]} intensity={22} distance={8} decay={2} color="#ffb869" />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial map={useMemo(() => {
          const t = planksTexture("#6b5a48");
          t.wrapS = t.wrapT = THREE.RepeatWrapping;
          t.repeat.set(3, 2);
          return t;
        }, [])} roughness={0.85} />
      </mesh>
      <Box p={[0, 2, -2.6]} s={[10, 4, 0.2]} c="#1f7a6d" />
      {/* posters of the hackathons */}
      {posts.map((tx, i) => (
        <mesh key={i} position={[xs[i] * 1.0, 3.05, -2.48]}>
          <planeGeometry args={[1.45, 0.42]} />
          <meshBasicMaterial map={tx} toneMapped={false} />
        </mesh>
      ))}
      {/* bench */}
      <Box p={[0, 0.82, -0.6]} s={[6.4, 0.1, 1.6]} c="#6b4a2f" />
      {[-3, 3].map((x) => (
        <Box key={x} p={[x, 0.4, -0.6]} s={[0.1, 0.8, 1.4]} c="#4a3220" />
      ))}
      {projects.map((p, i) => {
        const active = selected === i;
        const hov = hover === i;
        return (
          <group
            key={p.title}
            position={[xs[i], 1.82, -1.0]}
            rotation={[0, -xs[i] * 0.07, 0]}
            scale={(active || hov ? 1.05 : 1) * 0.88}
            onClick={(e) => {
              e.stopPropagation();
              if (!pan.dragged()) onPick(`project-${i}`);
            }}
            onPointerOver={() => setHover(i)}
            onPointerOut={() => setHover((h) => (h === i ? null : h))}
          >
            <Box p={[0, 0, -0.03]} s={[1.75, 1.15, 0.08]} c={hov || active ? "#f4b73f" : "#14111a"} />
            <mesh position={[0, 0, 0.02]}>
              <planeGeometry args={[1.6, 1.0]} />
              <meshBasicMaterial map={tex[i]} toneMapped={false} />
            </mesh>
            <Box p={[0, -0.78, -0.1]} s={[0.1, 0.42, 0.1]} c="#14111a" />
            <Box p={[0, -0.98, -0.05]} s={[0.6, 0.05, 0.35]} c="#14111a" />
          </group>
        );
      })}
      <Model name="Television_01" w={0.7} pos={[-2.8, 0.87, -0.1]} rot={[0, 0.5, 0]} />
      <Model name="circuit_board" w={0.45} pos={[-1.3, 0.87, 0.15]} rot={[0, 0.3, 0]} />
      <Model name="retro_multimeter" h={0.24} pos={[1.4, 0.87, 0.15]} rot={[0, -0.6, 0]} />
      <Model name="desk_lamp_arm_01" h={0.7} pos={[2.8, 0.87, -0.7]} rot={[0, -0.4, 0]} />
      <pointLight position={[2.5, 1.5, -0.3]} intensity={14} distance={5} color="#ffd9a8" />
      {/* soldering station, PCB and a jar of parts */}
      <Box p={[-2.05, 0.885, 0.0]} s={[0.7, 0.03, 0.5]} c="#1f7a4d" />
      {[[-2.2, 0.93, 0.05], [-1.95, 0.93, -0.05], [-2.1, 0.93, 0.12]].map((p, i) => (
        <Box key={i} p={p as [number, number, number]} s={[0.12, 0.06, 0.08]} c="#14111a" />
      ))}
      <group position={[2.4, 0.87, 0.1]} rotation={[0, 0.4, 0]}>
        <Box p={[0, 0.05, 0]} s={[0.4, 0.1, 0.3]} c="#d8342b" />
        <mesh position={[0.2, 0.15, 0]} rotation={[0, 0, -0.9]}>
          <cylinderGeometry args={[0.015, 0.015, 0.5, 6]} />
          <meshStandardMaterial color="#c7c7d1" metalness={0.8} />
        </mesh>
      </group>
      <mesh position={[0.9, 1.0, 0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.26, 14]} />
        <meshPhysicalMaterial color="#cfe6ee" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

/* ================= BOOKSHOP ================= */

const SPINES = ["#d8342b", "#1b4b9b", "#f4b73f", "#efe4cc", "#2c8c7e", "#8a3f6a", "#e07b39", "#3b6e8f"];

/** Rows of ordinary books, so the shop feels stocked around the featured covers */
const fillerBooks = (count: number, seed: number) => {
  let x = 0;
  return Array.from({ length: count }, (_, i) => {
    const w = 0.16 + (((i + seed) * 13) % 5) * 0.045;
    const book = { x: x + w / 2, w, h: 0.62 + (((i + seed) * 7) % 6) * 0.07, c: SPINES[((i + seed) * 5) % SPINES.length] };
    x += w + 0.015;
    return book;
  });
};

const BookRow = ({ y, count, seed, width }: { y: number; count: number; seed: number; width: number }) => {
  const books = useMemo(() => fillerBooks(count, seed), [count, seed]);
  const span = books[books.length - 1].x + books[books.length - 1].w / 2;
  return (
    <group position={[-Math.min(span, width) / 2, y, -2.25]}>
      {books.filter((b) => b.x < width).map((b, i) => (
        <mesh key={i} position={[b.x, b.h / 2, 0]}>
          <boxGeometry args={[b.w, b.h, 0.34]} />
          <meshStandardMaterial color={b.c} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
};

export const BookScene = ({ onPick, selected }: { onPick: (id: string) => void; selected: number }) => {
  const [hover, setHover] = useState<number | null>(null);
  useCursor(hover !== null);
  const { camera, size } = useThree();
  const glide = useGlide();
  const pan = usePan(3.2, 0.012, size.width / size.height <= 1.15);
  const look = useMemo(() => new THREE.Vector3(0, 2.5, -2), []);
  const covers = useMemo(() => bookshelf.map((b) => bookCoverTexture(b.cover.art as CoverArt, b.title, b.subtitle, b.cover.bg, b.cover.fg)), []);
  const stamp = useMemo(() => comingSoonTexture(), []);
  const sign = useMemo(() => signTexture("TIỆM SÁCH", "sách cũ · what I'm reading, and why", "red"), []);
  const posters = useMemo(() => (["benthanh", "nhahat", "ducba", "buudien"] as const).map((k) => landmarkPoster(k)), []);
  const wains = useMemo(() => {
    const t = wainscotTexture();
    t.repeat.set(10, 1.3);
    return t;
  }, []);
  const rug = useMemo(() => rugTexture(), []);
  const floor = useMemo(() => {
    const t = tileTexture();
    t.repeat.set(6, 4);
    return t;
  }, []);
  const scales = useRef<THREE.Group>(null);
  const covs = useRef<(THREE.Group | null)[]>([]);
  useFrame((s) => {
    const wide = size.width / size.height > 1.15;
    const x = wide ? 0 : pan.next();
    look.x = x;
    glide(new THREE.Vector3(x, 2.6, wide ? 6.0 : 7.2), 0.08);
    camera.lookAt(look);
    if (scales.current) scales.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.8) * 0.08;
    covs.current.forEach((g, i) => {
      if (!g) return;
      const k = lerp(g.scale.x, hover === i || selected === i ? 1.06 : 1, 0.2);
      g.scale.setScalar(k);
      g.position.y = 2.8 + 0.67 * (k - 1); // grows from the shelf board, never lifted off it
    });
  });
  const xs = bookshelf.map((_, i) => (i - (bookshelf.length - 1) / 2) * 1.55);

  return (
    <group>
      <color attach="background" args={["#3a2a1a"]} />
      <hemisphereLight args={["#ffe2b0", "#8a6a45", 0.95]} />
      <pointLight position={[-2.5, 4.2, 0.5]} intensity={26} distance={9} decay={2} color="#ffc070" />
      <pointLight position={[2.5, 4.2, 0.5]} intensity={26} distance={9} decay={2} color="#ffc070" />
      <pointLight position={[0, 2.6, 3]} intensity={14} distance={9} decay={2} color="#ffb060" />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial map={floor} roughness={0.6} />
      </mesh>
      <Box p={[0, 2.4, -2.5]} s={[8.0, 4.8, 0.3]} c="#5a3a22" />
      {/* the room: faded mustard plaster over teal glazed tile, a dark timber ceiling, an old rug */}
      <Box p={[0, 2.9, -2.75]} s={[16, 5.8, 0.2]} c="#d1a85c" r={0.95} />
      <mesh position={[0, 0.65, -2.63]}>
        <planeGeometry args={[16, 1.3]} />
        <meshStandardMaterial map={wains} roughness={0.5} />
      </mesh>
      <Box p={[0, 1.34, -2.6]} s={[16, 0.07, 0.1]} c="#e8dcb8" />
      {[-7.6, 7.6].map((x) => (
        <Box key={x} p={[x, 2.9, 2.5]} s={[0.2, 5.8, 10]} c="#c99d52" r={0.95} />
      ))}
      <Box p={[0, 5.75, 2.5]} s={[16, 0.2, 10]} c="#4a3220" />
      {[-6, -3, 0, 3, 6].map((x) => (
        <Box key={x} p={[x, 5.6, 2.5]} s={[0.25, 0.25, 10]} c="#2e1f13" />
      ))}
      <mesh position={[0, 0.016, 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 3.2]} />
        <meshStandardMaterial map={rug} roughness={0.95} />
      </mesh>
      {/* faded landmark posters and a wall clock on the plaster */}
      {[[-5.7, 3.0, 0.04], [-4.75, 2.45, -0.05], [5.7, 3.0, -0.04], [4.75, 2.45, 0.05]].map(([x, y, r], i) => (
        <group key={i} position={[x, y, -2.6]} rotation={[0, 0, r]}>
          <Box p={[0, 0, -0.01]} s={[0.96, 1.32, 0.03]} c="#f1e3c2" />
          <mesh position={[0, 0, 0.012]}>
            <planeGeometry args={[0.88, 1.24]} />
            <meshStandardMaterial map={posters[i]} roughness={0.9} />
          </mesh>
        </group>
      ))}
      <Model name="wall_clock" h={0.8} pos={[-5.2, 4.4, -2.55]} />
      {/* a green louvred shutter, left open to the street */}
      <group position={[-6.95, 2.6, -2.62]}>
        <Box p={[0, 0, 0]} s={[1.0, 2.3, 0.08]} c="#2c6a58" />
        {Array.from({ length: 12 }, (_, i) => (
          <Box key={i} p={[0, -1.0 + i * 0.18, 0.05]} s={[0.9, 0.05, 0.05]} c="#1f4e40" />
        ))}
      </group>
      {/* ceiling fan and two bare bulbs on cords */}
      <Model name="ceiling_fan" w={2.2} pos={[0, 5.15, 0.5]} />
      {[-2.5, 2.5].map((x) => (
        <group key={x} position={[x, 0, 0.5]}>
          <mesh position={[0, 5.05, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 1.4, 4]} />
            <meshBasicMaterial color="#14111a" />
          </mesh>
          <mesh position={[0, 4.33, 0]}>
            <sphereGeometry args={[0.1, 14, 10]} />
            <meshBasicMaterial color="#ffe3a0" toneMapped={false} />
          </mesh>
          <Glow p={[x * 0 , 4.33, 0]} s={1.6} o={0.8} />
        </group>
      ))}
      {/* the shop sign, hung over the shelves */}
      <mesh position={[0, 5.2, -2.62]}>
        <planeGeometry args={[2.8, 0.8]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* three rows of shelves: stocked above and below, the featured covers face-out in the middle */}
      {[0, 1, 2].map((row) => (
        <Box key={row} p={[0, 0.9 + row * 1.2 + (row === 2 ? 0.4 : 0), -2.2]} s={[7.8, 0.06, 0.5]} c="#3a2616" />
      ))}
      <Box p={[-3.9, 2.4, -2.2]} s={[0.1, 4.8, 0.5]} c="#3a2616" />
      <Box p={[3.9, 2.4, -2.2]} s={[0.1, 4.8, 0.5]} c="#3a2616" />
      <BookRow y={0.93} count={26} seed={1} width={7.4} />
      <BookRow y={2.13} count={26} seed={4} width={7.4} />
      <BookRow y={3.73} count={26} seed={7} width={7.4} />
      {/* the featured books, with their own covers */}
      {bookshelf.map((b, i) => (
        <group
          key={b.title}
          ref={(g) => (covs.current[i] = g)}
          position={[xs[i], 2.8, -2.0]}
          rotation={[-0.06, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            if (!pan.dragged()) onPick(`book-${i}`);
          }}
          onPointerOver={() => setHover(i)}
          onPointerOut={() => setHover((h) => (h === i ? null : h))}
        >
          <Box p={[0, 0, 0]} s={[1.0, 1.34, 0.14]} c={b.cover.bg} />
          <Box p={[0.02, 0, -0.01]} s={[0.97, 1.31, 0.14]} c="#f4ead0" />
          <mesh position={[0, 0, 0.072]}>
            <planeGeometry args={[1.0, 1.34]} />
            <meshStandardMaterial map={covers[i]} roughness={0.7} />
          </mesh>
          {b.area === "Coming soon" && (
            <mesh position={[0, 0.38, 0.08]}>
              <planeGeometry args={[0.7, 0.35]} />
              <meshBasicMaterial map={stamp} transparent toneMapped={false} />
            </mesh>
          )}
          <mesh visible={hover === i || selected === i} position={[0, 0, -0.02]}>
            <boxGeometry args={[1.12, 1.46, 0.1]} />
            <meshBasicMaterial color="#f4b73f" transparent opacity={0.35} depthWrite={false} />
          </mesh>
        </group>
      ))}
      {/* stacks on the floor */}
      {[[-3.2, 0.3, 0], [-2.7, 1.0, 0.4], [-2.9, 1.9, 1]].map(([x, z, r], si) => (
        <group key={si} position={[x, 0, z]} rotation={[0, r, 0]}>
          {Array.from({ length: 3 + (si % 3) }, (_, k) => (
            <Box key={k} p={[(k % 2) * 0.03, 0.05 + k * 0.1, 0]} s={[0.6 - k * 0.04, 0.09, 0.42]} c={SPINES[(si * 3 + k * 2) % SPINES.length]} />
          ))}
        </group>
      ))}
      {/* an old radio on the counter, and a tea corner with a low table and a stool */}
      <Model name="vintage_radio_transceiver" h={0.4} pos={[3.65, 1.045, 0.55]} rot={[0, -0.4, 0]} />
      <Model name="painted_wooden_table" h={0.6} pos={[-4.7, 0, 0.9]} />
      <Model name="tea_set_01" h={0.2} pos={[-4.7, 0.6, 0.9]} />
      <Model name="painted_wooden_chair_01" h={0.8} pos={[-4.0, 0, 1.2]} rot={[0, 1.2, 0]} />
      <Model name="ceramic_vase_01" h={0.5} pos={[-3.9, 0, -1.6]} />
      {/* counter with the scales of justice and a reading lamp */}
      <Box p={[3.0, 0.5, 0.6]} s={[2.2, 1.0, 0.9]} c="#6b4a2f" />
      <Box p={[3.0, 1.02, 0.6]} s={[2.3, 0.05, 1.0]} c="#4a3220" />
      <group position={[2.35, 1.045, 0.6]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.03, 0.4, 8]} />
          <meshStandardMaterial color="#2c8c7e" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.05, 0.2, 0.18, 16, 1, true]} />
          <meshStandardMaterial color="#1f7a6d" side={THREE.DoubleSide} />
        </mesh>
        <pointLight position={[0, 0.35, 0]} intensity={4} distance={3} color="#ffd9a0" />
      </group>
      <group position={[3.0, 1.045, 0.6]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.6, 8]} />
          <meshStandardMaterial color="#f4b73f" metalness={0.8} roughness={0.3} />
        </mesh>
        <group ref={scales} position={[0, 0.62, 0]}>
          <mesh>
            <boxGeometry args={[0.9, 0.03, 0.03]} />
            <meshStandardMaterial color="#f4b73f" metalness={0.8} roughness={0.3} />
          </mesh>
          {[-0.42, 0.42].map((x) => (
            <mesh key={x} position={[x, -0.22, 0]}>
              <cylinderGeometry args={[0.16, 0.12, 0.04, 14]} />
              <meshStandardMaterial color="#f4b73f" metalness={0.8} roughness={0.3} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

/* ================= POST OFFICE: the letter ================= */

export const GateScene = ({ onPick, open }: { onPick: (id: string) => void; open: boolean }) => {
  const tex = useMemo(() => envelopeTexture(), []);
  const hall = useMemo(() => postHallTexture(), []);
  const card = useMemo(() => postcardTexture(), []);
  const sign = useMemo(() => signTexture("POST OFFICE", "Bưu điện", "teal"), []);
  const floor = useMemo(() => {
    const t = tileTexture();
    t.repeat.set(5, 4);
    return t;
  }, []);
  const [hover, setHover] = useState(false);
  useCursor(hover && !open);
  const hoverId = useRef<string | null>(null);
  hoverId.current = hover ? "letter" : null;
  const env = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  const glide = useGlide();
  useFrame((s) => {
    const portrait = size.width / size.height < 0.8; // a phone: stand further back so the whole desk fits
    glide(new THREE.Vector3(0, portrait ? 2.7 : 2.2, portrait ? 6.0 : 3.7), 0.08);
    camera.lookAt(0, portrait ? 1.0 : 1.25, 0);
    if (env.current) {
      // the letter lies folded on the desk; it only swells a touch when you point at it
      env.current.scale.setScalar(lerp(env.current.scale.x, hover && !open ? 1.04 : 1, 0.2));
      env.current.visible = !open;
    }
  });
  const click = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onPick("letter");
  };
  return (
    <group>
      <color attach="background" args={["#d8c9a8"]} />
      <hemisphereLight args={["#fff0d0", "#b89f78", 1.3]} />
      <pointLight position={[0, 3, 1.5]} intensity={34} distance={12} decay={2} color="#ffc680" />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 9]} />
        <meshStandardMaterial map={floor} roughness={0.5} />
      </mesh>
      {/* the hall's back wall with its arched windows */}
      <mesh position={[0, 2.25, -2.5]}>
        <planeGeometry args={[9, 4.5]} />
        <meshStandardMaterial map={hall} roughness={0.85} emissiveMap={hall} emissive="#ffffff" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 3.9, -2.45]}>
        <planeGeometry args={[2.6, 0.8]} />
        <meshBasicMaterial map={sign} toneMapped={false} />
      </mesh>
      {/* wall clock */}
      <mesh position={[3.2, 3.0, -2.44]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#f4ead0" />
      </mesh>
      <mesh position={[3.2, 3.0, -2.43]}>
        <ringGeometry args={[0.47, 0.52, 32]} />
        <meshStandardMaterial color="#2a2118" />
      </mesh>
      <Box p={[3.2, 3.1, -2.42]} s={[0.025, 0.3, 0.01]} c="#2a2118" />
      <Box p={[3.27, 3.0, -2.42]} s={[0.2, 0.025, 0.01]} c="#2a2118" />
      {/* the counter, with a brass grille */}
      <Box p={[-3.2, 0.55, -1.2]} s={[2.2, 1.1, 0.9]} c="#5a3a22" r={0.5} />
      <Box p={[-3.2, 1.12, -1.2]} s={[2.4, 0.06, 1.0]} c="#3a2616" r={0.4} />
      {Array.from({ length: 14 }, (_, i) => (
        <mesh key={i} position={[-4.2 + i * 0.155, 1.6, -1.55]}>
          <cylinderGeometry args={[0.01, 0.01, 0.9, 6]} />
          <meshStandardMaterial color="#d6b25a" metalness={0.9} roughness={0.3} />
        </mesh>
      ))}
      <Box p={[-3.2, 2.1, -1.55]} s={[2.3, 0.06, 0.05]} c="#d6b25a" m={0.9} />
      {/* the red letter box beside the desk */}
      <group position={[2.6, 0, -0.2]}>
        <Box p={[0, 0.65, 0]} s={[0.6, 1.3, 0.5]} c="#a8261e" r={0.45} />
        <mesh position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5, 24, 1, false, Math.PI / 2, Math.PI]} />
          <meshStandardMaterial color="#a8261e" roughness={0.45} />
        </mesh>
        <Box p={[0, 1.0, 0.255]} s={[0.4, 0.06, 0.02]} c="#14111a" />
        <Box p={[0, 0.55, 0.255]} s={[0.4, 0.16, 0.01]} c="#f4b73f" />
      </group>
      {/* thank-you postcard pinned to the wall */}
      <group position={[-1.9, 2.5, -2.44]} rotation={[0, 0, 0.04]}>
        <mesh>
          <planeGeometry args={[1.5, 1.0]} />
          <meshBasicMaterial map={card} toneMapped={false} />
        </mesh>
        <Box p={[0, 0.52, 0.01]} s={[0.4, 0.07, 0.01]} c="#e8d9ae" />
      </group>
      {/* writing table with pen and ink */}
      <Box p={[0, 0.8, 0]} s={[3.2, 0.1, 1.6]} c="#6b4a2f" r={0.5} />
      {[[-1.4, -0.6], [1.4, -0.6], [-1.4, 0.6], [1.4, 0.6]].map(([x, z], i) => (
        <Box key={i} p={[x, 0.4, z]} s={[0.1, 0.8, 0.1]} c="#4a3220" />
      ))}
      <mesh position={[1.35, 0.95, 0.2]}>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 14]} />
        <meshStandardMaterial color="#1b4b9b" />
      </mesh>
      <mesh position={[1.15, 0.87, 0.55]} rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#14111a" />
      </mesh>
      <Hotspot id="letter" p={[-0.25, 1.25, 0.1]} hover={hoverId} hide={open} />
      <group
        ref={env}
        position={[-0.25, 0.856, 0.1]}
        rotation={[-Math.PI / 2, 0, 0.06]}
        onClick={click}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <mesh>
          <planeGeometry args={[1.6, 1.04]} />
          <meshBasicMaterial map={tex} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
};
