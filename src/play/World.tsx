import { MutableRefObject, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import * as THREE from "three";
import { facadeTexture, signTexture, ShopKind } from "./textures";
import { Avatar, Fx, Pet, Place, clamp, dampAngle } from "./parts";
import { Atmosphere, Model, usePBR } from "./gfx";
import { HomeRoom } from "./home";
import { BookScene, CafeScene, GateScene, WorkshopScene } from "./scenes";
import { Awning, BookStall, CoffeeStall, EndGate, HouseFront, Mirror, PlaceMarker, RepairShop, UtilityPole, WallFlag } from "./Street";

export type { Fx, Place };

export interface Interactable {
  id: string;
  label: string;
  pos: [number, number]; // x, z
  radius: number;
  /** entering a place from the street */
  enter?: Place;
}

export const STREET_ITEMS: Interactable[] = [
  { id: "home", label: "Go into Home: About", pos: [-2.1, -10], radius: 3.4, enter: "home" },
  { id: "cafe", label: "Sit down for coffee: Experience", pos: [1.9, -24], radius: 3.4, enter: "cafe" },
  { id: "dog", label: "Pet Cậu Vàng the dog", pos: [1.5, -31], radius: 2 },
  { id: "workshop", label: "Step into the workshop: Projects", pos: [-2.1, -38], radius: 3.4, enter: "workshop" },
  { id: "books", label: "Browse the bookshop: Interests", pos: [1.9, -52], radius: 3.4, enter: "books" },
  { id: "gate", label: "Go into the post office: Contact", pos: [0, -63], radius: 3.6, enter: "gate" },
];

export const HOME_ITEMS: Interactable[] = [
  { id: "shelf", label: "Read the bookshelf", pos: [2.5, -4.0], radius: 1.4 },
  { id: "laptop", label: "Open the laptop", pos: [3.0, -3.1], radius: 1.4 },
  { id: "kitchen", label: "Look at the kitchen", pos: [0, 0], radius: 1 },
  { id: "radio", label: "Turn the radio on or off", pos: [3.0, 0.5], radius: 1.5 },
  { id: "door", label: "Step back outside", pos: [0, 2.6], radius: 1.5 },
];

export const PLACES: { id: string; place: Place; label: string; sub: string; pos: [number, number] }[] = [
  { id: "home", place: "home", label: "Home", sub: "About", pos: [-2.1, -10] },
  { id: "cafe", place: "cafe", label: "Café", sub: "Experience", pos: [1.9, -24] },
  { id: "workshop", place: "workshop", label: "Workshop", sub: "Projects", pos: [-2.1, -38] },
  { id: "books", place: "books", label: "Bookshop", sub: "Interests", pos: [1.9, -52] },
  { id: "gate", place: "gate", label: "Post Office", sub: "Contact", pos: [0, -63] },
];

export interface Goal {
  x: number;
  z: number;
  id?: string;
}


/** Things you can't walk through in the hẻm: circles (x, z, r) and boxes (x0, x1, z0, z1). Kept in step with Street.tsx. */
type Solid = { x: number; z: number; r: number } | { x0: number; x1: number; z0: number; z1: number };
const STREET_SOLIDS: Solid[] = [
  // Home porch: columns, bicycle, gate, planters
  { x: -2.1, z: -12.4, r: 0.28 },
  { x: -2.1, z: -7.6, r: 0.28 },
  { x0: -2.65, x1: -2.25, z0: -12.2, z1: -10.9 },
  { x0: -2.6, x1: -2.2, z0: -8.9, z1: -6.8 },
  { x0: -2.3, x1: -1.35, z0: -12.9, z1: -12.2 },
  { x: -1.8, z: -12.0, r: 0.3 },
  { x0: -2.3, x1: -1.35, z0: -9.0, z1: -8.2 },
  // Café stall: cart, tables, stools, chairs, canopy poles, hammock
  { x0: 2.1, x1: 3.0, z0: -25.9, z1: -22.6 },
  { x: 1.95, z: -22.2, r: 0.4 },
  { x: 1.95, z: -22.8, r: 0.22 },
  { x: 1.5, z: -22.05, r: 0.3 },
  { x: 2.4, z: -21.7, r: 0.24 },
  { x: 2.05, z: -26.5, r: 0.4 },
  { x: 1.45, z: -26.4, r: 0.3 },
  { x: 2.0, z: -27.1, r: 0.3 },
  { x: 2.55, z: -25.9, r: 0.24 },
  { x: 1.55, z: -27.3, r: 0.08 },
  { x: 1.55, z: -21.1, r: 0.08 },
  { x0: 2.3, x1: 3.1, z0: -28.8, z1: -26.5 },
  // Workshop counter (left)
  { x0: -3.0, x1: -2.1, z0: -40.8, z1: -35.2 },
  // Bookshop: racks, table, chair (right)
  { x0: 1.9, x1: 2.4, z0: -54.95, z1: -53.45 },
  { x0: 1.9, x1: 2.4, z0: -50.55, z1: -49.05 },
  { x: 2.1, z: -51.8, r: 0.4 },
  { x0: 1.35, x1: 1.85, z0: -52.55, z1: -52.05 },
  // Post office: letter box
  { x: 1.7, z: -67.4, r: 0.38 },
];

/** Push a circle of radius r out of every solid. Returns the corrected position. */
const resolveSolids = (solids: Solid[], x: number, z: number, r: number): [number, number] => {
  for (let pass = 0; pass < 2; pass++) {
    for (const o of solids) {
      if ("r" in o) {
        const dx = x - o.x;
        const dz = z - o.z;
        const d = Math.hypot(dx, dz);
        const min = o.r + r;
        if (d < min) {
          const k = d > 1e-4 ? min / d : 1;
          x = d > 1e-4 ? o.x + dx * k : o.x + min;
          z = d > 1e-4 ? o.z + dz * k : z;
        }
      } else if (x > o.x0 - r && x < o.x1 + r && z > o.z0 - r && z < o.z1 + r) {
        const cx = Math.min(Math.max(x, o.x0), o.x1);
        const cz = Math.min(Math.max(z, o.z0), o.z1);
        const dx = x - cx;
        const dz = z - cz;
        const d = Math.hypot(dx, dz);
        if (d > 1e-4) {
          if (d < r) {
            x = cx + (dx / d) * r;
            z = cz + (dz / d) * r;
          }
        } else {
          const pushes = [x - (o.x0 - r), o.x1 + r - x, z - (o.z0 - r), o.z1 + r - z];
          const m = Math.min(...pushes);
          if (m === pushes[0]) x = o.x0 - r;
          else if (m === pushes[1]) x = o.x1 + r;
          else if (m === pushes[2]) z = o.z0 - r;
          else z = o.z1 + r;
        }
      }
    }
  }
  return [x, z];
};

const BOUNDS = {
  street: { x: 2.1, zMin: -68, zMax: 6 },
  home: { x: 3.3, zMin: -4.2, zMax: 2.8 },
};
const WALLS = ["#d9b25a", "#ead7a6", "#c9806c", "#8fb39e", "#dcb872", "#8fa9b5", "#c9a07a", "#e2d6b4"];
const TRIMS = ["#f4ead0", "#3b5a4e", "#f4ead0", "#6a4a2f"];

interface Seg {
  z: number;
  depth: number;
  spot?: string;
}

const segments = (spots: { z: number; id: string }[]): Seg[] => {
  const out: Seg[] = [];
  let cursor = 8;
  const fill = (a: number, b: number) => {
    const n = Math.max(1, Math.round((a - b) / 6));
    const d = (a - b) / n;
    for (let i = 0; i < n; i++) out.push({ z: a - d * (i + 0.5), depth: d });
  };
  [...spots]
    .sort((p, q) => q.z - p.z)
    .forEach((s) => {
      fill(cursor, s.z + 4);
      out.push({ z: s.z, depth: 8, spot: s.id });
      cursor = s.z - 4;
    });
  fill(cursor, -82);
  return out;
};


/* ---------- Street ---------- */

const Street = () => {
  const pbr = usePBR("asphalt_02", [3, 36]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -34]}>
        <planeGeometry args={[6.6, 96]} />
        <meshStandardMaterial {...pbr} color="#f0e6d2" roughness={0.8} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 3.1, 0.06, -34]}>
          <boxGeometry args={[0.2, 0.12, 96]} />
          <meshStandardMaterial color="#8a8791" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

/** Hide whatever is far from the player: a cheap level of detail for a long alley */
const Near = ({ z, pos, range = 38, children }: { z: number; pos: MutableRefObject<THREE.Vector3>; range?: number; children: React.ReactNode }) => {
  const g = useRef<THREE.Group>(null);
  const n = useRef(0);
  useFrame(() => {
    if (++n.current % 8 !== 0 || !g.current) return;
    g.current.visible = Math.abs(pos.current.z - z) < range;
  });
  return <group ref={g}>{children}</group>;
};

/* ---------- Buildings ---------- */

export const Building = ({
  side,
  seg,
  index,
  sign,
}: {
  side: -1 | 1;
  seg: Seg;
  index: number;
  sign?: { text: string; sub: string | null; style: "red" | "enamel" | "teal" | "yellow" };
}) => {
  const shop: ShopKind = seg.spot ? "open" : index % 3 === 0 ? "none" : "shutter";
  const tex = useMemo(
    () => facadeTexture(WALLS[(index * 3 + (side > 0 ? 2 : 0)) % WALLS.length], TRIMS[index % TRIMS.length], 11 + index * 7 + (side > 0 ? 3 : 0), shop),
    [index, side, shop],
  );
  const signTex = useMemo(() => (sign ? signTexture(sign.text, sign.sub, sign.style) : null), [sign]);
  const h = seg.depth * 2.5;
  return (
    <group position={[0, 0, seg.z]}>
      <mesh position={[side * 6.2, h / 2, 0]}>
        <boxGeometry args={[6, h, seg.depth - 0.02]} />
        <meshStandardMaterial color="#c9b48a" roughness={1} />
      </mesh>
      <mesh position={[side * 3.185, h / 2, 0]} rotation={[0, side * -Math.PI / 2, 0]}>
        <planeGeometry args={[seg.depth, h]} />
        <meshStandardMaterial map={tex} roughness={0.9} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.18} />
      </mesh>
      {signTex && (
        <mesh position={[side * 3.16, seg.spot === "home" ? 4.24 : 4.05, 0]} rotation={[0, side * -Math.PI / 2, 0]}>
          {/* the house's sign is smaller: it has to fit between the porch roof and the balcony */}
          <planeGeometry args={seg.spot === "home" ? [3.58, 1.09] : [4.6, 1.4]} />
          <meshBasicMaterial map={signTex} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

/* ---------- Props ---------- */

const Plant = ({ pos, s = 1 }: { pos: [number, number, number]; s?: number }) => (
  <group position={pos}>
    <Model name="planter_box_01" w={0.9 * s} rot={[0, Math.PI / 2, 0]} />
    <Model name="potted_plant_04" h={0.55 * s} pos={[0, 0.0, 0.45 * s]} />
  </group>
);

const Entry = () => {
  const sign = useMemo(() => signTexture("THU'S ALLEY", "Hẻm của Thư", "enamel"), []);
  return (
    <mesh position={[-3.15, 2.5, 2.2]} rotation={[0, Math.PI / 2, 0]}>
      <planeGeometry args={[2.9, 0.9]} />
      <meshBasicMaterial map={sign} toneMapped={false} />
    </mesh>
  );
};


/* ---------- Player ---------- */

const Player = ({
  place,
  input,
  goal,
  paused,
  pos,
  onNear,
  onArrive,
  dogPos,
  catPos,
}: {
  place: Place | null;
  input: MutableRefObject<{ x: number; z: number }>;
  goal: MutableRefObject<Goal | null>;
  paused: boolean;
  pos: MutableRefObject<THREE.Vector3>;
  onNear: (id: string | null) => void;
  onArrive: (id: string) => void;
  dogPos: MutableRefObject<THREE.Vector2>;
  catPos: MutableRefObject<THREE.Vector2>;
}) => {
  const g = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const vel = useRef(new THREE.Vector2());
  const face = useRef(Math.PI);
  const near = useRef<string | null>(null);
  const entering = useRef(false);
  const camLook = useRef(new THREE.Vector3(0, 1.2, -2));
  const cameFromInside = useRef(false);
  const lastPlace = useRef(place);
  if (lastPlace.current !== place) {
    cameFromInside.current = place === null;
    lastPlace.current = place;
  }
  const { camera } = useThree();
  const items = place === "home" ? HOME_ITEMS : STREET_ITEMS;
  const bounds = place === "home" ? BOUNDS.home : BOUNDS.street;
  const dogSolid = useMemo(() => ({ x: 0, z: 0, r: 0.42 }), []);
  const streetSolids = useMemo<Solid[]>(() => [...STREET_SOLIDS, dogSolid], [dogSolid]);

  useFrame((s, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const p = pos.current;
    const i = input.current;
    let vx = 0;
    let vz = 0;
    const len = Math.hypot(i.x, i.z);
    if (!paused && len > 0.05) {
      vx = (i.x / Math.max(1, len)) * 3.8;
      vz = (i.z / Math.max(1, len)) * 3.8;
      goal.current = null;
    } else if (!paused && goal.current) {
      const gx = goal.current.x - p.x;
      const gz = goal.current.z - p.z;
      const d = Math.hypot(gx, gz);
      if (d < 0.25) {
        const id = goal.current.id;
        goal.current = null;
        if (id) onArrive(id);
      } else {
        vx = (gx / d) * 4.2;
        vz = (gz / d) * 4.2;
      }
    }
    // ease into and out of a walk instead of snapping
    vel.current.x = THREE.MathUtils.damp(vel.current.x, vx, 9, dt);
    vel.current.y = THREE.MathUtils.damp(vel.current.y, vz, 9, dt);
    const speed = vel.current.length();
    const moving = speed > 0.15;
    p.x = clamp(p.x + vel.current.x * dt, -bounds.x, bounds.x);
    p.z = clamp(p.z + vel.current.y * dt, bounds.zMin, bounds.zMax);
    if (place === null) {
      // the dog is solid too: you walk around it, not through it
      dogSolid.x = dogPos.current.x;
      dogSolid.z = dogPos.current.y;
      const [cx, cz] = resolveSolids(streetSolids, p.x, p.z, 0.27);
      p.x = cx;
      p.z = cz;
    }
    if (moving) face.current = dampAngle(face.current, Math.atan2(vel.current.x, vel.current.y), 10, dt);
    const t = s.clock.elapsedTime;
    if (g.current) {
      const k = Math.min(1, speed / 3.8);
      g.current.position.set(p.x, Math.abs(Math.sin(t * 10)) * 0.045 * k, p.z);
      g.current.rotation.y = face.current;
      if (body.current) {
        body.current.rotation.x = 0.1 * k;
        body.current.rotation.z = Math.sin(t * 10) * 0.04 * k;
      }
    }
    const k2 = Math.min(1, speed / 3.8);
    const sw = Math.sin(t * 10) * 0.75 * k2;
    if (legL.current) legL.current.rotation.x = sw;
    if (legR.current) legR.current.rotation.x = -sw;
    if (armL.current) armL.current.rotation.x = -sw * 0.9;
    if (armR.current) armR.current.rotation.x = sw * 0.9;

    let best: string | null = null;
    let bestD = Infinity;
    for (const it of items) {
      const ix = it.id === "dog" ? dogPos.current.x : it.id === "cat" ? catPos.current.x : it.pos[0];
      const iz = it.id === "dog" ? dogPos.current.y : it.id === "cat" ? catPos.current.y : it.pos[1];
      const d = Math.hypot(p.x - ix, p.z - iz);
      if (d < it.radius && d < bestD) {
        best = it.id;
        bestD = d;
      }
    }
    if (best !== near.current) {
      near.current = best;
      onNear(best);
    }

    // walking up to a doorway takes you inside
    if (place === null && !entering.current) {
      const go = (id: string) => {
        entering.current = true;
        onArrive(id);
      };
      if (p.x < -1.95 && Math.abs(p.z + 10) < 0.85) go("home");
      else if (p.x > 1.55 && Math.abs(p.z + 24) < 1.1) go("cafe");
      else if (p.x < -1.55 && Math.abs(p.z + 38) < 1.1) go("workshop");
      else if (p.x > 1.45 && Math.abs(p.z + 52) < 1.1) go("books");
      else if (p.z < -64.2) go("gate");
    }

    if (place === null) {
      const target = new THREE.Vector3(p.x * 0.45, 3.4, p.z + 6.2);
      const look = new THREE.Vector3(p.x * 0.7, 1.3, p.z - 2.5);
      if (cameFromInside.current) {
        // back from a shop or the house: arrive on the street camera instead of sweeping across from the interior
        camera.position.copy(target);
        camLook.current.copy(look);
        cameFromInside.current = false;
      } else {
        camera.position.lerp(target, 1 - Math.exp(-4 * dt));
        camLook.current.lerp(look, 1 - Math.exp(-6 * dt));
      }
      camera.lookAt(camLook.current);
    }
  });

  return <Avatar ref={g} legL={legL} legR={legR} armL={armL} armR={armR} body={body} />;
};

/* ---------- Scene ---------- */

export interface WorldProps {
  place: Place | null;
  input: MutableRefObject<{ x: number; z: number }>;
  goal: MutableRefObject<Goal | null>;
  paused: boolean;
  visited: Set<string>;
  onNear: (id: string | null) => void;
  onInteract: (id: string) => void;
  fx: MutableRefObject<Fx>;
  selected: number;
  letterOpen: boolean;
  reading: boolean;
  radio: boolean;
  turn: MutableRefObject<number>;
  focus: "laptop" | "kitchen" | null;
  cafeBegin: MutableRefObject<number>;
}

const Scene = (p: WorldProps) => {
  const { place } = p;
  const pos = useRef(new THREE.Vector3(0, 0, 4));
  const streetPos = useRef(pos.current.clone());
  const dogPos = useRef(new THREE.Vector2(1.5, -31));
  const catPos = useRef(new THREE.Vector2(-3, 1.3));
  const vendor = useRef(0);
  const [hover, setHover] = useState(false);
  useCursor(hover);
  const prev = useRef<Place | null>(null);
  const { camera } = useThree();

  // entering and leaving a place: remember a safe spot in the hẻm (stepped away from the doorway so we
  // don't walk straight back in), and start inside the house at the door
  useEffect(() => {
    if (prev.current === null && place !== null) {
      const safe = pos.current.clone();
      if (Math.abs(safe.x) > 1.0 && [-10, -24, -38, -52].some((z) => Math.abs(safe.z - z) < 1.6)) safe.x = Math.sign(safe.x) * 0.9;
      if (safe.z < -62.5) safe.z = -61.5;
      streetPos.current.copy(safe);
      pos.current.copy(safe);
    }
    if (place === null && prev.current !== null) {
      pos.current.copy(streetPos.current);
      camera.position.set(pos.current.x * 0.45, 3.4, pos.current.z + 6.2);
    }
    p.goal.current = null;
    prev.current = place;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place]);

  const left = useMemo(() => segments([{ z: -10, id: "home" }, { z: -38, id: "workshop" }]), []);
  const right = useMemo(() => segments([{ z: -24, id: "cafe" }, { z: -52, id: "books" }]), []);
  const signs: Record<string, { text: string; sub: string | null; style: "red" | "enamel" | "teal" | "yellow" }> = {
    home: { text: "HOME", sub: "Nhà", style: "enamel" },
    cafe: { text: "ICED MILK COFFEE", sub: "Cà phê sữa đá", style: "red" },
    workshop: { text: "ELECTRONICS STORE", sub: "Cửa hàng điện tử", style: "teal" },
    books: { text: "BOOKSHOP", sub: "Tiệm sách", style: "yellow" },
  };
  const act = (id: string) => (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    p.onInteract(id);
  };
  const walkTo = (id: string) => {
    const pl = PLACES.find((x) => x.id === id)!;
    p.goal.current = { x: pl.pos[0], z: pl.pos[1], id };
  };
  const awnings: [number, 1 | -1, [string, string, string]][] = [
    [-16.5, -1, ["#2c8c7e", "#f1e6cf", "#14392f"]],
    [-27, -1, ["#d8342b", "#f1e6cf", "#1b4b9b"]],
    [-44, -1, ["#f4b73f", "#f1e6cf", "#d8342b"]],
    [0.5, 1, ["#d8342b", "#f1e6cf", "#1b4b9b"]],
    [-8, 1, ["#2c8c7e", "#f1e6cf", "#14392f"]],
    [-35, 1, ["#1b4b9b", "#f1e6cf", "#f4b73f"]],
    [-60, 1, ["#f4b73f", "#f1e6cf", "#2c8c7e"]],
  ];

  return (
    <>
      <color attach="background" args={["#ecd9b0"]} />
      <fog attach="fog" args={["#e8d3a6", 16, 58]} />
      <Atmosphere indoor={place !== null} />

      {/* ---------------- the hẻm ---------------- */}
      <group visible={place === null}>
        <hemisphereLight args={["#f6e4bc", "#a88a5e", 1.5]} />
        <directionalLight position={[4, 14, 6]} intensity={2.3} color="#ffdda0" />
        {[[0, 2], [-2, -10], [0, -32], [0, -64]].map(([x, z]) => (
          <pointLight key={`${x}${z}`} position={[x, 3.2, z]} intensity={14} distance={16} decay={2} color="#ffd9a0" />
        ))}

        <Street />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -34]} onPointerDown={(e) => { e.stopPropagation(); p.goal.current = { x: clamp(e.point.x, -2.1, 2.1), z: clamp(e.point.z, -68, 6) }; }} onPointerOver={() => setHover(false)}>
          <planeGeometry args={[6.4, 96]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {left.map((s, i) => (
          <Near key={`l${i}`} z={s.z} pos={pos}>
            <Building side={-1} seg={s} index={i} sign={s.spot ? signs[s.spot] : undefined} />
          </Near>
        ))}
        {right.map((s, i) => (
          <Near key={`r${i}`} z={s.z} pos={pos}>
            <Building side={1} seg={s} index={i + 4} sign={s.spot ? signs[s.spot] : undefined} />
          </Near>
        ))}
        <Entry />

        <group position={[0, 0, -10]}>
          <Mirror>
            <HouseFront />
          </Mirror>
        </group>
        <group position={[0, 0, -24]}>
          <CoffeeStall vendor={vendor} />
        </group>
        <group position={[0, 0, -38]}>
          <Mirror>
            <Suspense fallback={null}>
              <RepairShop />
            </Suspense>
          </Mirror>
        </group>
        <group position={[0, 0, -52]}>
          <BookStall />
        </group>
        <EndGate />

        {([[1, -5.5], [-1, -20.5], [1, -33], [-1, -47]] as [1 | -1, number][]).map(([side, z]) => (
          <WallFlag key={z} side={side} z={z} />
        ))}

        {awnings.map(([z, side, cols], i) => (
          <Awning key={i} side={side} z={z} depth={6} colors={cols} />
        ))}
        {[-4, -17, -31, -47, -58].map((z, i) => (
          <UtilityPole key={z} z={z} side={i % 2 ? 1 : -1} />
        ))}

        {PLACES.map((pl) => (
          <PlaceMarker key={pl.id} x={Math.sign(pl.pos[0]) * 0.7} z={pl.pos[1] + (pl.id === "gate" ? 4 : 0)} text={pl.label} sub={pl.sub} visited={p.visited.has(pl.id)} onClick={() => walkTo(pl.id)} />
        ))}

        <Plant pos={[-2.9, 0, -3]} s={1.2} />
        <Plant pos={[2.9, 0, -9]} />
        <Plant pos={[-2.9, 0, -29]} s={1.4} />
        <Plant pos={[2.9, 0, -44]} />

        <group onClick={act("dog")} onPointerOver={() => setHover(true)} onPointerOut={() => setHover(false)}>
          <Pet kind="dog" home={[1.5, 0, -31]} playerPos={pos} trigger="bark" fx={p.fx} dogPos={dogPos} />
        </group>
      </group>

      {/* ---------------- inside ---------------- */}
      {place === "home" && (
        <Suspense fallback={null}>
          <HomeRoom focus={p.focus} fx={p.fx} input={p.input} turn={p.turn} paused={p.paused} onNear={p.onNear} onPick={p.onInteract} catPos={catPos} radio={p.radio} />
        </Suspense>
      )}
      {place === "cafe" && <CafeScene fx={p.fx} onPick={p.onInteract} begin={p.cafeBegin} reading={p.reading} />}
      {place === "workshop" && (
        <Suspense fallback={null}>
          <WorkshopScene onPick={p.onInteract} selected={p.selected} />
        </Suspense>
      )}
      {place === "books" && <BookScene onPick={p.onInteract} selected={p.selected} />}
      {place === "gate" && <GateScene onPick={p.onInteract} open={p.letterOpen} />}

      {place === null && (
        <Player place={place} input={p.input} goal={p.goal} paused={p.paused} pos={pos} onNear={p.onNear} onArrive={p.onInteract} dogPos={dogPos} catPos={catPos} />
      )}
    </>
  );
};

export default function World(props: WorldProps) {
  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ fov: 55, near: 0.2, far: 90, position: [0, 3.4, 10.2] }}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}
