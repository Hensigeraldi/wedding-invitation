"use client";

import { motion } from "framer-motion";
import { Music } from "lucide-react";

export default function MusicPlayer({ isHidden = false, playing = false }: { isHidden?: boolean; playing?: boolean }) {
  return (
    <motion.div
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border border-gold/60 bg-burgundy-black/70 backdrop-blur-md flex items-center justify-center text-champagne pointer-events-none transition-colors ${
        isHidden ? "hidden" : ""
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: playing ? [0, 360] : 0,
      }}
      transition={{
        opacity: { duration: 0.6, delay: 1.5 },
        scale: { duration: 0.6, delay: 1.5 },
        rotate: playing ? { duration: 8, repeat: Infinity, ease: "linear" } : { duration: 0.6 },
      }}
    >
      <Music size={17} />
    </motion.div>
  );
}
