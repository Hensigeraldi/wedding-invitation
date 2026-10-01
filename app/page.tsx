"use client";


import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import MusicPlayer from "@/components/layout/MusicPlayer";
import SplashCover from "@/components/layout/SplashCover";
import Hero from "@/components/sections/Hero";
import Story from "@/components/sections/Story";
import Couple from "@/components/sections/Couple";
import Gallery from "@/components/sections/Gallery";
import Event from "@/components/sections/Event";
import Countdown from "@/components/sections/Countdown";
import Families from "@/components/sections/Families";
import TurutMengundang from "@/components/sections/TurutMengundang";
import Gift from "@/components/sections/Gift";
import RSVP from "@/components/sections/RSVP";
import Footer from "@/components/sections/Footer";
import { weddingConfig } from "@/config/wedding";

export default function Home() {
  const [coverOpen, setCoverOpen] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showGift, setShowGift] = useState(true);

  useEffect(() => {
    // Membaca parameter URL saat komponen dimuat
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('gift') === 'false') {
        setShowGift(false); // Sembunyikan jika gift=false
      }
    }
  }, []);

  useEffect(() => {
    const a = new Audio(weddingConfig.music.src);
    a.loop = true;
    
    // Update state based on actual audio events
    a.addEventListener('play', () => setPlaying(true));
    a.addEventListener('pause', () => setPlaying(false));
    
    setAudio(a);
    
    return () => {
      a.pause();
      a.src = "";
    };
  }, []);

  const handleOpenInvitation = () => {
    setCoverOpen(true);
    if (audio) {
      audio.play().then(() => setPlaying(true)).catch(err => console.log("Audio play failed:", err));
    }
  };

  return (
    <>
      {/* Hide MusicPlayer icon until intro video finishes, but mount it so it can play audio */}
      <MusicPlayer isHidden={!introFinished} playing={playing} />
      
      <AnimatePresence>
        {!coverOpen && (
          <SplashCover onOpen={handleOpenInvitation} />
        )}
      </AnimatePresence>

      <main>
        {/* Phase 2: After cover is open, but intro video not finished */}
        {coverOpen && !introFinished && (
          <Hero onVideoEnd={() => setIntroFinished(true)} />
        )}

        {/* Phase 3: After intro video is finished */}
        {introFinished && (
          <>
            <Couple useAlternateParents={!showGift} />
            <Story />
            <Event />
            <Gallery />
            <Countdown />
            <Families />
            <TurutMengundang />
            {showGift && <Gift />}
            <RSVP />
          </>
        )}
      </main>
      {introFinished && <Footer />}
    </>
  );
}
