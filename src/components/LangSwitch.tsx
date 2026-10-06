"use client";

import { setLang, useLang, useDict, type Lang } from "@/lib/i18n";

const OPTIONS: { code: Lang; label: string }[] = [
  { code: "tr", label: "TR" },
  { code: "en", label: "EN" },
];

export default function LangSwitch({ className = "" }: { className?: string }) {
  const lang = useLang();
  const d = useDict();

  return (
    <div
      role="group"
      aria-label={d.nav.langLabel}
      className={`mono-tag inline-flex items-center border border-line text-[11px] font-semibold ${className}`}
    >
      {OPTIONS.map((o) => {
        const on = lang === o.code;
        return (
          <button
            key={o.code}
            type="button"
            lang={o.code}
            aria-pressed={on}
            onClick={() => setLang(o.code)}
            className={`px-3 py-2 transition-colors ${
              on ? "bg-accent text-ink" : "text-text-dim hover:text-ivory"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
