"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Magnetic from "./Magnetic";
import { useIntroRevealed } from "@/lib/intro";
import { fireBurst } from "@/lib/rng";
import { useDict } from "@/lib/i18n";

// The slash of the team logo, applied to the name: the word is cut along a
// steep diagonal and the two halves slide past each other along the cut.
const CUT_A = "polygon(0 0, 40% 0, 62% 100%, 0 100%)";
const CUT_B = "polygon(40% 0, 100% 0, 100% 100%, 62% 100%)";
// direction of the cut (dx : dy) so halves slide *along* the fault line
const DIR = { x: 0.3, y: 0.95 };

const SIZE = "text-[clamp(5rem,min(34vw,31vh),26rem)]";

function Word() {
  return (
    <span lang="en" className={`font-display font-black uppercase leading-[0.88] tracking-tight ${SIZE}`}>
      <span className="block">Break</span>
      <span className="block">Point.</span>
    </span>
  );
}

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const revealed = useIntroRevealed();
  const d = useDict();
  const wordRef = useRef<HTMLDivElement>(null);
  const [shaking, setShaking] = useState(false);
  const settleTimer = useRef<number | null>(null);
  const shakeTimer = useRef<number | null>(null);
  const entered = useRef(false);

  // how far (px) the two halves are slid apart along the cut
  const slide = useMotionValue(300);
  const spring = useSpring(slide, { stiffness: 140, damping: 11, mass: 0.9 });
  const ax = useTransform(spring, (s) => -s * DIR.x);
  const ay = useTransform(spring, (s) => -s * DIR.y);
  const bx = useTransform(spring, (s) => s * DIR.x);
  const by = useTransform(spring, (s) => s * DIR.y);
  const opacity = useMotionValue(0);
  const gap = useTransform(spring, (s) => Math.min(1, Math.abs(s) / 40));

  const impact = () => {
    const el = wordRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    fireBurst({ x: r.left + r.width * 0.5, y: r.top + r.height * 0.5, power: 1.8 });
  };

  useEffect(() => {
    if (!revealed || entered.current) return;
    entered.current = true;
    opacity.set(1);
    slide.set(0);
    const t = window.setTimeout(impact, 420);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  useEffect(
    () => () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      if (shakeTimer.current) window.clearTimeout(shakeTimer.current);
    },
    []
  );

  const onMove = (e: React.PointerEvent) => {
    if (settleTimer.current || !entered.current) return;
    const el = wordRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const k = (e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1);
    slide.set(k * 56);
  };

  const onLeave = () => {
    if (!settleTimer.current) slide.set(0);
  };

  const smash = () => {
    if (settleTimer.current) return;
    impact();
    slide.set(150);
    setShaking(true);
    shakeTimer.current = window.setTimeout(() => setShaking(false), 560);
    settleTimer.current = window.setTimeout(() => {
      slide.set(0);
      settleTimer.current = null;
    }, 900);
  };

  return (
    <section
      id="top"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="min-h-screen-safe relative flex items-center overflow-hidden pb-20 pt-32"
    >
      <motion.div
        initial="hidden"
        animate={revealed ? "show" : "hidden"}
        variants={stagger}
        className="mono-tag absolute left-6 top-24 text-[11px] uppercase text-text-dim sm:left-10"
      >
        <motion.span variants={rise} className="block">
          <span className="text-accent">{"//"}</span> {d.hero.meta}
        </motion.span>
      </motion.div>

      <div className="relative mx-auto w-full max-w-[1500px] px-6 sm:px-10">
        <h1 className="sr-only">BreakPoint Jr.</h1>

        <div className={shaking ? "crack-shake" : ""}>
          <div
            ref={wordRef}
            role="button"
            tabIndex={0}
            aria-label={d.hero.aria}
            data-cursor={d.cur.brk}
            onClick={smash}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                smash();
              }
            }}
            className="relative inline-block select-none"
          >
            <motion.div aria-hidden="true" style={{ x: ax, y: ay, opacity, clipPath: CUT_A }} className="text-ivory">
              <Word />
            </motion.div>
            <motion.div
              aria-hidden="true"
              style={{ x: bx, y: by, opacity, clipPath: CUT_B }}
              className="absolute inset-0 text-accent"
            >
              <Word />
            </motion.div>

            {/* the fault line itself, with the logo's breakpoint ring */}
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{ opacity: gap }}
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              <line
                x1="40"
                y1="0"
                x2="62"
                y2="100"
                stroke="#ffd60a"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </motion.svg>
            <motion.span
              aria-hidden="true"
              style={{ opacity }}
              className="pointer-events-none absolute left-[51%] top-1/2 h-[clamp(1.6rem,3.2vw,3rem)] w-[clamp(1.6rem,3.2vw,3rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-accent bg-ink"
            >
              <span className="absolute inset-0 animate-ping rounded-full border border-accent/70" />
              <span className="absolute left-1/2 top-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bug" />
            </motion.span>

            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, rotate: -14, scale: 0.4 }}
              animate={revealed ? { opacity: 1, rotate: -6, scale: 1 } : {}}
              transition={{ delay: 0.9, type: "spring", stiffness: 260, damping: 14 }}
              className="slash-shape absolute -bottom-2 right-0 translate-x-[42%] bg-ink px-5 py-1 font-display text-[clamp(2rem,6vw,5.5rem)] font-black uppercase leading-none text-accent ring-1 ring-accent sm:px-8"
            >
              Jr.
            </motion.span>
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
          variants={stagger}
          className="mt-12 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <motion.p variants={rise} className="max-w-md text-lg leading-relaxed text-text-dim sm:text-xl">
            {d.hero.text[0]}
            <span className="text-ivory">{d.hero.text[1]}</span>
            {d.hero.text[2]}
          </motion.p>

          <motion.div variants={rise} className="flex flex-wrap items-center gap-5">
            <Magnetic>
              <a
                href="#hakkimizda"
                data-cursor={d.cur.explore}
                className="slash-shape inline-flex items-center gap-3 bg-accent px-9 py-4 font-display text-lg font-extrabold uppercase tracking-wide text-ink transition-colors hover:bg-ivory"
              >
                {d.hero.meet}
                <ArrowDown size={18} strokeWidth={2.5} />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#sponsorluk"
                data-cursor={d.cur.support}
                className="inline-flex items-center gap-3 border border-line px-8 py-4 font-display text-lg font-extrabold uppercase tracking-wide text-ivory transition-colors hover:border-accent hover:text-accent"
              >
                {d.hero.sponsor}
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: revealed ? 1 : 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="mono-tag pointer-events-none absolute bottom-6 right-6 flex items-center gap-3 text-[10px] uppercase text-text-faint sm:right-10"
      >
        <span className="[@media(hover:none)]:hidden">{d.hero.hint}</span>
        <span className="hidden [@media(hover:none)]:inline">{d.hero.hintTouch}</span>
        <span className="relative block h-10 w-px overflow-hidden bg-line">
          <motion.span
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-accent"
          />
        </span>
      </motion.div>
    </section>
  );
}
