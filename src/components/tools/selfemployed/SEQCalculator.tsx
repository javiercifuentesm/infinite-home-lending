import { useMemo, useState } from "react";
import { runCalculation, type SEQInputs } from "../../../hooks/useSEQMath";
import { SEQBankStatementInputs } from "./SEQBankStatementInputs";
import { SEQCTA } from "./SEQCTA";
import { SEQDocChecklist } from "./SEQDocChecklist";
import { SEQInsight } from "./SEQInsight";
import { SEQMetrics } from "./SEQMetrics";
import { SEQPathColumns } from "./SEQPathColumns";
import type { SEQPath } from "./SEQPathTabs";
import { SEQPathTabs } from "./SEQPathTabs";
import { SEQPlanningBox } from "./SEQPlanningBox";
import { SEQPlanningInputs } from "./SEQPlanningInputs";
import { SEQSharedInputs } from "./SEQSharedInputs";
import { SEQTaxReturnInputs } from "./SEQTaxReturnInputs";
import { SEQWinnerBanner } from "./SEQWinnerBanner";
import { SmartToolIntro } from "../SmartToolIntro";

const defaultInputs: SEQInputs = {
  yearsEmp: 2,
  bizType: "sched_c",
  cs: 720,
  debts: 800,
  dp: 10,
  targetPrice: 500000,
  netY1: 85000,
  netY2: 92000,
  ab_dep: 3500,
  ab_dep2: 0,
  ab_home: 4200,
  ab_loss: 0,
  ab_meals: 2400,
  avgDeposits: 14500,
  bsPeriod: 12,
  expFactor: "0.50",
  customExpFactor: 50,
  planReduction: 15000,
  taxRate: 25,
};

export function SEQCalculator() {
  const [path, setPath] = useState<SEQPath>("taxreturn");
  const [inputs, setInputs] = useState<SEQInputs>(defaultInputs);

  const results = useMemo(() => runCalculation(inputs), [inputs]);

  const showTax = path === "taxreturn" || path === "compare";
  const showBs = path === "bankstatement" || path === "compare";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-0 sm:px-6 lg:px-8">
      <SmartToolIntro title="The Self-Employed Mortgage Qualifier">
        <p>
          Standard mortgage tools assume you have a W-2. This one doesn&apos;t. Enter your real numbers — tax return
          income or bank deposit cash flow — and see exactly how lenders calculate your qualifying income, which path
          qualifies you for more home, and what adjusting your write-offs could unlock.
        </p>
      </SmartToolIntro>

      <SEQPathTabs path={path} onPathChange={setPath} />

      <SEQSharedInputs inputs={inputs} setInputs={setInputs} />

      {showTax ? <SEQTaxReturnInputs inputs={inputs} setInputs={setInputs} /> : null}
      {showBs ? <SEQBankStatementInputs inputs={inputs} setInputs={setInputs} /> : null}

      <SEQPlanningInputs inputs={inputs} setInputs={setInputs} />

      <SEQWinnerBanner path={path} results={results} />

      <SEQPathColumns path={path} results={results} inputs={inputs} />

      <SEQMetrics path={path} results={results} />

      <SEQPlanningBox results={results} planReduction={inputs.planReduction} />

      <SEQDocChecklist />

      <SEQInsight path={path} results={results} planReduction={inputs.planReduction} />

      <SEQCTA path={path} results={results} />
    </div>
  );
}
