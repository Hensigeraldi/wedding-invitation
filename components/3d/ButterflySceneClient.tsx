"use client";

import dynamic from "next/dynamic";

// R3F/Three.js needs browser APIs (WebGL), so this must never render on the server.
const ButterflyScene = dynamic(() => import("./ButterflyScene"), {
  ssr: false,
  loading: () => null,
});

export default ButterflyScene;
