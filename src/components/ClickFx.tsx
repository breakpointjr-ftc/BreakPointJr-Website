"use client";

import { useEffect, useRef } from "react";
import type { Burst } from "@/lib/rng";

type Crack = { pts: { x: number; y: number }[]; t0: number; width: number };
type Shard = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  size: number;
  t0: number;
  life: number;
  color: string;
};

const GROW_MS = 200;
const CRACK_LIFE = 1100;
const COLORS = ["#ffd60a", "#ffd60a", "#fff3a3", "#f6f6f2", "#0b0b0e"];

// Overlay canvas that turns every click into a small fracture: jagged cracks
// radiate from the pointer and glass shards fly off. Cracks are stroked
// twice (dark + yellow) so they read on the dark page and on the yellow CTA.
export default function ClickFx() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let w = 0;
    let h = 0;
    const cracks: Crack[] = [];
    const shards: Shard[] = [];
    let raf = 0;
    let running = false;
    let last = 0;

    const resize = () => {
      if (w && window.innerWidth === w && Math.abs(window.innerHeight - h) < 160) return;
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeCrack = (x: number, y: number, angle: number, length: number, width: number, now: number, depth = 0) => {
      const pts = [{ x, y }];
      let a = angle;
      let cx = x;
      let cy = y;
      let travelled = 0;
      while (travelled < length) {
        const step = 14 + Math.random() * 14;
        a += (Math.random() - 0.5) * 0.7;
        cx += Math.cos(a) * step;
        cy += Math.sin(a) * step;
        travelled += step;
        pts.push({ x: cx, y: cy });
        if (depth < 1 && Math.random() < 0.16 && travelled > 40) {
          makeCrack(cx, cy, a + (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random() * 0.6), length * 0.45, width * 0.7, now + 60, depth + 1);
        }
      }
      cracks.push({ pts, t0: now, width });
    };

    const burst = (x: number, y: number, power: number) => {
      const now = performance.now();
      const n = Math.round(5 + power * 5);
      const base = Math.random() * Math.PI * 2;
      for (let i = 0; i < n; i++) {
        const a = base + (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        makeCrack(x, y, a, (70 + Math.random() * 130) * power, 1.4 + power * 0.5, now);
      }
      const sn = Math.round(6 + power * 14);
      for (let i = 0; i < sn; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = (120 + Math.random() * 380) * (0.6 + power * 0.5);
        shards.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 120,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 12,
          size: 3 + Math.random() * 7 * (0.6 + power * 0.4),
          t0: now,
          life: 800 + Math.random() * 700,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
      wake();
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (let i = cracks.length - 1; i >= 0; i--) {
        const c = cracks[i];
        const age = now - c.t0;
        if (age > CRACK_LIFE) {
          cracks.splice(i, 1);
          continue;
        }
        if (age < 0) continue;
        const grow = Math.min(1, age / GROW_MS);
        const count = Math.max(2, Math.floor(c.pts.length * grow));
        const fade = age < CRACK_LIFE * 0.45 ? 1 : 1 - (age - CRACK_LIFE * 0.45) / (CRACK_LIFE * 0.55);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        for (const pass of [0, 1]) {
          ctx.lineWidth = pass === 0 ? c.width + 2.2 : c.width;
          ctx.strokeStyle = pass === 0 ? `rgba(0,0,0,${(0.55 * fade).toFixed(3)})` : `rgba(255,214,10,${fade.toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(c.pts[0].x, c.pts[0].y);
          for (let k = 1; k < count; k++) ctx.lineTo(c.pts[k].x, c.pts[k].y);
          ctx.stroke();
        }
      }

      for (let i = shards.length - 1; i >= 0; i--) {
        const s = shards[i];
        const age = now - s.t0;
        if (age > s.life) {
          shards.splice(i, 1);
          continue;
        }
        s.vy += 980 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rot += s.vr * dt;
        const fade = 1 - age / s.life;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.globalAlpha = fade;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.moveTo(0, -s.size);
        ctx.lineTo(s.size * 0.8, s.size * 0.7);
        ctx.lineTo(-s.size * 0.9, s.size * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      draw(now);
      if (cracks.length > 0 || shards.length > 0) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        ctx.clearRect(0, 0, w, h);
      }
    };

    function wake() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }

    const onBurst = (e: Event) => {
      const d = (e as CustomEvent<Burst>).detail;
      burst(d.x, d.y, d.power ?? 1.6);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("fx:burst", onBurst);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("fx:burst", onBurst);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] h-full w-full"
    />
  );
}
