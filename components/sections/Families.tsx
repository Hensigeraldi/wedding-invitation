"use client";

import Reveal from "@/components/animations/Reveal";

export default function Families() {
  return (
    <section id="families" className="relative bg-[linear-gradient(180deg,#f7f1e3_0%,#ecd9a8_50%,#f7f1e3_100%)] pt-20 pb-12 md:pt-28 md:pb-16 overflow-hidden">
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <Reveal>
          <div className="flex flex-col items-center">
            <p className="font-heading-alt text-2xl md:text-3xl text-gold-deep mb-8 italic">Kami yang berbahagia</p>
            
            <div className="flex flex-col gap-4 w-full max-w-sm px-4">
              <div className="gold-card py-6 px-4 bg-[#f0e6cc]/50 backdrop-blur-sm">
                <p className="text-sm md:text-base text-deep-burgundy font-medium tracking-wide">
                  Kel. Irot - Pai, Robby
                </p>
              </div>
              <div className="gold-card py-6 px-4 bg-[#f0e6cc]/50 backdrop-blur-sm">
                <p className="text-sm md:text-base text-deep-burgundy font-medium tracking-wide">
                  Kel. Rondonuwu - Sandag, Ranny
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
