import { MutableRefObject, forwardRef, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { seawolfLogoTexture, seawolvesTexture } from "./textures";

export const clamp = THREE.MathUtils.clamp;
export const lerp = THREE.MathUtils.lerp;
export const dampAngle = (a: number, b: number, k: number, dt: number) => {
  let d = ((b - a + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * (1 - Math.exp(-k * dt));
};

export interface Fx {
  meow: number;
  bark: number;
  strum: number;
  riff: number;
}

export type Place = "home" | "cafe" | "workshop" | "books" | "gate";

/** The player: a Stony Brook Seawolves fan in the red shirt, jeans and white sneakers, with a ponytail. */
export const Avatar = forwardRef<
  THREE.Group,
  {
    legL: MutableRefObject<THREE.Group | null>;
    legR: MutableRefObject<THREE.Group | null>;
    armL: MutableRefObject<THREE.Group | null>;
    armR: MutableRefObject<THREE.Group | null>;
    body: MutableRefObject<THREE.Group | null>;
  }
>(({ legL, legR, armL, armR, body }, ref) => {
  const skin = "#f1c9a2";
  const jacket = "#990000"; // SBU red
  const trim = "#6e0000";
  const print = useMemo(() => seawolvesTexture(), []);
  const logo = useMemo(() => seawolfLogoTexture(), []);
  return (
    <group ref={ref}>
      <group ref={body}>
        {/* torso: rounded jacket with collar, hem and a back seam */}
        <mesh position={[0, 0.9, 0]} scale={[1, 1, 0.82]} castShadow>
          <capsuleGeometry args={[0.2, 0.36, 10, 20]} />
          <meshStandardMaterial color={jacket} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.66, 0]} scale={[1, 1, 0.84]}>
          <cylinderGeometry args={[0.208, 0.215, 0.07, 20]} />
          <meshStandardMaterial color={trim} roughness={0.65} />
        </mesh>
        <mesh position={[0, 1.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.8, 1]}>
          <torusGeometry args={[0.105, 0.032, 10, 22]} />
          <meshStandardMaterial color={trim} roughness={0.65} />
        </mesh>
        <mesh position={[0, 0.98, 0.172]}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshBasicMaterial map={logo} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.95, -0.172]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial map={print} transparent toneMapped={false} />
        </mesh>
        <mesh position={[0, 0.9, -0.168]} visible={false}>
          <boxGeometry args={[0.012, 0.5, 0.01]} />
          <meshStandardMaterial color={trim} />
        </mesh>
        {/* neck and head */}
        <mesh position={[0, 1.27, 0]}>
          <cylinderGeometry args={[0.055, 0.065, 0.09, 12]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.46, 0]} scale={[1, 1.04, 1]}>
          <sphereGeometry args={[0.2, 28, 24]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
        {/* face */}
        {[-1, 1].map((sx) => (
          <group key={sx}>
            <mesh position={[sx * 0.07, 1.47, 0.178]} scale={[1, 1.25, 0.5]}>
              <sphereGeometry args={[0.022, 10, 8]} />
              <meshStandardMaterial color="#1a1210" roughness={0.2} />
            </mesh>
            <mesh position={[sx * 0.066, 1.476, 0.19]}>
              <sphereGeometry args={[0.006, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[sx * 0.075, 1.515, 0.18]} rotation={[0, 0, -sx * 0.15]}>
              <boxGeometry args={[0.04, 0.007, 0.006]} />
              <meshStandardMaterial color="#1a1210" />
            </mesh>
            <mesh position={[sx * 0.115, 1.42, 0.15]} scale={[1, 0.7, 0.4]}>
              <sphereGeometry args={[0.03, 8, 6]} />
              <meshStandardMaterial color="#ee9a8c" roughness={0.9} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.395, 0.185]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.028, 0.006, 6, 14, Math.PI]} />
          <meshBasicMaterial color="#9a4a40" />
        </mesh>
        {/* signature: round dark-framed glasses */}
        {[-1, 1].map((sx) => (
          <group key={`g${sx}`}>
            <mesh position={[sx * 0.072, 1.468, 0.19]}>
              <torusGeometry args={[0.047, 0.0065, 8, 28]} />
              <meshStandardMaterial color="#17110d" roughness={0.35} />
            </mesh>
            <mesh position={[sx * 0.072, 1.468, 0.188]}>
              <circleGeometry args={[0.045, 20]} />
              <meshPhysicalMaterial color="#dff0f4" transparent opacity={0.22} roughness={0.05} />
            </mesh>
            <mesh position={[sx * 0.168, 1.47, 0.12]} rotation={[0, sx * 0.15, 0]}>
              <boxGeometry args={[0.006, 0.008, 0.16]} />
              <meshStandardMaterial color="#17110d" roughness={0.35} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 1.472, 0.192]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.03, 6]} />
          <meshStandardMaterial color="#17110d" roughness={0.35} />
        </mesh>
        {/* hair: cap, side locks, fringe and a tied ponytail */}
        <mesh position={[0, 1.5, -0.015]} scale={[1.02, 1, 1.02]}>
          <sphereGeometry args={[0.208, 28, 22, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color="#17110d" roughness={0.45} />
        </mesh>
        <mesh position={[0, 1.52, 0.09]} rotation={[0.25, 0, 0]} scale={[1, 0.34, 0.5]}>
          <sphereGeometry args={[0.19, 20, 14]} />
          <meshStandardMaterial color="#17110d" roughness={0.45} />
        </mesh>
        {[-1, 1].map((sx) => (
          <mesh key={sx} position={[sx * 0.185, 1.43, 0.02]} scale={[0.5, 1.2, 0.8]}>
            <sphereGeometry args={[0.07, 12, 10]} />
            <meshStandardMaterial color="#17110d" roughness={0.45} />
          </mesh>
        ))}
        <mesh position={[0, 1.5, -0.2]}>
          <torusGeometry args={[0.035, 0.012, 8, 14]} />
          <meshStandardMaterial color="#a8392b" roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.38, -0.25]} rotation={[0.35, 0, 0]} scale={[1, 1, 1]}>
          <capsuleGeometry args={[0.055, 0.28, 8, 14]} />
          <meshStandardMaterial color="#17110d" roughness={0.45} />
        </mesh>
        {/* short red sleeves, bare forearms and hands */}
        {([[-1, armL], [1, armR]] as const).map(([sx, ref2]) => (
          <group key={sx} ref={ref2} position={[sx * 0.255, 1.12, 0]}>
            <mesh position={[0, -0.1, 0]} castShadow>
              <capsuleGeometry args={[0.065, 0.1, 8, 14]} />
              <meshStandardMaterial color={jacket} roughness={0.6} />
            </mesh>
            <mesh position={[0, -0.27, 0]} castShadow>
              <capsuleGeometry args={[0.046, 0.18, 8, 12]} />
              <meshStandardMaterial color={skin} roughness={0.7} />
            </mesh>
            <mesh position={[0, -0.43, 0]} scale={[1, 1.1, 0.9]}>
              <sphereGeometry args={[0.05, 12, 10]} />
              <meshStandardMaterial color={skin} roughness={0.7} />
            </mesh>
          </group>
        ))}
      </group>
      {/* legs: jeans and white sneakers */}
      {([[-1, legL], [1, legR]] as const).map(([sx, lref]) => (
        <group key={sx} ref={lref} position={[sx * 0.095, 0.64, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.075, 0.38, 8, 14]} />
            <meshStandardMaterial color="#35466a" roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.6, 0.04]} scale={[0.9, 0.55, 1.5]}>
            <sphereGeometry args={[0.085, 14, 10]} />
            <meshStandardMaterial color="#f1ede4" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.64, 0.05]} scale={[1, 0.25, 1.6]}>
            <sphereGeometry args={[0.085, 14, 8]} />
            <meshStandardMaterial color="#a8392b" roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
});
Avatar.displayName = "Avatar";

/** A cat or a dog. The dog follows the player; both react to a trigger. */
export const Pet = ({
  kind,
  home,
  playerPos,
  trigger,
  fx,
  dogPos,
  bounds,
}: {
  kind: "cat" | "dog";
  home: [number, number, number];
  playerPos?: MutableRefObject<THREE.Vector3>;
  trigger: "meow" | "bark";
  fx: MutableRefObject<Fx>;
  dogPos?: MutableRefObject<THREE.Vector2>;
  bounds?: number;
}) => {
  const g = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Mesh>(null);
  const heart = useRef<THREE.Mesh>(null);
  const cat = kind === "cat";
  const heartMat = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const x = c.getContext("2d")!;
    x.fillStyle = "#e94a6a";
    x.beginPath();
    x.moveTo(32, 54);
    x.bezierCurveTo(2, 32, 12, 6, 32, 20);
    x.bezierCurveTo(52, 6, 62, 32, 32, 54);
    x.fill();
    return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, toneMapped: false, depthWrite: false });
  }, []);

  useFrame((s, dt) => {
    const t = s.clock.elapsedTime;
    const grp = g.current;
    if (!grp) return;
    if (tail.current) tail.current.rotation.y = Math.sin(t * (cat ? 2 : 9)) * (cat ? 0.5 : 0.8);
    let baseY = home[1];
    if (!cat && dogPos && playerPos) {
      const p = playerPos.current;
      const dx = p.x - grp.position.x;
      const dz = p.z - grp.position.z;
      const d = Math.hypot(dx, dz);
      let moving = false;
      if (d < 9 && d > 1.7) {
        const sp = Math.min(3.2, d * 1.2) * Math.min(dt, 0.05);
        grp.position.x += (dx / d) * sp;
        grp.position.z += (dz / d) * sp;
        grp.rotation.y = dampAngle(grp.rotation.y, Math.atan2(dx, dz), 8, dt);
        moving = true;
      }
      grp.position.x = clamp(grp.position.x, -(bounds ?? 2.2), bounds ?? 2.2);
      baseY = moving ? Math.abs(Math.sin(t * 12)) * 0.05 : 0;
      dogPos.current.set(grp.position.x, grp.position.z);
    }
    const since = t - fx.current[trigger];
    grp.position.y = baseY + (since < 0.5 ? Math.sin((since / 0.5) * Math.PI) * 0.18 : 0);
    if (heart.current) {
      const on = since < 1.2;
      heart.current.visible = on;
      if (on) {
        heart.current.position.y = (cat ? 0.9 : 1.0) + since * 0.7;
        heart.current.lookAt(s.camera.position);
        heartMat.opacity = 1 - since / 1.2;
      }
    }
  });

  const mat = (c: string, r = 0.9) => <meshStandardMaterial color={c} roughness={r} />;
  const tailCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        cat
          ? [new THREE.Vector3(0, 0.1, -0.22), new THREE.Vector3(0.14, 0.08, -0.3), new THREE.Vector3(0.26, 0.1, -0.1), new THREE.Vector3(0.24, 0.12, 0.12)]
          : [new THREE.Vector3(0, 0.5, -0.4), new THREE.Vector3(0, 0.62, -0.52), new THREE.Vector3(0, 0.78, -0.5)],
      ),
    [cat],
  );
  return (
    <group ref={g} position={home} rotation={[0, cat ? 0.5 : 0, 0]}>
      {cat ? (
        <>
          {/* a loaf-curled tabby */}
          <mesh position={[0, 0.17, 0]} scale={[0.2, 0.16, 0.28]}>
            <sphereGeometry args={[1, 20, 16]} />
            {mat("#d98a3a")}
          </mesh>
          {[-0.12, 0, 0.12].map((z) => (
            <mesh key={z} position={[0, 0.3, z]} rotation={[0, 0, Math.PI / 2]} scale={[1, 1, 0.5]}>
              <torusGeometry args={[0.15, 0.012, 6, 14, Math.PI * 0.8]} />
              {mat("#8a4f1c")}
            </mesh>
          ))}
          <mesh position={[0, 0.27, 0.27]} scale={[0.13, 0.115, 0.12]}>
            <sphereGeometry args={[1, 20, 16]} />
            {mat("#e09a4a")}
          </mesh>
          {[-1, 1].map((sx) => (
            <group key={sx} position={[sx * 0.075, 0.36, 0.26]} rotation={[0, 0, -sx * 0.25]}>
              <mesh rotation={[0.2, 0, 0]}>
                <coneGeometry args={[0.04, 0.085, 4]} />
                {mat("#d98a3a")}
              </mesh>
              <mesh position={[0, -0.005, 0.012]} rotation={[0.2, 0, 0]} scale={[0.6, 0.7, 0.4]}>
                <coneGeometry args={[0.04, 0.085, 4]} />
                {mat("#e9a5a0")}
              </mesh>
            </group>
          ))}
          {[-1, 1].map((sx) => (
            <mesh key={`e${sx}`} position={[sx * 0.05, 0.285, 0.382]} rotation={[0, 0, sx * 0.2]} scale={[1, 0.35, 0.5]}>
              <sphereGeometry args={[0.018, 8, 6]} />
              <meshBasicMaterial color="#1a120a" />
            </mesh>
          ))}
          <mesh position={[0, 0.262, 0.386]} scale={[1, 0.7, 0.6]}>
            <sphereGeometry args={[0.014, 8, 6]} />
            <meshBasicMaterial color="#d98a8a" />
          </mesh>
          {[-1, 1].flatMap((sx) =>
            [0, 1].map((i) => (
              <mesh key={`w${sx}${i}`} position={[sx * 0.08, 0.26 - i * 0.012, 0.37]} rotation={[0, 0, sx * (1.4 + i * 0.12)]}>
                <cylinderGeometry args={[0.0015, 0.0015, 0.1, 3]} />
                <meshBasicMaterial color="#f1e6d0" />
              </mesh>
            )),
          )}
          {[-1, 1].map((sx) => (
            <mesh key={`p${sx}`} position={[sx * 0.07, 0.05, 0.3]} scale={[1, 0.7, 1.4]}>
              <sphereGeometry args={[0.04, 10, 8]} />
              {mat("#e09a4a")}
            </mesh>
          ))}
          <mesh ref={tail}>
            <tubeGeometry args={[tailCurve, 16, 0.03, 8, false]} />
            {mat("#c47a30")}
          </mesh>
        </>
      ) : (
        <>
          {/* a friendly tan dog */}
          <mesh position={[0, 0.46, -0.04]} scale={[0.18, 0.19, 0.4]}>
            <sphereGeometry args={[1, 22, 18]} />
            {mat("#c99a5b")}
          </mesh>
          {/* the head sits straight on the shoulders: no neck */}
          <group position={[0, -0.1, -0.1]}>
          <mesh position={[0, 0.72, 0.5]} scale={[0.15, 0.15, 0.16]}>
            <sphereGeometry args={[1, 20, 16]} />
            {mat("#d3a669")}
          </mesh>
          <mesh position={[0, 0.66, 0.65]} scale={[0.085, 0.07, 0.11]}>
            <sphereGeometry args={[1, 14, 12]} />
            {mat("#f1e0c0")}
          </mesh>
          <mesh position={[0, 0.69, 0.76]} scale={[0.03, 0.022, 0.025]}>
            <sphereGeometry args={[1, 10, 8]} />
            <meshStandardMaterial color="#1a120a" roughness={0.3} />
          </mesh>
          {[-1, 1].map((sx) => (
            <group key={sx}>
              <mesh position={[sx * 0.13, 0.76, 0.46]} rotation={[0.2, 0, sx * 0.5]} scale={[0.05, 0.14, 0.09]}>
                <sphereGeometry args={[1, 12, 10]} />
                {mat("#8a6334")}
              </mesh>
              <mesh position={[sx * 0.06, 0.74, 0.62]}>
                <sphereGeometry args={[0.016, 8, 6]} />
                <meshBasicMaterial color="#1a120a" />
              </mesh>
            </group>
          ))}
          </group>
          {/* legs run up into the body, so nothing floats */}
          {[-1, 1].flatMap((sx) =>
            [0.22, -0.28].map((z) => (
              <mesh key={`${sx}${z}`} position={[sx * 0.09, 0.25, z]}>
                <capsuleGeometry args={[0.055, 0.3, 4, 8]} />
                {mat("#b88a50")}
              </mesh>
            )),
          )}
          <mesh ref={tail} position={[0, 0.52, -0.36]} rotation={[-0.9, 0, 0]}>
            <capsuleGeometry args={[0.03, 0.24, 4, 8]} />
            {mat("#c99a5b")}
          </mesh>
        </>
      )}
      <mesh ref={heart} visible={false} material={heartMat}>
        <planeGeometry args={[0.3, 0.3]} />
      </mesh>
    </group>
  );
};

/** A checked scarf texture: the khăn rằn worn by women across southern Vietnam */
const scarfTexture = () => {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d")!;
  x.fillStyle = "#f4ead0";
  x.fillRect(0, 0, 64, 64);
  x.fillStyle = "#8a2a26";
  for (let i = 0; i < 64; i += 16) {
    x.fillRect(i, 0, 8, 64);
    x.fillRect(0, i, 64, 8);
  }
  x.fillStyle = "rgba(40,20,16,0.55)";
  for (let i = 0; i < 64; i += 16) {
    x.fillRect(i + 3, 0, 2, 64);
    x.fillRect(0, i + 3, 64, 2);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 1);
  return t;
};

/** The cà phê vendor: a Vietnamese woman in a teal áo bà ba, a checked khăn rằn and a nón lá, who hands over the glass */
export const Vendor = ({ serve }: { serve: MutableRefObject<number> }) => {
  const arm = useRef<THREE.Group>(null);
  const forearm = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const scarf = useMemo(() => scarfTexture(), []);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    const k = serve.current; // 0 idle .. 1 arm fully extended
    if (arm.current) {
      arm.current.rotation.x = lerp(0.12, -1.25, k);
      arm.current.rotation.z = lerp(-0.08, 0.0, k);
    }
    if (forearm.current) forearm.current.rotation.x = lerp(-0.2, -0.45, k);
    if (head.current) {
      head.current.rotation.z = Math.sin(t * 0.7) * 0.03;
      head.current.rotation.x = Math.sin(t * 0.5) * 0.02 + k * 0.08;
    }
    if (torso.current) torso.current.scale.y = 1 + Math.sin(t * 1.6) * 0.008;
  });
  const skin = "#e9bf97";
  const teal = "#2b8a7c";
  const dark = "#17110d";
  return (
    <group>
      {/* trousers, hidden behind the counter */}
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.72, 16]} />
        <meshStandardMaterial color="#2a2420" roughness={0.9} />
      </mesh>

      <group ref={torso}>
        {/* áo bà ba tunic with a high collar, button line and a cream apron */}
        <mesh position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.165, 0.225, 0.62, 22]} />
          <meshStandardMaterial color={teal} roughness={0.75} />
        </mesh>
        {[0.95, 1.07, 1.19].map((y) => (
          <mesh key={y} position={[0, y, 0.2 - (y - 0.95) * 0.12]}>
            <sphereGeometry args={[0.014, 8, 6]} />
            <meshStandardMaterial color="#f4ead0" roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 0.9, 0.205]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.3, 0.38, 0.03]} />
          <meshStandardMaterial color="#f4ead0" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.84, 0.225]}>
          <boxGeometry args={[0.16, 0.1, 0.012]} />
          <meshStandardMaterial color="#e6d9b8" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.74, 0.0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22, 0.012, 6, 24]} />
          <meshStandardMaterial color="#f4ead0" roughness={0.85} />
        </mesh>
        {/* khăn rằn around the neck */}
        <mesh position={[0, 1.36, 0.01]} rotation={[Math.PI / 2 + 0.15, 0, 0]}>
          <torusGeometry args={[0.1, 0.038, 10, 28]} />
          <meshStandardMaterial map={scarf} roughness={0.9} />
        </mesh>
        <mesh position={[0.05, 1.28, 0.1]} rotation={[0.2, 0, -0.25]}>
          <boxGeometry args={[0.07, 0.15, 0.025]} />
          <meshStandardMaterial map={scarf} roughness={0.9} />
        </mesh>
      </group>
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.058, 0.066, 0.1, 14]} />
        <meshStandardMaterial color={skin} roughness={0.7} />
      </mesh>

      <group ref={head} position={[0, 1.6, 0]}>
        <mesh scale={[1, 1.08, 0.98]}>
          <sphereGeometry args={[0.178, 28, 24]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
        {[-1, 1].map((sx) => (
          <group key={sx}>
            <mesh position={[sx * 0.178, -0.005, 0]} scale={[0.5, 1, 0.8]}>
              <sphereGeometry args={[0.04, 10, 8]} />
              <meshStandardMaterial color={skin} roughness={0.7} />
            </mesh>
            <mesh position={[sx * 0.065, 0.03, 0.158]} scale={[1, 1.2, 0.55]}>
              <sphereGeometry args={[0.02, 12, 10]} />
              <meshStandardMaterial color={dark} roughness={0.25} />
            </mesh>
            <mesh position={[sx * 0.059, 0.037, 0.169]}>
              <sphereGeometry args={[0.0055, 6, 6]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[sx * 0.066, 0.075, 0.15]} rotation={[0, 0, -sx * 0.18]}>
              <boxGeometry args={[0.042, 0.007, 0.006]} />
              <meshStandardMaterial color={dark} />
            </mesh>
            <mesh position={[sx * 0.108, -0.035, 0.135]} scale={[1, 0.65, 0.4]}>
              <sphereGeometry args={[0.03, 10, 8]} />
              <meshStandardMaterial color="#ec9d8f" roughness={0.9} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, -0.012, 0.172]} scale={[0.8, 1, 0.8]}>
          <sphereGeometry args={[0.014, 8, 6]} />
          <meshStandardMaterial color="#dca883" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.075, 0.158]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.034, 0.0075, 6, 14, Math.PI]} />
          <meshBasicMaterial color="#a8433a" />
        </mesh>
        {/* black hair under the hat, with a low bun */}
        <mesh position={[0, 0.03, -0.015]} scale={[1.03, 1.02, 1.03]}>
          <sphereGeometry args={[0.18, 26, 20, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
          <meshStandardMaterial color={dark} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.05, -0.17]}>
          <sphereGeometry args={[0.085, 16, 14]} />
          <meshStandardMaterial color={dark} roughness={0.5} />
        </mesh>
        {/* nón lá: straw cone with ring ribs, a finial and a chin strap */}
        <group position={[0, 0.17, 0.0]} rotation={[-0.1, 0, 0]}>
          <mesh>
            <coneGeometry args={[0.5, 0.21, 40, 1, true]} />
            <meshStandardMaterial color="#e8d6a2" roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
          {[0.14, 0.26, 0.38].map((r) => (
            <mesh key={r} position={[0, 0.105 - (r / 0.5) * 0.21, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[r, 0.003, 4, 48]} />
              <meshStandardMaterial color="#b89a56" roughness={0.9} />
            </mesh>
          ))}
          <mesh position={[0, 0.115, 0]}>
            <sphereGeometry args={[0.016, 8, 6]} />
            <meshStandardMaterial color="#b89a56" roughness={0.9} />
          </mesh>
        </group>
        {[-1, 1].map((sx) => (
          <Line
            key={`strap${sx}`}
            points={[new THREE.Vector3(sx * 0.17, 0.09, 0.02), new THREE.Vector3(sx * 0.185, -0.06, 0.07), new THREE.Vector3(sx * 0.03, -0.17, 0.11)]}
            color="#b04a7a"
            lineWidth={2}
          />
        ))}
      </group>

      {/* left arm resting on the counter */}
      <group position={[-0.25, 1.3, 0]} rotation={[0.55, 0, 0.2]}>
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.052, 0.18, 8, 12]} />
          <meshStandardMaterial color={teal} roughness={0.75} />
        </mesh>
        <mesh position={[0, -0.33, 0]}>
          <capsuleGeometry args={[0.04, 0.16, 8, 12]} />
          <meshStandardMaterial color={skin} roughness={0.7} />
        </mesh>
      </group>
      {/* right arm: reaches toward the customer with the glass */}
      <group ref={arm} position={[0.25, 1.3, 0.02]}>
        <mesh position={[0, -0.12, 0]}>
          <capsuleGeometry args={[0.052, 0.18, 8, 12]} />
          <meshStandardMaterial color={teal} roughness={0.75} />
        </mesh>
        <group ref={forearm} position={[0, -0.26, 0]}>
          <mesh position={[0, -0.1, 0]}>
            <capsuleGeometry args={[0.04, 0.16, 8, 12]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
          <mesh position={[0, -0.22, 0]} scale={[1, 1.1, 0.9]}>
            <sphereGeometry args={[0.042, 12, 10]} />
            <meshStandardMaterial color={skin} roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
};

/** Stainless-steel phin filter: wide base plate that rests on the glass rim, chamber, press screw and lid */
const Phin = () => {
  const drop = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!drop.current) return;
    const t = (s.clock.elapsedTime * 0.8) % 1;
    drop.current.position.y = -0.02 - t * 0.1;
    drop.current.visible = t < 0.9;
    drop.current.scale.setScalar(0.7 + t * 0.4);
  });
  const steel = <meshStandardMaterial color="#d6d8dd" metalness={0.95} roughness={0.22} />;
  return (
    <group>
      <mesh position={[0, 0.004, 0]}>
        <cylinderGeometry args={[0.112, 0.112, 0.008, 28]} />
        {steel}
      </mesh>
      <mesh position={[0, -0.012, 0]}>
        <cylinderGeometry args={[0.035, 0.03, 0.03, 18]} />
        {steel}
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.062, 0.066, 0.08, 28, 1, true]} />
        <meshStandardMaterial color="#d6d8dd" metalness={0.95} roughness={0.22} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.07, 0.066, 0.016, 28]} />
        {steel}
      </mesh>
      <mesh position={[0, 0.112, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.03, 10]} />
        {steel}
      </mesh>
      <mesh position={[0, 0.132, 0]}>
        <sphereGeometry args={[0.02, 14, 10]} />
        {steel}
      </mesh>
      <mesh ref={drop} position={[0, -0.04, 0]}>
        <sphereGeometry args={[0.008, 8, 8]} />
        <meshStandardMaterial color="#2a1408" roughness={0.2} />
      </mesh>
    </group>
  );
};

/** Cà phê sữa đá as Vietnam serves it: a tapered glass, sweet condensed milk settled at the bottom under dark
 *  coffee, big ice cubes, a steel phin dripping on top, standing on a saucer with a long spoon. */
export const CoffeeGlass = forwardRef<THREE.Group, { phin?: boolean }>(({ phin = true }, ref) => {
  const H = 0.3;
  const inner = (y: number) => 0.064 + (0.088 - 0.064) * ((y - 0.028) / (H - 0.028));
  const glass = useMemo(
    () =>
      new THREE.LatheGeometry(
        [
          [0, 0],
          [0.066, 0],
          [0.07, 0.012],
          [0.095, H],
          [0.098, H + 0.006],
          [0.09, H + 0.006],
          [0.088, H],
          [0.064, 0.028],
          [0, 0.028],
        ].map(([r, y]) => new THREE.Vector2(r, y)),
        36,
      ),
    [H],
  );
  const layers = useMemo(() => {
    const layer = (y0: number, y1: number) =>
      new THREE.LatheGeometry(
        [new THREE.Vector2(0, y0), new THREE.Vector2(inner(y0) - 0.001, y0), new THREE.Vector2(inner(y1) - 0.001, y1), new THREE.Vector2(0, y1)],
        32,
      );
    return [layer(0.028, 0.09), layer(0.09, 0.135), layer(0.135, 0.255)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ice: [number, number, number, number][] = [
    [-0.03, 0.15, 0.02, 0.2],
    [0.035, 0.18, -0.02, 0.9],
    [0.0, 0.215, 0.04, 0.5],
    [-0.035, 0.23, -0.03, 1.3],
    [0.04, 0.245, 0.03, 0.1],
  ];
  return (
    <group ref={ref}>
      <mesh position={[0, -0.012, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.012, 32]} />
        <meshStandardMaterial color="#f1efe8" roughness={0.35} />
      </mesh>
      <mesh geometry={layers[0]}>
        <meshStandardMaterial color="#f2e6c6" roughness={0.45} />
      </mesh>
      <mesh geometry={layers[1]}>
        <meshStandardMaterial color="#a8672f" roughness={0.4} />
      </mesh>
      <mesh geometry={layers[2]}>
        <meshStandardMaterial color="#3a1d0e" roughness={0.3} transparent opacity={0.96} />
      </mesh>
      {ice.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[r, r * 1.7, r * 0.6]}>
          <boxGeometry args={[0.052, 0.052, 0.052]} />
          <meshPhysicalMaterial color="#e8f4f8" transparent opacity={0.55} roughness={0.12} />
        </mesh>
      ))}
      <mesh geometry={glass}>
        <meshPhysicalMaterial color="#f4fbff" transparent opacity={0.22} roughness={0.04} side={THREE.DoubleSide} envMapIntensity={1.4} />
      </mesh>
      {/* long spoon */}
      <mesh position={[0.045, 0.2, -0.01]} rotation={[0, 0, -0.17]}>
        <cylinderGeometry args={[0.004, 0.004, 0.34, 6]} />
        <meshStandardMaterial color="#c7c7d1" metalness={0.9} roughness={0.3} />
      </mesh>
      {phin && (
        <group position={[0, H + 0.006, 0]}>
          <Phin />
        </group>
      )}
    </group>
  );
});
CoffeeGlass.displayName = "CoffeeGlass";

/** Acoustic guitar (standing) and electric guitar models, origin at the base */
export const AcousticGuitar = ({ shake }: { shake: MutableRefObject<number> }) => {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    const dt = s.clock.elapsedTime - shake.current;
    g.current.rotation.z = -0.1 + (dt < 0.25 ? Math.sin(dt * 90) * 0.03 * (1 - dt / 0.25) : 0);
  });
  return (
    <group ref={g} rotation={[0, 0, -0.1]}>
      <mesh position={[0, 0.42, 0]} scale={[1, 1, 0.34]}>
        <cylinderGeometry args={[0.3, 0.3, 0.52, 18]} />
        <meshStandardMaterial color="#c27c3c" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.82, 0]} scale={[1, 1, 0.34]}>
        <cylinderGeometry args={[0.21, 0.21, 0.36, 18]} />
        <meshStandardMaterial color="#c27c3c" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.42, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.095, 0.095, 0.02, 14]} />
        <meshStandardMaterial color="#14111a" />
      </mesh>
      <mesh position={[0, 1.58, 0]}>
        <boxGeometry args={[0.09, 1.3, 0.05]} />
        <meshStandardMaterial color="#5a3a22" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.28, 0]}>
        <boxGeometry args={[0.14, 0.26, 0.05]} />
        <meshStandardMaterial color="#14111a" />
      </mesh>
    </group>
  );
};

export const ElectricGuitar = ({ shake }: { shake: MutableRefObject<number> }) => {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (!g.current) return;
    const dt = s.clock.elapsedTime - shake.current;
    g.current.position.x = dt < 3 ? Math.sin(dt * 70) * 0.012 : 0;
  });
  return (
    <group ref={g}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.42, 0.56, 0.07]} />
        <meshStandardMaterial color="#b3261e" roughness={0.25} metalness={0.25} />
      </mesh>
      <mesh position={[-0.2, 0.74, 0]}>
        <boxGeometry args={[0.12, 0.22, 0.07]} />
        <meshStandardMaterial color="#b3261e" roughness={0.25} metalness={0.25} />
      </mesh>
      <mesh position={[0, 0.5, 0.05]}>
        <boxGeometry args={[0.2, 0.05, 0.02]} />
        <meshStandardMaterial color="#14111a" />
      </mesh>
      <mesh position={[0.02, 1.2, 0]}>
        <boxGeometry args={[0.07, 0.85, 0.05]} />
        <meshStandardMaterial color="#3a2616" />
      </mesh>
      <mesh position={[0.02, 1.7, 0]}>
        <boxGeometry args={[0.12, 0.22, 0.05]} />
        <meshStandardMaterial color="#14111a" />
      </mesh>
    </group>
  );
};

/** Steam that rises from a pot */
export const Steam = ({ pos }: { pos: [number, number, number] }) => {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame((s) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      const t = (s.clock.elapsedTime * 0.35 + i / 5) % 1;
      m.position.set(Math.sin(t * 6 + i) * 0.06, t * 0.9, 0);
      m.scale.setScalar(0.08 + t * 0.22);
      (m.material as THREE.MeshBasicMaterial).opacity = 0.35 * (1 - t);
    });
  });
  return (
    <group position={pos}>
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={i} ref={(el) => (refs.current[i] = el)}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};
