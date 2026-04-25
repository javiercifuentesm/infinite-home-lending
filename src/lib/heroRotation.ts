export type HeroAsset = {
  src: string;
  type: "house" | "human";
};

/**
 * Interleaves house → human → house → human from typed lists.
 * When counts differ, remainder is appended per the loop (see spec).
 */
export function buildHeroRotationOrder(assets: readonly HeroAsset[]): HeroAsset[] {
  const houses = assets.filter((a) => a.type === "house");
  const humans = assets.filter((a) => a.type === "human");
  const out: HeroAsset[] = [];
  const n = Math.max(houses.length, humans.length);
  for (let i = 0; i < n; i++) {
    if (houses[i]) out.push(houses[i]);
    if (humans[i]) out.push(humans[i]);
  }
  return out;
}
