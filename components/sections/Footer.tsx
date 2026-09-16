"use client";

import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/animations/Reveal";
import TwinkleDust from "@/components/animations/TwinkleDust";

export default function Footer() {
  return (
    <footer className="relative py-20 overflow-hidden bg-wine" style={{ background: "linear-gradient(180deg, #0e0407 0%, #2a070d 25%, #4a0e18 50%, #2a070d 75%, #0e0407 100%)" }}>
      <TwinkleDust theme="maroon" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <p className="text-sm md:text-base text-ivory/80 max-w-md mx-auto mb-10 leading-relaxed italic">
            &quot;Kiranya kasih Tuhan selalu menyertai dan memberkati kita hari ini, esok dan selamanya&quot;
          </p>
          <p className="font-heading-alt italic text-3xl md:text-4xl text-ivory mb-4">
            {weddingConfig.groom.displayName} &amp; {weddingConfig.bride.displayName}
          </p>
          <div className="w-16 mx-auto mb-4 border-t border-gold/40" />

          <p className="text-[11px] text-ivory/60 mt-10">
            With love, thank you for being part of our story.
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
