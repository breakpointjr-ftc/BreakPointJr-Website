"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import SectionHeading from "./SectionHeading";
import { useDict } from "@/lib/i18n";

type Item = { fn: string; title: string; desc: string };

function TraceItem({
  item,
  index,
  total,
  progress,
}: {
  item: Item;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const left = index % 2 === 0;
  // the line reaches this node at roughly (index + 0.5) / total
  const at = (index + 0.5) / total;
  const hit = useTransform(progress, [at - 0.06, at], [0, 1], { clamp: true });
  const nodeScale = useTransform(hit, [0, 0.6, 1], [1, 1.5, 1]);
  const nodeColor = useTransform(hit, [0, 1], ["#ff3b30", "#ffd60a"]);
  const ring = useTransform(hit, [0, 1], [0, 1]);

  return (
    <div className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 md:grid-cols-2 md:gap-x-0">
      <div className="relative md:absolute md:left-1/2 md:top-8 md:-translate-x-1/2">
        <motion.span
          style={{ scale: nodeScale, backgroundColor: nodeColor }}
          className="absolute left-[0.7rem] top-8 z-10 block h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-ink md:static md:left-auto md:top-auto md:translate-x-0"
        />
        <motion.span
          style={{ opacity: ring, scale: useTransform(ring, [0, 1], [0.6, 1]) }}
          className="pointer-events-none absolute left-[0.7rem] top-8 block h-9 w-9 -translate-x-1/2 -translate-y-[10px] rounded-full border border-accent md:left-1/2 md:top-1/2 md:-translate-y-1/2"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: left ? -80 : 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`col-start-2 pb-14 md:pb-20 ${
          left ? "md:col-start-1 md:pr-20 md:text-right" : "md:col-start-2 md:pl-20"
        }`}
      >
        <span className="text-outline block font-display text-[clamp(3.5rem,8vw,6.5rem)] font-black leading-[0.8] text-accent/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        <p className="mono-tag mt-4 text-[11px] uppercase text-accent">
          <span className="text-text-faint">{"// "}</span>
          {item.fn}
        </p>
        <h3 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] font-black uppercase leading-[0.95] text-ivory">
          {item.title.split(/(Inspire Award)/).map((part, i) =>
            part === "Inspire Award" ? (
              <span key={i} lang="en">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </h3>
        <p className={`mt-4 max-w-md text-base leading-relaxed text-text-dim ${left ? "md:ml-auto" : ""}`}>
          {item.desc}
        </p>
      </motion.div>
    </div>
  );
}

export default function Achievements() {
  const d = useDict();
  const ITEMS = d.goals.items;
  const listRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.7", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.5 });
  const pointerTop = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <section id="basarilar" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10">
        <SectionHeading
          index="03"
          tag={d.goals.tag}
          title={d.goals.title}
          variant="drop"
        />

        <div ref={listRef} className="relative mx-auto mt-16 max-w-6xl">
          <div className="absolute bottom-0 left-[0.7rem] top-0 w-px -translate-x-1/2 bg-line md:left-1/2" aria-hidden="true">
            <motion.div style={{ scaleY: progress }} className="h-full w-full origin-top bg-accent shadow-[0_0_18px_2px_rgba(255,214,10,0.55)]" />
            <motion.div
              style={{ top: pointerTop }}
              className="absolute left-0 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2"
            >
              <span className="mono-tag flex items-center gap-2 whitespace-nowrap bg-accent px-2 py-1 text-[10px] font-semibold uppercase text-ink">
                {d.goals.now}
              </span>
            </motion.div>
          </div>

          {ITEMS.map((item, i) => (
            <TraceItem key={item.fn} item={item} index={i} total={ITEMS.length} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  );
}
