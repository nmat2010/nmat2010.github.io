import { MutableRefObject, forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Box } from "./kit";

const UP = new THREE.Vector3(0, 1, 0);
type V3 = [number, number, number];

/** A rounded limb or rod running from point a to point b. */
const Limb = ({ a, b, r, c, rough = 0.7, m = 0 }: { a: V3; b: V3; r: number; c: string; rough?: number; m?: number }) => {
  const { pos, quat, len } = useMemo(() => {
    const A = new THREE.Vector3(...a);
    const d = new THREE.Vector3(...b).sub(A);
    const len = d.length();
    return { pos: A.clone().addScaledVector(d, 0.5), quat: new THREE.Quaternion().setFromUnitVectors(UP, d.normalize()), len };
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat}>
      <capsuleGeometry args={[r, Math.max(0.001, len - 2 * r), 6, 10]} />
      <meshStandardMaterial color={c} roughness={rough} metalness={m} />
    </mesh>
  );
};

const BODY = "#c8402b";
const DARK = "#1f1d24";
const STEEL = "#b9b6bd";

/** A tyre, a rim and three spokes, turning on the z axis as the bike rides. */
const Wheel = forwardRef<THREE.Group, { x: number }>(({ x }, ref) => (
  <group position={[x, 0.28, 0]}>
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[0.22, 0.065, 10, 28]} />
        <meshStandardMaterial color={DARK} roughness={0.95} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 20]} />
        <meshStandardMaterial color={STEEL} roughness={0.35} metalness={0.7} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
          <boxGeometry args={[0.3, 0.03, 0.11]} />
          <meshStandardMaterial color="#6f6c75" roughness={0.5} metalness={0.6} />
        </mesh>
      ))}
    </group>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 0.14, 10]} />
      <meshStandardMaterial color="#8a8791" roughness={0.4} metalness={0.6} />
    </mesh>
  </group>
));
Wheel.displayName = "Wheel";

/**
 * A Saigon scooter with a helmeted rider, built from rounded primitives. It faces +x, so it rides across the mouth of the alley.
 * The wheels turn at `speed` (units per second) while it is visible.
 */
export const Motorbike = forwardRef<THREE.Group, { speed?: number }>(({ speed = 28 }, ref) => {
  const front = useRef<THREE.Group>(null);
  const rear = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    const d = (speed * Math.min(dt, 0.05)) / 0.28;
    if (front.current) front.current.rotation.z -= d;
    if (rear.current) rear.current.rotation.z -= d;
  });
  return (
    <group ref={ref} visible={false}>
      <Wheel ref={rear} x={-0.62} />
      <Wheel ref={front} x={0.62} />
      {/* rear bodywork, floorboard and the legshield that rises to the handlebars */}
      <mesh position={[-0.42, 0.56, 0]} rotation={[0, 0, Math.PI / 2 + 0.12]} scale={[1, 1, 0.95]}>
        <capsuleGeometry args={[0.2, 0.42, 8, 16]} />
        <meshStandardMaterial color={BODY} roughness={0.4} metalness={0.15} />
      </mesh>
      <Box p={[0.0, 0.31, 0]} s={[0.62, 0.05, 0.4]} c={BODY} r={0.45} />
      <Limb a={[0.3, 0.32, 0]} b={[0.4, 0.98, 0]} r={0.1} c={BODY} rough={0.4} />
      <Box p={[0.3, 0.66, 0]} s={[0.02, 0.5, 0.36]} c="#a8261e" r={0.45} />
      {/* seat */}
      <mesh position={[-0.35, 0.8, 0]} rotation={[0, 0, Math.PI / 2 + 0.06]} scale={[1, 1, 0.86]}>
        <capsuleGeometry args={[0.15, 0.5, 6, 14]} />
        <meshStandardMaterial color="#2a2118" roughness={0.75} />
      </mesh>
      {/* front fender, fork and headlight cowl */}
      <mesh position={[0.66, 0.6, 0]} rotation={[0, 0, -0.3]} scale={[1, 0.35, 1]}>
        <capsuleGeometry args={[0.15, 0.2, 6, 12]} />
        <meshStandardMaterial color={BODY} roughness={0.4} metalness={0.15} />
      </mesh>
      {([-1, 1] as const).map((s) => (
        <Limb key={s} a={[0.42, 0.98, s * 0.1]} b={[0.62, 0.3, s * 0.1]} r={0.025} c={STEEL} rough={0.3} m={0.7} />
      ))}
      <mesh position={[0.46, 1.04, 0]} scale={[1, 0.8, 1.2]}>
        <sphereGeometry args={[0.15, 16, 12]} />
        <meshStandardMaterial color={BODY} roughness={0.4} metalness={0.15} />
      </mesh>
      <mesh position={[0.6, 1.02, 0]} scale={[0.5, 1, 1]}>
        <sphereGeometry args={[0.1, 14, 10]} />
        <meshBasicMaterial color="#fff3c4" toneMapped={false} />
      </mesh>
      {/* handlebar, grips and round mirrors */}
      <Limb a={[0.4, 1.12, -0.34]} b={[0.4, 1.12, 0.34]} r={0.02} c={DARK} />
      {([-1, 1] as const).map((s) => (
        <group key={s}>
          <Limb a={[0.4, 1.12, s * 0.3]} b={[0.4, 1.12, s * 0.38]} r={0.032} c="#111015" />
          <Limb a={[0.38, 1.14, s * 0.3]} b={[0.3, 1.46, s * 0.4]} r={0.012} c={STEEL} m={0.6} />
          <mesh position={[0.3, 1.5, s * 0.4]} rotation={[0, 0, -0.2]}>
            <cylinderGeometry args={[0.07, 0.07, 0.015, 16]} />
            <meshStandardMaterial color="#d8d5dc" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
      ))}
      {/* tail: light, plate, rack and exhaust */}
      <mesh position={[-0.88, 0.62, 0]}>
        <sphereGeometry args={[0.055, 10, 8]} />
        <meshBasicMaterial color="#ff4a3a" toneMapped={false} />
      </mesh>
      <Box p={[-0.88, 0.46, 0]} s={[0.02, 0.1, 0.2]} c="#f4ead0" />
      <Box p={[-0.62, 0.88, 0]} s={[0.42, 0.03, 0.34]} c={STEEL} r={0.4} m={0.5} />
      <Limb a={[-0.3, 0.26, 0.21]} b={[-0.82, 0.3, 0.21]} r={0.045} c="#8a8791" rough={0.35} m={0.7} />
      {/* the rider: seated, leaning into the ride, hands on the grips */}
      <Limb a={[-0.3, 0.86, 0.12]} b={[0.08, 0.82, 0.17]} r={0.075} c="#2f3552" />
      <Limb a={[-0.3, 0.86, -0.12]} b={[0.08, 0.82, -0.17]} r={0.075} c="#2f3552" />
      <Limb a={[0.08, 0.82, 0.17]} b={[0.14, 0.4, 0.17]} r={0.065} c="#2f3552" />
      <Limb a={[0.08, 0.82, -0.17]} b={[0.14, 0.4, -0.17]} r={0.065} c="#2f3552" />
      <Box p={[0.2, 0.34, 0.17]} s={[0.2, 0.07, 0.1]} c={DARK} />
      <Box p={[0.2, 0.34, -0.17]} s={[0.2, 0.07, 0.1]} c={DARK} />
      <mesh position={[-0.22, 1.22, 0]} rotation={[0, 0, -0.18]} scale={[0.9, 1, 1.1]}>
        <capsuleGeometry args={[0.15, 0.3, 8, 14]} />
        <meshStandardMaterial color="#3b5a4e" roughness={0.7} />
      </mesh>
      <Limb a={[-0.14, 1.4, 0.17]} b={[0.4, 1.12, 0.33]} r={0.05} c="#3b5a4e" />
      <Limb a={[-0.14, 1.4, -0.17]} b={[0.4, 1.12, -0.33]} r={0.05} c="#3b5a4e" />
      <mesh position={[-0.08, 1.72, 0]}>
        <sphereGeometry args={[0.14, 14, 12]} />
        <meshStandardMaterial color="#f1c9a2" roughness={0.6} />
      </mesh>
      <mesh position={[-0.09, 1.76, 0]} scale={[1.05, 1, 1.05]}>
        <sphereGeometry args={[0.18, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
        <meshStandardMaterial color="#f4ead0" roughness={0.35} />
      </mesh>
      <Box p={[0.07, 1.74, 0]} s={[0.06, 0.035, 0.22]} c="#2a2118" />
    </group>
  );
});
Motorbike.displayName = "Motorbike";

/** Dust kicked up where you land, and stars circling your head while you are dazed. It follows the player's `mishap` clock. */
export const Dazed = ({ mishap, pos }: { mishap: MutableRefObject<{ t: number; hit: number }>; pos: MutableRefObject<THREE.Vector3> }) => {
  const root = useRef<THREE.Group>(null);
  const puffs = useRef<(THREE.Mesh | null)[]>([]);
  const stars = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(() => {
    const { t, hit } = mishap.current;
    const r = root.current;
    if (!r) return;
    const s = (t - hit) / 0.7;
    const dust = t >= 0 && s >= 0 && s < 1;
    const dazed = t >= 0 && t > hit + 0.2 && t < hit + 2.0;
    r.visible = dust || dazed;
    if (!r.visible) return;
    r.position.set(pos.current.x, 0, pos.current.z - 0.25);
    puffs.current.forEach((m, i) => {
      if (!m) return;
      m.visible = dust;
      if (!dust) return;
      const a = (i / 6) * Math.PI * 2 + 0.4;
      const spread = 0.2 + 0.5 * s;
      m.position.set(Math.cos(a) * spread, 0.1 + 0.18 * s, Math.sin(a) * spread);
      m.scale.setScalar(0.1 + 0.28 * s);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - s);
    });
    const k = Math.min(1, (t - hit - 0.2) / 0.2, (hit + 2.0 - t) / 0.2);
    stars.current.forEach((m, i) => {
      if (!m) return;
      m.visible = dazed;
      const a = t * 6 + (i * Math.PI * 2) / 3;
      m.position.set(Math.cos(a) * 0.3, 1.5 + Math.sin(t * 9 + i) * 0.03, Math.sin(a) * 0.3);
      m.rotation.y = t * 8;
      m.scale.setScalar(Math.max(0, k));
    });
  });
  return (
    <group ref={root} visible={false}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh key={i} ref={(el) => (puffs.current[i] = el)}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshBasicMaterial color="#efe3c6" transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => (stars.current[i] = el)}>
          <octahedronGeometry args={[0.07]} />
          <meshBasicMaterial color="#ffc93c" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};
