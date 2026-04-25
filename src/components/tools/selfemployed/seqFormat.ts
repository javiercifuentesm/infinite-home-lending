/** Whole dollars, no decimals */
export function fmt(n: number): string {
  const v = Math.round(Math.max(0, n));
  return v.toLocaleString("en-US");
}

/** Thousands / millions for home prices and loans */
export function fmtK(n: number): string {
  const v = Math.max(0, n);
  if (v >= 1_000_000) {
    const m = v / 1_000_000;
    return `${m >= 10 ? m.toFixed(1) : m.toFixed(2)}M`;
  }
  if (v >= 10_000) {
    return `${Math.round(v / 1000)}k`;
  }
  return fmt(v);
}

export function fmtSignedK(n: number): string {
  if (n < 0) return `−${fmtK(Math.abs(n))}`;
  if (n > 0) return `+${fmtK(n)}`;
  return fmtK(0);
}
