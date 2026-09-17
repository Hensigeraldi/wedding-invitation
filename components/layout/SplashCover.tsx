"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SplashCoverContent({ onOpen }: { onOpen: () => void }) {
  const searchParams = useSearchParams();
  const guestName = searchParams.get("to") || searchParams.get("yth") || "Tamu Undangan";
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: "-100%" }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[100] w-full h-[100svh] flex flex-col items-center justify-between overflow-hidden bg-dark text-center"
    >
      {/* Background Image */}
      <Image
        src="/images/frame/prewed.png"
        alt="Prewedding Background"
        fill
        className="object-cover opacity-80"
        priority
      />
      {/* Dimmer overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-burgundy-black/70 via-burgundy-black/20 to-burgundy-black/90 pointer-events-none" />

      {/* Content Container (Flex Column) */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-between pt-12 md:pt-16 pb-6 md:pb-10 px-6">
        
        {/* 1. Top Section */}
        <div className="flex-shrink-0">
          <motion.p 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gold tracking-[0.3em] uppercase text-xs md:text-sm font-semibold drop-shadow-md"
          >
            Wedding Invitation
          </motion.p>
        </div>

        {/* 2. Middle Section (Names) */}
        {/* Menggunakan flex-grow dan justify-end agar nama selalu terdorong ke bawah mendekati Kepada Yth tanpa menabrak, dan menjauhi wajah di atas */}
        <div className="flex-grow flex flex-col items-center justify-end pb-4 md:pb-8 w-full">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-heading-alt text-6xl md:text-7xl text-ivory drop-shadow-2xl leading-none font-bold italic text-center"
          >
            Christian <br/>
            <span className="text-3xl text-champagne my-1 inline-block italic font-normal">&amp;</span><br/>
            Rodela
          </motion.h1>
        </div>

        {/* 3. Bottom Section */}
        <div className="flex-shrink-0 flex flex-col items-center w-full">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-3 text-center"
          >
            <p className="text-ivory/80 text-xs md:text-sm mb-1">Kepada Yth :</p>
            <p className="text-gold font-semibold text-base md:text-lg drop-shadow-sm">{guestName}</p>
          </motion.div>

          {/* Cover Undangan Icon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mb-5 relative w-36 h-20 md:w-44 md:h-24"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-full h-full relative"
            >
              <Image
                src="/images/cover-undangan.png"
                alt="Cover Undangan"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Buka Undangan Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            onClick={onOpen}
            className="group flex items-center gap-3 bg-burgundy-black border border-gold/40 hover:border-gold hover:bg-wine text-champagne px-8 py-4 rounded-full uppercase tracking-widest text-xs transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            <MailOpen size={18} className="group-hover:scale-110 transition-transform duration-300" />
            Buka Undangan
          </motion.button>
        </div>

      </div>
    </motion.div>
  );
}

export default function SplashCover({ onOpen }: { onOpen: () => void }) {
  return (
    <Suspense fallback={null}>
      <SplashCoverContent onOpen={onOpen} />
    </Suspense>
  );
}
