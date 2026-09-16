"use client";

import { motion } from "framer-motion";

export default function Hero({ onVideoEnd }: { onVideoEnd?: () => void }) {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] w-full bg-dark flex items-center justify-center overflow-hidden"
    >
      <video
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        src="/videos/opening-video.mp4"
        onEnded={onVideoEnd}
      />
    </section>
  );
}
