"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BrandMark from "./BrandMark";
import LangSwitch from "./LangSwitch";
import { useIntroRevealed } from "@/lib/intro";
import { useDict } from "@/lib/i18n";

const HREFS = ["#hakkimizda", "#takim", "#basarilar", "#sponsorluk", "#iletisim"] as const;

export default function Navbar() {
  const revealed = useIntroRevealed();
  const d = useDict();
  const LINKS = HREFS.map((href, i) => ({
    href,
    label: [d.nav.about, d.nav.team, d.nav.goals, d.nav.sponsors, d.nav.contact][i],
  }));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = HREFS.map((h) => document.querySelector(h)).filter(
      (el): el is Element => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={revealed ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? "border-b border-line bg-ink/75 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-[1500px] items-center justify-between px-6 sm:px-10">
        <a href="#top" data-cursor={d.cur.top} className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <BrandMark className="h-10 w-10 transition-transform duration-500 group-hover:rotate-[-12deg]" />
          <span className="font-display text-[22px] font-extrabold uppercase leading-none tracking-wide text-ivory">
            <span lang="en">
              BreakPoint<span className="text-accent"> Jr.</span>
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              data-active={active === link.href}
              className={`underline-fade mono-tag text-[11px] uppercase transition-colors ${
                active === link.href ? "text-ivory" : "text-text-dim hover:text-ivory"
              }`}
            >
              <span className={active === link.href ? "mr-1.5 text-accent" : "mr-1.5 text-text-faint"}>
                0{i + 1}
              </span>
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <LangSwitch />
          <a
            href="#iletisim"
            data-cursor={d.cur.write}
            className="slash-shape inline-flex items-center bg-accent px-7 py-3 font-display text-base font-extrabold uppercase tracking-wide text-ink transition-colors hover:bg-ivory"
          >
            {d.nav.cta}
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex h-10 w-10 flex-col items-center justify-center gap-[6px] md:hidden"
          aria-label={d.nav.menu}
          aria-expanded={open}
        >
          <span className={`h-[2px] w-6 bg-ivory transition-transform duration-300 ${open ? "translate-y-[8px] rotate-45" : ""}`} />
          <span className={`h-[2px] w-6 bg-ivory transition-opacity duration-200 ${open ? "opacity-0" : ""}`} />
          <span className={`h-[2px] w-6 bg-ivory transition-transform duration-300 ${open ? "-translate-y-[8px] -rotate-45" : ""}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
            exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.2, 1] }}
            className="absolute left-0 top-0 -z-10 flex h-[100svh] w-full flex-col justify-center gap-2 bg-ink px-6 pt-20 md:hidden"
          >
            {LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5 }}
                className="font-display text-6xl font-black uppercase leading-[1.05] text-ivory active:text-accent"
              >
                <span className="number-tick mr-4 align-top text-sm text-accent">0{i + 1}</span>
                {link.label}
              </motion.a>
            ))}
            <LangSwitch className="mt-8 self-start" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
