"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useDict } from "@/lib/i18n";

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

// Endless ticker that speeds up (and flips direction) with scroll velocity.
function Ticker({
  items,
  baseSpeed,
  className,
  separator,
}: {
  items: readonly string[];
  baseSpeed: number;
  className: string;
  separator: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-6, 0, 6], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    const sign = baseSpeed < 0 ? -1 : 1;
    const flip = f < -0.05 ? -1 : 1;
    baseX.set(baseX.get() + Math.abs(baseSpeed) * sign * flip * (delta / 1000) * (1 + Math.abs(f)));
  });

  const group = (
    <span className="flex shrink-0 items-center">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="whitespace-nowrap px-6 sm:px-10">{it}</span>
          {separator}
        </span>
      ))}
    </span>
  );

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div style={{ x }} className="flex w-max">
        {group}
        {group}
        {group}
        {group}
      </motion.div>
    </div>
  );
}

// One hazard-yellow strip with the team's loop; it speeds up with scrolling.
export default function PrincipleMarquee() {
  const d = useDict();
  return (
    <div
      className="relative my-6 overflow-hidden py-8 sm:my-10 sm:py-12"
      aria-label={d.marquee.join(", ")}
    >
      <div className="-mx-[4%] -rotate-2">
        <Ticker
          items={d.marquee}
          baseSpeed={4}
          separator={<span className="slash-shape h-[0.9em] w-7 bg-ink" aria-hidden="true" />}
          className="bg-accent py-3 font-display text-[clamp(2rem,5.5vw,4.8rem)] font-black uppercase leading-none text-ink"
        />
      </div>
    </div>
  );
}
