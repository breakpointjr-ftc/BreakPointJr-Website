"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a,button,[role='button'],summary,select,[data-cursor]";

// A breakpoint marker for a cursor: a red dot (the gutter marker of every
// IDE) trailed by a yellow ring that swells over anything clickable and
// can carry a label via data-cursor="...". Only active on fine pointers.
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.documentElement.classList.add("has-cursor");

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let seen = false;
    let scale = 1;
    let targetScale = 1;
    let pressed = false;

    const setMode = (target: EventTarget | null) => {
      const el = target instanceof Element ? target : null;
      const field = el?.closest("input,textarea");
      if (field) {
        dot.style.opacity = "0";
        ring.style.opacity = "0";
        return;
      }
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      const hit = el?.closest(INTERACTIVE) as HTMLElement | null;
      const dark = !!el?.closest("[data-cursor-dark]");
      ring.style.borderColor = dark ? "#07070a" : "#ffd60a";
      ring.style.backgroundColor = hit ? (dark ? "rgba(7,7,10,0.1)" : "rgba(255,214,10,0.14)") : "transparent";
      const text = hit?.getAttribute("data-cursor") ?? "";
      label.textContent = text;
      label.style.color = dark ? "#07070a" : "#ffd60a";
      targetScale = text ? 2.3 : hit ? 1.7 : 1;
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!seen) {
        seen = true;
        rx = x;
        ry = y;
        dot.style.visibility = "visible";
        ring.style.visibility = "visible";
      }
      setMode(e.target);
    };
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };
    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      scale += (targetScale * (pressed ? 0.75 : 1) - scale) * 0.2;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${pressed ? 1.6 : 1})`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      label.style.transform = `scale(${1 / Math.max(scale, 0.01)})`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{ visibility: "hidden" }}
        className="pointer-events-none fixed left-0 top-0 z-[95] flex h-9 w-9 items-center justify-center rounded-full border border-accent transition-[background-color,border-color,opacity] duration-200"
      >
        <span
          ref={labelRef}
          className="mono-tag whitespace-nowrap text-[7px] font-semibold uppercase text-accent"
        />
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{ visibility: "hidden" }}
        className="pointer-events-none fixed left-0 top-0 z-[96] h-2 w-2 rounded-full bg-bug transition-opacity duration-200"
      />
    </>
  );
}
