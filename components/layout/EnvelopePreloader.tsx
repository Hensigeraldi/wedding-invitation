"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import Butterfly from "@/components/3d/Butterfly";
import { useGLTF } from "@react-three/drei";

function ButterflySoftReveal() {
  const groupRef = useRef<THREE.Group>(null);
  const time = useRef(0);
  
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    time.current += delta;
    
    // Kupu-kupu terbang ke atas (spiral up) setelah keluar dari amplop
    const y = time.current * 0.5;
    groupRef.current.position.set(0, y, 0);
  });

  return (
    <group ref={groupRef}>
      <Butterfly 
        scale={0.65} 
        color="#8A1538" 
        stationary={false} 
        radius={1.2} 
        speed={1.5} 
      /> 
    </group>
  );
}

export default function EnvelopePreloader({ onEnter }: { onEnter: () => void }) {
  const [phase, setPhase] = useState<"idle" | "opening" | "soft_reveal" | "fading" | "done">("idle");
  
  useEffect(() => {
    useGLTF.preload("/models/butterfly.glb");
    const img = new Image();
    img.src = "/images/envelope-texture.jpg";
  }, []);

  const handleOpen = () => {
    if (phase !== "idle") return;
    setPhase("opening");
    
    // Smooth stagger: Flap is opening. After 700ms, it's mostly open, so we transition to soft_reveal.
    setTimeout(() => {
      setPhase("soft_reveal");
    }, 700); 
    
    // After 2.5 seconds of soft reveal, fade everything out
    setTimeout(() => {
      setPhase("fading");
    }, 3200); 
    
    // Fully done and unmount
    setTimeout(() => {
      setPhase("done");
      onEnter();
    }, 4200); 
  };

  if (phase === "done") return null;

  const isFading = phase === "fading";
  const isOpened = phase !== "idle";

  return (
    <div 
      className="fixed inset-0 z-[100] cursor-pointer bg-[#0e0407] overflow-hidden" 
      onClick={handleOpen}
      style={{ perspective: "1500px" }}
    >
      <AnimatePresence>
        {phase === "idle" && (
          <motion.p
            className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.4em] text-gold/80 uppercase z-50 pointer-events-none drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
          >
            Tap untuk membuka
          </motion.p>
        )}
      </AnimatePresence>

      <motion.div 
        className="absolute inset-0 w-full h-full origin-center"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ scale: 1, opacity: 1 }}
        animate={isFading ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: [0.65, 0, 0.35, 1] }}
      >
        {/* Envelope Interior (Creamy white / Ivory) - Forms the diamond/V shape when opened */}
        <div className="absolute inset-0 bg-[#f7f1e3] shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]" />

        {/* Envelope Body Flaps (Maroon with texture) */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ transformStyle: "preserve-3d" }}>
          
          {/* Bottom Flap */}
          <motion.div 
            className="absolute inset-0 bg-[url('/images/envelope-texture.jpg')] bg-cover bg-center" 
            style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }}
            animate={isFading ? { opacity: 0.8 } : { opacity: 1 }}
          />
          <div 
            className="absolute inset-0 shadow-[inset_0_40px_40px_rgba(0,0,0,0.6)] mix-blend-multiply" 
            style={{ clipPath: "polygon(0 100%, 50% 50%, 100% 100%)" }} 
          />
          
          {/* Left Flap */}
          <motion.div 
            className="absolute inset-0 bg-[url('/images/envelope-texture.jpg')] bg-cover bg-center" 
            style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)" }}
            animate={isFading ? { opacity: 0.8 } : { opacity: 1 }}
          />
          <div 
            className="absolute inset-0 shadow-[inset_-30px_0_30px_rgba(0,0,0,0.4)] mix-blend-multiply" 
            style={{ clipPath: "polygon(0 0, 50% 50%, 0 100%)" }} 
          />
          
          {/* Right Flap */}
          <motion.div 
            className="absolute inset-0 bg-[url('/images/envelope-texture.jpg')] bg-cover bg-center" 
            style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }}
            animate={isFading ? { opacity: 0.8 } : { opacity: 1 }}
          />
          <div 
            className="absolute inset-0 shadow-[inset_30px_0_30px_rgba(0,0,0,0.4)] mix-blend-multiply" 
            style={{ clipPath: "polygon(100% 0, 100% 100%, 50% 50%)" }} 
          />
          
          {/* Folds/Seams Highlight (Emboss effect) - fades out early during fade phase */}
          <motion.svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
            animate={isFading ? { opacity: 0 } : { opacity: 0.7 }}
          >
            {/* Top diagonals - Light highlight for emboss */}
            <line x1="0" y1="0" x2="50%" y2="50%" stroke="#e5c76b" strokeWidth="1.5" />
            <line x1="100%" y1="0" x2="50%" y2="50%" stroke="#e5c76b" strokeWidth="1.5" />
            {/* Bottom diagonals - Dark shadow for depth */}
            <line x1="0" y1="100%" x2="50%" y2="50%" stroke="#0e0407" strokeWidth="2.5" />
            <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="#0e0407" strokeWidth="2.5" />
          </motion.svg>

          {/* Top Flap (Animated) */}
          <motion.div 
            className="absolute inset-0 origin-top z-20"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateX: 0 }}
            animate={isOpened ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Front of top flap */}
            <div 
              className="absolute inset-0 bg-[url('/images/envelope-texture.jpg')] bg-cover bg-center" 
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 50%)", backfaceVisibility: "hidden" }}
            />
            <div 
              className="absolute inset-0 shadow-[inset_0_-30px_30px_rgba(0,0,0,0.5)] mix-blend-multiply" 
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 50%)", backfaceVisibility: "hidden" }} 
            />
            
            {/* Back of top flap (visible when folded up - matching the cream interior) */}
            <div 
              className="absolute inset-0 bg-[#f7f1e3]" 
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 50%)", backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* 3D Butterfly - fades in during soft reveal, fades out alongside container */}
      <AnimatePresence>
        {(phase === "opening" || phase === "soft_reveal" || phase === "fading") && (
          <motion.div 
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isFading ? 0 : 1, scale: isFading ? 1.5 : 1 }}
            transition={{ 
              opacity: { duration: isFading ? 0.8 : 1.2, ease: "easeInOut" },
              scale: { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
            }}
          >
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
              <ambientLight intensity={2} />
              <directionalLight position={[2, 5, 2]} intensity={2.5} color="#ffffff" />
              <directionalLight position={[-2, -5, -2]} intensity={1} color="#f0d98a" />
              <ButterflySoftReveal />
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
