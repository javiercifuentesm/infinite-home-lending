type Props = {
  crossoverYr: number | null;
};

export function BuyVsRentInsight({ crossoverYr }: Props) {
  let text: string;
  if (crossoverYr == null) {
    text =
      "In this scenario, renting and consistently investing the cost difference keeps the renter ahead through 30 years. That said, the math changes significantly with life events — if rent rises faster than expected, if investment returns disappoint, or if you stay longer than anticipated. The crossover year is sensitive to inputs. A $50/month smaller rent gap or a 0.5% lower investment return can shift the entire picture.";
  } else if (crossoverYr <= 5) {
    text = `A crossover at year ${crossoverYr} means buying is the stronger financial path for virtually any realistic homeownership timeline. Even buyers who sell in 7–8 years benefit. The primary risk isn't financial — it's flexibility. Buying ties capital and reduces your ability to relocate quickly. If your career or life plans are stable, the math strongly supports buying here.`;
  } else if (crossoverYr <= 10) {
    text = `A crossover at year ${crossoverYr} is within a normal homeownership horizon for most buyers. The key question isn't whether buying makes sense eventually — it's whether your specific plans support staying long enough for the math to work in your favor. If there's meaningful uncertainty about your next 10 years, that uncertainty matters more than the crossover year itself.`;
  } else {
    text = `A crossover at year ${crossoverYr} means you need a long commitment to the home for buying to be the stronger financial path. That doesn't mean it's the wrong decision — homeownership provides stability, control, and non-financial value that no calculator captures. But it does mean the financial case rests on a long timeline, and that deserves honest consideration before you commit.`;
  }

  return (
    <blockquote
      className="border-l-[3px] border-[#C6A15B] py-[0.9rem] pl-4 pr-4 font-[Georgia,serif] text-[15px] italic leading-relaxed text-[#0B2A4A]"
      style={{ background: "var(--color-background-secondary)" }}
    >
      {text}
    </blockquote>
  );
}
