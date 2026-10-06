"use client";

import { useEffect, useRef } from "react";
import { mulberry32, type Burst } from "@/lib/rng";

type Edge = { x1: number; y1: number; x2: number; y2: number; mx: number; my: number };
type Ripple = { x: number; y: number; t0: number; power: number };

const GLOW_RADIUS = 260;

// A fixed sheet of "shattered glass" behind the whole site. Every edge is a
// crack; the cursor lights the cracks nearby and every click sends a
// shockwave through the mesh. It only draws while something is happening.
export default function GlassField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let edges: Edge[] = [];
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const ripples: Ripple[] = [];
    let raf = 0;
    let running = false;
    let lastMove = 0;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = w < 700 ? 88 : 124;
      const cols = Math.ceil(w / cell) + 3;
      const rows = Math.ceil(h / cell) + 3;
      const rnd = mulberry32(2026);
      const pts: { x: number; y: number }[][] = [];
      for (let r = 0; r < rows; r++) {
        const row: { x: number; y: number }[] = [];
        for (let c = 0; c < cols; c++) {
          row.push({
            x: (c - 1) * cell + (rnd() - 0.5) * cell * 0.75,
            y: (r - 1) * cell + (rnd() - 0.5) * cell * 0.75,
          });
        }
        pts.push(row);
      }
      edges = [];
      const add = (a: { x: number; y: number }, b: { x: number; y: number }) =>
        edges.push({
          x1: a.x,
          y1: a.y,
          x2: b.x,
          y2: b.y,
          mx: (a.x + b.x) / 2,
          my: (a.y + b.y) / 2,
        });
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const a = pts[r][c];
          if (c + 1 < cols) add(a, pts[r][c + 1]);
          if (r + 1 < rows) add(a, pts[r + 1][c]);
          if (r + 1 < rows && c + 1 < cols) {
            if (rnd() > 0.5) add(a, pts[r + 1][c + 1]);
            else add(pts[r][c + 1], pts[r + 1][c]);
          }
        }
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);

      // idle mesh
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.beginPath();
      for (const e of edges) {
        ctx.moveTo(e.x1, e.y1);
        ctx.lineTo(e.x2, e.y2);
      }
      ctx.stroke();

      if (reduce) return;

      // soft pool of light under the cursor
      if (pointer.x > -1000) {
        const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, GLOW_RADIUS * 1.2);
        g.addColorStop(0, "rgba(255,214,10,0.075)");
        g.addColorStop(1, "rgba(255,214,10,0)");
        ctx.fillStyle = g;
        ctx.fillRect(pointer.x - GLOW_RADIUS * 1.2, pointer.y - GLOW_RADIUS * 1.2, GLOW_RADIUS * 2.4, GLOW_RADIUS * 2.4);
      }

      // cracks lit by the cursor
      ctx.lineWidth = 1.4;
      for (const e of edges) {
        const dx = e.mx - pointer.x;
        const dy = e.my - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > GLOW_RADIUS * GLOW_RADIUS) continue;
        const k = 1 - Math.sqrt(d2) / GLOW_RADIUS;
        ctx.strokeStyle = `rgba(255,214,10,${(k * k * 0.6).toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(e.x1, e.y1);
        ctx.lineTo(e.x2, e.y2);
        ctx.stroke();
      }

      // shockwaves
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        const age = now - rp.t0;
        const life = 1500 * rp.power;
        if (age > life) {
          ripples.splice(i, 1);
          continue;
        }
        const radius = age * 1.05;
        const band = 110;
        const fade = 1 - age / life;
        for (const e of edges) {
          const dd = Math.abs(Math.hypot(e.mx - rp.x, e.my - rp.y) - radius);
          if (dd > band) continue;
          const a = (1 - dd / band) * fade * 0.85 * Math.min(1, rp.power);
          ctx.strokeStyle = `rgba(255,236,150,${a.toFixed(3)})`;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(e.x1, e.y1);
          ctx.lineTo(e.x2, e.y2);
          ctx.stroke();
        }
      }
    };

    const tick = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.16;
      pointer.y += (pointer.ty - pointer.y) * 0.16;
      draw(now);
      const settling =
        Math.abs(pointer.tx - pointer.x) > 0.5 || Math.abs(pointer.ty - pointer.y) > 0.5;
      if (ripples.length > 0 || settling || now - lastMove < 500) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };

    const wake = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (pointer.x < -1000) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      lastMove = performance.now();
      wake();
    };

    const onBurst = (e: Event) => {
      const d = (e as CustomEvent<Burst>).detail;
      ripples.push({ x: d.x, y: d.y, t0: performance.now(), power: 1 + (d.power ?? 1) * 0.5 });
      wake();
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        draw(performance.now());
      }, 120);
    };

    build();
    draw(performance.now());
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("fx:burst", onBurst);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("fx:burst", onBurst);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
