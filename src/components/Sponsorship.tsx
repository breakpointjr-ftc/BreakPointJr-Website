"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import BudgetAllocation from "./BudgetAllocation";
import { useDict, type Dict } from "@/lib/i18n";

function TierCard({ tier, index, d }: { tier: Dict["sponsor"]["tiers"][number]; index: number; d: Dict }) {
  const highlight = index === 1;
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={highlight ? "lg:-mt-8 lg:mb-8" : ""}
    >
      <div
        ref={ref}
        onPointerMove={onMove}
        data-cursor={d.cur.pick}
        className="group relative h-full overflow-hidden rounded-2xl bg-line-soft p-px"
      >
        {highlight ? (
          <span className="conic-border absolute -inset-[60%]" aria-hidden="true" />
        ) : (
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(255,214,10,0.9), transparent 55%)",
            }}
          />
        )}

        <div className="relative flex h-full flex-col rounded-[15px] bg-panel p-7 sm:p-8">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), rgba(255,214,10,0.09), transparent 60%)",
            }}
          />
          {highlight && (
            <span className="mono-tag slash-shape absolute right-6 top-0 bg-accent px-4 pb-1.5 pt-1 text-[10px] font-semibold uppercase text-ink">
              {d.sponsor.popular}
            </span>
          )}
          <p className="mono-tag text-[11px] uppercase tracking-wider text-text-dim">{tier.name}</p>
          <p className="mt-5 font-display text-5xl font-black leading-none text-ivory sm:text-6xl">
            {tier.price}
          </p>
          <div className="my-7 h-px bg-line" />
          <ul className="flex-1 space-y-4">
            {tier.perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-sm leading-snug text-text-dim">
                <span className="slash-shape mt-1 h-3 w-3 shrink-0 bg-accent" aria-hidden="true" />
                <span>{perk}</span>
              </li>
            ))}
          </ul>
          <a
            href="#iletisim"
            className="mt-9 inline-flex w-fit items-center gap-2 border-b border-ivory/30 pb-1 font-display text-lg font-extrabold uppercase tracking-wide text-ivory transition-colors hover:border-accent hover:text-accent"
          >
            {d.sponsor.contactLink}
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Sponsorship() {
  const d = useDict();
  return (
    <section id="sponsorluk" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10">
        <SectionHeading
          index="04"
          tag={d.sponsor.tag}
          title={d.sponsor.title}
          description={d.sponsor.desc}
        />

        <div className="mt-14 rounded-2xl border border-line bg-ink/70 p-6 sm:p-10">
          <p className="mono-tag mb-8 flex items-center gap-3 text-[11px] uppercase text-text-dim">
            <span className="slash-shape h-[12px] w-6 bg-accent" aria-hidden="true" />
            {d.sponsor.budgetTitle}
          </p>
          <BudgetAllocation />
          <p className="mono-tag mt-8 text-[11px] text-text-faint">
            {d.sponsor.budgetNote}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:items-stretch">
          {d.sponsor.tiers.map((tier, i) => (
            <TierCard key={i} tier={tier} index={i} d={d} />
          ))}
        </div>

        <p className="mono-tag mt-10 text-[11px] text-text-faint">
          {d.sponsor.footnote}
        </p>
      </div>
    </section>
  );
}
