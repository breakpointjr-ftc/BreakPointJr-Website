"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useDict } from "@/lib/i18n";

// Words wrapped in *asterisks* turn yellow when the scroll reaches them.
function tokenize(text: string) {
  return text.split(" ").map((raw) => ({ text: raw.replace(/\*/g, ""), hot: raw.startsWith("*") }));
}

function ScrubWord({
  progress,
  index,
  total,
  hot,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  total: number;
  hot: boolean;
  children: string;
}) {
  const start = index / total;
  const end = Math.min(1, start + 3.2 / total);
  const color = useTransform(
    progress,
    [start, end],
    ["rgba(244,244,241,0.14)", hot ? "#ffd60a" : "#f4f4f1"],
    { clamp: true }
  );
  return (
    <motion.span
      lang={/breakpoint/i.test(children) ? "en" : undefined}
      style={{ color }}
      className="mr-[0.28em] inline-block"
    >
      {children}
    </motion.span>
  );
}

export default function About() {
  const d = useDict();
  const TOKENS = tokenize(d.about.manifesto);
  const textRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 0.82", "end 0.45"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.4 });

  return (
    <section id="hakkimizda" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10">
        <div className="mb-8 flex items-center gap-4">
          <span className="number-tick text-sm font-semibold text-accent">01</span>
          <span className="slash-shape h-[14px] w-8 bg-accent" />
          <span className="mono-tag text-[11px] uppercase text-text-dim">{d.about.tag}</span>
        </div>

        <p
          ref={textRef}
          className="max-w-6xl font-display text-[clamp(1.8rem,3.9vw,3.6rem)] font-bold uppercase leading-[1.06] tracking-tight"
        >
          <span className="sr-only">{d.about.manifesto.replace(/\*/g, "")}</span>
          <span aria-hidden="true">
            {TOKENS.map((t, i) => (
              <ScrubWord key={i} progress={progress} index={i} total={TOKENS.length} hot={t.hot}>
                {t.text}
              </ScrubWord>
            ))}
          </span>
        </p>

        <div className="mt-14 border-b border-line sm:mt-20">
          {d.about.pillars.map((p, i) => (
            <motion.article
              key={p.title}
              tabIndex={0}
              data-cursor={d.cur.open}
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden border-t border-line outline-none"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-x-100 group-focus-within:scale-x-100 group-focus:scale-x-100" />
              <div className="relative flex items-center gap-5 py-4 sm:gap-10 sm:py-5">
                <span className="number-tick w-10 text-sm font-semibold text-accent transition-colors duration-300 group-hover:text-ink group-focus:text-ink sm:w-16">
                  0{i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-[clamp(2rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-tight text-ivory transition-colors duration-300 group-hover:text-ink group-focus:text-ink">
                    {p.title}
                  </h3>
                  <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus:grid-rows-[1fr] [@media(hover:none)]:!grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="max-w-xl pt-4 text-base leading-relaxed text-text-dim transition-colors duration-300 group-hover:text-ink/80 group-focus:text-ink/80 sm:text-lg">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                </div>
                <ArrowUpRight
                  className="hidden shrink-0 text-text-faint transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink sm:block"
                  size={32}
                  strokeWidth={1.5}
                />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
