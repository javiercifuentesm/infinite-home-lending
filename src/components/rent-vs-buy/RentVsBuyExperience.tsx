import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  computeDecisionV2,
  type DecisionEngineV2,
} from "../../lib/rentVsBuy/decisionEngineV2";
import { DecisionHero } from "./DecisionHero";
import { DecisionToggle } from "./DecisionToggle";
import { OutcomeExplanation } from "./OutcomeExplanation";
import { RealityComparison } from "./RealityComparison";
import { LossCounter } from "./LossCounter";
import { FutureShock } from "./FutureShock";
import { BreakEven } from "./BreakEven";
import { DecisionBar } from "./DecisionBar";
import { DecisionCTA } from "./DecisionCTA";

type Step = 0 | 1 | 2 | 3;
type ViewMode = "buyNow" | "wait";

function parseMoney(s: string): number | null {
  const n = Number(String(s).replace(/[$,\s]/g, ""));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function parseRatePct(s: string): number | null {
  const n = Number(String(s).replace(/[%\s]/g, ""));
  if (!Number.isFinite(n) || n <= 0 || n > 25) return null;
  return n / 100;
}

export function RentVsBuyExperience() {
  const [step, setStep] = useState<Step>(0);
  const [purchasePrice, setPurchasePrice] = useState("450000");
  const [monthlyRent, setMonthlyRent] = useState("2100");
  const [ratePct, setRatePct] = useState("6.5");
  const [years, setYears] = useState("5");
  const [includeInvestment, setIncludeInvestment] = useState(true);
  const [inputError, setInputError] = useState<string | null>(null);
  const [decision, setDecision] = useState<DecisionEngineV2 | null>(null);
  const [view, setView] = useState<ViewMode>("buyNow");
  const calcBusy = useRef(false);
  const calcTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runCalculation = useCallback(() => {
    if (calcBusy.current) return;
    calcBusy.current = true;
    setInputError(null);
    const price = parseMoney(purchasePrice);
    const rent = parseMoney(monthlyRent);
    const rate = parseRatePct(ratePct);
    const horizon = Number(years);
    if (price === null || price <= 0) {
      calcBusy.current = false;
      setInputError("Enter a valid purchase price.");
      return;
    }
    if (rent === null) {
      calcBusy.current = false;
      setInputError("Enter monthly rent.");
      return;
    }
    if (rate === null) {
      calcBusy.current = false;
      setInputError("Enter an interest rate between 0 and 25%.");
      return;
    }
    if (!Number.isFinite(horizon) || horizon <= 0 || horizon > 40) {
      calcBusy.current = false;
      setInputError("Pick a time horizon between 1 and 40 years.");
      return;
    }

    setStep(2);
    setView("buyNow");
    if (calcTimeoutRef.current) clearTimeout(calcTimeoutRef.current);
    calcTimeoutRef.current = window.setTimeout(() => {
      calcTimeoutRef.current = null;
      const d = computeDecisionV2({
        purchasePrice: price,
        monthlyRent: rent,
        interestRateAnnual: rate,
        yearsHorizon: horizon,
        includeInvestmentOpportunity: includeInvestment,
      });
      calcBusy.current = false;
      if (!d) {
        setInputError("We couldn’t run that scenario. Try adjusting the numbers.");
        setStep(1);
        return;
      }
      setDecision(d);
      setStep(3);
    }, 380);
  }, [purchasePrice, monthlyRent, ratePct, years, includeInvestment]);

  const progress = step === 0 ? 0 : step === 1 ? 12 : step === 2 ? 50 : 100;

  return (
    <div className="fixed inset-0 z-10 flex flex-col overflow-hidden bg-[#F7F9FC] text-[#0B1F3A]">
      <header className="shrink-0 border-b border-black/[0.06] bg-[#F7F9FC]/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          {step > 0 && step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1) setStep(0);
                else if (step === 2) {
                  if (calcTimeoutRef.current) clearTimeout(calcTimeoutRef.current);
                  calcTimeoutRef.current = null;
                  calcBusy.current = false;
                  setStep(1);
                }
              }}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-semibold text-[#0B1F3A]/70 transition hover:bg-black/[0.04] hover:text-[#0B1F3A]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Back
            </button>
          ) : step === 3 ? (
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setDecision(null);
              }}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-semibold text-[#0B1F3A]/70 transition hover:bg-black/[0.04] hover:text-[#0B1F3A]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              Edit
            </button>
          ) : (
            <div className="w-14" aria-hidden />
          )}
          <div className="min-w-0 flex-1 px-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-[#0B1F3A]/10">
              <div
                className="h-full rounded-full bg-[#D4AF37] transition-[width] duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <Link
            to="/smart-tools"
            className="shrink-0 text-[12px] font-semibold text-[#0B1F3A]/55 underline-offset-4 hover:text-[#0B1F3A] hover:underline"
          >
            Exit
          </Link>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-lg px-4 pb-10 pt-8 sm:px-6 sm:pb-14">
          {step === 0 && (
            <section className="flex min-h-[60vh] flex-col justify-center">
              <h1 className="font-display text-center text-[clamp(1.75rem,5.5vw,2.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-[#0B1F3A]">
                Should I Buy Now or Wait?
              </h1>
              <p className="mt-4 text-center text-[17px] leading-relaxed text-[#0B1F3A]/80">
                A decision read — not a spreadsheet. Know which side wins, by how much, and what waiting costs.
              </p>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="mx-auto mt-10 w-full min-h-[56px] max-w-sm rounded-xl border-2 border-[#0B1F3A] bg-white px-8 text-[17px] font-bold text-[#0B1F3A] shadow-sm transition-all hover:bg-[#0B1F3A] hover:text-white"
              >
                Start
              </button>
            </section>
          )}

          {step === 1 && (
            <section>
              <h2 className="font-display text-xl font-semibold text-[#0B1F3A]">Your scenario</h2>
              <p className="mt-1 text-[14px] text-[#0B1F3A]/65">Four inputs — one clear outcome.</p>
              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#0B1F3A]/50">
                    Purchase price
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className="numeric mt-1.5 w-full rounded-xl border border-black/[0.1] bg-white px-4 py-3.5 text-[17px] font-semibold text-[#0B1F3A] outline-none transition focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/15"
                    autoComplete="off"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#0B1F3A]/50">
                    Monthly rent
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    className="numeric mt-1.5 w-full rounded-xl border border-black/[0.1] bg-white px-4 py-3.5 text-[17px] font-semibold text-[#0B1F3A] outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/15"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#0B1F3A]/50">
                    Interest rate (%)
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={ratePct}
                    onChange={(e) => setRatePct(e.target.value)}
                    className="numeric mt-1.5 w-full rounded-xl border border-black/[0.1] bg-white px-4 py-3.5 text-[17px] font-semibold text-[#0B1F3A] outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/15"
                  />
                </label>
                <label className="block">
                  <span className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#0B1F3A]/50">
                    Time horizon (years)
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="numeric mt-1.5 w-full rounded-xl border border-black/[0.1] bg-white px-4 py-3.5 text-[17px] font-semibold text-[#0B1F3A] outline-none focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/15"
                  />
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3.5">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 rounded border-[#0B1F3A]/30 text-[#0B1F3A] focus:ring-[#D4AF37]"
                    checked={includeInvestment}
                    onChange={(e) => setIncludeInvestment(e.target.checked)}
                  />
                  <span className="text-[14px] leading-snug text-[#0B1F3A]/80">
                    <span className="font-semibold text-[#0B1F3A]">Grow the down payment</span> — assume your would-be
                    down payment earns market returns while you rent (optional).
                  </span>
                </label>
              </div>
              {inputError ? (
                <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-[14px] font-medium text-rose-900 ring-1 ring-rose-200">
                  {inputError}
                </p>
              ) : null}
            </section>
          )}

          {step === 2 && (
            <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 py-16">
              <Loader2 className="h-10 w-10 animate-spin text-[#0B1F3A]/40" strokeWidth={1.75} aria-hidden />
              <p className="text-[15px] font-medium text-[#0B1F3A]/70">Building your decision…</p>
            </div>
          )}

          {step === 3 && !decision && (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-[#0B1F3A]/40" strokeWidth={1.75} aria-hidden />
              <p className="text-[14px] text-[#0B1F3A]/65">Loading results…</p>
            </div>
          )}

          {step === 3 && decision && (
            <div className="space-y-8">
              <DecisionHero decision={decision} view={view} />
              <DecisionToggle waitYearsLabel={decision.waitLabelYears} view={view} onViewChange={setView} />
              <OutcomeExplanation decision={decision} />
              <RealityComparison decision={decision} view={view} />
              <LossCounter decision={decision} />
              <FutureShock decision={decision} />
              <BreakEven decision={decision} />
              <DecisionBar level={decision.impact} />
              <DecisionCTA />
              <p className="pb-4 text-center text-[11px] leading-relaxed text-[#0B1F3A]/45">
                Illustrative model — not a loan quote, rate lock, or guarantee. For education only.
              </p>
            </div>
          )}
        </div>
      </div>

      {step === 1 && (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 border-t border-black/[0.06] bg-[#F7F9FC]/95 p-4 backdrop-blur-md">
          <div className="pointer-events-auto mx-auto max-w-lg">
            <button
              type="button"
              onClick={runCalculation}
              className="w-full min-h-[52px] rounded-xl bg-[#0B1F3A] text-[16px] font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              See my decision
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
