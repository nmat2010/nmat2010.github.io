import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

// Convert lat/lon to 3D coordinates on a sphere
const latLonToVector3 = (lat: number, lon: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
};

// Hanoi coordinates: 21.0285° N, 105.8542° E
const HANOI = { lat: 21.0285, lon: 105.8542 };
// Stony Brook, NY: 40.9125° N, -73.1236° W
const NEW_YORK = { lat: 40.9125, lon: -73.1236 };

interface LocationMarkerProps {
  position: THREE.Vector3;
  color: string;
}

const LocationMarker = ({ position, color }: LocationMarkerProps) => {
  const markerRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (markerRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      markerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.1]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
};

interface EarthProps {
  onJourneyComplete: () => void;
}

// Plane component that travels along the path
interface PlaneProps {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  progress: number;
}

const TravelingPlane = ({ startPos, endPos, progress }: PlaneProps) => {
  const planeRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (planeRef.current && progress > 0 && progress < 1) {
      // Create curved path (great circle arc)
      const curveHeight = 0.8; // Height of the arc
      const midPoint = new THREE.Vector3()
        .lerpVectors(startPos, endPos, 0.5)
        .normalize()
        .multiplyScalar(2 + curveHeight);

      // Quadratic bezier curve for smooth arc
      const curve = new THREE.QuadraticBezierCurve3(startPos, midPoint, endPos);
      const position = curve.getPoint(progress);
      planeRef.current.position.copy(position);

      // Make plane point in direction of travel
      const tangent = curve.getTangent(progress);
      const up = position.clone().normalize();
      const axis = new THREE.Vector3().crossVectors(up, tangent).normalize();
      const radians = Math.acos(up.dot(tangent));
      planeRef.current.quaternion.setFromAxisAngle(axis, radians);
      planeRef.current.rotateOnAxis(up, Math.PI / 2);
    }
  }, [progress, startPos, endPos]);

  if (progress <= 0 || progress >= 1) return null;

  return (
    <group ref={planeRef}>
      {/* Plane body - cone shape */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.03, 0.12, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Wings */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[0.15, 0.02, 0.04]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Tail */}
      <mesh position={[0, 0.03, -0.05]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.02, 0.02]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const Earth = ({ onJourneyComplete }: EarthProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [phase, setPhase] = useState<"start" | "journey" | "complete">("start");
  const timeRef = useRef(0);

  const hanoiPos = latLonToVector3(HANOI.lat, HANOI.lon, 2);
  const newYorkPos = latLonToVector3(NEW_YORK.lat, NEW_YORK.lon, 2);

  useEffect(() => {
    // Initial camera position (close to Hanoi)
    camera.position.set(hanoiPos.x * 1.5, hanoiPos.y * 1.5, hanoiPos.z * 1.5);
    camera.lookAt(hanoiPos);

    // Start the journey after a brief pause
    setTimeout(() => setPhase("journey"), 1000);
  }, [camera, hanoiPos]);

  useFrame((_, delta) => {
    // Rotate the Earth slowly
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }

    if (phase === "journey") {
      timeRef.current += delta * 0.3; // Animation speed

      if (timeRef.current <= 1) {
        // Smoothly interpolate camera from Hanoi to New York
        const t = easeInOutCubic(timeRef.current);

        const startPos = hanoiPos.clone().multiplyScalar(1.5);
        const endPos = newYorkPos.clone().multiplyScalar(1.8);

        camera.position.lerpVectors(startPos, endPos, t);

        const lookAtTarget = new THREE.Vector3().lerpVectors(hanoiPos, newYorkPos, t);
        camera.lookAt(lookAtTarget);
      } else if (timeRef.current > 1 && timeRef.current <= 2) {
        // Zoom out to show full Earth
        const zoomT = easeInOutCubic(timeRef.current - 1);
        const currentPos = newYorkPos.clone().multiplyScalar(1.8);
        const farPos = new THREE.Vector3(0, 0, 6);

        camera.position.lerpVectors(currentPos, farPos, zoomT);
        camera.lookAt(0, 0, 0);
      } else {
        setPhase("complete");
        setTimeout(() => {
          onJourneyComplete();
        }, 500);
      }
    }
  });

  // Easing function for smooth animation
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  return (
    <>
      {/* Main Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#1a365d"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Continent outlines - simplified */}
      <mesh>
        <sphereGeometry args={[2.01, 64, 64]} />
        <meshBasicMaterial
          color="#2d5f8d"
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>

      {/* Location markers */}
      <LocationMarker position={hanoiPos} color="#e94560" />
      <LocationMarker position={newYorkPos} color="#f97068" />

      {/* Traveling plane */}
      {phase === "journey" && timeRef.current <= 1 && (
        <TravelingPlane
          startPos={hanoiPos}
          endPos={newYorkPos}
          progress={easeInOutCubic(timeRef.current)}
        />
      )}

      {/* Journey path - curved dotted line */}
      {phase !== "start" && (
        <>
          {Array.from({ length: 50 }).map((_, i) => {
            const t = i / 49;
            const curveHeight = 0.8;
            const midPoint = new THREE.Vector3()
              .lerpVectors(hanoiPos, newYorkPos, 0.5)
              .normalize()
              .multiplyScalar(2 + curveHeight);

            const curve = new THREE.QuadraticBezierCurve3(hanoiPos, midPoint, newYorkPos);
            const point = curve.getPoint(t);

            return (
              <mesh key={i} position={point}>
                <sphereGeometry args={[0.01, 8, 8]} />
                <meshBasicMaterial color="#e94560" opacity={0.6} transparent />
              </mesh>
            );
          })}
        </>
      )}
    </>
  );
};

interface GlobeJourneyProps {
  onComplete: () => void;
}

export const GlobeJourney = ({ onComplete }: GlobeJourneyProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  const handleJourneyComplete = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0a0f1e] transition-opacity duration-1000 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars
          radius={300}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        <Earth onJourneyComplete={handleJourneyComplete} />
      </Canvas>

      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            From Hanoi to Stony Brook
          </h1>
          <p className="text-lg md:text-xl text-white/70 animate-fade-in delay-300">
            A journey of innovation and impact
          </p>
        </div>
      </div>
    </div>
  );
};
