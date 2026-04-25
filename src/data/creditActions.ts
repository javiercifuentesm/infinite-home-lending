export type CreditAction = {
  id: string;
  name: string;
  pts: [number, number];
  detail: string;
  timeline: string;
};

export const CREDIT_ACTIONS: readonly CreditAction[] = [
  {
    id: "util30",
    name: "Pay credit card balances below 30% utilization",
    pts: [25, 45],
    detail: "Most impactful single move. Takes 1–2 billing cycles.",
    timeline: "30–60 days",
  },
  {
    id: "util10",
    name: "Pay credit card balances below 10% utilization",
    pts: [40, 70],
    detail: "Maximum score impact from utilization. Requires significant payoff.",
    timeline: "30–90 days",
  },
  {
    id: "lateRemove",
    name: "Dispute and remove one late payment",
    pts: [20, 40],
    detail: "If the late payment is an error or goodwill adjustment is granted.",
    timeline: "30–90 days",
  },
  {
    id: "newCard",
    name: "Avoid opening any new credit accounts",
    pts: [10, 20],
    detail: "Each new account triggers a hard inquiry and reduces avg. account age.",
    timeline: "Immediate / ongoing",
  },
  {
    id: "authorized",
    name: "Become authorized user on someone's old, low-balance card",
    pts: [15, 35],
    detail: "Inherit their payment history and low utilization.",
    timeline: "30–60 days",
  },
  {
    id: "collections",
    name: "Pay or negotiate a collection account",
    pts: [10, 30],
    detail: "Recent collections hurt more. FICO 9 ignores paid collections.",
    timeline: "30–90 days",
  },
  {
    id: "dispError",
    name: "Dispute a credit report error",
    pts: [20, 50],
    detail: "One in five reports has an error. Errors can suppress scores.",
    timeline: "30–45 days",
  },
  {
    id: "ontime",
    name: "Make 6 consecutive on-time payments",
    pts: [15, 30],
    detail: "Payment history is 35% of your FICO score. Consistency compounds.",
    timeline: "6 months",
  },
];
