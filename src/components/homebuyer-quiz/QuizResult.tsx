import type { FinancialRealityOutcome } from "../../lib/financialReality/engine";
import { FinancialRealityResult } from "./FinancialRealityResult";

type Props = {
  outcome: FinancialRealityOutcome;
  onRetake: () => void;
};

export function QuizResult(props: Props) {
  return <FinancialRealityResult {...props} />;
}
