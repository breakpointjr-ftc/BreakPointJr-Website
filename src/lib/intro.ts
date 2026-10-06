import { useSyncExternalStore } from "react";

export type IntroPhase = "playing" | "revealing" | "done";

// Tiny shared store so the hero can wait for the intro's shatter moment
// before playing its own entrance.
let phase: IntroPhase = "playing";
const listeners = new Set<() => void>();

export function setIntroPhase(next: IntroPhase) {
  if (next === phase) return;
  phase = next;
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function useIntroPhase(): IntroPhase {
  return useSyncExternalStore(
    subscribe,
    () => phase,
    () => "playing" as IntroPhase
  );
}

export function useIntroRevealed() {
  return useIntroPhase() !== "playing";
}
