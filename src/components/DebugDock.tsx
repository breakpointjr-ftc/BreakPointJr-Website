"use client";

import { useEffect, useState } from "react";
import { useIntroPhase } from "@/lib/intro";
import { useDict } from "@/lib/i18n";

// Section "breakpoints" in the margin, like an IDE gutter. Quiet by design:
// just dots, with the line number showing for the active/hovered stop.
const STOPS = [
  { id: "top", line: 1 },
  { id: "hakkimizda", line: 42 },
  { id: "takim", line: 128 },
  { id: "basarilar", line: 214 },
  { id: "sponsorluk", line: 307 },
  { id: "iletisim", line: 389 },
] as const;

export default function DebugDock() {
  const phase = useIntroPhase();
  const d = useDict();
  const labels = [d.nav.top, d.nav.about, d.nav.team, d.nav.goals, d.nav.sponsors, d.nav.contact];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = STOPS.map((s) => document.getElementById(s.id));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = STOPS.findIndex((s) => s.id === entry.target.id);
          if (idx >= 0) setActive(idx);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className={`fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col transition-opacity duration-700 xl:flex ${
        phase === "done" ? "opacity-100" : "opacity-0"
      }`}
    >
      {STOPS.map((s, i) => {
        const on = i === active;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-cursor={labels[i].toUpperCase()}
            className="group relative flex items-center justify-end py-2"
            aria-current={on ? "location" : undefined}
          >
            <span
              className={`number-tick absolute right-6 text-[10px] transition-all duration-300 ${
                on
                  ? "translate-x-0 text-accent opacity-100"
                  : "translate-x-1 text-text-faint opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {s.line}
            </span>
            <span
              className={`relative block h-3 w-3 rounded-full border ring-2 ring-ink transition-all duration-300 ${
                on
                  ? "border-accent bg-accent shadow-[0_0_14px_2px_rgba(255,214,10,0.6)]"
                  : "border-bug bg-bug/80 group-hover:scale-125"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
