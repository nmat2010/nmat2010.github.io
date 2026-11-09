import { Suspense, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`.replace("//", "/");

/** A real CC0 model (Poly Haven), cloned per use, fitted to a height or width, standing on y=0 */
const ModelInner = ({
  name,
  h,
  w,
  tint,
  cast = true,
}: {
  name: string;
  h?: number;
  w?: number;
  tint?: string;
  cast?: boolean;
}) => {
  const { scene } = useGLTF(asset(`models/${name}/${name}_1k.gltf`));
  const obj = useMemo(() => {
    const c = scene.clone(true);
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = cast;
        m.receiveShadow = true;
        if (tint) {
          const mat = (m.material as THREE.MeshStandardMaterial).clone();
          mat.color.set(tint);
          m.material = mat;
        }
      }
    });
    c.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(c);
    const size = box.getSize(new THREE.Vector3());
    const s = h ? h / size.y : w ? w / size.x : 1;
    c.scale.setScalar(s);
    c.updateMatrixWorld(true);
    box.setFromObject(c);
    const center = box.getCenter(new THREE.Vector3());
    const wrap = new THREE.Group();
    c.position.set(-center.x, -box.min.y, -center.z);
    wrap.add(c);
    return wrap;
  }, [scene, h, w, tint, cast]);
  return <primitive object={obj} />;
};

export const Model = ({
  pos = [0, 0, 0],
  rot = [0, 0, 0],
  ...rest
}: {
  name: string;
  h?: number;
  w?: number;
  tint?: string;
  cast?: boolean;
  pos?: [number, number, number];
  rot?: [number, number, number];
}) => (
  <group position={pos} rotation={rot}>
    <Suspense fallback={null}>
      <ModelInner {...rest} />
    </Suspense>
  </group>
);

/** PBR material set from Poly Haven jpgs: colour, GL normal, ARM (ao/rough/metal) */
export const usePBR = (name: string, repeat: [number, number]) => {
  const maps = useLoader(THREE.TextureLoader, [asset(`tex/${name}_Diffuse.jpg`), asset(`tex/${name}_nor_gl.jpg`), asset(`tex/${name}_arm.jpg`)]);
  return useMemo(() => {
    const [map, normalMap, arm] = maps.map((t) => {
      const c = t.clone();
      c.wrapS = c.wrapT = THREE.RepeatWrapping;
      c.repeat.set(...repeat);
      c.anisotropy = 4;
      c.needsUpdate = true;
      return c;
    });
    map.colorSpace = THREE.SRGBColorSpace;
    return { map, normalMap, roughnessMap: arm, aoMap: arm, metalnessMap: arm };
  }, [maps, repeat]);
};

/** Night sky for the reflections on shiny things. No post-processing: it was the main cause of lag. */
export const Atmosphere = ({ indoor = false }: { indoor?: boolean }) => (
  <Environment files={asset("hdr/kloppenheim_06_puresky.hdr")} environmentIntensity={indoor ? 0.5 : 0.8} />
);
