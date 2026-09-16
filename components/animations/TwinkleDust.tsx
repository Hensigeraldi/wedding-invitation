"use client";

import { useMemo } from "react";

type TwinkleDustProps = {
  theme?: "maroon" | "cream";
};

export default function TwinkleDust({ theme = "maroon" }: TwinkleDustProps) {
  // Generate a few overlapping layers with different animation delays for a more organic feel
  const layers = useMemo(() => {
    // Kurangi jumlah layer menjadi 1 agar bintang-bintang tidak terlalu ramai
    return Array.from({ length: 1 }).map((_, i) => {
      // Randomize position slightly for each layer
      const xOffset = Math.floor(Math.random() * 50);
      const yOffset = Math.floor(Math.random() * 50);
      const delay = i * -1.5;
      
      return (
        <div
          key={i}
          className="absolute inset-0 pointer-events-none twinkle-dust"
          style={{
            animationDelay: `${delay}s`,
            backgroundPosition: `${xOffset}px ${yOffset}px`,
            opacity: theme === "maroon" ? 0.6 : 0.25,
          }}
        />
      );
    });
  }, [theme]);

  // Use mix-blend-screen for dark backgrounds, multiply or normal for cream
  const blendMode = theme === "maroon" ? "mix-blend-screen" : "mix-blend-multiply";

  return (
    <div 
      className={`absolute inset-0 z-0 pointer-events-none ${blendMode} overflow-hidden ${
        theme === "maroon" ? "text-gold" : "text-deep-burgundy"
      }`}
    >
      {layers}
    </div>
  );
}
