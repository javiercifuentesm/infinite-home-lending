import {
  buildSchedule,
  fmt,
  monthlyExtra,
  type PaymentFreq,
  type ScheduleResult,
} from "../../hooks/useAcceleratorMath";

type Props = {
  monthsSaved: number;
  yearsSaved: number;
  moSaved: number;
  intSaved: number;
  effectiveReturn: number;
  basePayoff: number;
  accelPayoff: number;
  base: ScheduleResult;
  accel: ScheduleResult;
  principal: number;
  rate: number;
  termMonths: number;
  extraAmt: number;
  freq: PaymentFreq;
};

export function AcceleratorMilestones({
  monthsSaved,
  yearsSaved,
  moSaved,
  intSaved,
  effectiveReturn,
  basePayoff,
  accelPayoff,
  base,
  accel,
  principal,
  rate,
  termMonths,
  extraAmt,
  freq,
}: Props) {
  const items: { title: string; sub: string }[] = [];

  if (monthsSaved >= 12) {
    const timeTitle =
      moSaved > 0
        ? `${yearsSaved} year${yearsSaved !== 1 ? "s" : ""} and ${moSaved} months off your mortgage`
        : `${yearsSaved} year${yearsSaved !== 1 ? "s" : ""} off your mortgage`;
    items.push({
      title: timeTitle,
      sub: `You'll own your home free and clear in ${accelPayoff} years instead of ${basePayoff}.`,
    });
  }

  if (intSaved >= 5000) {
    items.push({
      title: `${fmt(intSaved)} in interest you keep`,
      sub: `That money stays in your pocket rather than going to the lender. Most people find this number more surprising than the time savings.`,
    });
  }

  if (effectiveReturn > 0) {
    items.push({
      title: `~${effectiveReturn.toFixed(1)}% guaranteed effective return`,
      sub: `Every extra dollar toward principal earns a return equal to your interest rate — risk-free. It's one of the most reliable uses of discretionary cash in personal finance.`,
    });
  }

  if (freq === "monthly" && extraAmt >= 100) {
    const halfMo = monthlyExtra(Math.round(extraAmt / 2), "monthly");
    const halfSched = buildSchedule(principal, rate, termMonths, halfMo, 0);
    const halfSaved = base.months - halfSched.months;
    if (halfSaved > 0) {
      items.push({
        title: `Even ${fmt(Math.round(extraAmt / 2))}/month saves ${Math.floor(halfSaved / 12)} years`,
        sub: `The relationship between extra payments and time saved is non-linear. Small amounts still move the needle significantly.`,
      });
    }
  }

  if (accel.months < base.months && freq !== "onetime") {
    items.push({
      title: "Equity builds faster — opening more options",
      sub: `Paying off your loan faster accelerates equity growth, which improves your position for future refinancing, a HELOC, or a move-up purchase.`,
    });
  }

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">What your extra payments unlock</h3>
      <ul className="mt-4 space-y-4">
        {items.map((it) => (
          <li key={it.title} className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#C6A15B]" aria-hidden />
            <div>
              <p className="font-semibold text-[#0B2A4A]">{it.title}</p>
              <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-text-tertiary)]">{it.sub}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
