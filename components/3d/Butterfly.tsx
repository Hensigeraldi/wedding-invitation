"use client";

import { useRef, useMemo, useEffect, Suspense, Component, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

/** Catches broken/corrupt GLTF loads so the scene falls back to the procedural butterfly instead of crashing the Canvas. */
class GltfErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: unknown) {
    console.warn("Butterfly GLB failed to load, using procedural fallback:", error);
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export type ButterflyProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
  radius?: number;
  seed?: number;
  /** If true, butterfly stays at position and just flaps (for preloader) */
  stationary?: boolean;
};

// ─── Procedural butterfly (fallback & background scenes) ─────────────────────
export function ProceduralButterfly({ color = "#c9a227" }: { color?: string }) {
  const leftWing = useRef<THREE.Group>(null);
  const rightWing = useRef<THREE.Group>(null);
  const flapPhase = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    flapPhase.current += delta * 6;
    const flap = Math.sin(flapPhase.current) * 0.55 + 0.15;
    if (leftWing.current) leftWing.current.rotation.y = flap;
    if (rightWing.current) rightWing.current.rotation.y = -flap;
  });

  const wingMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color).multiplyScalar(0.2),
        metalness: 0.4,
        roughness: 0.3,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      }),
    [color]
  );

  const wingShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.bezierCurveTo(0.5, 0.6, 1.1, 0.5, 1.0, -0.1);
    shape.bezierCurveTo(0.9, -0.6, 0.4, -0.5, 0, 0);
    return shape;
  }, []);

  const geometry = useMemo(() => new THREE.ShapeGeometry(wingShape, 12), [wingShape]);

  return (
    <group>
      <mesh>
        <capsuleGeometry args={[0.05, 0.35, 4, 8]} />
        <meshStandardMaterial color="#2a070d" roughness={0.6} />
      </mesh>
      <group ref={leftWing} position={[0, 0.05, 0]}>
        <mesh geometry={geometry} material={wingMaterial} position={[0, 0.1, 0]} />
        <mesh geometry={geometry} material={wingMaterial} position={[0, -0.15, 0]} scale={0.65} rotation={[0, 0, -0.3]} />
      </group>
      <group ref={rightWing} position={[0, 0.05, 0]} scale={[-1, 1, 1]}>
        <mesh geometry={geometry} material={wingMaterial} position={[0, 0.1, 0]} />
        <mesh geometry={geometry} material={wingMaterial} position={[0, -0.15, 0]} scale={0.65} rotation={[0, 0, -0.3]} />
      </group>
    </group>
  );
}

// ─── GLB butterfly ────────────────────────────────────────────────────────────
// The Poly.pizza export's native bounding box is ~16-18 units across (obj2gltf
// output, not modeled at a 1-unit convention). Every call site in this project
// (ButterflyScene layers, EnvelopePreloader's soft reveal) passes `scale`
// values tuned for the ~2-unit-wide ProceduralButterfly fallback (e.g. 0.4-1.1).
// Without normalization, the real model would render 8-9x larger than
// intended — filling/clipping through the camera instead of looking like a
// small flying butterfly. We auto-normalize on load so `scale` means the same
// thing regardless of which butterfly (procedural or GLB) ends up rendering.
const TARGET_SIZE = 2.0; // matches ProceduralButterfly's approx wingspan at scale=1

function GltfButterfly({
  color,
  stationary,
  flyProgress,
}: {
  color: string;
  stationary?: boolean;
  flyProgress?: React.MutableRefObject<number>;
}) {
  const { scene, animations } = useGLTF("/models/butterfly.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { actions } = useAnimations(animations, groupRef);
  const flapRef = useRef(0);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);

    // 1. Normalize to a consistent unit size (see TARGET_SIZE note above).
    const rawBox = new THREE.Box3().setFromObject(clone);
    const rawSize = rawBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z) || 1;
    const normalizeScale = TARGET_SIZE / maxDim;
    clone.scale.setScalar(normalizeScale);

    // 2. Re-center so rotation/bobbing pivots around the body rather than an
    //    off-center bounding box (this model's Y range isn't centered on 0).
    const scaledBox = new THREE.Box3().setFromObject(clone);
    const center = scaledBox.getCenter(new THREE.Vector3());
    clone.position.sub(center);

    // 3. Tint the model towards gold/champagne
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            // Blend existing color with gold tint
            const orig = mat.color.clone();
            mat.color.lerpColors(orig, new THREE.Color(color), 0.3);
            mat.emissive.set(color);
            mat.emissiveIntensity = 0.04;
            mat.metalness = Math.min(mat.metalness + 0.2, 0.6);
          }
        });
      }
    });
    return clone;
  }, [scene, color]);

  useEffect(() => {
    // Play built-in animations if any
    Object.values(actions).forEach((a) => a?.play());
  }, [actions]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    flapRef.current += delta;

    if (stationary) {
      // Gentle hover bob
      groupRef.current.position.y = Math.sin(flapRef.current * 1.5) * 0.06;
      groupRef.current.rotation.z = Math.sin(flapRef.current * 0.8) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

// ─── Main Butterfly export ────────────────────────────────────────────────────
export default function Butterfly({
  position = [0, 0, 0],
  scale = 1,
  color = "#c9a227",
  speed = 0.15,
  radius = 1.5,
  seed = Math.random() * 100,
  stationary = false,
}: ButterflyProps) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current || stationary) return;
    const t = clock.getElapsedTime() * speed + seed;
    const x = position[0] + Math.sin(t) * radius;
    const y = position[1] + Math.sin(t * 1.7) * (radius * 0.35);
    const z = position[2] + Math.cos(t * 0.8) * (radius * 0.5);
    group.current.position.set(x, y, z);
    const dx = Math.cos(t) * radius;
    group.current.rotation.z = Math.sin(t * 1.7) * 0.25;
    group.current.rotation.y = Math.atan2(dx, 1) * 0.6 + Math.PI / 2;
    group.current.rotation.x = Math.sin(t * 0.5) * 0.1;
  });

  return (
    <group ref={group} position={stationary ? position : [0, 0, 0]} scale={scale}>
      <GltfErrorBoundary fallback={<ProceduralButterfly color={color} />}>
        <Suspense fallback={<ProceduralButterfly color={color} />}>
          <GltfButterfly color={color} stationary={stationary} />
        </Suspense>
      </GltfErrorBoundary>
    </group>
  );
}

useGLTF.preload("/models/butterfly.glb");
