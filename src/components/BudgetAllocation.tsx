"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDict } from "@/lib/i18n";

// Colors are paired with direct labels (never color alone) and checked for
// separation on the dark surface.
const COLORS = ["#ffd60a", "#3987e5", "#1fb287", "#ff6b57"] as const;
const VALUES = [40, 25, 20, 15] as const;

export default function BudgetAllocation() {
  const d = useDict();
  const [hovered, setHovered] = useState<number | null>(null);
  const SEGMENTS = VALUES.map((value, i) => ({ value, color: COLORS[i], label: d.sponsor.segments[i] }));

  return (
    <div>
      <div
        className="flex h-16 w-full gap-1 sm:h-24"
        role="img"
        aria-label={`${d.sponsor.budgetAria}: ${SEGMENTS.map((s) => `${s.label} %${s.value}`).join(", ")}`}
      >
        {SEGMENTS.map((seg, i) => (
          <motion.button
            key={seg.label}
            type="button"
            tabIndex={-1}
            onPointerEnter={() => setHovered(i)}
            onPointerLeave={() => setHovered(null)}
            initial={{ width: 0 }}
            whileInView={{ width: `${seg.value}%` }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1.1, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            style={{
              backgroundColor: seg.color,
              opacity: hovered === null || hovered === i ? 1 : 0.28,
              clipPath:
                i === 0
                  ? "polygon(0 0, 100% 0, 90% 100%, 0 100%)"
                  : i === SEGMENTS.length - 1
                    ? "polygon(10% 0, 100% 0, 100% 100%, 0 100%)"
                    : "polygon(10% 0, 100% 0, 90% 100%, 0 100%)",
            }}
            className="relative h-full overflow-hidden transition-opacity duration-300"
          >
            <span className="absolute bottom-2 left-[12%] font-display text-2xl font-black leading-none text-ink sm:text-4xl">
              %{seg.value}
            </span>
          </motion.button>
        ))}
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
        {SEGMENTS.map((seg, i) => (
          <li
            key={seg.label}
            onPointerEnter={() => setHovered(i)}
            onPointerLeave={() => setHovered(null)}
            className={`flex items-start gap-3 transition-opacity duration-300 ${
              hovered === null || hovered === i ? "opacity-100" : "opacity-40"
            }`}
          >
            <span className="mt-1.5 h-3 w-3 shrink-0 rotate-45" style={{ backgroundColor: seg.color }} />
            <div>
              <p className="text-[13px] leading-snug text-text-dim">{seg.label}</p>
              <p className="number-tick mt-1 text-sm text-ivory">%{seg.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
