"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Driven entirely by a transform (scaleX) on the compositor thread — no
// React state, no re-render per scroll frame, no layout-triggering `width`
// animation. The previous version called setState on every native `scroll`
// event and animated `width`, which forces a layout + re-render on every
// frame and was a major source of scroll jank under Lenis's high-frequency
// scroll events.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.2,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0%" }}
      className="fixed top-0 left-0 h-[2px] w-full bg-accent z-[60]"
      aria-hidden="true"
    />
  );
}
