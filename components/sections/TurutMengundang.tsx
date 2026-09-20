"use client";

import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/animations/Reveal";
import TwinkleDust from "@/components/animations/TwinkleDust";

export default function TurutMengundang() {
  return (
    <section className="relative bg-wine py-20 md:py-28">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #0e0407 0%, #2a070d 25%, #4a0e18 50%, #2a070d 75%, #0e0407 100%)",
        }}
      />
      <TwinkleDust theme="maroon" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <Reveal>
          <div className="gold-card relative px-6 py-12 md:px-12 md:py-16 bg-black/20 backdrop-blur-sm">
            <h2 className="font-heading text-center text-champagne text-2xl md:text-3xl tracking-widest uppercase mb-6">
              Turut Mengundang
            </h2>
            <div className="w-32 mx-auto border-t border-gold/40 mb-10" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 relative">
              {/* Divider in the middle for desktop */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gold/30 -translate-x-1/2" />
              
              {/* Left Column */}
              <div className="flex flex-col gap-4 md:gap-6 text-center md:text-right md:pr-12">
                {weddingConfig.turutMengundang.left.map((item, i) => (
                  <div key={i} className="border border-gold/20 bg-black/20 rounded-md p-4 backdrop-blur-sm">
                    <p className="text-ivory/90 text-sm md:text-base whitespace-pre-line leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-4 md:gap-6 text-center md:text-left md:pl-12">
                {weddingConfig.turutMengundang.right.map((item, i) => (
                  <div key={i} className="border border-gold/20 bg-black/20 rounded-md p-4 backdrop-blur-sm">
                    <p className="text-ivory/90 text-sm md:text-base whitespace-pre-line leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
