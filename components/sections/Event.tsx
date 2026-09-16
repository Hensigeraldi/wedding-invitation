"use client";

import { MapPin, Clock, ExternalLink } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/animations/Reveal";
import TwinkleDust from "@/components/animations/TwinkleDust";

function EventCard({
  title,
  date,
  time,
  venueName,
  mapsUrl,
  delay = 0,
}: {
  title: string;
  date: string;
  time: string;
  venueName: string;
  mapsUrl: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className="flex-1">
      <div className="gold-card relative text-center px-8 py-14">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-px bg-gold" />
        <p className="section-label text-champagne mb-3">{title}</p>
        <h3 className="font-heading-alt italic text-2xl md:text-3xl text-ivory mb-6">
          {date}
        </h3>

        <div className="flex items-center justify-center gap-2 text-champagne/90 text-sm mb-2">
          <Clock size={14} />
          <span>{time}</span>
        </div>
        <div className="flex items-start justify-center gap-2 text-ivory/70 text-sm mb-8">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <span>{venueName}</span>
        </div>

        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-elegant"
        >
          Open Google Maps <ExternalLink size={12} />
        </a>
      </div>
    </Reveal>
  );
}

export default function Event() {
  return (
    <section id="event" className="relative bg-wine py-28 md:py-36">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, #0e0407 0%, #2a070d 25%, #4a0e18 50%, #2a070d 75%, #0e0407 100%)",
        }}
      />
      <TwinkleDust theme="maroon" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <Reveal className="text-center mb-16">
          <p className="section-label text-champagne mb-4">Save The Date</p>
          <h2 className="font-heading-alt italic text-4xl md:text-6xl text-ivory">
            Wedding Invitation
          </h2>
        </Reveal>

        <div className="flex flex-col md:flex-row gap-8 md:gap-6">
          <EventCard {...weddingConfig.ceremony} />
          <EventCard {...weddingConfig.reception} delay={0.15} />
        </div>
      </div>
    </section>
  );
}