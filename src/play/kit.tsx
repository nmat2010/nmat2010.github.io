import * as THREE from "three";
import { useMemo } from "react";
import { blobTexture, glowTexture } from "./textures";


export const Box = ({ p, s, c, r = 0.8, m = 0 }: { p: [number, number, number]; s: [number, number, number]; c: string; r?: number; m?: number }) => (
  <mesh position={p}>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={r} metalness={m} />
  </mesh>
);

/** Cold white fluorescent tube, the light of every Saigon shop front */
export const Tube = ({ p, w = 1.2, rot = 0 }: { p: [number, number, number]; w?: number; rot?: number }) => (
  <group position={p} rotation={[0, 0, rot]}>
    <mesh>
      <boxGeometry args={[w, 0.05, 0.05]} />
      <meshBasicMaterial color="#eaf6ff" toneMapped={false} />
    </mesh>
    <mesh position={[0, 0.03, 0]}>
      <boxGeometry args={[w + 0.1, 0.015, 0.09]} />
      <meshStandardMaterial color="#9a98a4" />
    </mesh>
  </group>
);



let blobTex: THREE.Texture | null = null;
const glowTex: Record<string, THREE.Texture> = {};

/** A cheap soft contact shadow, so furniture sits on the floor without a shadow pass */
export const Blob = ({ p, w = 1, d = 1, o = 0.8 }: { p: [number, number, number]; w?: number; d?: number; o?: number }) => {
  const tex = useMemo(() => (blobTex ??= blobTexture()), []);
  return (
    <mesh position={[p[0], p[1] + 0.012, p[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={[w, d, 1]} renderOrder={1}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={tex} transparent opacity={o} depthWrite={false} />
    </mesh>
  );
};

/** A glow halo around a lamp: additive sprite instead of a bloom pass */
export const Glow = ({ p, s = 1.4, color = "255,210,140", o = 1 }: { p: [number, number, number]; s?: number; color?: string; o?: number }) => {
  const tex = useMemo(() => (glowTex[color] ??= glowTexture(color)), [color]);
  return (
    <sprite position={p} scale={[s, s, 1]}>
      <spriteMaterial map={tex} transparent opacity={o} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} fog={false} />
    </sprite>
  );
};
