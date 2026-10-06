"use client";

import { useEffect } from "react";

export default function ConsoleGreeting() {
  useEffect(() => {
    console.log(
      "%cBreakPoint Jr.%c\nKaynak koda mı bakıyorsun? İyi işaret. Takıma katılmak ya da sponsor olmak isterseniz: breakpointjr.ftc@gmail.com",
      "color:#ffd60a;font-weight:700;font-size:14px;font-family:monospace;",
      "color:#9ca3af;font-size:12px;font-family:monospace;"
    );
  }, []);

  return null;
}
