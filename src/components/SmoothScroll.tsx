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
        // lerp easing is frame-rate independent: the scroll position glides a
        // fixed fraction of the remaining distance every frame, which is what
        // gives the long, soft "butter" tail on 60/120/144 Hz screens alike.
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 1,
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
