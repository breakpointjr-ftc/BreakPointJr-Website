"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Magnetic from "./Magnetic";
import { fireBurst } from "@/lib/rng";
import { useDict } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

// The in-view trigger sits on the (unclipped) wrapper: a child that starts
// fully clipped by its overflow-hidden parent never counts as "in view".
function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="-mt-[0.25em] block overflow-hidden pb-[0.04em] pt-[0.25em]"
    >
      <motion.span
        variants={{
          hidden: { y: "105%" },
          show: { y: "0%", transition: { duration: 1, delay, ease: EASE } },
        }}
        className="block"
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

export default function CtaBanner() {
  const d = useDict();
  const [shake, setShake] = useState(0);

  const smash = (e: React.MouseEvent) => {
    fireBurst({ x: e.clientX, y: e.clientY, power: 2 });
    setShake((n) => n + 1);
  };

  return (
    <section
      data-cursor-dark
      className="relative overflow-hidden bg-accent text-ink"
      style={{ clipPath: "polygon(0 5vw, 100% 0, 100% calc(100% - 5vw), 0 100%)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-56deg, #07070a 0 2px, transparent 2px 38px)",
        }}
      />

      <div className="relative mx-auto max-w-[1500px] px-6 pb-[calc(5vw+3rem)] pt-[calc(5vw+3.5rem)] sm:px-10">
        <p className="mono-tag mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase">
          <span className="slash-shape h-[14px] w-8 bg-ink" aria-hidden="true" />
          {d.cta.eyebrow}
        </p>

        <h2 className="font-display text-[clamp(3.4rem,12vw,11rem)] font-black uppercase leading-[1.02] tracking-tight">
          {d.cta.lines.slice(0, 2).map((l, i) => (
            <Line key={l} delay={i * 0.12}>
              {l}
            </Line>
          ))}
          <Line delay={0.24}>
            <button
              key={shake}
              type="button"
              onClick={smash}
              data-cursor={d.cur.brk}
              className={`relative inline-block text-left uppercase ${shake ? "crack-shake" : ""}`}
            >
              {d.cta.lines[2]}
            </button>
          </Line>
        </h2>

        <div className="mt-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-md text-lg font-medium leading-relaxed sm:text-xl">
            {d.cta.text}
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <Magnetic>
              <a
                href="#sponsorluk"
                data-cursor={d.cur.support}
                className="slash-shape inline-flex items-center gap-3 bg-ink px-10 py-5 font-display text-xl font-extrabold uppercase tracking-wide text-accent transition-transform hover:scale-[1.03]"
              >
                {d.cta.sponsor}
                <ArrowRight size={20} strokeWidth={2.5} />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#iletisim"
                data-cursor={d.cur.write}
                className="inline-flex items-center gap-3 border-2 border-ink px-9 py-[18px] font-display text-xl font-extrabold uppercase tracking-wide transition-colors hover:bg-ink hover:text-accent"
              >
                {d.cta.contact}
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

    </section>
  );
}
