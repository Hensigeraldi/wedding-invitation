"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/animations/Reveal";

const SPAN_CLASSES: Record<string, string> = {
  tall: "row-span-2",
  wide: "col-span-2",
  normal: "",
};

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const items = weddingConfig.gallery;

  function close() {
    setActiveIndex(null);
  }
  function next() {
    setActiveIndex((i) => (i === null ? null : (i + 1) % items.length));
  }
  function prev() {
    setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length));
  }

  return (
    <section id="gallery" className="relative bg-[linear-gradient(180deg,#f7f1e3_0%,#ecd9a8_50%,#f7f1e3_100%)] py-28 md:py-36 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <p className="section-label text-gold-deep mb-4">Moments</p>
          <h2 className="font-heading-alt italic text-4xl md:text-6xl text-burgundy-black">
            Prewedding Gallery
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4">
          {items.map((item, i) => (
            <Reveal
              key={item.image}
              delay={(i % 4) * 0.08}
              direction="none"
              className={`${SPAN_CLASSES[item.span ?? "normal"]}`}
            >
              <button
                onClick={() => setActiveIndex(i)}
                className="group relative w-full h-full overflow-hidden block"
                aria-label="View story"
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-burgundy-black/0 group-hover:bg-burgundy-black/30 transition-colors duration-500 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] tracking-[0.3em] uppercase text-gold">
                    View Story
                  </span>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-[100] bg-burgundy-black/95 backdrop-blur-md flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              className="absolute top-6 right-6 text-ivory/80 hover:text-gold"
              onClick={close}
              aria-label="Close"
            >
              <X size={26} />
            </button>
            <button
              className="absolute left-4 md:left-10 text-ivory/80 hover:text-gold"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous"
            >
              <ChevronLeft size={30} />
            </button>
            <button
              className="absolute right-4 md:right-10 text-ivory/80 hover:text-gold"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next"
            >
              <ChevronRight size={30} />
            </button>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="relative w-full max-w-3xl aspect-[4/5] md:aspect-[3/2]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={items[activeIndex].image}
                alt=""
                fill
                sizes="90vw"
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
