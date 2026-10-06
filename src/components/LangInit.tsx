"use client";

import { useEffect } from "react";
import { readStoredLang, setLang } from "@/lib/i18n";

// Applies the visitor's saved language after hydration (first paint is
// always Turkish so server and client markup agree).
export default function LangInit() {
  useEffect(() => {
    const saved = readStoredLang();
    if (saved) setLang(saved, false);
  }, []);
  return null;
}
