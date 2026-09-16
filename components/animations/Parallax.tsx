"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** speed < 1 moves slower than scroll (background), > 1 moves faster (foreground) */
  speed?: number;
  /** apply on the vertical axis */
  axis?: "y" | "x";
};

export default function Parallax({
  children,
  className,
  speed = 0.3,
  axis = "y",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const range = 120 * speed;
  const value: MotionValue<number> = useTransform(
    scrollYProgress,
    [0, 1],
    [-range, range]
  );

  const style = axis === "y" ? { y: value } : { x: value };

  return (
    <div ref={ref} className={className}>
      <motion.div style={style}>{children}</motion.div>
    </div>
  );
}
