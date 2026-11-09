import { MutableRefObject, Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Blob, Box, Glow } from "./kit";
import { Model, usePBR } from "./gfx";
import { AcousticGuitar, ElectricGuitar } from "./guitars";
import { Steam, Fx } from "./parts";
import { alleyNightTexture, hotspotTexture, landmarkPoster, laptopKeysTexture, laptopScreenTexture, musicNoteTexture, radioDialTexture, radioGrilleTexture, rugTexture, tileTexture, wainscotTexture } from "./textures";

/* First-person house. Room is 7 x 7 m, ceiling 3.2 m. Front wall (door) at z=+3.5, back wall at z=-3.5. */
const W = 3.5;
const H = 3.2;
const EYE = 1.6;

/** Furniture footprints for collision: [x0, x1, z0, z1] */
const SOLIDS: [number, number, number, number][] = [
  [-1.1, 1.1, -3.5, -2.55], // sideboard
  [-3.5, -1.7, -3.5, -2.85], // bookshelf
  [1.7, 3.5, -3.5, -2.2], // desk
  [-3.5, -2.45, -2.3, 0.7], // kitchen run
  [-3.5, -2.3, 1.0, 2.7], // sofa
  [-1.95, -1.05, 1.25, 2.15], // tea table
  [2.9, 3.5, -0.1, 0.7], // side table
  [2.8, 3.5, 1.9, 2.5], // amp
  [2.35, 3.0, -2.4, -1.8], // desk chair
];

const AUTO: [string, number, number, number][] = [
  ["laptop", 2.62, -2.4, 1.3],
  ["kitchen", -2.55, -0.8, 1.35],
  ["shelf", -2.7, -2.4, 1.2],
];

const Louvre = ({ w = 0.5, h = 1.5 }: { w?: number; h?: number }) => (
  <group>
    <Box p={[0, 0, 0]} s={[w, h, 0.03]} c="#3f7a58" r={0.7} />
    {Array.from({ length: 10 }, (_, i) => (
      <mesh key={i} position={[0, -h / 2 + 0.12 + i * ((h - 0.2) / 9), 0.02]} rotation={[0.5, 0, 0]}>
        <boxGeometry args={[w - 0.08, 0.05, 0.012]} />
        <meshStandardMaterial color="#2f6a49" roughness={0.7} />
      </mesh>
    ))}
  </group>
);

/** A carbon-steel wok on an iron trivet over the burner: flat-bottomed so it sits, with a lip, a long handle and a little food */
const Wok = () => {
  const body = useMemo(
    () =>
      new THREE.LatheGeometry(
        [[0, 0], [0.12, 0], [0.14, 0.012], [0.24, 0.115], [0.255, 0.13], [0.245, 0.13], [0.23, 0.11], [0.13, 0.03], [0, 0.026]].map(([r, y]) => new THREE.Vector2(r, y)),
        32,
      ),
    [],
  );
  return (
    <group position={[0, 0.935, 0]}>
      {/* trivet: three iron feet between the stove top and the wok */}
      <mesh position={[0, -0.007, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.12, 0.008, 6, 24]} />
        <meshStandardMaterial color="#14111a" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh geometry={body}>
        <meshStandardMaterial color="#4a4a54" metalness={0.7} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.134, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.25, 0.007, 6, 32]} />
        <meshStandardMaterial color="#c7c7d1" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* a riveted steel tab on the rim, a metal shank, then the wooden grip, all sloping gently up and out */}
      <mesh position={[0.235, 0.12, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.09, 0.014, 0.05]} />
        <meshStandardMaterial color="#4a4a54" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0.31, 0.138, 0]} rotation={[0, 0, 0.12 - Math.PI / 2]}>
        <cylinderGeometry args={[0.011, 0.011, 0.1, 8]} />
        <meshStandardMaterial color="#c7c7d1" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.43, 0.152, 0]} rotation={[0, 0, 0.12 - Math.PI / 2]}>
        <cylinderGeometry args={[0.016, 0.014, 0.17, 8]} />
        <meshStandardMaterial color="#6a3f22" roughness={0.7} />
      </mesh>
      {/* stir-fry: a low mound of greens and carrot that sits inside the wall of the pan */}
      <mesh position={[0, 0.034, 0]} scale={[1, 0.38, 1]}>
        <sphereGeometry args={[0.115, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#3f7a58" roughness={0.8} />
      </mesh>
      {[[0.04, 0.02, "#e07b39"], [-0.05, 0.05, "#e07b39"], [0.0, -0.06, "#e8dcc0"], [-0.06, -0.03, "#7aa84a"], [0.07, -0.04, "#7aa84a"]].map(([x, z, c], i) => {
        const r = Math.hypot(x as number, z as number);
        return (
          <mesh key={i} position={[x as number, 0.034 + 0.044 * Math.sqrt(Math.max(0, 1 - (r / 0.115) ** 2)) - 0.004, z as number]} scale={[1, 0.6, 1.3]}>
            <sphereGeometry args={[0.02, 8, 6]} />
            <meshStandardMaterial color={c as string} roughness={0.7} />
          </mesh>
        );
      })}
    </group>
  );
};

/** A 1960s Saigon tabletop radio: walnut case, cloth grille, a lit tuning dial and two knobs. Glows amber when it is playing. */
const Radio = ({ on }: { on: boolean }) => {
  const grille = useMemo(() => radioGrilleTexture(), []);
  const dial = useMemo(() => radioDialTexture(), []);
  const note = useMemo(() => musicNoteTexture(), []);
  const notes = useRef<(THREE.Sprite | null)[]>([]);
  useFrame((s) => {
    notes.current.forEach((n, i) => {
      if (!n) return;
      const t = (s.clock.elapsedTime * 0.3 + i / 3) % 1;
      n.position.set(0.05 + Math.sin(t * 6 + i) * 0.06, 0.3 + t * 0.55, 0.15);
      (n.material as THREE.SpriteMaterial).opacity = Math.sin(t * Math.PI) * 0.9;
    });
  });
  return (
    <group>
      {[[-0.18, -0.05], [0.18, -0.05], [-0.18, 0.05], [0.18, 0.05]].map(([x, z], i) => (
        <Box key={i} p={[x, 0.008, z]} s={[0.03, 0.016, 0.03]} c="#14111a" />
      ))}
      <Box p={[0, 0.136, 0]} s={[0.42, 0.24, 0.16]} c="#7a4a28" r={0.5} />
      <Box p={[0, 0.262, 0]} s={[0.43, 0.012, 0.17]} c="#e8dcc0" r={0.5} />
      <mesh position={[-0.08, 0.14, 0.0805]}>
        <planeGeometry args={[0.22, 0.17]} />
        <meshBasicMaterial map={grille} color={on ? "#ffffff" : "#a89880"} toneMapped={false} />
      </mesh>
      <mesh position={[0.125, 0.165, 0.0805]}>
        <planeGeometry args={[0.13, 0.17]} />
        <meshBasicMaterial map={dial} color={on ? "#ffd9a0" : "#6f6552"} toneMapped={false} />
      </mesh>
      {[0.1, 0.15].map((x) => (
        <mesh key={x} position={[x, 0.07, 0.09]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.014, 0.016, 0.02, 14]} />
          <meshStandardMaterial color="#e8dcc0" roughness={0.4} />
        </mesh>
      ))}
      {on && <Glow p={[0.125, 0.165, 0.12]} s={0.4} color="255,170,80" o={0.9} />}
      {on &&
        [0, 1, 2].map((i) => (
          <sprite key={i} ref={(n) => (notes.current[i] = n)} scale={[0.12, 0.12, 1]}>
            <spriteMaterial map={note} transparent depthWrite={false} toneMapped={false} />
          </sprite>
        ))}
    </group>
  );
};

/** A modern laptop: aluminium base with a keyboard and trackpad, and a lid that swings open on its hinge */
const OpenLaptop = ({ lid, pos, rot }: { lid: MutableRefObject<number>; pos: [number, number, number]; rot: number }) => {
  const keys = useMemo(() => laptopKeysTexture(), []);
  const screen = useMemo(() => laptopScreenTexture(), []);
  const hinge = useRef<THREE.Group>(null);
  const LW = 0.34;
  const LD = 0.23;
  useFrame(() => {
    if (hinge.current) hinge.current.rotation.x = -lid.current * 1.85; // 0 = shut flat, 1 = open past vertical
  });
  return (
    <group position={pos} rotation={[0, rot, 0]} scale={1.25}>
      <Box p={[0, 0.007, 0]} s={[LW, 0.014, LD]} c="#c5c8ce" r={0.35} m={0.8} />
      <mesh position={[0, 0.0145, 0.005]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[LW - 0.02, LD - 0.025]} />
        <meshStandardMaterial map={keys} roughness={0.5} />
      </mesh>
      {[-1, 1].map((sx) => (
        <Box key={sx} p={[sx * (LW / 2 - 0.02), -0.002, LD / 2 - 0.02]} s={[0.03, 0.004, 0.02]} c="#14111a" />
      ))}
      {[-1, 1].map((sx) => (
        <Box key={`b${sx}`} p={[sx * (LW / 2 - 0.02), -0.002, -LD / 2 + 0.02]} s={[0.03, 0.004, 0.02]} c="#14111a" />
      ))}
      {/* the lid turns about the back edge of the base */}
      <group ref={hinge} position={[0, 0.014, -LD / 2]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.006, 0.006, LW * 0.7, 10]} />
          <meshStandardMaterial color="#9a9da4" metalness={0.8} roughness={0.4} />
        </mesh>
        <Box p={[0, 0.006, LD / 2]} s={[LW, 0.01, LD]} c="#c5c8ce" r={0.35} m={0.8} />
        <mesh position={[0, 0.0115, LD / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.022, 20]} />
          <meshBasicMaterial color="#f1efe8" toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.0005, LD / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[LW - 0.02, LD - 0.02]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

/** A pulsing marker over something you can use */
export const Hotspot = ({ p, id, hover, hide }: { p: [number, number, number]; id: string; hover: MutableRefObject<string | null>; hide: boolean }) => {
  const tex = useMemo(() => hotspotTexture(), []);
  const ref = useRef<THREE.Sprite>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.visible = !hide;
    const active = hover.current === id;
    const t = s.clock.elapsedTime;
    const k = 0.34 + Math.sin(t * 2.6 + p[0] * 3) * 0.05 + (active ? 0.16 : 0);
    ref.current.scale.set(k, k, 1);
    (ref.current.material as THREE.SpriteMaterial).opacity = active ? 1 : 0.72 + Math.sin(t * 2.6) * 0.2;
    ref.current.position.y = p[1] + Math.sin(t * 1.8 + p[2]) * 0.03;
  });
  return (
    <sprite ref={ref} position={p} renderOrder={6}>
      <spriteMaterial map={tex} transparent depthTest={false} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} fog={false} />
    </sprite>
  );
};

export const HomeRoom = ({
  fx,
  input,
  turn,
  paused,
  onNear,
  onPick,
  catPos,
  focus,
  radio,
}: {
  focus: "laptop" | "kitchen" | null;
  radio: boolean;
  fx: MutableRefObject<Fx>;
  input: MutableRefObject<{ x: number; z: number }>;
  turn: MutableRefObject<number>;
  paused: boolean;
  onNear: (id: string | null) => void;
  onPick: (id: string) => void;
  catPos: MutableRefObject<THREE.Vector2>;
}) => {
  const plaster = usePBR("beige_wall_001", [3, 1.2]);
  const floor = useMemo(() => {
    const t = tileTexture();
    t.repeat.set(7, 7);
    return t;
  }, []);
  const wains = useMemo(() => {
    const t = wainscotTexture();
    t.repeat.set(5, 1.3);
    return t;
  }, []);
  const rug = useMemo(() => rugTexture(), []);
  const alley = useMemo(() => alleyNightTexture(), []);
  const posters = useMemo(() => (["benthanh", "ducba", "buudien", "nhahat"] as const).map((k) => landmarkPoster(k)), []);
  const root = useRef<THREE.Group>(null);
  const strum = useRef(-9);
  const riff = useRef(-9);
  const fan = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const st = useRef({ x: 0, z: 2.5, yaw: 0, pitch: 0, bob: 0, hover: null as string | null, tick: 0, leaving: false });
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const lid = useRef(0);
  const armed = useRef<Record<string, boolean>>({ laptop: true, kitchen: true, shelf: true });
  const lastPose = useRef<{ pos: THREE.Vector3; look: THREE.Vector3 } | null>(null);
  const fk = useRef(0);
  const flame = useRef<THREE.PointLight>(null);
  const hoverId = useRef<string | null>(null);
  const lookM = useMemo(() => new THREE.Matrix4(), []);
  const qTarget = useMemo(() => new THREE.Quaternion(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const qFree = useMemo(() => new THREE.Quaternion(), []);
  const eul = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const POSES = useMemo(
    () => ({
      laptop: { pos: new THREE.Vector3(2.62, 1.18, -2.0), look: new THREE.Vector3(2.62, 0.95, -2.95) },
      kitchen: { pos: new THREE.Vector3(-2.15, 1.7, -0.8), look: new THREE.Vector3(-3.0, 0.9, -0.8) },
    }),
    [],
  );

  const pickAt = (ndc: THREE.Vector2) => {
    if (!root.current) return null;
    ray.setFromCamera(ndc, camera);
    ray.far = 4.5;
    const hit = ray.intersectObjects(root.current.children, true)[0];
    let o: THREE.Object3D | null = hit?.object ?? null;
    while (o && !o.userData.id) o = o.parent;
    return (o?.userData.id as string | undefined) ?? null;
  };

  // drag to look, click to use what you point at
  useEffect(() => {
    const el = gl.domElement;
    let down = false;
    let moved = 0;
    let lx = 0;
    let ly = 0;
    const pd = (e: PointerEvent) => {
      down = true;
      moved = 0;
      lx = e.clientX;
      ly = e.clientY;
    };
    const pm = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      st.current.yaw -= dx * 0.005;
      st.current.pitch = THREE.MathUtils.clamp(st.current.pitch - dy * 0.004, -1.0, 0.9);
    };
    const pu = (e: PointerEvent) => {
      if (down && moved < 6) {
        const r = el.getBoundingClientRect();
        const id = pickAt(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1));
        if (id) onPick(id);
      }
      down = false;
    };
    el.addEventListener("pointerdown", pd);
    window.addEventListener("pointermove", pm);
    window.addEventListener("pointerup", pu);
    return () => {
      el.removeEventListener("pointerdown", pd);
      window.removeEventListener("pointermove", pm);
      window.removeEventListener("pointerup", pu);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, camera]);

  useFrame((s, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const c = st.current;
    if (!paused && !focus) {
      c.yaw -= turn.current * 1.8 * dt;
      const sp = 2.2;
      const fx_ = -input.current.z;
      const rx = input.current.x;
      const dx = (-Math.sin(c.yaw) * fx_ + Math.cos(c.yaw) * rx) * sp * dt;
      const dz = (-Math.cos(c.yaw) * fx_ - Math.sin(c.yaw) * rx) * sp * dt;
      let nx = THREE.MathUtils.clamp(c.x + dx, -W + 0.35, W - 0.35);
      let nz = THREE.MathUtils.clamp(c.z + dz, -W + 0.35, W - 0.35);
      for (const [x0, x1, z0, z1] of SOLIDS) {
        const r = 0.3;
        if (nx > x0 - r && nx < x1 + r && nz > z0 - r && nz < z1 + r) {
          const pushes = [nx - (x0 - r), x1 + r - nx, nz - (z0 - r), z1 + r - nz];
          const m = Math.min(...pushes);
          if (m === pushes[0]) nx = x0 - r;
          else if (m === pushes[1]) nx = x1 + r;
          else if (m === pushes[2]) nz = z0 - r;
          else nz = z1 + r;
        }
      }
      if (Math.hypot(nx - c.x, nz - c.z) > 0.001) c.bob += dt * 8;
      c.x = nx;
      c.z = nz;
      if (nz > W - 0.45 && Math.abs(nx) < 1.2 && !c.leaving) {
        c.leaving = true;
        onPick("door");
      }
    }
    // free first-person camera, blended toward a focus pose when you open the laptop or lean over the stove
    fk.current = THREE.MathUtils.damp(fk.current, focus ? 1 : 0, 2.6, dt);
    const e = fk.current * fk.current * (3 - 2 * fk.current);
    eul.set(c.pitch, c.yaw, 0);
    qFree.setFromEuler(eul);
    // walking up to the laptop, the stove or the bookshelf opens it
    if (!paused && !focus) {
      for (const [id, ax, az, r] of AUTO) {
        const d = Math.hypot(c.x - ax, c.z - az);
        if (armed.current[id] && d < r) {
          armed.current[id] = false;
          onPick(id);
        } else if (d > r + 0.9) armed.current[id] = true;
      }
    }
    camera.position.set(c.x, EYE + Math.sin(c.bob) * 0.015, c.z);
    camera.quaternion.copy(qFree);
    const pose = focus ? POSES[focus] : null;
    if (pose && e > 0.001) {
      camera.position.lerp(pose.pos, e);
      lookM.lookAt(pose.pos, pose.look, up);
      qTarget.setFromRotationMatrix(lookM);
      camera.quaternion.slerp(qTarget, e);
    } else if (!focus && e > 0.001 && lastPose.current) {
      camera.position.lerp(lastPose.current.pos, e);
      lookM.lookAt(lastPose.current.pos, lastPose.current.look, up);
      qTarget.setFromRotationMatrix(lookM);
      camera.quaternion.slerp(qTarget, e);
    }
    if (focus) lastPose.current = pose;
    lid.current = THREE.MathUtils.damp(lid.current, focus === "laptop" ? 1 : 0, 3.2, dt);
    if (flame.current) flame.current.intensity = THREE.MathUtils.damp(flame.current.intensity, focus === "kitchen" ? 9 + Math.sin(s.clock.elapsedTime * 22) * 2.5 : 0, 5, dt);
    if (fan.current) fan.current.rotation.y += dt * 3;
    strum.current = fx.current.strum;
    riff.current = fx.current.riff;
    catPos.current.set(-2.9, 1.7);

    c.tick++;
    if (c.tick % 4 === 0) {
      const id = paused || focus ? null : pickAt(new THREE.Vector2(0, 0));
      if (id !== c.hover) {
        c.hover = id;
        hoverId.current = id;
        onNear(id);
      }
    }
    void s;
  });

  const pick = (id: string, children: React.ReactNode) => <group userData={{ id }}>{children}</group>;

  return (
    <group>
      <color attach="background" args={["#14100c"]} />
      <hemisphereLight args={["#fff2d6", "#b89f78", 1.1]} />
      <directionalLight position={[-3, 4, 6]} intensity={1.4} color="#fff0cc" />
      <pointLight position={[0, 2.8, 0]} intensity={8} distance={10} decay={1.6} color="#ffe2b0" />
      <pointLight position={[-2.2, 1.9, 3.2]} intensity={6} distance={5} decay={2} color="#cfe6ff" />

      {/* floor, ceiling, walls */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W * 2, W * 2]} />
        <meshStandardMaterial map={floor} roughness={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W * 2, W * 2]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.95} />
      </mesh>
      {[-1.9, 0, 1.9].map((x) => (
        <Box key={x} p={[x, H - 0.12, 0]} s={[0.22, 0.24, W * 2]} c="#4a2f1c" r={0.6} />
      ))}
      {([
        [0, -W, 0, W * 2],
        [-W, 0, Math.PI / 2, W * 2],
        [W, 0, -Math.PI / 2, W * 2],
      ] as [number, number, number, number][]).map(([x, z, ry, w], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, ry, 0]}>
          <mesh position={[0, 1.1 + (H - 1.1) / 2, 0.01]}>
            <planeGeometry args={[w, H - 1.1]} />
            <meshStandardMaterial {...plaster} color="#e6bd62" />
          </mesh>
          <mesh position={[0, 0.55, 0.012]}>
            <planeGeometry args={[w, 1.1]} />
            <meshStandardMaterial map={wains} roughness={0.35} />
          </mesh>
          <Box p={[0, 1.12, 0.03]} s={[w, 0.06, 0.05]} c="#4a2f1c" r={0.5} />
          <Box p={[0, 0.06, 0.03]} s={[w, 0.12, 0.04]} c="#4a2f1c" r={0.5} />
        </group>
      ))}
      {/* front wall around the door and window */}
      <group position={[0, 0, W]} rotation={[0, Math.PI, 0]}>
        {[[-2.4, 2.2], [2.4, 2.2]].map(([x, w]) => (
          <mesh key={x} position={[x, H / 2, 0]}>
            <planeGeometry args={[w, H]} />
            <meshStandardMaterial {...plaster} color="#e6bd62" />
          </mesh>
        ))}
        <mesh position={[0, 2.8, 0]}>
          <planeGeometry args={[2.6, 0.8]} />
          <meshStandardMaterial {...plaster} color="#e6bd62" />
        </mesh>
        {[-1.3, 1.3].map((x) => (
          <Box key={x} p={[x, 1.2, 0.03]} s={[0.12, 2.4, 0.1]} c="#3a2616" r={0.5} />
        ))}
        <Box p={[0, 2.4, 0.03]} s={[2.72, 0.12, 0.1]} c="#3a2616" r={0.5} />
        <mesh position={[0, 1.2, -0.9]}>
          <planeGeometry args={[2.6, 2.4]} />
          <meshBasicMaterial map={alley} toneMapped={false} />
        </mesh>
        {/* wooden doors swung open */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 1.2, 0, 0.1]} rotation={[0, s * -1.45, 0]}>
            <Box p={[s * -0.34, 1.15, 0]} s={[0.68, 2.3, 0.05]} c="#6a3f22" r={0.55} />
            <Box p={[s * -0.34, 1.65, 0.03]} s={[0.46, 0.7, 0.02]} c="#5a3419" r={0.6} />
            <Box p={[s * -0.34, 0.6, 0.03]} s={[0.46, 0.7, 0.02]} c="#5a3419" r={0.6} />
          </group>
        ))}
        <mesh position={[-2.6 + 0.0, 1.5, 0.02]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
        </mesh>
      </group>
      {/* French-style window on the front wall, shutters open */}
      <group position={[-2.5, 1.9, W - 0.02]} rotation={[0, Math.PI, 0]}>
        <Box p={[0, 0, 0]} s={[1.3, 1.6, 0.08]} c="#3a2616" r={0.5} />
        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[1.12, 1.42]} />
          <meshBasicMaterial color="#9ec9e0" toneMapped={false} />
        </mesh>
        <Box p={[0, 0, 0.06]} s={[0.04, 1.42, 0.02]} c="#3a2616" r={0.5} />
        <group position={[-0.65, 0, 0.05]} rotation={[0, 1.3, 0]}>
          <group position={[0.25, 0, 0]}>
            <Louvre w={0.5} h={1.6} />
          </group>
        </group>
        <group position={[0.65, 0, 0.05]} rotation={[0, -1.3, 0]}>
          <group position={[-0.25, 0, 0]}>
            <Louvre w={0.5} h={1.6} />
          </group>
        </group>
      </group>

      {/* the ceiling: fan and a bare bulb */}
      <group position={[0, H - 0.25, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 6]} />
          <meshStandardMaterial color="#14111a" />
        </mesh>
        <group ref={fan} position={[0, -0.1, 0]}>
          <Model name="ceiling_fan" w={1.35} cast={false} />
        </group>
      </group>
      <group position={[-1.5, H, -0.6]}>
        <mesh position={[0, -0.35, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.7, 4]} />
          <meshBasicMaterial color="#14111a" />
        </mesh>
        <mesh position={[0, -0.74, 0]}>
          <sphereGeometry args={[0.07, 12, 10]} />
          <meshBasicMaterial color="#fff1c8" toneMapped={false} />
        </mesh>
        <Glow p={[0, -0.74, 0]} s={0.7} o={0.5} />
      </group>

      {/* back wall: sideboard with the framed portrait */}
      <group ref={root}>
        <group position={[0, 0, -W + 0.05]}>
          <Model name="chinese_commode" w={2.1} pos={[0, 0, 0.45]} />
          <Model name="ceramic_vase_01" h={0.4} pos={[-0.75, 0.945, 0.45]} />
          <Model name="tea_set_01" w={0.3} pos={[0.55, 0.945, 0.45]} />
        </group>
        {pick(
          "shelf",
          <group position={[-2.7, 0, -W + 0.3]}>
            <Model name="wooden_bookshelf_worn" h={2.25} />
            {[0.36, 0.72, 1.05, 1.38, 1.81].map((y, r) =>
              Array.from({ length: 9 }, (_, i) => {
                const hgt = Math.min(0.26 + ((i * 7 + r * 3) % 5) * 0.035, [0.3, 0.28, 0.28, 0.37, 0.4][r]);
                const wd = 0.07 + ((i * 3 + r) % 4) * 0.02;
                return (
                  <mesh key={`${r}${i}`} position={[-0.58 + i * 0.145 + (r % 2) * 0.02, y + hgt / 2, 0.0]}>
                    <boxGeometry args={[wd, hgt, 0.26]} />
                    <meshStandardMaterial color={["#a8392b", "#2f5f86", "#d9a441", "#e8dcc0", "#3f7a58", "#6a3f22"][(i + r * 2) % 6]} roughness={0.75} />
                  </mesh>
                );
              }),
            )}
          </group>,
        )}
        {pick(
          "laptop",
          <group position={[2.65, 0, -2.95]}>
            <Model name="painted_wooden_table" h={0.76} />
            <Suspense fallback={null}>
              <OpenLaptop lid={lid} pos={[-0.03, 0.764, 0.05]} rot={0.0} />
            </Suspense>
            <Model name="desk_lamp_arm_01" h={0.62} pos={[-0.62, 0.76, -0.22]} rot={[0, -2.14, 0]} />
            <Model name="painted_wooden_chair_01" h={0.95} pos={[0.1, 0, 0.95]} rot={[0, Math.PI, 0]} />
          </group>,
        )}
        {pick(
          "kitchen",
          <group position={[-W + 0.35, 0, -0.8]}>
            <Box p={[0, 0.45, -0.95]} s={[0.7, 0.9, 1.0]} c="#2f6a49" r={0.55} />
            <Box p={[0, 0.92, -0.95]} s={[0.76, 0.05, 1.06]} c="#e8dcc0" r={0.4} />
            <Box p={[0, 0.45, 0.95]} s={[0.7, 0.9, 0.8]} c="#2f6a49" r={0.55} />
            <Box p={[0, 0.92, 0.95]} s={[0.76, 0.05, 0.86]} c="#e8dcc0" r={0.4} />
            <Model name="electric_stove" h={0.92} rot={[0, Math.PI / 2, 0]} />
            <Wok />
            <Steam pos={[0, 1.1, 0]} />
            {focus === "kitchen" && <Steam pos={[0.02, 1.08, 0.04]} />}
            <pointLight ref={flame} position={[0.05, 0.95, 0]} intensity={0} distance={3} color="#ff8a3a" />
            <Box p={[-0.2, 1.7, 0]} s={[0.3, 0.04, 1.6]} c="#6a3f22" r={0.5} />
            {[-0.6, 0.6].map((z) => (
              <Box key={z} p={[-0.3, 1.65, z]} s={[0.2, 0.06, 0.04]} c="#3a2616" r={0.5} />
            ))}
            <Model name="brass_pot_01" h={0.3} pos={[-0.2, 1.72, -0.5]} />
            <Model name="pot_enamel_01" w={0.28} pos={[-0.2, 1.72, 0.1]} />
            <Model name="brass_pan_01" w={0.4} pos={[-0.2, 1.72, 0.6]} rot={[0, 1.2, 0]} />
            <Model name="ceramic_vase_01" h={0.4} pos={[0.2, 0.94, -0.95]} />
          </group>,
        )}
        <group position={[W - 0.12, 0.55, 1.35]} rotation={[0, -Math.PI / 2, 0]}>
          <Box p={[0, 1.05, -0.02]} s={[0.1, 0.04, 0.05]} c="#3a2616" />
          <AcousticGuitar shake={strum} />
        </group>
        <group position={[W - 0.1, 0.95, 0.3]} rotation={[0, -Math.PI / 2, 0]}>
          <Box p={[0, 1.1, -0.02]} s={[0.1, 0.04, 0.05]} c="#3a2616" />
          <ElectricGuitar shake={riff} />
        </group>
        {/* the radio on the side table under the guitars: click it to put a Saigon bolero on */}
        {pick(
          "radio",
          <group position={[W - 0.4, 0.55, 0.3]} rotation={[0, -Math.PI / 2, 0]}>
            <Radio on={radio} />
          </group>,
        )}
        {pick(
          "door",
          <mesh position={[0, 1.2, W - 0.2]} visible={false}>
            <boxGeometry args={[2.2, 2.4, 0.4]} />
          </mesh>,
        )}
      </group>

      {([
        ["laptop", [2.62, 1.12, -2.95]],
        ["kitchen", [-2.85, 1.3, -0.8]],
        ["radio", [W - 0.45, 0.95, 0.3]],
      ] as [string, [number, number, number]][]).map(([id, p]) => (
        <Hotspot key={id} id={id} p={p} hover={hoverId} hide={!!focus || paused || (id === "radio" && radio)} />
      ))}

      {/* sofa, tea table, armchair, rug, amp and radio: the living corner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.3, 0.012, 1.6]}>
        <planeGeometry args={[3.0, 2.1]} />
        <meshStandardMaterial map={rug} roughness={1} />
      </mesh>
      <Model name="sofa_02" w={1.9} pos={[-2.95, 0, 1.85]} rot={[0, Math.PI / 2, 0]} />
      <Model name="chinese_tea_table" w={0.9} pos={[-1.5, 0, 1.7]} />
      <Model name="tea_set_01" w={0.3} pos={[-1.5, 0.5, 1.7]} rot={[0, 0.6, 0]} />
      <Model name="side_table_01" w={0.55} pos={[W - 0.4, 0, 0.3 + 0.0]} />
      <Model name="portable_cassette_player" w={0.2} pos={[W - 0.35, 0.6, 2.2]} rot={[0, -1.2, 0]} />
      <Box p={[W - 0.35, 0.3, 2.2]} s={[0.4, 0.6, 0.5]} c="#1f1a16" r={0.8} />
      <mesh position={[W - 0.545, 0.3, 2.2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.36, 0.5]} />
        <meshStandardMaterial color="#6a5a3a" roughness={1} />
      </mesh>
      <Model name="wall_clock" w={0.34} pos={[0.2, 2.35, W - 0.05]} rot={[0, Math.PI, 0]} />
      <mesh position={[-W + 0.03, 1.95, 1.9]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.7, 0.98]} />
        <meshBasicMaterial map={posters[2]} toneMapped={false} />
      </mesh>
      <mesh position={[-W + 0.03, 1.95, 0.95]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.7, 0.98]} />
        <meshBasicMaterial map={posters[3]} toneMapped={false} />
      </mesh>
      {/* hand-painted posters */}
      {posters.slice(0, 2).map((t, i) => (
        <mesh key={i} position={[W - 0.03, 1.85, 1.0 - i * 0.9 - 0.4]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[0.7, 0.98]} />
          <meshBasicMaterial map={t} toneMapped={false} />
        </mesh>
      ))}
      {/* contact shadows */}
      <Blob p={[0, 0, -3.0]} w={2.6} d={1.4} />
      <Blob p={[-2.7, 0, -3.1]} w={1.8} d={1.0} />
      <Blob p={[2.65, 0, -2.9]} w={2.2} d={1.4} />
      <Blob p={[-3.1, 0, -0.8]} w={1.4} d={3.0} />
      <Blob p={[-2.95, 0, 1.85]} w={1.3} d={2.4} />
      <Blob p={[-1.5, 0, 1.7]} w={1.3} d={1.3} />
      <Blob p={[-0.2, 0, 2.2]} w={1.2} d={1.2} />
      <Suspense fallback={null} />
    </group>
  );
};
