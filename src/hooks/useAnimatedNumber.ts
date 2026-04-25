import { useEffect, useState } from "react";

/** Ease-out cubic for count-up (matches spec). */
function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function useAnimatedNumber(
  target: number,
  durationMs: number,
  runKey: number,
  enabled: boolean
): number {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    setValue(0);
    let raf = 0;
    const start = performance.now();
    const from = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(from + (target - from) * easeOutCubic(t));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, runKey, enabled]);

  return value;
}
