import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { weddingConfig } from "@/config/wedding";
import SmoothScrollProvider from "@/components/animations/SmoothScrollProvider";

// Self-hosted variable fonts (public/fonts) — no external font-fetch needed
// at build time, which keeps builds reliable on any VPS/CI environment.
const cormorant = localFont({
  variable: "--font-cormorant",
  src: [
    { path: "../public/fonts/CormorantGaramond.ttf", style: "normal" },
    { path: "../public/fonts/CormorantGaramond-Italic.ttf", style: "italic" },
  ],
});

const playfair = localFont({
  variable: "--font-playfair",
  src: [
    { path: "../public/fonts/PlayfairDisplay.ttf", style: "normal" },
    { path: "../public/fonts/PlayfairDisplay-Italic.ttf", style: "italic" },
  ],
});

const inter = localFont({
  variable: "--font-inter",
  src: [{ path: "../public/fonts/Inter.ttf", style: "normal" }],
});

export const metadata: Metadata = {
  title: `${weddingConfig.groom.displayName} & ${weddingConfig.bride.displayName} Wedding`,
  description: `The Wedding of ${weddingConfig.groom.displayName} & ${weddingConfig.bride.displayName} — ${weddingConfig.dateLong}`,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#120509",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${cormorant.variable} ${playfair.variable} ${inter.variable} antialiased`}
    >
      <body className="bg-dark text-ivory">
        <div className="grain-overlay" aria-hidden="true" />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
