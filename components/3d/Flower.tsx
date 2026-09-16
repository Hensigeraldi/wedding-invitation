"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float, Environment } from "@react-three/drei";

type FlowerProps = {
  theme?: "maroon" | "cream";
  scale?: number;
};

export function ProceduralFlower({ theme = "maroon", scale = 1 }: FlowerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const color = theme === "maroon" ? "#e6b826" : "#b08c22"; // Gold or Deep Gold
  const emissive = theme === "maroon" ? "#c9a227" : "#4a0e18"; 

  // Create a simple procedural flower: a center sphere and 5 petal spheres
  const centerGeometry = useMemo(() => new THREE.SphereGeometry(0.2, 16, 16), []);
  const petalGeometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.35, 16, 16);
    // Flatten petal
    geo.scale(1, 0.2, 1.5);
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.2,
        emissive: emissive,
        emissiveIntensity: 0.2,
      }),
    [color, emissive]
  );

  const petals = useMemo(() => {
    const arr = [];
    const numPetals = 5;
    for (let i = 0; i < numPetals; i++) {
      const angle = (i / numPetals) * Math.PI * 2;
      const radius = 0.4;
      arr.push({
        position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number],
        rotation: [0, -angle, 0] as [number, number, number],
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      // Very subtle sway
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      <mesh geometry={centerGeometry} material={material} />
      {petals.map((petal, i) => (
        <mesh
          key={i}
          geometry={petalGeometry}
          material={material}
          position={petal.position}
          rotation={petal.rotation}
        />
      ))}
    </group>
  );
}

export default function FlowerScene({ theme = "maroon", className = "" }: { theme?: "maroon" | "cream", className?: string }) {
  return (
    <div className={`w-32 h-32 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 5, 0], fov: 40 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Environment preset="sunset" />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <ProceduralFlower theme={theme} scale={1.2} />
        </Float>
      </Canvas>
    </div>
  );
}
