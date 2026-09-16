"use client";

import { useEffect, useState } from "react";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/animations/Reveal";
import TwinkleDust from "@/components/animations/TwinkleDust";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: Date): TimeLeft {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Countdown() {
  const target = new Date(weddingConfig.date);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const units: { label: string; value: number }[] = [
    { label: "Days", value: timeLeft?.days ?? 0 },
    { label: "Hours", value: timeLeft?.hours ?? 0 },
    { label: "Minutes", value: timeLeft?.minutes ?? 0 },
    { label: "Seconds", value: timeLeft?.seconds ?? 0 },
  ];

  return (
    <section className="relative py-28 md:py-36 overflow-hidden bg-wine" style={{ background: "linear-gradient(180deg, #0e0407 0%, #2a070d 25%, #4a0e18 50%, #2a070d 75%, #0e0407 100%)" }}>
      <TwinkleDust theme="maroon" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <Reveal>
          <p className="section-label text-champagne mb-4">Counting Down To</p>
          <h2 className="font-heading-alt italic text-3xl md:text-5xl text-ivory mb-14">
            {weddingConfig.dateLong}
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="grid grid-cols-4 gap-3 md:gap-8 max-w-2xl mx-auto">
            {units.map((unit) => (
              <div key={unit.label} className="flex flex-col items-center border-t border-gold/20 pt-4 md:pt-6">
                <span
                  className="font-heading-alt text-4xl sm:text-5xl md:text-7xl text-ivory tabular-nums"
                  suppressHydrationWarning
                >
                  {timeLeft ? pad(unit.value) : "--"}
                </span>
                <span className="mt-2 text-[10px] md:text-xs tracking-[0.3em] uppercase text-champagne/80">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
