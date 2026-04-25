export type JurisdictionKey =
  | "md_montgomery"
  | "md_pg"
  | "md_frederick"
  | "md_other"
  | "va_nova"
  | "va_other"
  | "dc";

export type JurisdictionDef = {
  name: string;
  getRate: (price: number) => number;
  note: string;
};

export const JURISDICTIONS: Record<JurisdictionKey, JurisdictionDef> = {
  md_montgomery: {
    name: "Montgomery County, MD",
    getRate: () => 0.01275,
    note:
      "Montgomery County: MD state transfer tax (seller half 0.25%) + county transfer (0.5%) + tiered recordation (~0.525% avg). Total seller share approx 1.0–1.5% depending on price. One of the highest in the region. Always confirm with your title company for a property-specific figure.",
  },
  md_pg: {
    name: "Prince George's County, MD",
    getRate: () => 0.012,
    note:
      "Prince George's County: MD state transfer (seller half 0.25%) + county transfer (0.7%) + recordation (~0.25%). Total seller share approx 1.2% — among the highest in the DMV.",
  },
  md_frederick: {
    name: "Frederick County, MD",
    getRate: () => 0.0085,
    note:
      "Frederick County: MD state transfer (seller half 0.25%) + county transfer (0.5%) + recordation (~0.1%). Lower than Montgomery — more seller-friendly tax structure.",
  },
  md_other: {
    name: "Maryland — Other County (avg)",
    getRate: () => 0.009,
    note:
      "Using Maryland average estimate (~0.9%). Actual rates vary significantly by county. Always confirm with your title company before presenting figures to a seller.",
  },
  va_nova: {
    name: "Northern Virginia",
    getRate: () => 0.0025,
    note:
      "VA grantor tax: $1/$1,000 (0.10%) + Northern Virginia regional grantor tax: $1.50/$1,000 (0.15%) = 0.25% total seller tax. Buyers pay recordation tax separately. Lowest seller transfer costs in the DMV.",
  },
  va_other: {
    name: "Virginia — Rest of State",
    getRate: () => 0.001,
    note:
      "VA grantor tax only: $1/$1,000 (0.10%) of sale price. Buyers pay recordation tax separately. Lowest seller transfer costs in the region.",
  },
  dc: {
    name: "Washington DC",
    getRate: (price: number) => (price >= 400000 ? 0.0145 : 0.011),
    note:
      "DC deed transfer tax: 1.1% on sales under $400,000 — 1.45% on sales $400,000 and above (seller pays). Buyer pays recordation tax separately. On a $550,000 DC sale, seller transfer tax is approximately $7,975.",
  },
};

export type SellerNetInputs = {
  price: number;
  payoff: number;
  comm: number;
  concession: number;
  hoa: number;
  warranty: number;
  titleFee: number;
  taxPro: number;
  other: number;
  state: JurisdictionKey;
};

export type ScenarioResult = {
  price: number;
  commAmt: number;
  transferTax: number;
  taxRate: number;
  recordingFee: number;
  concession: number;
  hoa: number;
  warranty: number;
  titleFee: number;
  taxPro: number;
  other: number;
  totalDeductions: number;
  net: number;
  isUnderwater: boolean;
};

export type SellerNetResults = ReturnType<typeof runCalculation>;

export function calcScenario(
  price: number,
  payoff: number,
  commPct: number,
  concession: number,
  hoa: number,
  warranty: number,
  titleFee: number,
  taxPro: number,
  other: number,
  state: JurisdictionKey,
): ScenarioResult {
  const j = JURISDICTIONS[state];
  const taxRate = j.getRate(price);
  const commAmt = Math.round((price * commPct) / 100);
  const transferTax = Math.round(price * taxRate);
  const recordingFee = 110;

  const totalDeductions =
    payoff +
    commAmt +
    transferTax +
    recordingFee +
    concession +
    hoa +
    warranty +
    titleFee +
    taxPro +
    other;

  const net = Math.round(price - totalDeductions);

  return {
    price,
    commAmt,
    transferTax,
    taxRate,
    recordingFee,
    concession,
    hoa,
    warranty,
    titleFee,
    taxPro,
    other,
    totalDeductions: Math.round(totalDeductions),
    net,
    isUnderwater: net < 0,
  };
}

export function runCalculation(inputs: SellerNetInputs) {
  const { price, payoff, comm, concession, hoa, warranty, titleFee, taxPro, other, state } = inputs;

  const ask = calcScenario(price, payoff, comm, concession, hoa, warranty, titleFee, taxPro, other, state);
  const below3 = calcScenario(
    Math.round(price * 0.97),
    payoff,
    comm,
    concession,
    hoa,
    warranty,
    titleFee,
    taxPro,
    other,
    state,
  );
  const below5 = calcScenario(
    Math.round(price * 0.95),
    payoff,
    comm,
    concession,
    hoa,
    warranty,
    titleFee,
    taxPro,
    other,
    state,
  );

  const diff3 = ask.net - below3.net;
  const diff5 = ask.net - below5.net;

  const j = JURISDICTIONS[state];

  return {
    ask,
    below3,
    below5,
    diff3,
    diff5,
    payoff,
    commPct: comm,
    jurisdictionName: j.name,
    jurisdictionNote: j.note,
    state,
    price,
    comm,
    concession,
    hoa,
    warranty,
    titleFee,
    taxPro,
    other,
  };
}

export function fmt(n: number): string {
  const v = Math.round(n);
  const abs = Math.abs(v).toLocaleString();
  return v < 0 ? `-$${abs}` : `$${abs}`;
}

export function fmtK(n: number): string {
  const v = Math.round(n);
  const sign = v < 0 ? "-" : "";
  const av = Math.abs(v);
  if (av >= 1_000_000) return `${sign}$${(av / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  return `${sign}$${Math.round(av / 1000)}k`;
}
