"use client";

import { useRef } from "react";
import SectionHeading from "./SectionHeading";
import { mulberry32 } from "@/lib/rng";
import { useDict } from "@/lib/i18n";

// Every member gets a one-of-a-kind shattered-glass portrait generated from
// their index. When real photos arrive, swap <ShardArt/> for an <Image/>
// (public/team/<isim>.jpg) inside the same frame.
function ShardArt({ seed }: { seed: number }) {
  const rnd = mulberry32(seed * 7919 + 13);
  const C = 4;
  const R = 5;
  const W = 100;
  const H = 125;
  const g: { x: number; y: number }[][] = [];
  for (let r = 0; r <= R; r++) {
    const row: { x: number; y: number }[] = [];
    for (let c = 0; c <= C; c++) {
      row.push({
        x: (c / C) * W + (c === 0 || c === C ? 0 : (rnd() - 0.5) * (W / C) * 0.8),
        y: (r / R) * H + (r === 0 || r === R ? 0 : (rnd() - 0.5) * (H / R) * 0.8),
      });
    }
    g.push(row);
  }
  const tris: { pts: string; fill: string; o: number; tx: number; ty: number }[] = [];
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const a = g[r][c];
      const b = g[r][c + 1];
      const d = g[r + 1][c + 1];
      const e = g[r + 1][c];
      const pairs = rnd() > 0.5 ? [[a, b, d], [a, d, e]] : [[a, b, e], [b, d, e]];
      for (const t of pairs) {
        const cx = (t[0].x + t[1].x + t[2].x) / 3;
        const cy = (t[0].y + t[1].y + t[2].y) / 3;
        const dx = cx - W / 2;
        const dy = cy - H / 2;
        const len = Math.hypot(dx, dy) || 1;
        const roll = rnd();
        tris.push({
          pts: t.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
          fill: roll > 0.86 ? "#ffd60a" : roll > 0.78 ? "#f6f6f2" : "#ffd60a",
          o: roll > 0.86 ? 0.9 : roll > 0.78 ? 0.35 : 0.05 + rnd() * 0.2,
          tx: (dx / len) * (6 + rnd() * 8),
          ty: (dy / len) * (6 + rnd() * 8),
        });
      }
    }
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
      {tris.map((t, i) => (
        <polygon
          key={i}
          points={t.pts}
          fill={t.fill}
          fillOpacity={t.o}
          stroke="rgba(255,214,10,0.28)"
          strokeWidth="0.35"
          className="transition-transform duration-500 ease-out group-hover:[transform:translate(var(--tx),var(--ty))]"
          style={{ "--tx": `${t.tx}px`, "--ty": `${t.ty}px` } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}

function TiltCard({ index, role, dept }: { index: number; role: string; dept: string }) {
  const d = useDict();
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${((0.5 - py) * 14).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((px - 0.5) * 16).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div className="lg:even:mt-16" style={{ perspective: 900 }}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        data-cursor={d.cur.inspect}
        style={
          {
            transform: "rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
            transition: "transform 0.25s ease-out",
            transformStyle: "preserve-3d",
          } as React.CSSProperties
        }
        className="group relative overflow-hidden border border-line bg-panel/80 p-3 hover:border-accent/60"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-soft">
          <ShardArt seed={index + 1} />
          <span className="text-outline absolute bottom-1 left-3 font-display text-[5.5rem] font-black leading-none text-accent/90">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="px-1 pb-2 pt-5">
          <p className="font-display text-2xl font-extrabold uppercase leading-none text-ivory">{role}</p>
          <p className="mono-tag mt-2 text-[11px] uppercase text-text-faint">{dept}</p>
        </div>
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(260px circle at var(--mx,50%) var(--my,50%), rgba(255,214,10,0.18), transparent 60%)",
          }}
        />
      </div>
    </div>
  );
}

export default function Team() {
  const d = useDict();
  return (
    <section id="takim" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10">
        <SectionHeading
          index="02"
          tag={d.team.tag}
          title={d.team.title}
          description={d.team.desc}
          variant="slice"
        />

        <div className="mt-14 grid grid-cols-2 gap-3 pb-12 sm:gap-5 lg:grid-cols-4">
          {d.team.members.map((m, i) => (
            <TiltCard key={m.role} index={i} role={m.role} dept={m.dept} />
          ))}
        </div>
      </div>
    </section>
  );
}
