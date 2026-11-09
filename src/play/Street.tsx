import { MutableRefObject, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { projects } from "@/data/projects";
import { flagTexture, labelTexture, postOfficeTexture, signTexture, tarpTexture, tileTexture } from "./textures";
import { Box, Tube } from "./kit";
import { CoffeeGlass, Steam, Vendor } from "./parts";
import { Model } from "./gfx";

/* Everything here is authored for the RIGHT side of the hẻm (building at +x, alley toward -x).
   Left-side spots wrap it in <Mirror>. No lettering inside a mirrored group. */

export const Mirror = ({ children }: { children: React.ReactNode }) => <group scale={[-1, 1, 1]}>{children}</group>;

/* ---------- small furniture ---------- */

/** The small plastic stool every Vietnamese café runs on: slotted skirt, flat seat, rim */
export const PlasticStool = ({ p, c = "#d8342b", r = 0 }: { p: [number, number, number]; c?: string; r?: number }) => (
  <group position={p} rotation={[0, r, 0]}>
    <mesh position={[0, 0.27, 0]}>
      <cylinderGeometry args={[0.2, 0.2, 0.035, 18]} />
      <meshStandardMaterial color={c} roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.29, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.19, 0.012, 6, 20]} />
      <meshStandardMaterial color={c} roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.14, 0]}>
      <cylinderGeometry args={[0.17, 0.215, 0.26, 18, 1, true]} />
      <meshStandardMaterial color={c} roughness={0.5} side={THREE.DoubleSide} />
    </mesh>
    {[0, 1, 2, 3, 4, 5].map((i) => (
      <mesh key={i} position={[Math.sin((i / 6) * Math.PI * 2) * 0.2, 0.14, Math.cos((i / 6) * Math.PI * 2) * 0.2]} rotation={[0, (i / 6) * Math.PI * 2, 0]}>
        <boxGeometry args={[0.05, 0.1, 0.02]} />
        <meshStandardMaterial color="#14111a" />
      </mesh>
    ))}
  </group>
);

export const PlasticTable = ({ p, c = "#2c8c7e", glass = true }: { p: [number, number, number]; c?: string; glass?: boolean }) => (
  <group position={p}>
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.34, 0.34, 0.035, 20]} />
      <meshStandardMaterial color={c} roughness={0.45} />
    </mesh>
    <mesh position={[0, 0.25, 0]}>
      <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
      <meshStandardMaterial color="#c7c7d1" metalness={0.5} roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.015, 0]}>
      <cylinderGeometry args={[0.2, 0.24, 0.03, 14]} />
      <meshStandardMaterial color="#c7c7d1" metalness={0.5} roughness={0.4} />
    </mesh>
    {glass && (
      <group position={[0.08, 0.52, 0.05]} scale={0.34}>
        <CoffeeGlass phin={false} />
      </group>
    )}
  </group>
);

/** Pink-flowered thermos, the bình thủy */
const Thermos = ({ p }: { p: [number, number, number] }) => (
  <group position={p}>
    <mesh position={[0, 0.2, 0]}>
      <cylinderGeometry args={[0.1, 0.1, 0.4, 14]} />
      <meshStandardMaterial color="#d8342b" roughness={0.4} />
    </mesh>
    <mesh position={[0, 0.43, 0]}>
      <cylinderGeometry args={[0.07, 0.1, 0.06, 14]} />
      <meshStandardMaterial color="#c7c7d1" metalness={0.7} roughness={0.3} />
    </mesh>
    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
      <mesh key={i} position={[Math.sin(i * 0.9) * 0.101, 0.1 + (i % 4) * 0.08, Math.cos(i * 0.9) * 0.101]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshBasicMaterial color={i % 2 ? "#f4b73f" : "#fff3d6"} />
      </mesh>
    ))}
  </group>
);

/** A Vietnamese flag on an iron arm bolted to a house front: it hangs from the arm and ripples in the breeze */
export const WallFlag = ({ side, z, y = 4.4 }: { side: 1 | -1; z: number; y?: number }) => {
  const map = useMemo(() => flagTexture(), []);
  const geo = useRef<THREE.PlaneGeometry>(null);
  const base = useMemo(() => Float32Array.from(new THREE.PlaneGeometry(1.4, 0.93, 16, 8).attributes.position.array), []);
  useFrame((s) => {
    const g = geo.current;
    if (!g) return;
    const pos = g.attributes.position;
    const t = s.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const yy = base[i * 3 + 1];
      const free = (x + 0.7) / 1.4; // 0 at the wall, 1 at the loose end
      pos.setZ(i, Math.sin(x * 5 - t * 2.6 + yy * 2) * 0.07 * free * (0.4 + (0.465 - yy) / 0.93));
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
  });
  return (
    // local +x runs from the wall out over the street
    <group position={[side * 3.185, y, z]} rotation={[0, side > 0 ? Math.PI : 0, 0]}>
      <Box p={[0.02, 0.1, 0]} s={[0.04, 0.5, 0.2]} c="#14111a" />
      <mesh position={[0.78, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 1.56, 8]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.7} />
      </mesh>
      {/* the strut runs above the arm, clear of the cloth */}
      <mesh position={[0.31, 0.175, 0]} rotation={[0, 0, 1.03]}>
        <boxGeometry args={[0.03, 0.68, 0.03]} />
        <meshStandardMaterial color="#14111a" />
      </mesh>
      <mesh position={[0.78, -0.465, 0]}>
        <planeGeometry ref={geo} args={[1.4, 0.93, 16, 8]} />
        <meshStandardMaterial map={map} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

/* ---------- Nhà: a Saigon tube house with porch, gate and balcony ---------- */

export const HouseFront = () => {
  const tile = useMemo(() => {
    const t = tileTexture();
    t.repeat.set(2, 6);
    return t;
  }, []);
  const plate = useMemo(() => signTexture("290 NTT", null, "enamel"), []);
  return (
    <group>
      {/* tiled porch */}
      <mesh position={[2.6, 0.14, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.28, 6.6]} />
        <meshStandardMaterial map={tile} roughness={0.55} />
      </mesh>
      {/* two square porch columns with capitals */}
      {[-2.4, 2.4].map((z) => (
        <group key={z} position={[2.1, 0, z]}>
          <Box p={[0, 1.65, 0]} s={[0.34, 2.9, 0.34]} c="#efe4cc" r={0.9} />
          <Box p={[0, 3.12, 0]} s={[0.5, 0.18, 0.5]} c="#e0d3b5" r={0.9} />
          <Box p={[0, 0.34, 0]} s={[0.46, 0.14, 0.46]} c="#e0d3b5" r={0.9} />
        </group>
      ))}
      {/* porch roof slab with terracotta tiles */}
      <Box p={[2.6, 3.28, 0]} s={[1.3, 0.2, 6.2]} c="#efe4cc" />
      <mesh position={[2.45, 3.5, 0]} rotation={[0, 0, 0.18]}>
        <boxGeometry args={[1.3, 0.1, 6.3]} />
        <meshStandardMaterial color="#b4572f" roughness={0.85} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <Box key={i} p={[2.45, 3.58, -2.9 + i * 0.53]} s={[1.3, 0.04, 0.05]} c="#8f3f1f" />
      ))}
      {/* the front door, open onto the warm room behind */}
      <Box p={[3.15, 1.25, 0]} s={[0.12, 2.5, 1.9]} c="#14111a" />
      <mesh position={[3.1, 1.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.7, 2.3]} />
        <meshBasicMaterial color="#ffb869" toneMapped={false} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[3.06, 0, s * 0.92]} rotation={[0, s * 0.9, 0]}>
          <Box p={[0, 1.2, s * -0.4]} s={[0.06, 2.3, 0.8]} c="#1f7a6d" />
          <Box p={[0, 1.2, s * -0.4]} s={[0.07, 1.5, 0.5]} c="#17594f" />
        </group>
      ))}
      <Box p={[3.0, 2.55, 0]} s={[0.16, 0.16, 2.1]} c="#e0d3b5" />
      {/* sliding iron gate pushed to the side */}
      <group position={[2.35, 0, 3.2]}>
        {Array.from({ length: 9 }, (_, i) => (
          <Box key={i} p={[0, 0.95, -i * 0.22]} s={[0.04, 1.9, 0.04]} c="#14392f" />
        ))}
        <Box p={[0, 0.2, -0.88]} s={[0.05, 0.05, 1.9]} c="#14392f" />
        <Box p={[0, 1.7, -0.88]} s={[0.05, 0.05, 1.9]} c="#14392f" />
      </group>
      {/* altar to the household spirits, red with a glowing incense tip */}
      <group position={[3.12, 1.9, -2.5]}>
        <Box p={[0, 0, 0]} s={[0.1, 0.5, 0.45]} c="#b3261e" />
        <mesh position={[-0.06, 0.1, 0]}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="#ff8a3a" toneMapped={false} />
        </mesh>
        <mesh position={[-0.06, -0.12, 0.1]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#ff3a2a" toneMapped={false} />
        </mesh>
      </group>
      <mesh position={[3.13, 2.3, 2.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshBasicMaterial map={plate} toneMapped={false} />
      </mesh>
      {/* second-floor balcony with an iron rail, plants, laundry */}
      <Box p={[2.6, 4.9, 0]} s={[1.0, 0.16, 6.0]} c="#efe4cc" />
      {Array.from({ length: 26 }, (_, i) => (
        <Box key={i} p={[2.12, 5.45, -2.9 + i * 0.232]} s={[0.03, 0.9, 0.03]} c="#14111a" />
      ))}
      <Box p={[2.12, 5.9, 0]} s={[0.05, 0.05, 6]} c="#14111a" />
      <Box p={[2.12, 5.05, 0]} s={[0.05, 0.05, 6]} c="#14111a" />
      {/* pots stand on the deck, well inside the rail */}
      {[-1.8, 0.4, 2.1].map((z, i) => (
        <group key={i} position={[2.7, 4.98, z]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.15, 0.11, 0.3, 10]} />
            <meshStandardMaterial color="#b4572f" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.22, 10, 8]} />
            <meshStandardMaterial color={i === 1 ? "#d8342b" : "#2f8a5a"} />
          </mesh>
        </group>
      ))}
      {/* the bird cage hangs from an iron arm bolted to the wall */}
      <Box p={[2.7, 6.9, 1.0]} s={[0.9, 0.04, 0.04]} c="#14111a" />
      <Box p={[3.1, 6.7, 1.0]} s={[0.04, 0.4, 0.04]} c="#14111a" />
      <Cage p={[2.3, 6.6, 1.0]} />
      {/* plants and shoes by the door, a bicycle against the column */}
      <Model name="planter_box_01" w={1.0} pos={[1.8, 0.28, -2.6]} rot={[0, Math.PI / 2, 0]} />
      <Model name="potted_plant_04" h={0.7} pos={[1.8, 0.28, -2.0]} />
      <Model name="planter_box_01" w={0.9} pos={[1.8, 0.28, 1.5]} rot={[0, Math.PI / 2, 0]} />
      <Bicycle p={[2.45, 0.3, -1.55]} />
    </group>
  );
};

const Cage = ({ p }: { p: [number, number, number] }) => {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (g.current) g.current.rotation.z = Math.sin(s.clock.elapsedTime * 1.1 + p[2]) * 0.05;
  });
  return (
    <group ref={g} position={p}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.6, 4]} />
        <meshBasicMaterial color="#14111a" />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.36, 14, 1, true]} />
        <meshBasicMaterial color="#14111a" wireframe />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.22, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#14111a" wireframe />
      </mesh>
      <mesh position={[0, -0.36, 0]}>
        <cylinderGeometry args={[0.23, 0.23, 0.04, 14]} />
        <meshStandardMaterial color="#8a5a2b" />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.06, 8, 6]} />
        <meshStandardMaterial color="#f4b73f" />
      </mesh>
    </group>
  );
};

export const Bicycle = ({ p }: { p: [number, number, number] }) => (
  <group position={p} scale={0.8}>
    {[-0.5, 0.5].map((z) => (
      <mesh key={z} position={[0, 0.3, z]} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.3, 0.02, 6, 20]} />
        <meshStandardMaterial color="#14111a" />
      </mesh>
    ))}
    <Box p={[0, 0.55, 0]} s={[0.03, 0.03, 1.0]} c="#1b4b9b" />
    <Box p={[0, 0.42, 0.1]} s={[0.03, 0.4, 0.03]} c="#1b4b9b" />
    <Box p={[0, 0.9, 0.5]} s={[0.4, 0.03, 0.03]} c="#14111a" />
    <Box p={[0, 0.6, 0.5]} s={[0.03, 0.62, 0.03]} c="#14111a" />
    {/* kickstand: it leans on this, not on the house */}
    <mesh position={[0.05, 0.17, -0.2]} rotation={[0, 0, 0.27]}>
      <boxGeometry args={[0.02, 0.38, 0.02]} />
      <meshStandardMaterial color="#14111a" />
    </mesh>
    <Box p={[0, 0.7, -0.35]} s={[0.12, 0.04, 0.26]} c="#14111a" />
    {/* wire basket */}
    <mesh position={[0, 0.78, 0.62]}>
      <boxGeometry args={[0.34, 0.2, 0.26]} />
      <meshBasicMaterial color="#9a98a4" wireframe />
    </mesh>
  </group>
);

/* ---------- Cà phê sữa đá: a sidewalk stall ---------- */

/** A woven võng hammock slung between a hook in the wall and a post: a striped net that sags, with ropes gathered at both ends */
const Hammock = () => {
  const { geo, map, ends } = useMemo(() => {
    const A = new THREE.Vector3(3.0, 1.62, -4.7);
    const B = new THREE.Vector3(2.62, 1.62, -2.7);
    const curve = new THREE.CatmullRomCurve3([A, new THREE.Vector3(2.92, 1.22, -4.2), new THREE.Vector3(2.8, 0.98, -3.7), new THREE.Vector3(2.7, 1.2, -3.2), B]);
    const N = 32;
    const pos: number[] = [];
    const uv: number[] = [];
    const idx: number[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const p = curve.getPoint(t);
      const side = new THREE.Vector3().crossVectors(up, curve.getTangent(t)).normalize();
      const w = 0.3 * (0.25 + 0.75 * Math.pow(Math.sin(Math.PI * t), 0.55));
      const lift = 0.1 * Math.sin(Math.PI * t);
      [-1, 1].forEach((sgn, k) => {
        pos.push(p.x + side.x * w * sgn, p.y + lift, p.z + side.z * w * sgn);
        uv.push(t * 5, k);
      });
      if (i < N) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    g.computeVertexNormals();

    const c = document.createElement("canvas");
    c.width = 128;
    c.height = 32;
    const x = c.getContext("2d")!;
    ["#2f7a6d", "#f4ead0", "#b3261e", "#f4ead0", "#e0b546", "#f4ead0"].forEach((col, i) => {
      x.fillStyle = col;
      x.fillRect((i * 128) / 6, 0, 128 / 6 + 1, 32);
    });
    x.strokeStyle = "rgba(40,25,10,0.35)";
    x.lineWidth = 1;
    for (let k = 0; k < 128; k += 4) {
      x.beginPath();
      x.moveTo(k, 0);
      x.lineTo(k, 32);
      x.stroke();
    }
    for (let k = 0; k < 32; k += 4) {
      x.beginPath();
      x.moveTo(0, k);
      x.lineTo(128, k);
      x.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    return { geo: g, map: tex, ends: [A, B] };
  }, []);
  const hook = new THREE.Vector3(3.14, 1.74, -4.78);
  const post = new THREE.Vector3(2.58, 1.76, -2.55);
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial map={map} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      <Line points={[ends[0], hook]} color="#2a2118" lineWidth={1.5} />
      <Line points={[ends[1], post]} color="#2a2118" lineWidth={1.5} />
      <Box p={[3.15, 1.74, -4.78]} s={[0.1, 0.06, 0.06]} c="#4a3220" />
      <mesh position={[2.58, 0.88, -2.55]}>
        <cylinderGeometry args={[0.04, 0.05, 1.76, 10]} />
        <meshStandardMaterial color="#6b4a2f" roughness={0.8} />
      </mesh>
    </group>
  );
};

export const CoffeeStall = ({ vendor }: { vendor: MutableRefObject<number> }) => {
  const tarp = useMemo(() => {
    const t = tarpTexture();
    t.repeat.set(2, 1);
    return t;
  }, []);
  const menu = useMemo(() => signTexture("COFFEE", "iced milk coffee · tea", "red"), []);
  return (
    <group>
      {/* striped tarp canopy on poles */}
      <mesh position={[2.35, 3.0, -0.2]} rotation={[0, 0, -0.17]}>
        <boxGeometry args={[1.8, 0.04, 6.4]} />
        <meshStandardMaterial map={tarp} roughness={0.9} />
      </mesh>
      {[-3.3, 2.9].map((z) => (
        <mesh key={z} position={[1.55, 1.4, z]}>
          <cylinderGeometry args={[0.04, 0.04, 2.8, 8]} />
          <meshStandardMaterial color="#9a98a4" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      <Tube p={[2.5, 2.85, -0.2]} w={1.4} rot={0} />
      <pointLight position={[2.2, 2.6, 0]} intensity={8} distance={8} decay={2} color="#dcefff" />

      {/* the cart: glass cabinet with a tiled front and a counter on top */}
      <group position={[2.55, 0, -0.5]}>
        <Box p={[0, 0.45, 0]} s={[0.8, 0.9, 2.6]} c="#1f7a6d" />
        <Box p={[0.41, 0.45, 0]} s={[0.02, 0.8, 2.4]} c="#17594f" />
        <Box p={[0, 0.93, 0]} s={[0.9, 0.06, 2.7]} c="#c7c7d1" m={0.6} r={0.35} />
        {/* glass cabinet of bánh */}
        <mesh position={[0, 1.2, -0.7]}>
          <boxGeometry args={[0.7, 0.5, 0.9]} />
          <meshPhysicalMaterial color="#dff0f4" transparent opacity={0.22} roughness={0.05} />
        </mesh>
        {[[-0.15, -0.9], [0.1, -0.6], [-0.1, -0.4]].map(([x, z], i) => (
          <mesh key={i} position={[x, 1.05, z - 0.2]}>
            <boxGeometry args={[0.14, 0.12, 0.2]} />
            <meshStandardMaterial color={["#e8c27a", "#d98a3a", "#f1e6cf"][i]} />
          </mesh>
        ))}
        <Thermos p={[-0.05, 0.96, 0.4]} />
        <Thermos p={[-0.05, 0.96, 0.65]} />
        {/* kettle on a gas ring, steaming */}
        <group position={[0, 0.96, 1.05]}>
          <mesh position={[0, 0.16, 0]}>
            <cylinderGeometry args={[0.12, 0.17, 0.3, 14]} />
            <meshStandardMaterial color="#c7c7d1" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0.1, 0.32, 0]} rotation={[0, 0, -0.9]}>
            <cylinderGeometry args={[0.02, 0.03, 0.2, 6]} />
            <meshStandardMaterial color="#c7c7d1" metalness={0.8} />
          </mesh>
          <Steam pos={[0.18, 0.4, 0]} />
        </group>
        {/* glasses of cà phê sữa đá with their phin on top */}
        {[0.2, -0.05].map((z) => (
          <group key={z} position={[0.15, 0.96, z]} scale={0.38}>
            <CoffeeGlass />
          </group>
        ))}
        {/* ice box */}
        <Box p={[0.05, 0.25, 1.55]} s={[0.55, 0.5, 0.6]} c="#e6e9ee" r={0.4} />
        <Box p={[0.05, 0.52, 1.55]} s={[0.58, 0.04, 0.64]} c="#1b4b9b" />
      </group>
      <mesh position={[3.1, 2.2, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.5, 0.45]} />
        <meshBasicMaterial map={menu} toneMapped={false} />
      </mesh>

      {/* the vendor behind her cart */}
      <group position={[2.95, 0, -0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <Vendor serve={vendor} />
      </group>

      {/* low plastic tables and little stools spilling onto the alley */}
      <PlasticTable p={[1.95, 0, 1.8]} c="#2c8c7e" />
      <PlasticStool p={[1.95, 0, 1.2]} c="#d8342b" />
      <Model name="plastic_monobloc_chair_01" h={0.6} tint="#1b4b9b" pos={[1.5, 0, 1.95]} rot={[0, 0.5 + Math.PI / 2, 0]} />
      <PlasticStool p={[2.4, 0, 2.3]} c="#d8342b" r={1.1} />
      <PlasticTable p={[2.05, 0, -2.5]} c="#1b4b9b" />
      <Model name="plastic_monobloc_chair_01" h={0.6} tint="#d8342b" pos={[1.45, 0, -2.4]} rot={[0, Math.PI / 2, 0]} />
      <Model name="plastic_monobloc_chair_01" h={0.6} tint="#2c8c7e" pos={[2.0, 0, -3.1]} rot={[0, 0.8 + Math.PI / 2, 0]} />
      <PlasticStool p={[2.55, 0, -1.9]} c="#d8342b" r={0.2} />

      <Hammock />
    </group>
  );
};

/* ---------- Xưởng: an electronics repair shop ---------- */

export const RepairShop = () => {
  const tex = useTexture(projects.map((p) => p.image));
  tex.forEach((t) => (t.colorSpace = THREE.SRGBColorSpace));
  return (
    <group>
      {/* half-raised roll shutter above the shopfront */}
      <Box p={[3.0, 2.7, 0]} s={[0.4, 0.8, 6.4]} c="#6f7d78" />
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} p={[2.78, 2.45 + i * 0.12, 0]} s={[0.04, 0.03, 6.4]} c="#4a5551" />
      ))}
      {/* shopfront glows warm */}
      <mesh position={[3.1, 1.1, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6, 2.0]} />
        <meshBasicMaterial color="#d9a25a" toneMapped={false} />
      </mesh>
      <Tube p={[2.9, 2.2, -1.2]} w={1.5} />
      <Tube p={[2.9, 2.2, 1.6]} w={1.5} />
      <pointLight position={[2.4, 2.0, 0]} intensity={8} distance={8} decay={2} color="#dcefff" />
      {/* the counter, with a stack of screens showing the projects */}
      <Box p={[2.55, 0.5, 0]} s={[0.9, 1.0, 5.6]} c="#5a3a22" />
      <Box p={[2.55, 1.03, 0]} s={[1.0, 0.06, 5.7]} c="#3a2616" />
      {projects.map((p, i) => (
        <group key={p.title} position={[2.7, 1.5, -2.1 + i * 1.4]} scale={0.88} rotation={[0, -Math.PI / 2 + 0.3 - i * 0.2, 0]}>
          <Box p={[0, 0, -0.03]} s={[1.3, 0.85, 0.1]} c="#14111a" />
          <mesh position={[0, 0, 0.03]}>
            <planeGeometry args={[1.2, 0.75]} />
            <meshBasicMaterial map={tex[i]} toneMapped={false} />
          </mesh>
          <Box p={[0, -0.55, -0.05]} s={[0.1, 0.3, 0.08]} c="#14111a" />
        </group>
      ))}
      {/* old CRTs, wire reels and parts shelves behind */}
      <Model name="Television_01" w={0.7} pos={[3.0, 0.0, -2.4]} rot={[0, -Math.PI / 2, 0]} />
      <Model name="Television_01" w={0.7} pos={[3.0, 0.0, 2.5]} rot={[0, -Math.PI / 2 - 0.2, 0]} />
      <Model name="circuit_board" w={0.4} pos={[2.5, 1.06, -2.5]} />
      <Model name="retro_multimeter" h={0.22} pos={[2.5, 1.06, 2.4]} rot={[0, 2.2, 0]} />
      {[-2.2, 2.3].map((z, i) => (
        <mesh key={i} position={[2.8, 2.2, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 16]} />
          <meshStandardMaterial color={i ? "#d8342b" : "#1b4b9b"} />
        </mesh>
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <Line
          key={i}
          points={[new THREE.Vector3(2.8, 3.1, -2.4 + i), new THREE.Vector3(2.5, 2.2 - (i % 2) * 0.3, -2.2 + i), new THREE.Vector3(2.7, 1.7, -2.1 + i)]}
          color={["#d8342b", "#14111a", "#f4b73f", "#1b4b9b", "#14111a"][i]}
          lineWidth={1.5}
        />
      ))}
      {/* blue enamel hanging board */}
      <Box p={[2.2, 3.1, 3.3]} s={[0.05, 1.6, 0.5]} c="#1b4b9b" />
      <Box p={[2.18, 3.1, 3.3]} s={[0.02, 1.52, 0.42]} c="#ffffff" />
    </group>
  );
};

/* ---------- Tiệm sách: a second-hand bookshop with racks on the pavement ---------- */

export const BookStall = () => {
  const awning = useMemo(() => {
    const t = tarpTexture("#2c8c7e", "#f1e6cf", "#14392f");
    t.repeat.set(2, 1);
    return t;
  }, []);
  const rack = (z: number, k: number) => (
    <group key={z} position={[2.15, 0, z]} rotation={[0, 0, -0.2]}>
      <Box p={[0, 0.5, 0]} s={[0.35, 1.0, 1.5]} c="#6b4a2f" />
      {[0.15, 0.4, 0.65, 0.9].map((y, r) => (
        <group key={y}>
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} position={[0.12, y + 0.05, -0.65 + i * 0.18]}>
              <boxGeometry args={[0.18, 0.2, 0.1]} />
              <meshStandardMaterial color={["#d8342b", "#1b4b9b", "#f4b73f", "#f1e6cf", "#2c8c7e", "#8a3f6a"][(i * 2 + r + k) % 6]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
  return (
    <group>
      <mesh position={[2.55, 3.0, 0]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[1.6, 0.04, 6.6]} />
        <meshStandardMaterial map={awning} roughness={0.9} />
      </mesh>
      <mesh position={[3.1, 1.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6, 2.2]} />
        <meshBasicMaterial color="#c68a46" toneMapped={false} />
      </mesh>
      <pointLight position={[2.5, 2.4, 0]} intensity={8} distance={8} decay={2} color="#ffd9a0" />
      {/* shelves inside */}
      {[0.7, 1.4, 2.1].map((y) => (
        <Box key={y} p={[3.0, y, 0]} s={[0.3, 0.05, 5.8]} c="#3a2616" />
      ))}
      {[0.7, 1.4, 2.1].map((y, r) =>
        Array.from({ length: 24 }, (_, i) => (
          <mesh key={`${y}${i}`} position={[3.0, y + 0.22, -2.7 + i * 0.23]}>
            <boxGeometry args={[0.22, 0.38 + ((i * 3 + r) % 3) * 0.06, 0.18]} />
            <meshStandardMaterial color={["#d8342b", "#1b4b9b", "#f4b73f", "#f1e6cf", "#2c8c7e", "#8a3f6a"][(i + r * 2) % 6]} />
          </mesh>
        )),
      )}
      {rack(-2.2, 0)}
      {rack(2.2, 3)}
      {/* a wicker chair and a tea table */}
      <group position={[2.1, 0, 0.2]}>
        <PlasticTable p={[0, 0, 0]} c="#6b4a2f" />
        <mesh position={[0, 0.7, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.14, 8]} />
          <meshStandardMaterial color="#efe4cc" />
        </mesh>
      </group>
      <mesh position={[1.6, 0.4, -0.3]}>
        <boxGeometry args={[0.5, 0.06, 0.5]} />
        <meshStandardMaterial color="#c68a46" />
      </mesh>
      {/* hanging reading bulb */}
      <mesh position={[2.4, 2.7, 0.2]}>
        <sphereGeometry args={[0.07, 10, 8]} />
        <meshBasicMaterial color="#ffd27a" toneMapped={false} />
      </mesh>
    </group>
  );
};

/* ---------- Utility pole, laundry line, awnings: the Saigon overhead ---------- */

export const UtilityPole = ({ z, side }: { z: number; side: 1 | -1 }) => (
  <group position={[side * 2.95, 0, z]}>
    <mesh position={[0, 3.2, 0]}>
      <cylinderGeometry args={[0.1, 0.14, 6.4, 8]} />
      <meshStandardMaterial color="#7d7a85" roughness={0.9} />
    </mesh>
    <Box p={[0, 5.8, 0]} s={[0.1, 0.1, 1.4]} c="#4a4752" />
    <Box p={[-side * 0.2, 4.7, 0]} s={[0.4, 0.55, 0.4]} c="#6f7d78" r={0.5} />
    <mesh position={[-side * 0.1, 6.35, 0]}>
      <sphereGeometry args={[0.06, 8, 6]} />
      <meshBasicMaterial color="#ffe3a8" toneMapped={false} />
    </mesh>
  </group>
);

export const Awning = ({ side, z, depth, colors }: { side: 1 | -1; z: number; depth: number; colors: [string, string, string] }) => {
  const t = useMemo(() => {
    const tx = tarpTexture(...colors);
    tx.repeat.set(Math.round(depth / 1.5), 1);
    return tx;
  }, [colors, depth]);
  return (
    <mesh position={[side * 2.6, 3.0, z]} rotation={[0, 0, side * 0.2]}>
      <boxGeometry args={[1.2, 0.04, depth - 0.3]} />
      <meshStandardMaterial map={t} roughness={0.9} />
    </mesh>
  );
};

/** Bobbing marker over a doorway: a label plate on a stem. Click to walk there. */
export const PlaceMarker = ({
  x,
  z,
  text,
  sub,
  visited,
  onClick,
}: {
  x: number;
  z: number;
  text: string;
  sub: string;
  visited: boolean;
  onClick: () => void;
}) => {
  const g = useRef<THREE.Group>(null);
  const tex = useMemo(() => labelTexture(text, sub), [text, sub]);
  useFrame((s) => {
    if (g.current) g.current.position.y = 4.6 + Math.sin(s.clock.elapsedTime * 2 + z) * 0.1;
  });
  return (
    <group ref={g} position={[x, 4.6, z]} onClick={(e) => (e.stopPropagation(), onClick())}>
      <mesh>
        <planeGeometry args={[1.9, 0.6]} />
        <meshBasicMaterial map={tex} toneMapped={false} transparent fog={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.18, 0.32, 3]} />
        <meshBasicMaterial color={visited ? "#2c8c7e" : "#f4b73f"} toneMapped={false} fog={false} />
      </mesh>
    </group>
  );
};

/** The far end of the hẻm opens onto the central post office: yellow colonial facade, arched shuttered windows, a clock, a red letter box */
export const EndGate = () => {
  const facade = useMemo(() => postOfficeTexture(), []);
  const plate = useMemo(() => signTexture("MAILBOX", "hòm thư", "red"), []);
  return (
    <group position={[0, 0, -66]}>
      <mesh position={[0, 3.3, -4]}>
        <planeGeometry args={[9.4, 6]} />
        <meshStandardMaterial map={facade} roughness={0.85} emissiveMap={facade} emissive="#ffffff" emissiveIntensity={0.25} />
      </mesh>
      {/* porch canopy over the entrance */}
      <Box p={[0, 3.35, -3.4]} s={[2.6, 0.14, 1.4]} c="#f4ead0" />
      {[-1.15, 1.15].map((x) => (
        <Box key={x} p={[x, 1.65, -2.8]} s={[0.16, 3.3, 0.16]} c="#f4ead0" />
      ))}
      <pointLight position={[0, 2.2, -2.6]} intensity={10} distance={9} decay={2} color="#ffd9a0" />
      <UtilityPole z={2.5} side={-1} />
      {/* the red letter box */}
      <group position={[1.7, 0, -1.4]}>
        <Box p={[0, 0.5, 0]} s={[0.46, 1.0, 0.4]} c="#a8261e" r={0.45} />
        <mesh position={[0, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 1]}>
          <cylinderGeometry args={[0.23, 0.23, 0.4, 20, 1, false, 0, Math.PI]} />
          <meshStandardMaterial color="#a8261e" roughness={0.45} />
        </mesh>
        <Box p={[0, 0.78, 0.205]} s={[0.3, 0.05, 0.02]} c="#14111a" />
        <mesh position={[0, 0.42, 0.205]}>
          <planeGeometry args={[0.34, 0.12]} />
          <meshBasicMaterial map={plate} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};
