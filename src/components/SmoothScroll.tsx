"use client";

import { useSyncExternalStore } from "react";
import { ReactLenis } from "lenis/react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

// Buttery inertial scrolling (same approach as upscayl.org: real scroll
// position, just eased over time) instead of the browser's instant,
// mechanical wheel-to-scroll mapping. Disabled for users who prefer
// reduced motion.
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (prefersReducedMotion) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // Sections already declare `scroll-margin-top: 88px` in CSS,
        // which Lenis's anchor handling honors on its own — an explicit
        // offset here would double up and overshoot past the header.
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
