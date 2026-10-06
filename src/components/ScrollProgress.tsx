"use client";

import { motion, useScroll } from "framer-motion";

// Driven by a transform (scaleX) straight from the scroll position: no React
// state, no layout, no extra easing on top of the smooth scroll itself.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      className="fixed left-0 top-0 z-[60] h-[2px] w-full bg-accent"
      aria-hidden="true"
    />
  );
}
