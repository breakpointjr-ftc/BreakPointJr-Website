"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import BrandMark from "./BrandMark";
import { setIntroPhase } from "@/lib/intro";
import { mulberry32 } from "@/lib/rng";
import { useDict } from "@/lib/i18n";

const BOOT_MS = 2300;
const SLASH_MS = 460;
const SHATTER_MS = 1750;

const LOG = [
  { at: 0, tone: "dim" },
  { at: 22, tone: "ok" },
  { at: 48, tone: "ok" },
  { at: 74, tone: "ok" },
  { at: 96, tone: "bug" },
] as const;

type Shard = {
  points: string;
  cx: number;
  cy: number;
  fill: string;
  x: number;
  y: number;
  rotate: number;
  delay: number;
  duration: number;
};

function buildShards(): Shard[] {
  const rnd = mulberry32(11);
  const C = 9;
  const R = 6;
  const g: { x: number; y: number }[][] = [];
  for (let r = 0; r <= R; r++) {
    const row: { x: number; y: number }[] = [];
    for (let c = 0; c <= C; c++) {
      const edgeX = c === 0 || c === C;
      const edgeY = r === 0 || r === R;
      row.push({
        x: (c / C) * 100 + (edgeX ? 0 : (rnd() - 0.5) * (100 / C) * 0.85),
        y: (r / R) * 100 + (edgeY ? 0 : (rnd() - 0.5) * (100 / R) * 0.85),
      });
    }
    g.push(row);
  }
  const tris: { x: number; y: number }[][] = [];
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const a = g[r][c];
      const b = g[r][c + 1];
      const d = g[r + 1][c + 1];
      const e = g[r + 1][c];
      if (rnd() > 0.5) tris.push([a, b, d], [a, d, e]);
      else tris.push([a, b, e], [b, d, e]);
    }
  }
  return tris.map((t) => {
    const cx = (t[0].x + t[1].x + t[2].x) / 3;
    const cy = (t[0].y + t[1].y + t[2].y) / 3;
    const dx = cx - 50;
    const dy = cy - 50;
    const dist = Math.hypot(dx, dy);
    const shade = 8 + Math.floor(rnd() * 14);
    return {
      points: t.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" "),
      cx,
      cy,
      fill: `rgb(${shade},${shade},${shade + 4})`,
      x: dx * 0.9,
      y: dy * 0.5 + 80 + rnd() * 50,
      rotate: (rnd() - 0.5) * 140,
      delay: 0.1 + (dist / 70) * 0.4 + rnd() * 0.06,
      duration: 0.85 + rnd() * 0.45,
    };
  });
}

type Phase = "boot" | "slash" | "shatter" | "gone";

export default function IntroSplash() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [progress, setProgress] = useState(0);
  const d = useDict();
  const startRef = useRef(0);
  const shards = useMemo(() => buildShards(), []);

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];
    let raf = 0;
    let started = false;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const finish = () => {
      if (cancelled) return;
      setPhase("gone");
      setIntroPhase("done");
      document.body.style.overflow = previousOverflow;
    };

    const goShatter = () => {
      if (cancelled) return;
      setPhase("shatter");
      setIntroPhase("revealing");
      timers.push(window.setTimeout(finish, SHATTER_MS));
    };

    const goSlash = () => {
      if (cancelled || started) return;
      started = true;
      setProgress(100);
      setPhase("slash");
      timers.push(window.setTimeout(goShatter, SLASH_MS));
    };

    if (reduce) {
      setIntroPhase("revealing");
      timers.push(window.setTimeout(finish, 350));
    } else {
      startRef.current = performance.now();
      const loop = (now: number) => {
        const t = Math.min(1, (now - startRef.current) / BOOT_MS);
        // slow start, quick middle, a stall just before 100 (the "bug")
        const eased = t < 0.85 ? Math.pow(t / 0.85, 1.6) * 0.92 : 0.92 + ((t - 0.85) / 0.15) * 0.08;
        setProgress(Math.min(100, Math.round(eased * 100)));
        if (t >= 1) goSlash();
        else raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const skip = () => {
      startRef.current = performance.now() - BOOT_MS;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", skip);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", skip);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  if (phase === "gone") return null;

  const showBase = phase !== "shatter";

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden="true">
      {showBase && (
        <div className="absolute inset-0 overflow-hidden bg-ink">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          <motion.div
            animate={{ opacity: phase === "slash" ? 0 : 1 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0"
          >
            <div className="mono-tag absolute left-6 top-6 text-[11px] uppercase text-text-dim sm:left-10 sm:top-9">
              <span lang="en">BreakPoint Jr.</span> <span className="text-accent">{"// boot"}</span>
            </div>
            <div className="mono-tag absolute right-6 top-6 text-[11px] uppercase text-text-faint sm:right-10 sm:top-9">
              v2026.1
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <BrandMark className="h-24 w-24 sm:h-32 sm:w-32" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-3xl font-extrabold uppercase tracking-wide text-ivory sm:text-5xl"
              >
                <span lang="en">
                  BreakPoint<span className="text-accent"> Jr.</span>
                </span>
              </motion.span>
            </div>

            <div className="mono-tag absolute bottom-24 left-6 space-y-1.5 text-[11px] sm:bottom-28 sm:left-10 sm:text-xs">
              {LOG.map((line, li) =>
                progress >= line.at ? (
                  <p
                    key={li}
                    className={
                      line.tone === "bug"
                        ? "glitch-jitter font-semibold text-bug"
                        : line.tone === "ok"
                          ? "text-text-dim"
                          : "text-accent"
                    }
                  >
                    {d.intro.log[li]}
                  </p>
                ) : null
              )}
            </div>

            <div className="absolute bottom-20 right-6 text-right sm:bottom-24 sm:right-10">
              <span className="font-display text-[22vw] font-black leading-none text-accent sm:text-[11rem]">
                {progress}
                <span className="text-[0.4em] text-text-faint">%</span>
              </span>
            </div>

            <div className="absolute inset-x-6 bottom-10 sm:inset-x-10">
              <div className="relative h-px bg-line">
                <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${progress}%` }} />
                <span
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bug"
                  style={{ left: `${progress}%` }}
                />
              </div>
              <p className="mono-tag mt-3 text-[10px] uppercase text-text-faint">
                {d.intro.skip}
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {phase === "slash" && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.28, ease: [0.7, 0, 0.2, 1] }}
          className="absolute left-1/2 top-1/2 h-[6px] w-[240vmax] -translate-x-1/2 -translate-y-1/2 rotate-[56deg] bg-accent shadow-[0_0_40px_6px_rgba(255,214,10,0.6)]"
        />
      )}

      {phase === "shatter" && (
        <>
          {shards.map((s, i) => (
            <motion.svg
              key={i}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
              animate={{ x: `${s.x}vw`, y: `${s.y}vh`, rotate: s.rotate, opacity: [1, 1, 0] }}
              transition={{
                duration: s.duration,
                delay: s.delay,
                ease: [0.5, 0, 0.9, 0.45],
                opacity: { duration: s.duration, delay: s.delay, times: [0, 0.7, 1] },
              }}
              style={{ transformOrigin: `${s.cx}% ${s.cy}%` }}
              className="absolute inset-0 h-full w-full"
            >
              <polygon
                points={s.points}
                fill={s.fill}
                stroke="rgba(255,214,10,0.7)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </motion.svg>
          ))}
          <motion.div
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 bg-accent"
          />
        </>
      )}
    </div>
  );
}
