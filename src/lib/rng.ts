// Deterministic PRNG so procedural art (shards, glass mesh) is identical on
// server and client and never reshuffles between renders.
export function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Burst = { x: number; y: number; power?: number };

// Fire a crack/shard burst at viewport coordinates (handled by <ClickFx/>
// and <GlassField/>).
export function fireBurst(detail: Burst) {
  window.dispatchEvent(new CustomEvent<Burst>("fx:burst", { detail }));
}
