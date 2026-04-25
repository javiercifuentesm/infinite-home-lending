/**
 * Deterministic copy + classification for the Loan Structure Simulator.
 * Separates “what happened” (mortgage math) from “how we talk about it” (advisor-style read).
 */

import type { HorizonSlice, SimulatorHorizonYears } from "./mortgage";

export type ScenarioId = "A" | "B";

/** How decisive the interest comparison is — drives tone, headlines, and card highlighting. */
export type ComparisonStrength = "clear" | "moderate" | "close" | "tie" | "mixed";

/** UI tone for Decision Confidence layer (derived from `strength` only — no duplicate rules). */
export type DecisionConfidenceTone = "strong" | "moderate" | "close" | "mixed";

export type DecisionConfidence = {
  label: string;
  microcopy: string;
  tone: DecisionConfidenceTone;
};

/**
 * Maps existing `ClassificationStrength` from `classifyComparisonStrength` to user-facing
 * confidence label + microcopy. Single source of truth for the confidence layer.
 */
export function getDecisionConfidencePresentation(strength: ComparisonStrength): DecisionConfidence {
  switch (strength) {
    case "clear":
      return {
        label: "Strong advantage",
        microcopy: "This difference is large enough to materially impact long-term cost.",
        tone: "strong",
      };
    case "moderate":
      return {
        label: "Moderate advantage",
        microcopy: "The gap is noticeable, but may depend on your priorities.",
        tone: "moderate",
      };
    case "close":
      return {
        label: "Close comparison",
        microcopy: "The difference is relatively small over this timeframe.",
        tone: "close",
      };
    case "tie":
      return {
        label: "Close comparison",
        microcopy:
          "Loan interest is too close to call—comfort, timeline, and other factors may matter more.",
        tone: "close",
      };
    case "mixed":
      return {
        label: "Mixed tradeoff",
        microcopy: "Each scenario has tradeoffs depending on your priorities.",
        tone: "mixed",
      };
  }
}

/** Conversion block subtext — aligns with comparison strength. */
export function getConversionSubtext(strength: ComparisonStrength): string {
  switch (strength) {
    case "clear":
      return "Locking in the right structure here can make a meaningful difference.";
    case "moderate":
      return "There's a noticeable difference here — worth reviewing before deciding.";
    case "close":
    case "tie":
      return "This is a close call. A quick review can help simplify your decision.";
    case "mixed":
      return "Each option has tradeoffs — we can help align this with your priorities.";
  }
}

/** Subtle line under the delta—reinforces impact without repeating `deltaDisplay`. */
export function getDeltaReinforcementLine(strength: ComparisonStrength): string | null {
  switch (strength) {
    case "clear":
      return "That's a meaningful cost difference over this timeframe.";
    case "moderate":
      return "That adds up to a noticeable spread over this horizon.";
    case "mixed":
      return "Borrowing cost and monthly load may point different ways—both are worth weighing.";
    case "close":
    case "tie":
      return null;
  }
}

export type HorizonInterpretation = {
  strength: ComparisonStrength;
  /** Decision confidence (label + microcopy) — derived from `strength` via `getDecisionConfidencePresentation`. */
  confidence: DecisionConfidence;
  /** Primary signal: lower mortgage interest over the window */
  interestWinner: ScenarioId | "tie";
  /** Meaningful conflict: lower monthly on one scenario, lower interest on the other */
  mixedMonthlyVsInterest: boolean;
  interestGap: number;
  interestEps: number;
  principalGap: number;
  balanceGap: number;
  monthlyDiff: number;
  /** Large editorial headline for the horizon summary */
  primaryHeadline: string;
  /** Supporting line under headline (optional) */
  primarySubline: string | null;
  /** Dominant delta line, e.g. "Save ~$17,400 in interest" */
  deltaDisplay: string;
  /** Optional one-line reinforcement under the delta (null when it would repeat close/tie copy). */
  deltaReinforcement: string | null;
  /** Short label for winner card chip */
  winnerCardLabel: string | null;
  /** Direction block title */
  directionTitle: string;
  /** Direction body lines */
  directionLines: string[];
  /** Decision strength headline (replaces generic confidence) */
  decisionHeadline: string;
  decisionReason: string | null;
};

function formatUsdApprox(n: number): string {
  const x = Math.abs(Math.round(n));
  if (x >= 1_000_000) return `~$${(x / 1_000_000).toFixed(1)}M`;
  if (x >= 1000) return `~$${(x / 1000).toFixed(x % 1000 === 0 ? 0 : 1)}K`;
  return `~$${x}`;
}

/** Interest tie band — same family as legacy simulator eps. */
export function getInterestEpsilon(ia: number, ib: number): number {
  return Math.max(75, Math.max(ia, ib) * 0.01);
}

export function getWinnerScenario(
  sliceA: HorizonSlice,
  sliceB: HorizonSlice,
  eps: number
): ScenarioId | "tie" {
  const ia = sliceA.interestPaid;
  const ib = sliceB.interestPaid;
  if (Math.abs(ia - ib) < eps) return "tie";
  return ia < ib ? "A" : "B";
}

/**
 * Classify decisiveness using interest gap (primary), with a mixed flag when monthly vs interest diverge.
 */
export function classifyComparisonStrength(
  sliceA: HorizonSlice,
  sliceB: HorizonSlice,
  monthlyA: number,
  monthlyB: number,
  eps: number
): {
  strength: ComparisonStrength;
  interestWinner: ScenarioId | "tie";
  mixedMonthlyVsInterest: boolean;
} {
  const ia = sliceA.interestPaid;
  const ib = sliceB.interestPaid;
  const gap = Math.abs(ia - ib);
  const interestWinner = getWinnerScenario(sliceA, sliceB, eps);

  const lowerMonthly: ScenarioId | "null" =
    monthlyA + 15 < monthlyB ? "A" : monthlyB + 15 < monthlyA ? "B" : "null";

  const mixedMonthlyVsInterest =
    interestWinner !== "tie" &&
    lowerMonthly !== "null" &&
    lowerMonthly !== interestWinner;

  if (interestWinner === "tie") {
    return { strength: "tie", interestWinner: "tie", mixedMonthlyVsInterest: false };
  }

  if (mixedMonthlyVsInterest) {
    return { strength: "mixed", interestWinner, mixedMonthlyVsInterest: true };
  }

  const maxI = Math.max(ia, ib, 1);
  const rel = gap / maxI;

  if (rel >= 0.08 || gap >= 8000) {
    return { strength: "clear", interestWinner, mixedMonthlyVsInterest: false };
  }
  if (rel >= 0.035 || gap >= 2500) {
    return { strength: "moderate", interestWinner, mixedMonthlyVsInterest: false };
  }
  return { strength: "close", interestWinner, mixedMonthlyVsInterest: false };
}

export function formatDeltaForDisplay(
  interestGap: number,
  winner: ScenarioId,
  strength: ComparisonStrength
): string {
  const fmt = formatUsdApprox(interestGap);
  if (strength === "tie") {
    return `Only ${fmt} separates the two in loan interest`;
  }
  return `Save ${fmt} in interest vs Scenario ${winner === "A" ? "B" : "A"}`;
}

/** “Pay more” framing from the perspective of the higher-interest scenario */
export function formatDeltaPayMore(interestGap: number, payer: ScenarioId): string {
  return `Pay ${formatUsdApprox(interestGap)} more in interest than Scenario ${payer === "A" ? "B" : "A"}`;
}

export function getPrimaryDeltaMetric(
  sliceA: HorizonSlice,
  sliceB: HorizonSlice,
  interestWinner: ScenarioId | "tie",
  strength: ComparisonStrength
): { text: string; emphasis: "save" | "pay" | "modest" | "tie" } {
  const ia = sliceA.interestPaid;
  const ib = sliceB.interestPaid;
  const gap = Math.abs(ia - ib);

  if (strength === "tie" || interestWinner === "tie") {
    return {
      text:
        gap < 1
          ? "No meaningful gap in loan interest"
          : `Only ${formatUsdApprox(gap)} separates the two structures`,
      emphasis: "tie",
    };
  }

  const loser: ScenarioId = interestWinner === "A" ? "B" : "A";
  if (strength === "close") {
    return {
      text: `About ${formatUsdApprox(gap)} separates them on loan interest`,
      emphasis: "modest",
    };
  }

  return {
    text: formatDeltaForDisplay(gap, interestWinner, strength === "mixed" ? "moderate" : strength),
    emphasis: "save",
  };
}

export function getComparisonTone(strength: ComparisonStrength): "decisive" | "nuanced" | "open" {
  if (strength === "clear" || strength === "moderate") return "decisive";
  if (strength === "mixed") return "nuanced";
  return "open";
}

function horizonShortLabel(years: SimulatorHorizonYears): string {
  if (years <= 5) return "5 years";
  if (years <= 7) return "7 years";
  return "10+ years";
}

/**
 * Full interpretation for summary strip + Direction section.
 */
export function buildHorizonInterpretation(input: {
  sliceA: HorizonSlice;
  sliceB: HorizonSlice;
  posA: { remainingBalance: number };
  posB: { remainingBalance: number };
  monthlyA: number;
  monthlyB: number;
  horizonLabel: string;
  selectedHorizon: SimulatorHorizonYears;
}): HorizonInterpretation {
  const { sliceA, sliceB, posA, posB, monthlyA, monthlyB, horizonLabel, selectedHorizon } = input;
  const ia = sliceA.interestPaid;
  const ib = sliceB.interestPaid;
  const eps = getInterestEpsilon(ia, ib);
  const interestGap = Math.abs(ia - ib);
  const principalGap = Math.abs(sliceA.principalPaid - sliceB.principalPaid);
  const balanceGap = Math.abs(posA.remainingBalance - posB.remainingBalance);

  const { strength, interestWinner, mixedMonthlyVsInterest } = classifyComparisonStrength(
    sliceA,
    sliceB,
    monthlyA,
    monthlyB,
    eps
  );

  const lowerMonthly: ScenarioId | null =
    monthlyA + 15 < monthlyB ? "A" : monthlyB + 15 < monthlyA ? "B" : null;
  const higherMonthly: ScenarioId | null = lowerMonthly === "A" ? "B" : lowerMonthly === "B" ? "A" : null;

  const deltaMetric = getPrimaryDeltaMetric(sliceA, sliceB, interestWinner, strength);

  let primaryHeadline: string;
  let primarySubline: string | null = null;
  let deltaDisplay: string;
  let winnerCardLabel: string | null = null;
  let directionTitle: string;
  const directionLines: string[] = [];
  let decisionHeadline: string;
  let decisionReason: string | null = null;

  const hl = horizonShortLabel(selectedHorizon);

  if (strength === "tie") {
    primaryHeadline = "The cost difference is modest over this window";
    primarySubline = "Neither structure leads clearly on loan interest—compare monthly comfort and timeline next.";
    deltaDisplay = deltaMetric.text;
    directionTitle = "Neither scenario leads on mortgage interest for this horizon";
    directionLines.push(
      `Over ${horizonLabel}, loan interest is effectively tied. Principal, balance, and monthly payment may tip the read.`
    );
    directionLines.push(
      "This is a good moment to stress-test with real quotes and talk through how long you expect to hold the loan."
    );
    decisionHeadline = "Close comparison — needs advisor review";
    decisionReason = "Interest cost is too close to call; liquidity and timeline should weigh in.";
  } else if (strength === "mixed" && interestWinner !== "tie") {
    const iw = interestWinner;
    const hm = higherMonthly;
    primaryHeadline =
      hm === null
        ? `Scenario ${iw} leads on loan interest; monthly payments are close`
        : hm === iw
          ? `Scenario ${iw} is more cost-efficient on interest, with a higher monthly load`
          : `Scenario ${iw} keeps interest lower; Scenario ${hm} is easier on the monthly budget`;
    primarySubline = `Over ${horizonLabel}, borrowing cost and cash flow point in different directions—your timeline decides.`;
    deltaDisplay = deltaMetric.text;
    winnerCardLabel = `Lower interest over ${hl}`;
    directionTitle = `Scenario ${interestWinner} is more cost-efficient on loan interest over ${horizonLabel}`;
    directionLines.push(
      `Scenario ${interestWinner} accrues less mortgage interest in this window. Scenario ${iw === "A" ? "B" : "A"} is lighter on monthly payment—so you’re trading near-term cash against long-term borrowing cost.`
    );
    directionLines.push(
      "This is where your timeline and liquidity goals should decide the structure—not the spreadsheet alone."
    );
    decisionHeadline = "Mixed tradeoff — cash flow vs borrowing cost";
    decisionReason = "Monthly payment and interest don’t align on the same scenario; priorities should break the tie.";
  } else if (strength === "close" && interestWinner !== "tie") {
    const w = interestWinner;
    primaryHeadline = "The cost difference is modest over this horizon";
    primarySubline = `Scenario ${w} edges loan interest slightly—timing and liquidity may matter more than this gap.`;
    deltaDisplay = deltaMetric.text;
    winnerCardLabel = `Slight edge · ${hl}`;
    directionTitle = `Scenario ${w} is slightly more cost-efficient over ${horizonLabel}`;
    directionLines.push(
      `The gap is relatively small, so this likely comes down to broader priorities rather than pure cost.`
    );
    directionLines.push(
      `If keeping borrowing cost lower is the priority, Scenario ${w} is the stronger direction. If near-term flexibility matters more, either structure may still deserve consideration.`
    );
    decisionHeadline = "Close comparison — difference is real but modest";
    decisionReason = "The interest gap may not be large enough to override comfort or timing on its own.";
  } else if (strength === "moderate" && interestWinner !== "tie") {
    const w = interestWinner;
    primaryHeadline = `Scenario ${w} leads on borrowing cost over this horizon`;
    primarySubline = `Over ${horizonLabel}, Scenario ${w} keeps interest lower and leaves less balance behind than Scenario ${w === "A" ? "B" : "A"}.`;
    deltaDisplay = formatDeltaForDisplay(interestGap, w, "moderate");
    winnerCardLabel = `Lower interest over ${hl}`;
    directionTitle = `Scenario ${w} is more cost-efficient over ${horizonLabel}`;
    directionLines.push(
      `${formatUsdApprox(interestGap)} less in mortgage interest than Scenario ${w === "A" ? "B" : "A"} (loan only).`
    );
    directionLines.push("The gap is large enough to notice—worth weighing against monthly payment and your expected hold period.");
    decisionHeadline = "Meaningful difference on borrowing cost";
    decisionReason =
      principalGap > balanceGap * 0.02
        ? "Driven primarily by rate and loan-size differences over this window."
        : "Interest cost diverges enough to matter if you expect to hold through this horizon.";
  } else if (strength === "clear" && interestWinner !== "tie") {
    const w = interestWinner;
    primaryHeadline = `Scenario ${w} is clearly more cost-efficient over this horizon`;
    primarySubline = `Over ${horizonLabel}, Scenario ${w} keeps interest meaningfully lower and reduces remaining balance faster.`;
    deltaDisplay = formatDeltaForDisplay(interestGap, w, "clear");
    winnerCardLabel = `Stronger position · ${hl}`;
    directionTitle = `Scenario ${w} is more cost-efficient over ${horizonLabel}`;
    directionLines.push(
      `${formatUsdApprox(interestGap)} less in mortgage interest than Scenario ${w === "A" ? "B" : "A"}—this is not a rounding difference.`
    );
    directionLines.push(
      "If keeping long-term borrowing cost lower aligns with your plan, this is the stronger directional read—still confirm with real quotes."
    );
    decisionHeadline = "Clear cost advantage on loan interest";
    decisionReason = "The gap is large enough to matter for most borrowers over this window.";
  } else {
    primaryHeadline = "Compare structures over this horizon";
    deltaDisplay = deltaMetric.text;
    directionTitle = "Compare scenarios";
    directionLines.push("Adjust inputs or horizon to see a clearer spread.");
    decisionHeadline = "Comparison";
    decisionReason = null;
  }

  return {
    strength,
    confidence: getDecisionConfidencePresentation(strength),
    deltaReinforcement: getDeltaReinforcementLine(strength),
    interestWinner,
    mixedMonthlyVsInterest,
    interestGap,
    interestEps: eps,
    principalGap,
    balanceGap,
    monthlyDiff: monthlyA - monthlyB,
    primaryHeadline,
    primarySubline,
    deltaDisplay,
    winnerCardLabel,
    directionTitle,
    directionLines,
    decisionHeadline,
    decisionReason,
  };
}

export type CardDominance = "winner" | "loser" | "balanced";

/** Visual hierarchy for scenario cards — interest-led, with balanced treatment for tie/close. */
export function getScenarioCardPresentation(
  interpretation: HorizonInterpretation,
  lowerMonthly: ScenarioId | null
): {
  cardA: CardDominance;
  cardB: CardDominance;
  labelA: string | null;
  labelB: string | null;
} {
  const { strength, interestWinner } = interpretation;

  if (strength === "tie") {
    return {
      cardA: "balanced",
      cardB: "balanced",
      labelA: "Needs advisor review",
      labelB: "Needs advisor review",
    };
  }
  if (strength === "close") {
    return {
      cardA: "balanced",
      cardB: "balanced",
      labelA: "Close comparison",
      labelB: "Close comparison",
    };
  }
  if (strength === "mixed" && interestWinner !== "tie") {
    const iw = interestWinner;
    return {
      cardA: iw === "A" ? "winner" : "loser",
      cardB: iw === "B" ? "winner" : "loser",
      labelA:
        iw === "A"
          ? interpretation.winnerCardLabel
          : lowerMonthly === "A"
            ? "Lighter monthly"
            : null,
      labelB:
        iw === "B"
          ? interpretation.winnerCardLabel
          : lowerMonthly === "B"
            ? "Lighter monthly"
            : null,
    };
  }
  if (interestWinner === "A") {
    return {
      cardA: "winner",
      cardB: "loser",
      labelA: interpretation.winnerCardLabel,
      labelB: null,
    };
  }
  if (interestWinner === "B") {
    return {
      cardA: "loser",
      cardB: "winner",
      labelA: null,
      labelB: interpretation.winnerCardLabel,
    };
  }
  return { cardA: "balanced", cardB: "balanced", labelA: null, labelB: null };
}
