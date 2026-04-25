/**
 * Run: npx tsx src/lib/verifyHorizonMonotonicity.ts
 * Confirms 5y / 7y / 10y analysis windows produce strictly ordered interest and balance
 * for a typical 30-year loan (same inputs as default simulator scenarios).
 */
import assert from "node:assert/strict";
import { cumulativePIOverHorizon, SIMULATOR_HORIZON_MONTHS } from "./mortgage";

const loan = 650_000 * 0.8; // ~default scenario A loan
const rate = 6.625;
const termMonths = 360;

const m5 = SIMULATOR_HORIZON_MONTHS[5];
const m7 = SIMULATOR_HORIZON_MONTHS[7];
const m10 = SIMULATOR_HORIZON_MONTHS[10];

const s5 = cumulativePIOverHorizon(loan, rate, termMonths, m5);
const s7 = cumulativePIOverHorizon(loan, rate, termMonths, m7);
const s10 = cumulativePIOverHorizon(loan, rate, termMonths, m10);

assert(s5.interestPaid < s7.interestPaid, "interest 5y < 7y");
assert(s7.interestPaid < s10.interestPaid, "interest 7y < 10y");

assert(s5.remainingBalance > s7.remainingBalance, "balance 5y > 7y");
assert(s7.remainingBalance > s10.remainingBalance, "balance 7y > 10y");

console.log("verifyHorizonMonotonicity: OK", {
  interest: [s5.interestPaid, s7.interestPaid, s10.interestPaid],
  balance: [s5.remainingBalance, s7.remainingBalance, s10.remainingBalance],
});
