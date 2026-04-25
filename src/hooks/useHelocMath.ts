/** Pure HELOC educational math — not a lender quote. */

export type HelocInputs = {
  hv: number;
  mb: number;
  cltv: number;
  credit: number;
  draw: number;
  rate: number;
  drawYrs: number;
  repayYrs: number;
};

export type ScheduleRow = {
  mo: number;
  pmt: number;
  inDraw: boolean;
  helBal: number;
  equity: number;
};

export type HelocResult = {
  equity: number;
  maxLine: number;
  actualDraw: number;
  cltvAfter: number;
  equityRemaining: number;
  ioPmt: number;
  piPmtVal: number;
  totalInt: number;
  cliffAmount: number;
  cliffPct: number;
  scenarios: {
    down: { rate: number; io: number; pi: number };
    base: { rate: number; io: number; pi: number };
    up: { rate: number; io: number; pi: number };
  };
  rateRiskAmount: number;
  heRate: number;
  hePmt: number;
  heTotalInt: number;
  cashRate: number;
  cashPmt: number;
  cashTotalInt: number;
  helocWins: boolean;
  heWins: boolean;
  schedule: ScheduleRow[];
  totalMonths: number;
  drawYrs: number;
  repayYrs: number;
  rate: number;
  hv: number;
  mb: number;
  draw: number;
};

export function rateMargin(creditScore: number): number {
  if (creditScore >= 760) return 0.5;
  if (creditScore >= 720) return 0.75;
  if (creditScore >= 680) return 1.0;
  return 1.5;
}

export function interestOnlyPmt(balance: number, annualRate: number): number {
  return Math.round(balance * (annualRate / 100 / 12));
}

export function piPmt(balance: number, annualRate: number, months: number): number {
  const r = annualRate / 100 / 12;
  if (months === 0) return 0;
  if (r === 0) return Math.round(balance / months);
  return Math.round((balance * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1));
}

export function totalInterest(balance: number, annualRate: number, drawYrs: number, repayYrs: number): number {
  const drawInt = interestOnlyPmt(balance, annualRate) * drawYrs * 12;
  const repayPmt = piPmt(balance, annualRate, repayYrs * 12);
  const repayInt = repayPmt * repayYrs * 12 - balance;
  return Math.round(drawInt + Math.max(0, repayInt));
}

export function fmt(n: number): string {
  return "$" + Math.abs(Math.round(n)).toLocaleString("en-US");
}

export function fmtK(n: number): string {
  const a = Math.abs(n);
  if (a >= 1_000_000) return "$" + (a / 1_000_000).toFixed(2) + "M";
  if (a >= 1000) return "$" + (a / 1000).toFixed(1) + "k";
  return "$" + Math.round(n);
}

export function chartYFmt(v: number): string {
  const a = Math.abs(v);
  if (a >= 1000) return "$" + Math.round(v / 1000) + "k";
  return "$" + Math.round(v);
}

export function defaultHelocInputs(): HelocInputs {
  return {
    hv: 520000,
    mb: 280000,
    cltv: 85,
    credit: 720,
    draw: 75000,
    rate: 8.0,
    drawYrs: 10,
    repayYrs: 20,
  };
}

export function runCalculation(inputs: HelocInputs & { cltvPct: number }): HelocResult {
  const { hv, mb, cltvPct, draw, rate, drawYrs, repayYrs } = inputs;

  const equity = Math.max(0, hv - mb);
  const maxLine = Math.max(0, Math.round(hv * cltvPct - mb));
  const actualDraw = Math.min(Math.max(0, draw), maxLine);
  const cltvAfter = hv > 0 ? Math.round(((mb + actualDraw) / hv) * 100) : 0;
  const equityRemaining = Math.max(0, hv - mb - actualDraw);

  const ioPmt = interestOnlyPmt(actualDraw, rate);
  const piPmtVal = piPmt(actualDraw, rate, repayYrs * 12);
  const totalInt = totalInterest(actualDraw, rate, drawYrs, repayYrs);
  const cliffAmount = Math.max(0, piPmtVal - ioPmt);
  const cliffPct = ioPmt > 0 ? Math.round((cliffAmount / ioPmt) * 100) : 0;

  const rateUp = rate + 2;
  const rateDown = Math.max(0, rate - 1.5);
  const scenarios = {
    down: {
      rate: rateDown,
      io: interestOnlyPmt(actualDraw, rateDown),
      pi: piPmt(actualDraw, rateDown, repayYrs * 12),
    },
    base: { rate, io: ioPmt, pi: piPmtVal },
    up: {
      rate: rateUp,
      io: interestOnlyPmt(actualDraw, rateUp),
      pi: piPmt(actualDraw, rateUp, repayYrs * 12),
    },
  };
  const rateRiskAmount = scenarios.up.pi - piPmtVal;

  const heRate = rate + 0.5;
  const hePmt = piPmt(actualDraw, heRate, 20 * 12);
  const heTotalInt = Math.max(0, hePmt * 20 * 12 - actualDraw);

  const cashRate = rate + 1.5;
  const newLoanBal = mb + actualDraw;
  const cashPmt = piPmt(newLoanBal, cashRate, 30 * 12);
  const cashTotalInt = Math.max(0, cashPmt * 30 * 12 - newLoanBal);

  const helocWins = totalInt <= heTotalInt && totalInt <= cashTotalInt;
  const heWins = heTotalInt < totalInt && heTotalInt <= cashTotalInt;

  const totalMonths = (drawYrs + repayYrs) * 12;
  const r = rate / 100 / 12;
  let helBal = actualDraw;
  const schedule: ScheduleRow[] = [];

  for (let mo = 1; mo <= totalMonths; mo++) {
    const inDraw = mo <= drawYrs * 12;
    const pmt = inDraw ? ioPmt : piPmtVal;
    if (!inDraw && r > 0) {
      const intP = helBal * r;
      const prinP = pmt - intP;
      helBal = Math.max(0, helBal - prinP);
    } else if (inDraw) {
      helBal = actualDraw;
    }
    const equityAtMo = Math.max(0, hv - mb - helBal);
    schedule.push({
      mo,
      pmt,
      inDraw,
      helBal: Math.round(helBal),
      equity: Math.round(equityAtMo),
    });
  }

  return {
    equity,
    maxLine,
    actualDraw,
    cltvAfter,
    equityRemaining,
    ioPmt,
    piPmtVal,
    totalInt,
    cliffAmount,
    cliffPct,
    scenarios,
    rateRiskAmount,
    heRate,
    hePmt,
    heTotalInt,
    cashRate,
    cashPmt,
    cashTotalInt,
    helocWins,
    heWins,
    schedule,
    totalMonths,
    drawYrs,
    repayYrs,
    rate,
    hv,
    mb,
    draw,
  };
}
