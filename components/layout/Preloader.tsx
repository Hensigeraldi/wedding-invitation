"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { weddingConfig } from "@/config/wedding";

export default function Preloader({ onEnter }: { onEnter: () => void }) {
  const [isOpening, setIsOpening] = useState(false);

  function handleEnter() {
    setIsOpening(true);
    // let the exit animation play before mounting the main site
    setTimeout(onEnter, 1100);
  }

  return (
    <AnimatePresence>
      {!isOpening ? (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(180deg, #0e0407 0%, #12040a 100%)" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(74,14,24,0.6) 0%, rgba(18,4,10,0.98) 70%)",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="relative z-10 text-center px-6"
          >
            <p className="section-label mb-6">
              {weddingConfig.groom.displayName} &amp; {weddingConfig.bride.displayName}
            </p>
            <h1 className="font-heading-alt italic text-3xl sm:text-4xl md:text-5xl text-ivory mb-10">
              Welcome to Our Wedding
            </h1>

            <motion.button
              onClick={handleEnter}
              className="btn-elegant mx-auto"
              whileTap={{ scale: 0.96 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              Enter
            </motion.button>
          </motion.div>

          {/* radial gold light-ray accent */}
          <motion.div
            className="absolute w-[140vmax] h-[140vmax] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.13) 0%, rgba(201,162,39,0.05) 40%, transparent 65%)",
            }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      ) : (
        <motion.div
          key="overlay-open"
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{ background: "#0e0407" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
