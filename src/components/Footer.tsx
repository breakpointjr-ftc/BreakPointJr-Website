"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useDict } from "@/lib/i18n";

const HREFS = ["#hakkimizda", "#takim", "#basarilar", "#sponsorluk", "#iletisim"] as const;

const WORDMARK = "BreakPoint Jr.";
const WORD_CLASS =
  "block whitespace-nowrap text-center font-display text-[clamp(2.6rem,13.6vw,17rem)] font-black uppercase leading-[0.8] tracking-tight";

export default function Footer() {
  const d = useDict();
  const labels = [d.nav.about, d.nav.team, d.nav.goals, d.nav.sponsors, d.nav.contact];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end end"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.5 });
  const clipPath = useTransform(fill, (v) => `inset(${(1 - v) * 125 - 25}% -2% -15% -2%)`);

  return (
    <footer ref={ref} className="relative overflow-hidden pt-24">
      <div className="mx-auto grid max-w-[1500px] gap-12 px-6 sm:px-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="max-w-xs font-display text-3xl font-extrabold uppercase leading-[0.95] text-ivory">
            {d.footer.tagline[0]}
            <span className="text-accent">{d.footer.tagline[1]}</span>
            {d.footer.tagline[2].split("Türkiye").flatMap((part, i, arr) =>
              i < arr.length - 1 ? [part, <span key={i} lang="tr">Türkiye</span>] : [part]
            )}
          </p>
          <div className="mt-6 inline-flex items-center gap-3 border border-line px-4 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-bug" />
            <span className="mono-tag text-[10px] uppercase text-text-dim">{d.footer.status}</span>
          </div>
        </div>

        <div>
          <p className="mono-tag text-[11px] uppercase text-text-faint">{d.footer.pages}</p>
          <ul className="mt-3">
            {HREFS.map((href, i) => (
              <li key={href}>
                <a
                  href={href}
                  data-cursor={d.cur.go}
                  className="underline-fade inline-block py-2 font-display text-xl font-bold uppercase text-text-dim transition-colors hover:text-ivory"
                >
                  {labels[i]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mono-tag text-[11px] uppercase text-text-faint">{d.footer.contact}</p>
          <ul className="mt-5 space-y-3 text-text-dim">
            <li>
              <a
                href="mailto:breakpointjr.ftc@gmail.com"
                className="underline-fade inline-block py-2 transition-colors hover:text-ivory"
              >
                breakpointjr.ftc@gmail.com
              </a>
            </li>
            <li>Türkiye</li>
          </ul>
          <a
            href="#top"
            data-cursor={d.cur.up}
            className="mono-tag mt-8 inline-flex items-center gap-2 text-[11px] uppercase text-accent"
          >
            <ArrowUp size={14} /> {d.footer.toTop}
          </a>
        </div>
      </div>

      <div className="relative mt-20 select-none px-2" aria-hidden="true">
        <span lang="en" className={`${WORD_CLASS} text-outline text-ivory/25`}>{WORDMARK}</span>
        <motion.span lang="en" style={{ clipPath }} className={`${WORD_CLASS} absolute inset-x-2 top-0 text-accent`}>
          {WORDMARK}
        </motion.span>
      </div>

      <div className="relative border-t border-line">
        <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-3 px-6 py-6 sm:flex-row sm:px-10">
          <p className="mono-tag text-[11px] uppercase tracking-wider text-text-faint">
            © {new Date().getFullYear()} <span lang="en">BreakPoint Jr.</span>
          </p>
          <span className="mono-tag border border-line px-2 py-1 text-[10px] text-text-faint">
            {d.footer.season}
          </span>
        </div>
      </div>
    </footer>
  );
}
