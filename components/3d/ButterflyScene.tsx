"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import Butterfly from "./Butterfly";
import FloatingParticles from "./FloatingParticles";

type ButterflyLayer = {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  radius: number;
};

const DESKTOP_LAYERS: ButterflyLayer[] = [
  // foreground — larger, faster-feeling parallax
  { position: [1.5, 0.5, 2], scale: 1.1, color: "#e5c76b", speed: 0.18, radius: 1.8 },
  // middle layer
  { position: [-2, -0.5, 0], scale: 0.75, color: "#c9a227", speed: 0.13, radius: 1.4 },
  { position: [2.2, -1, -1], scale: 0.6, color: "#d4af37", speed: 0.15, radius: 1.2 },
  // background — smaller, softer
  { position: [-1.2, 1.2, -3], scale: 0.4, color: "#c9a227", speed: 0.09, radius: 1 },
];

const MOBILE_LAYERS: ButterflyLayer[] = [
  { position: [1.2, 0.4, 1], scale: 0.9, color: "#e5c76b", speed: 0.16, radius: 1.3 },
  { position: [-1.4, -0.6, -1], scale: 0.55, color: "#c9a227", speed: 0.12, radius: 1 },
];

type ButterflySceneProps = {
  className?: string;
  showParticles?: boolean;
};

export default function ButterflyScene({
  className,
  showParticles = true,
}: ButterflySceneProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const layers = isMobile ? MOBILE_LAYERS : DESKTOP_LAYERS;

  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={isMobile ? 1 : [1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 3]} intensity={0.6} color="#e5c76b" />
        {layers.map((layer, i) => (
          <Butterfly key={i} {...layer} seed={i * 17} />
        ))}
        {showParticles && (
          <FloatingParticles count={isMobile ? 40 : 100} />
        )}
      </Canvas>
    </div>
  );
}
