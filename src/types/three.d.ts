import { Object3DNode } from '@react-three/fiber';
import * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    // Meshes
    group: Object3DNode<THREE.Group, typeof THREE.Group>;
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    line: Object3DNode<THREE.Line, typeof THREE.Line>;

    // Geometries
    sphereGeometry: Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
    cylinderGeometry: Object3DNode<THREE.CylinderGeometry, typeof THREE.CylinderGeometry>;
    bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
    bufferAttribute: Object3DNode<THREE.BufferAttribute, typeof THREE.BufferAttribute>;

    // Materials
    meshBasicMaterial: Object3DNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
    meshStandardMaterial: Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    lineBasicMaterial: Object3DNode<THREE.LineBasicMaterial, typeof THREE.LineBasicMaterial>;

    // Lights
    ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
  }
}
