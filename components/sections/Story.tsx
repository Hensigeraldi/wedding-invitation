"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/animations/Reveal";
import Parallax from "@/components/animations/Parallax";

export default function Story() {
  return (
    <section
      id="story"
      className="relative bg-[linear-gradient(180deg,#f7f1e3_0%,#ecd9a8_45%,#f7f1e3_100%)] py-28 md:py-36 overflow-hidden"
    >
      <div className="relative max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-20">
          <h2 className="font-heading-alt italic text-4xl md:text-6xl text-burgundy-black">
            The Groom & The Bride
          </h2>
        </Reveal>

        <div className="relative z-10">
          {/* vertical gold line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-deep/40 to-transparent md:-translate-x-1/2" />

          <div className="flex flex-col gap-20 md:gap-28">
            {weddingConfig.story.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={item.year}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? "" : "md:flex-row-reverse"
                    }`}
                >
                  {/* node */}
                  <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-gold-deep shadow-[0_0_14px_3px_rgba(176,140,34,0.3)] z-10 border border-gold-deep/60" />

                  {/* image */}
                  <Reveal
                    direction={isEven ? "left" : "right"}
                    className="w-full md:w-1/2 pl-16 md:pl-0"
                  >
                    <Parallax speed={0.15}>
                      <motion.div
                        className="relative aspect-[4/5] w-full max-w-sm mx-auto overflow-hidden rounded-sm"
                        whileHover={{ scale: 1.03 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 90vw, 400px"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 border border-gold/25" />
                      </motion.div>
                    </Parallax>
                  </Reveal>

                  {/* text */}
                  <Reveal
                    direction={isEven ? "right" : "left"}
                    delay={0.15}
                    className="w-full md:w-1/2 pl-16 md:pl-0 text-left md:text-center"
                  >
                    <span className="font-heading-alt italic text-3xl md:text-4xl text-burgundy-black">
                      {item.year}
                    </span>
                    <h3 className="font-heading text-xl md:text-2xl text-burgundy-black mt-2 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base text-wine/80 leading-relaxed max-w-sm md:mx-auto">
                      {item.description}
                    </p>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
