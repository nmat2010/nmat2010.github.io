import { MutableRefObject, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Mirror a half outline (right side, bottom to top) into a closed Shape */
const outline = (half: [number, number][], smooth = 56) => {
  const right = new THREE.SplineCurve(half.map(([x, y]) => new THREE.Vector2(x, y))).getPoints(smooth);
  const pts = [...right, ...right.slice(0, -1).reverse().map((p) => new THREE.Vector2(-p.x, p.y))];
  return new THREE.Shape(pts);
};

const wood = (c: string, r = 0.42) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0.02 });

const Strings = ({ x0, y0, y1, count = 6, spread = 0.05, z = 0, color = "#d8d4c8" }: { x0: number; y0: number; y1: number; count?: number; spread?: number; z?: number; color?: string }) => (
  <>
    {Array.from({ length: count }, (_, i) => {
      const x = x0 - spread / 2 + (spread / (count - 1)) * i;
      return (
        <mesh key={i} position={[x, (y0 + y1) / 2, z]}>
          <cylinderGeometry args={[0.0016 + (count - i) * 0.00018, 0.0016 + (count - i) * 0.00018, y1 - y0, 4]} />
          <meshStandardMaterial color={color} metalness={0.9} roughness={0.3} />
        </mesh>
      );
    })}
  </>
);

/** Steel-string acoustic: figure-eight body, sound hole and rosette, bridge, fretted neck, slotted headstock, pegs. Origin at the base, faces +z. */
export const AcousticGuitar = ({ shake }: { shake: MutableRefObject<number> }) => {
  const g = useRef<THREE.Group>(null);
  const body = useMemo(() => {
    const shape = outline([
      [0, 0],
      [0.115, 0.005],
      [0.2, 0.06],
      [0.225, 0.15],
      [0.195, 0.25],
      [0.135, 0.3],
      [0.118, 0.345],
      [0.14, 0.41],
      [0.155, 0.47],
      [0.12, 0.525],
      [0.06, 0.545],
      [0, 0.55],
    ]);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.09, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 3, curveSegments: 24 });
    geo.translate(0, 0, -0.045);
    return geo;
  }, []);
  const top = useMemo(() => new THREE.ShapeGeometry(outline([[0, 0.002], [0.113, 0.007], [0.198, 0.062], [0.223, 0.15], [0.193, 0.25], [0.133, 0.3], [0.116, 0.345], [0.138, 0.41], [0.153, 0.47], [0.118, 0.523], [0.06, 0.543], [0, 0.548]]), 24), []);
  useFrame((s) => {
    if (!g.current) return;
    const dt = s.clock.elapsedTime - shake.current;
    g.current.rotation.z = dt < 0.25 ? Math.sin(dt * 90) * 0.03 * (1 - dt / 0.25) : 0;
  });
  const neckTop = 1.12;
  return (
    <group ref={g}>
      <mesh geometry={body} material={wood("#b8762f", 0.38)} />
      <mesh geometry={top} position={[0, 0, 0.0562]}>
        <meshStandardMaterial color="#d9a35a" roughness={0.5} />
      </mesh>
      {/* sound hole, rosette, bridge, pickguard */}
      <mesh position={[0, 0.34, 0.058]}>
        <circleGeometry args={[0.052, 32]} />
        <meshBasicMaterial color="#120d09" />
      </mesh>
      <mesh position={[0, 0.34, 0.058]}>
        <ringGeometry args={[0.056, 0.066, 32]} />
        <meshStandardMaterial color="#3a2616" roughness={0.6} />
      </mesh>
      <mesh position={[0.075, 0.28, 0.058]} rotation={[0, 0, -0.5]}>
        <planeGeometry args={[0.1, 0.07]} />
        <meshStandardMaterial color="#1c1410" roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.17, 0.066]}>
        <boxGeometry args={[0.14, 0.026, 0.016]} />
        <meshStandardMaterial color="#2b1a10" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.172, 0.076]}>
        <boxGeometry args={[0.1, 0.006, 0.006]} />
        <meshStandardMaterial color="#e8e2d0" />
      </mesh>
      {/* neck, fretboard, frets */}
      <mesh position={[0, 0.55 + (neckTop - 0.55) / 2 - 0.02, 0]}>
        <boxGeometry args={[0.052, neckTop - 0.55, 0.036]} />
        <meshStandardMaterial color="#8a5a2b" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55 + (neckTop - 0.55) / 2 + 0.06, 0.02]}>
        <boxGeometry args={[0.054, neckTop - 0.67, 0.012]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.45} />
      </mesh>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[0, 0.58 + Math.pow(i / 12, 0.92) * 0.52, 0.027]}>
          <boxGeometry args={[0.054, 0.0035, 0.003]} />
          <meshStandardMaterial color="#cfc9b8" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      {[0.64, 0.76, 0.88, 1.0].map((y) => (
        <mesh key={y} position={[0, y, 0.0275]}>
          <circleGeometry args={[0.0042, 10]} />
          <meshBasicMaterial color="#e8e2d0" />
        </mesh>
      ))}
      <mesh position={[0, neckTop + 0.075, 0]}>
        <boxGeometry args={[0.066, 0.16, 0.026]} />
        <meshStandardMaterial color="#2a1a10" roughness={0.45} />
      </mesh>
      {[-1, 1].flatMap((sx) =>
        [0, 1, 2].map((i) => (
          <mesh key={`${sx}${i}`} position={[sx * 0.044, neckTop + 0.03 + i * 0.046, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.006, 0.006, 0.022, 8]} />
            <meshStandardMaterial color="#c8c3b3" metalness={0.9} roughness={0.25} />
          </mesh>
        )),
      )}
      <Strings x0={0} y0={0.18} y1={neckTop - 0.01} z={0.03} spread={0.04} />
    </group>
  );
};

/** Solid-body electric: contoured double-cut body, pickguard, three single coils, knobs, maple neck with rosewood board, six-in-line tuners. */
export const ElectricGuitar = ({ shake }: { shake: MutableRefObject<number> }) => {
  const g = useRef<THREE.Group>(null);
  const body = useMemo(() => {
    const shape = outline([
      [0, 0],
      [0.1, 0.004],
      [0.17, 0.05],
      [0.18, 0.13],
      [0.15, 0.2],
      [0.095, 0.245],
      [0.1, 0.3],
      [0.15, 0.36],
      [0.2, 0.43],
      [0.19, 0.46],
      [0.12, 0.42],
      [0.06, 0.4],
      [0, 0.4],
    ]);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 3, curveSegments: 24 });
    geo.translate(0, 0.0, -0.02);
    return geo;
  }, []);
  useFrame((s) => {
    if (!g.current) return;
    const dt = s.clock.elapsedTime - shake.current;
    g.current.position.x = dt < 3 ? Math.sin(dt * 70) * 0.004 : 0;
  });
  const neckTop = 1.1;
  return (
    <group ref={g}>
      <mesh geometry={body} material={new THREE.MeshPhysicalMaterial({ color: "#a8261e", roughness: 0.22, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.1 })} />
      <mesh position={[0, 0.24, 0.0275]}>
        <boxGeometry args={[0.2, 0.31, 0.003]} />
        <meshStandardMaterial color="#f1ede0" roughness={0.4} />
      </mesh>
      {[0.3, 0.215, 0.13].map((y) => (
        <mesh key={y} position={[0, y, 0.034]}>
          <boxGeometry args={[0.1, 0.018, 0.01]} />
          <meshStandardMaterial color="#fdfbf2" roughness={0.4} />
        </mesh>
      ))}
      {[0.3, 0.215, 0.13].map((y) =>
        Array.from({ length: 6 }, (_, i) => (
          <mesh key={`${y}${i}`} position={[-0.0375 + i * 0.015, y, 0.0395]}>
            <cylinderGeometry args={[0.0028, 0.0028, 0.002, 6]} />
            <meshStandardMaterial color="#b5b2a8" metalness={0.9} roughness={0.3} />
          </mesh>
        )),
      )}
      <mesh position={[0, 0.07, 0.034]}>
        <boxGeometry args={[0.1, 0.02, 0.012]} />
        <meshStandardMaterial color="#c8c3b3" metalness={0.9} roughness={0.25} />
      </mesh>
      {[[0.1, 0.085], [0.1, 0.045], [0.065, 0.02]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.036]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.016, 12]} />
          <meshStandardMaterial color="#1c1410" roughness={0.4} />
        </mesh>
      ))}
      <mesh position={[0, 0.4 + (neckTop - 0.4) / 2, 0.005]}>
        <boxGeometry args={[0.046, neckTop - 0.4, 0.03]} />
        <meshStandardMaterial color="#d9ae6b" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.44 + (neckTop - 0.44) / 2, 0.021]}>
        <boxGeometry args={[0.048, neckTop - 0.44, 0.008]} />
        <meshStandardMaterial color="#3a1f12" roughness={0.45} />
      </mesh>
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[0, 0.47 + Math.pow(i / 20, 0.9) * 0.6, 0.0255]}>
          <boxGeometry args={[0.048, 0.003, 0.002]} />
          <meshStandardMaterial color="#cfc9b8" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[0.012, neckTop + 0.09, 0.005]} rotation={[0, 0, 0.0]}>
        <boxGeometry args={[0.062, 0.2, 0.024]} />
        <meshStandardMaterial color="#d9ae6b" roughness={0.45} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[-0.0 + 0.012, neckTop + 0.03 + i * 0.03, 0.022]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.012, 8]} />
          <meshStandardMaterial color="#c8c3b3" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
      <Strings x0={0} y0={0.07} y1={neckTop} z={0.03} spread={0.034} />
    </group>
  );
};
