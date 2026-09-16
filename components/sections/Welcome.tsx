"use client";

import Image from "next/image";
import Reveal from "@/components/animations/Reveal";
import TwinkleDust from "@/components/animations/TwinkleDust";

export default function Welcome() {
  return (
    <section
      id="welcome"
      className="relative min-h-[100svh] py-20 flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #1a0509 0%, #0e0407 50%, #160408 100%)",
      }}
    >
      <TwinkleDust theme="maroon" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <Reveal>
          {/* Main container for frame + photo */}
          <div className="relative flex items-center justify-center">
            {/* The Photo (Behind the frame, z-index 0) */}
            {/* Menggunakan inset untuk memastikan foto tidak melebar keluar batas luar bingkai */}
            <div className="absolute top-[8%] bottom-[8%] left-[8%] right-[8%] z-0 overflow-hidden">
              <Image
                src="/images/frame/prewed.png"
                alt="CHRISTIAN & RODELA"
                fill
                className="object-cover"
                priority
              />
              {/* Dimmer tipis agar teks lebih terbaca */}
              <div className="absolute inset-0 bg-burgundy-black/30" />
            </div>

            {/* The Frame (On top of the photo, z-index 10) */}
            {/* Karena z-10, bingkai dan tanda salib di atasnya PASTI akan menutupi ujung-ujung foto */}
            <div className="relative z-10 w-full pointer-events-none">
              <Image
                src="/images/frame/bingkai.png"
                alt="Bingkai"
                width={800}
                height={1200}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>

            {/* The Text (On top of everything, z-index 20) */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-8 mt-10">
              <p className="text-gold tracking-[0.25em] uppercase text-xs md:text-sm mb-4 font-semibold drop-shadow-md">
                The Wedding Of
              </p>
              <h1 className="font-heading-alt text-4xl md:text-5xl text-ivory drop-shadow-lg mb-2">
                CHRISTIAN
              </h1>
              <span className="font-heading-alt text-2xl text-champagne my-1 drop-shadow-md italic">
                &amp;
              </span>
              <h1 className="font-heading-alt text-4xl md:text-5xl text-ivory drop-shadow-lg mb-6">
                RODELA
              </h1>
              <div className="w-12 h-[1px] bg-gold mb-5 drop-shadow-md" />
              <p className="text-champagne tracking-widest text-sm font-medium drop-shadow-md">
                10 OKTOBER 2026
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
