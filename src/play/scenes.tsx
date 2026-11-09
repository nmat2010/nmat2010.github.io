import { MutableRefObject, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useCursor, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "@/data/projects";
import { researchInterests } from "@/data/about";
import { envelopeTexture, planksTexture, postcardTexture, postHallTexture, signTexture, spineTexture, tileTexture } from "./textures";
import { Box, Tube } from "./kit";
import { Model } from "./gfx";
import { CoffeeStall, PlasticTable } from "./Street";
import { CoffeeGlass, Fx, clamp, lerp } from "./parts";

const ease = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};

/* ================= CAFÉ ================= */

export const CafeScene = ({ begin }: { fx: MutableRefObject<Fx>; onPick: (id: string) => void; begin: MutableRefObject<number> }) => {
  const serve = useRef(0);
  const glass = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
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
      glass.current.position.set(lerp(0.2, 0.0, k), lerp(1.2, 0.53, k), lerp(-2.75, -0.95, k));
    }
    const wide = size.width / size.height > 1.15;
    const dolly = ease(t / 1.4);
    campos.set(wide ? -0.5 : 0, lerp(2.0, 1.6, dolly), lerp(2.6, 2.1, dolly));
    look.set(wide ? -1.0 : 0, 1.0, -2.4);
    camera.position.lerp(campos, 0.1);
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
      <Box p={[-4, 1.8, -3.3]} s={[2.2, 2.6, 0.1]} c="#6f7d78" />
      <mesh position={[0, 3.7, -3.3]}>
        <planeGeometry args={[3.9, 1.2]} />
        <meshBasicMaterial map={useMemo(() => signTexture("ICED MILK COFFEE", "Cà phê sữa đá", "red"), [])} toneMapped={false} />
      </mesh>
      {/* the same stall as in the alley, turned to face us */}
      <group position={[0.5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <CoffeeStall vendor={serve} />
      </group>
      {/* the table where the glass lands */}
      <PlasticTable p={[0, 0, -0.95]} c="#1b4b9b" glass={false} />
      <group ref={glass} position={[0.2, 1.2, -2.75]} scale={1.6}>
        <CoffeeGlass />
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
  const look = useMemo(() => new THREE.Vector3(0, 1.45, -1), []);
  const posts = useMemo(
    () => projects.map((p) => signTexture(p.title.toUpperCase(), p.subtitle, (["yellow", "teal", "red"] as const)[projects.indexOf(p) % 3])),
    [],
  );
  useFrame((s) => {
    const wide = size.width / size.height > 1.15;
    const t = Math.min(1, s.clock.elapsedTime * 0.8);
    camera.position.lerp(new THREE.Vector3(0, 1.7, wide ? 3.6 : 4.8 - t * 0.3), 0.08);
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
              onPick(`project-${i}`);
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
      <Model name="Television_01" w={0.7} pos={[-2.65, 0.87, -0.1]} rot={[0, 0.5, 0]} />
      <Model name="circuit_board" w={0.45} pos={[-1.3, 0.87, 0.15]} rot={[0, 0.3, 0]} />
      <Model name="retro_multimeter" h={0.24} pos={[1.4, 0.87, 0.15]} rot={[0, -0.6, 0]} />
      <Model name="desk_lamp_arm_01" h={0.7} pos={[2.8, 0.87, -0.7]} rot={[0, -0.4, 0]} />
      <pointLight position={[2.5, 1.5, -0.3]} intensity={14} distance={5} color="#ffd9a8" />
      {/* soldering station, PCB and a jar of parts */}
      <Box p={[-2.2, 0.9, 0.0]} s={[0.7, 0.03, 0.5]} c="#1f7a4d" />
      {[[-2.35, 0.94, 0.05], [-2.1, 0.94, -0.05], [-2.25, 0.94, 0.12]].map((p, i) => (
        <Box key={i} p={p as [number, number, number]} s={[0.12, 0.06, 0.08]} c="#14111a" />
      ))}
      <group position={[2.4, 0.87, 0.1]} rotation={[0, 0.4, 0]}>
        <Box p={[0, 0.05, 0]} s={[0.4, 0.1, 0.3]} c="#d8342b" />
        <mesh position={[0.2, 0.15, 0]} rotation={[0, 0, -0.9]}>
          <cylinderGeometry args={[0.015, 0.015, 0.5, 6]} />
          <meshStandardMaterial color="#c7c7d1" metalness={0.8} />
        </mesh>
      </group>
      <mesh position={[0.9, 0.98, 0.1]}>
        <cylinderGeometry args={[0.15, 0.15, 0.26, 14]} />
        <meshPhysicalMaterial color="#cfe6ee" transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

/* ================= BOOKSHOP ================= */

export const BookScene = ({ onPick, selected }: { onPick: (id: string) => void; selected: number }) => {
  const [hover, setHover] = useState<number | null>(null);
  useCursor(hover !== null);
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(0, 2.1, -2), []);
  const spines = useMemo(() => {
    const cols = [["#d8342b", "#fff3d6"], ["#1b4b9b", "#ffffff"], ["#f4b73f", "#14111a"], ["#2c8c7e", "#fff3d6"], ["#efe4cc", "#14111a"], ["#8a3f6a", "#fff3d6"]];
    return researchInterests.map((t, i) => spineTexture(t, cols[i % cols.length][0], cols[i % cols.length][1]));
  }, []);
  const filler = useMemo(() => Array.from({ length: 70 }, (_, i) => ({ i, h: 0.8 + ((i * 7) % 5) * 0.08, c: ["#d8342b", "#1b4b9b", "#f4b73f", "#efe4cc", "#2c8c7e", "#8a3f6a"][(i * 5) % 6] })), []);
  const scales = useRef<THREE.Group>(null);
  useFrame((s) => {
    const wide = size.width / size.height > 1.15;
    camera.position.lerp(new THREE.Vector3(0, 2.3, wide ? 5.4 : 6.6), 0.08);
    camera.lookAt(look);
    if (scales.current) scales.current.rotation.z = Math.sin(s.clock.elapsedTime * 0.8) * 0.08;
  });

  return (
    <group>
      <color attach="background" args={["#bfe0ee"]} />
      <hemisphereLight args={["#fff0d0", "#b89f78", 1.2]} />
      <pointLight position={[0, 3, 1.5]} intensity={50} distance={12} decay={2} color="#ffc680" />
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial map={useMemo(() => {
          const t = tileTexture();
          t.repeat.set(6, 4);
          return t;
        }, [])} roughness={0.6} />
      </mesh>
      <Box p={[0, 2.4, -2.5]} s={[9, 4.8, 0.3]} c="#5a3a22" />
      {/* three rows of shelves, with the interests as spines that stand proud */}
      {[0, 1, 2].map((row) => (
        <group key={row}>
          <Box p={[0, 0.9 + row * 1.2, -2.2]} s={[8.2, 0.06, 0.5]} c="#3a2616" />
          {filler.filter((f) => f.i % 3 === row).map((f, k) => (
            <mesh key={f.i} position={[-3.9 + k * 0.34, 0.95 + row * 1.2 + f.h / 2, -2.25]}>
              <boxGeometry args={[0.28, f.h, 0.34]} />
              <meshStandardMaterial color={f.c} roughness={0.8} />
            </mesh>
          ))}
        </group>
      ))}
      {spines.map((tx, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = -2.6 + col * 2.6 + (row % 2) * 0.4;
        const y = 1.0 + (row === 0 ? 2.4 : 1.2) + 0.5 - 0.4;
        const active = selected === i;
        const hov = hover === i;
        return (
          <group
            key={i}
            position={[x, y, -1.9 + (active || hov ? 0.4 : 0.0)]}
            onClick={(e) => {
              e.stopPropagation();
              onPick(`book-${i}`);
            }}
            onPointerOver={() => setHover(i)}
            onPointerOut={() => setHover((h) => (h === i ? null : h))}
          >
            <mesh>
              <boxGeometry args={[0.46, 1.1, 0.34]} />
              <meshStandardMaterial map={tx} roughness={0.7} />
            </mesh>
            <mesh visible={hov || active}>
              <boxGeometry args={[0.52, 1.16, 0.4]} />
              <meshBasicMaterial color="#f4b73f" transparent opacity={0.25} depthWrite={false} />
            </mesh>
          </group>
        );
      })}
      {/* counter with the scales of justice */}
      <Box p={[3.0, 0.5, 0.6]} s={[2.2, 1.0, 0.9]} c="#6b4a2f" />
      <group position={[3.0, 1.0, 0.6]}>
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
  useCursor(hover);
  const env = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame((s) => {
    camera.position.lerp(new THREE.Vector3(0, 2.2, 3.7), 0.08);
    camera.lookAt(0, 1.25, 0);
    if (env.current) {
      env.current.position.y = 1.15 + Math.sin(s.clock.elapsedTime * 1.4) * 0.03 + (open ? 0.5 : 0);
      env.current.rotation.x = -0.9 + (hover ? 0.1 : 0);
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
          <cylinderGeometry args={[0.3, 0.3, 0.5, 24, 1, false, 0, Math.PI]} />
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
      <mesh position={[1.0, 0.95, 0.2]}>
        <cylinderGeometry args={[0.12, 0.14, 0.2, 14]} />
        <meshStandardMaterial color="#1b4b9b" />
      </mesh>
      <mesh position={[0.7, 0.87, 0.3]} rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 6]} />
        <meshStandardMaterial color="#14111a" />
      </mesh>
      <group
        ref={env}
        position={[0, 1.15, 0.1]}
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
