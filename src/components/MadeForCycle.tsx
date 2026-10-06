"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useDict } from "@/lib/i18n";

// Scroll distance the pinned section holds per word. Lower = faster to
// scroll through; keep it well under 100vh so the pin never feels like a trap.
const VH_PER_WORD = 80;

// Each word is cut into three horizontal slices that slide off in opposite
// directions as the next word's slices slide in from the other side.
const SLICES = [
  { clip: "inset(0 0 65% 0)", dir: -1 },
  { clip: "inset(34% 0 33% 0)", dir: 1 },
  { clip: "inset(66% 0 0 0)", dir: -1 },
] as const;

// -1 (entering) .. 0 (centered, held) .. +1 (leaving). Always clamped by hand,
// so words far from their band stay fully out instead of ghosting back in.
function useWordPhase(progress: MotionValue<number>, index: number, total: number) {
  return useTransform(progress, (v) => {
    const center = (index + 0.5) / total;
    const half = 0.5 / total;
    let p = (v - center) / half;
    p = Math.max(-1, Math.min(1, p));
    if (index === 0 && p < 0) p = 0;
    if (index === total - 1 && p > 0) p = 0;
    const dead = 0.3;
    const a = Math.abs(p);
    const s = a < dead ? 0 : (a - dead) / (1 - dead);
    return Math.sign(p) * s;
  });
}

function Slice({
  phase,
  clip,
  dir,
  children,
}: {
  phase: MotionValue<number>;
  clip: string;
  dir: number;
  children: React.ReactNode;
}) {
  // --slice-mult is 0 under prefers-reduced-motion (see globals.css), so the
  // words cross-fade in place instead of sliding; done in CSS so server and
  // client render the same markup.
  const x = useTransform(phase, (s) => `calc(var(--slice-mult, 1) * ${(s * dir * 80).toFixed(3)}vw)`);
  const opacity = useTransform(phase, (s) => 1 - Math.min(1, Math.abs(s) * 1.05));
  return (
    <motion.span
      aria-hidden="true"
      style={{ x, opacity, clipPath: clip }}
      className="will-change-transform absolute inset-0 flex items-center justify-center px-4"
    >
      {children}
    </motion.span>
  );
}

function SlicedWord({
  progress,
  index,
  total,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  children: string;
}) {
  const phase = useWordPhase(progress, index, total);
  return (
    <>
      <span className="sr-only">{children}</span>
      {SLICES.map((s, i) => (
        <Slice key={i} phase={phase} clip={s.clip} dir={s.dir}>
          <span className="text-gradient text-center font-display text-[clamp(3.6rem,13vw,12rem)] font-black uppercase leading-none">
            {children}
          </span>
        </Slice>
      ))}
    </>
  );
}

function Pip({
  progress,
  index,
  total,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const phase = useWordPhase(progress, index, total);
  const scaleX = useTransform(phase, (s) => 0.35 + 0.65 * (1 - Math.min(1, Math.abs(s) * 1.4)));
  const opacity = useTransform(phase, (s) => 0.25 + 0.75 * (1 - Math.min(1, Math.abs(s) * 1.4)));
  return (
    <motion.span
      style={{ scaleX, opacity }}
      className="block h-1 w-10 origin-left bg-accent"
    />
  );
}

export default function MadeForCycle() {
  const d = useDict();
  const WORDS = d.cycle.words;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      style={{ "--pin-vh": WORDS.length * VH_PER_WORD } as React.CSSProperties}
      className="pin-height relative"
    >
      <div className="h-screen-safe sticky top-0 flex flex-col items-center justify-center overflow-hidden">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mono-tag flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-ivory sm:text-base"
        >
          <span className="slash-shape h-[14px] w-7 bg-accent" aria-hidden="true" />
          <span lang="en">BreakPoint Jr.</span> {d.cycle.label}
        </motion.p>

        <div className="relative mt-10 h-[clamp(5rem,16vw,13rem)] w-full">
          {WORDS.map((w, i) => (
            <SlicedWord
              key={w}
              progress={progress}
              index={i}
              total={WORDS.length}
            >
              {w}
            </SlicedWord>
          ))}
        </div>

        <div className="mt-12 flex items-center gap-3" aria-hidden="true">
          {WORDS.map((w, i) => (
            <Pip key={w} progress={progress} index={i} total={WORDS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
