import type { RefObject } from "react";
import {
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

// Shared "rises up from below" reveal used consistently across every
// scrolled-into-view section, so scrolling through the site always feels
// like content is flowing up to meet you rather than each section having
// its own unrelated entrance.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const riseIn: Variants = {
  hidden: { opacity: 0, y: 56 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE_OUT },
  },
};

// A slightly smaller rise for secondary/inline elements (captions, footnotes)
// where the full 56px throw would feel too heavy.
export const riseInSm: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: EASE_OUT },
  },
};

// Wrap a grid/list with this and give each item `variants={riseIn}` (no
// separate initial/whileInView needed on the children) to get a cascading
// rise instead of everything popping in at once.
export function riseInStagger(stagger = 0.09, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
}

// Standard viewport trigger: fires a bit before the section is fully in
// view, and only once, so re-scrolling past it doesn't replay the reveal.
export const viewportOnce = { once: true, margin: "-100px" } as const;
export const viewportOnceTight = { once: true, margin: "-60px" } as const;

// Continuous scroll-linked "approach and pass" motion: content rises up
// from below as its section enters the viewport, holds fully in front of
// the user while the section is in view, then keeps rising and fades out
// as the section exits above — so scrolling never feels like descending a
// page, it feels like information floats up to meet you and moves on.
// Reverses cleanly when scrolling back up, which is expected and fine.
export function useScrollFlow(ref: RefObject<HTMLElement | null>, throwPx = 90) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 36,
    mass: 0.4,
  });

  const yRaw = useTransform(smooth, [0, 0.22, 0.78, 1], [throwPx, 0, 0, -throwPx]);
  const opacity = useTransform(smooth, [0, 0.14, 0.86, 1], [0, 1, 1, 0]);
  // --slice-mult is 0 under prefers-reduced-motion (globals.css): handled in
  // CSS so server and client markup match (a JS check would mismatch).
  const y = useTransform(yRaw, (v) => `calc(var(--slice-mult, 1) * ${v.toFixed(2)}px)`);

  return { y, opacity };
}
