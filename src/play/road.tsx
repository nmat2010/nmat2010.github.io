import { useMemo } from "react";
import * as THREE from "three";
import { usePBR } from "./gfx";
import { Box } from "./kit";
import { facadeTexture } from "./textures";

/** Where the last building of the hẻm ends and the main road begins */
const MOUTH = 8;
const WALK = 0.75;
const ROAD = { from: MOUTH + WALK, to: MOUTH + WALK + 7 };
const REACH = 44;
const PANEL = 5.6;
const PALETTE: [string, string][] = [
  ["#dcb872", "#f4ead0"],
  ["#c9806c", "#f4ead0"],
  ["#8fb39e", "#3b5a4e"],
  ["#e2d6b4", "#6a4a2f"],
  ["#8fa9b5", "#f4ead0"],
];

/** One shop front along the main road: it closes the open end of the alley's side buildings and carries on down the street. */
const Frontage = ({ x, h, tex }: { x: number; h: number; tex: THREE.CanvasTexture }) => (
  <mesh position={[x, h / 2, MOUTH + 0.02]}>
    <planeGeometry args={[PANEL, h]} />
    <meshStandardMaterial map={tex} roughness={0.9} emissive="#ffffff" emissiveMap={tex} emissiveIntensity={0.18} />
  </mesh>
);

/**
 * The street the alley opens onto, so the scooter rides on a proper road instead of past the ends of the walls:
 * shop fronts continue each way, a raised pavement with a kerb on each side of the alley mouth, then asphalt with
 * edge lines and a dashed centre line. The alley's own asphalt runs straight out into it.
 */
export const MainRoad = ({ leftH, rightH }: { leftH: number; rightH: number }) => {
  const asphalt = usePBR("asphalt_02", [REACH * 0.8, 3]);
  const tex = useMemo(
    () => PALETTE.map(([wall, trim], i) => facadeTexture(wall, trim, 41 + i * 13, i % 2 ? "none" : "shutter")),
    [],
  );
  const panels = Array.from({ length: Math.ceil((REACH - 3.2) / PANEL) }, (_, k) => k);
  const mid = (ROAD.from + ROAD.to) / 2;
  const dashes = Array.from({ length: Math.floor((REACH * 2) / 3.4) }, (_, i) => -REACH + 1.7 + i * 3.4);
  return (
    <group>
      {([-1, 1] as const).map((side) =>
        panels.map((k) => (
          <Frontage
            key={`${side}${k}`}
            x={side * (3.2 + PANEL / 2 + k * PANEL)}
            h={k === 0 ? (side < 0 ? leftH : rightH) : 13 + ((k * 5 + (side > 0 ? 2 : 0)) % 4) * 1.4}
            tex={tex[(k * 2 + (side > 0 ? 1 : 0)) % tex.length]}
          />
        )),
      )}
      {/* the pavement along the shop fronts, left open where the alley's asphalt runs out */}
      {([-1, 1] as const).map((side) => (
        <group key={side}>
          <Box p={[side * (3.3 + (REACH - 3.3) / 2), 0.06, MOUTH + WALK / 2]} s={[REACH - 3.3, 0.12, WALK]} c="#b9b3a6" r={0.95} />
          <Box p={[side * (3.3 + (REACH - 3.3) / 2), 0.07, ROAD.from + 0.04]} s={[REACH - 3.3, 0.14, 0.08]} c="#d8d2c4" r={0.8} />
        </group>
      ))}
      {/* the road itself */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.003, mid]}>
        <planeGeometry args={[REACH * 2, ROAD.to - ROAD.from]} />
        <meshStandardMaterial {...asphalt} color="#cfc6b6" roughness={0.85} />
      </mesh>
      {[ROAD.from + 0.35, ROAD.to - 0.35].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, z]}>
          <planeGeometry args={[REACH * 2, 0.1]} />
          <meshBasicMaterial color="#efe6d0" toneMapped={false} />
        </mesh>
      ))}
      {dashes.map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, mid]}>
          <planeGeometry args={[1.7, 0.14]} />
          <meshBasicMaterial color="#f4c94a" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};
