"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, AtSign, MapPin, PlaySquare, ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { fireBurst } from "@/lib/rng";
import { useDict } from "@/lib/i18n";

const CONTACT_EMAIL = "breakpointjr.ftc@gmail.com";

const CHANNELS = [
  { icon: Mail, label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
  { icon: AtSign, label: "@breakpointjr.ftc", href: "https://instagram.com/breakpointjr.ftc" },
  { icon: PlaySquare, label: "BreakPoint Jr.", href: "https://youtube.com" },
];

const FIELD =
  "peer mt-2 w-full border-b border-line bg-transparent py-3 text-lg text-ivory caret-accent outline-none placeholder:text-text-faint";

function Field({
  name,
  label,
  children,
}: {
  name: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="group relative block">
      <span className="mono-tag text-[11px] uppercase text-text-faint transition-colors group-focus-within:text-accent">
        <span className="text-accent">&gt;</span> {name}
        <span className="sr-only"> {label}</span>
      </span>
      {children}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out group-focus-within:scale-x-100" />
    </label>
  );
}

export default function Contact() {
  const d = useDict();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const btn = e.currentTarget.querySelector("button[type=submit]");
    if (btn) {
      const r = btn.getBoundingClientRect();
      fireBurst({ x: r.left + r.width / 2, y: r.top + r.height / 2, power: 1.6 });
    }
    setSent(true);
  };

  return (
    <section id="iletisim" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10">
        <SectionHeading
          index="05"
          tag={d.contact.tag}
          title={d.contact.title}
          description={d.contact.desc}
          variant="drop"
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            {CHANNELS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor={d.cur.go}
                className="group relative flex items-center justify-between gap-4 overflow-hidden border-t border-line py-6"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:scale-x-100" />
                <span className="relative flex min-w-0 items-center gap-5">
                  <c.icon size={22} strokeWidth={1.6} className="shrink-0 text-accent transition-colors group-hover:text-ink" />
                  <span lang="en" className="truncate font-display text-[clamp(1.05rem,4.4vw,1.6rem)] md:text-[clamp(1.5rem,3vw,2.4rem)] font-extrabold uppercase text-ivory transition-colors group-hover:text-ink">
                    {c.label}
                  </span>
                </span>
                <ArrowUpRight
                  size={26}
                  className="relative shrink-0 text-text-faint transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-ink"
                />
              </a>
            ))}
            <div className="flex items-center gap-5 border-y border-line py-6">
              <MapPin size={22} strokeWidth={1.6} className="shrink-0 text-accent" />
              <span lang="tr" className="font-display text-[clamp(1.5rem,3vw,2.4rem)] font-extrabold uppercase text-ivory">
                {d.contact.country}
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl border border-line bg-ink/70 p-6 sm:p-10">
            <p className="mono-tag mb-8 flex items-center gap-3 text-[11px] uppercase text-text-dim">
              <span className="h-2.5 w-2.5 rounded-full bg-bug" aria-hidden="true" />
              yeni_mesaj.ts
            </p>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                role="status"
                className="py-10"
              >
                <p className="font-display text-5xl font-black uppercase leading-none text-accent sm:text-6xl">
                  {d.contact.doneTitle}
                </p>
                <p className="mono-tag mt-6 text-xs leading-relaxed text-text-dim">
                  {d.contact.doneBody}
                  <br />
                  <span className="text-text-faint">{d.contact.doneNote}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mono-tag mt-8 text-xs uppercase text-accent underline underline-offset-4"
                >
                  {d.contact.again}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-9">
                <div className="grid gap-9 sm:grid-cols-2">
                  <Field name={d.contact.nameKey} label={d.contact.nameLabel}>
                    <input type="text" required placeholder={d.contact.namePh} className={FIELD} />
                  </Field>
                  <Field name={d.contact.emailKey} label={d.contact.emailLabel}>
                    <input type="email" required placeholder={d.contact.emailPh} className={FIELD} />
                  </Field>
                </div>
                <Field name={d.contact.msgKey} label={d.contact.msgLabel}>
                  <textarea
                    required
                    rows={4}
                    placeholder={d.contact.msgPh}
                    className={`${FIELD} resize-none`}
                  />
                </Field>
                <button
                  type="submit"
                  data-cursor={d.cur.send}
                  className="slash-shape group inline-flex items-center gap-3 bg-accent px-10 py-4 font-display text-xl font-extrabold uppercase tracking-wide text-ink transition-colors hover:bg-ivory"
                >
                  {d.contact.send}
                  <ArrowUpRight size={20} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
