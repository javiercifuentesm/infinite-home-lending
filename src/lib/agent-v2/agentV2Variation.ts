/**
 * Deterministic phrase rotation — avoids repeating the same opener in a session.
 * Replace with LLM sampling later; keep `phraseUsageIds` contract for analytics.
 */

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function pickUniqueFromPool(
  poolId: string,
  pool: readonly string[],
  sessionId: string,
  turnIndex: number,
  usedIds: string[] | undefined,
): { text: string; phraseId: string; nextUsedIds: string[] } {
  const used = new Set(usedIds ?? []);
  const base = hashStr(`${sessionId}:${poolId}:${turnIndex}`);
  for (let o = 0; o < pool.length * 2; o++) {
    const idx = (base + o) % pool.length;
    const phraseId = `${poolId}:${idx}`;
    if (!used.has(phraseId)) {
      return {
        text: pool[idx]!,
        phraseId,
        nextUsedIds: [...(usedIds ?? []), phraseId],
      };
    }
  }
  const idx = base % pool.length;
  return {
    text: pool[idx]!,
    phraseId: `${poolId}:${idx}:reuse`,
    nextUsedIds: [...(usedIds ?? []), `${poolId}:${idx}:reuse`],
  };
}
