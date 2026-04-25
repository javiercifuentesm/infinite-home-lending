import type { BuyVsRentInputs, YearlySnapshot } from "../../hooks/useBuyVsRentMath";
import { fmt } from "../../hooks/useBuyVsRentMath";

type Props = {
  inputs: BuyVsRentInputs;
  snapshot: YearlySnapshot;
  crossoverYr: number | null;
};

export function BuyVsRentFactors({ inputs, snapshot, crossoverYr }: Props) {
  type Factor = { dot: string; title: string; detail: string };
  const factors: Factor[] = [];

  if (crossoverYr != null && crossoverYr <= 7) {
    factors.push({
      dot: "#3B6D11",
      title: "Strong crossover timeline",
      detail: `The math tips to buying at year ${crossoverYr} — well within a typical homeownership horizon. This is a meaningful signal that buying builds more wealth over most realistic timescales.`,
    });
  } else if (crossoverYr == null || crossoverYr > 15) {
    factors.push({
      dot: "#A32D2D",
      title: "Long crossover timeline",
      detail: `Buying doesn't take the wealth lead until year ${crossoverYr ?? "30+"}. A long crossover suggests either high home prices, high rates, or favorable investment returns are working against the buy case.`,
    });
  }

  if (snapshot.monthlyBuyCost > snapshot.monthlyRent * 1.4) {
    factors.push({
      dot: "#A32D2D",
      title: `Monthly cost gap: ${fmt(snapshot.monthlyBuyCost - snapshot.monthlyRent)}/mo more to buy`,
      detail: "The higher monthly cost of buying means more money flows into the renter's investment portfolio each month — which is a powerful compounding advantage in early years.",
    });
  } else if (snapshot.monthlyBuyCost < snapshot.monthlyRent * 1.1) {
    factors.push({
      dot: "#3B6D11",
      title: "Monthly costs are close",
      detail: "When the cost to buy is close to the cost to rent, the case for buying strengthens — you build equity without significantly increasing your monthly obligations.",
    });
  }

  if (inputs.appr >= 4) {
    factors.push({
      dot: "#3B6D11",
      title: `${inputs.appr}% appreciation favors buying`,
      detail: "Home values growing faster than inflation accelerate equity building and reduce the time until buying becomes the stronger financial path.",
    });
  }

  if (inputs.inv >= 8) {
    factors.push({
      dot: "#C6A15B",
      title: `${inputs.inv}% investment return is a high bar`,
      detail: "Assuming high stock market returns increases the renting scenario's competitiveness. If returns are lower, the crossover year moves earlier in favor of buying.",
    });
  }

  if (inputs.ri >= 4) {
    factors.push({
      dot: "#3B6D11",
      title: `${inputs.ri}% rent increases work for buyers`,
      detail: "Rapid rent increases mean renters face growing monthly costs without building any equity. A fixed mortgage payment becomes more valuable as rent rises around it.",
    });
  }

  if (inputs.dp >= 20) {
    factors.push({
      dot: "#3B6D11",
      title: "20%+ down payment eliminates PMI",
      detail: "A 20% down payment removes private mortgage insurance, reducing your true monthly cost and strengthening the buying case from day one.",
    });
  }

  if (factors.length === 0) {
    factors.push({
      dot: "#C6A15B",
      title: "The decision is in the nuance",
      detail: "Your inputs produce a scenario where both paths are competitive. The decision comes down to personal factors — stability, flexibility, community, and your specific financial goals — as much as the numbers.",
    });
  }

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">What&apos;s driving the result</h3>
      <ul className="mt-4 space-y-4">
        {factors.map((f) => (
          <li key={f.title} className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: f.dot }} aria-hidden />
            <div>
              <p className="font-semibold text-[#0B2A4A]">{f.title}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-text-tertiary)]">{f.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
