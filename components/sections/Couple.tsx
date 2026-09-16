"use client";

import Image from "next/image";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/animations/Reveal";
import Parallax from "@/components/animations/Parallax";
import TwinkleDust from "@/components/animations/TwinkleDust";

function PersonBlock({
  label,
  name,
  parents,
  photo,
  align,
}: {
  label: string;
  name: string;
  parents: string;
  photo: string;
  align: "left" | "right";
}) {
  const isLeft = align === "left";
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-6 items-center ${isLeft ? "" : "md:[direction:rtl]"
        }`}
    >
      <Reveal direction={isLeft ? "left" : "right"} className="[direction:ltr]">
        <Parallax speed={0.15}>
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto">
            <div className="relative w-full h-full overflow-hidden rounded-[50%] shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <Image
                src={photo}
                alt={name}
                fill
                sizes="(max-width: 768px) 90vw, 480px"
                className="object-cover grayscale-[15%]"
              />
              <div className="absolute inset-3 border border-gold/40 rounded-[50%] pointer-events-none" />
              <div className="absolute inset-0 border-2 border-gold/20 rounded-[50%] pointer-events-none" />
            </div>
          </div>
        </Parallax>
      </Reveal>

      <Reveal
        direction={isLeft ? "right" : "left"}
        delay={0.15}
        className="[direction:ltr] text-center md:text-left px-4"
      >
        <p className="section-label text-champagne mb-4">{label}</p>
        <h3 className="font-heading-alt italic text-xl md:text-2xl lg:text-3xl text-ivory mb-4">
          {name}
        </h3>
        <div className="gold-divider w-16 mx-auto md:mx-0 mb-5" />
        <p className="text-sm text-champagne/90 mb-2">{parents}</p>
      </Reveal>
    </div>
  );
}

export default function Couple() {
  return (
    <section id="couple" className="relative py-28 md:py-36 overflow-hidden bg-wine"
      style={{ background: "linear-gradient(180deg, #0e0407 0%, #2a070d 25%, #4a0e18 50%, #2a070d 75%, #0e0407 100%)" }}
    >
      <TwinkleDust theme="maroon" />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-20">
          <h2 className="font-heading-alt italic text-1xl md:text-2xl text-ivory">
            Dengan penuh syukur kepada Tuhan Yesus Kristus kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami
          </h2>
        </Reveal>

        <div className="flex flex-col gap-24 md:gap-32">
          <PersonBlock
            label="The Groom"
            name={weddingConfig.groom.fullName}
            parents={weddingConfig.groom.parents}
            photo={weddingConfig.groom.photo}
            align="left"
          />
          <PersonBlock
            label="The Bride"
            name={weddingConfig.bride.fullName}
            parents={weddingConfig.bride.parents}
            photo={weddingConfig.bride.photo}
            align="right"
          />
        </div>
      </div>
    </section>
  );
}