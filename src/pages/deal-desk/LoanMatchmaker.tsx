import Nexio from "../../components/Nexio";
import { usePageMetadata } from "../../hooks/usePageMetadata";
import { PAGE_METADATA } from "../../lib/pageMetadata";
import LoanMatchmakerCalculator from "../../components/deal-desk/loan-matchmaker/LoanMatchmakerCalculator";

export default function LoanMatchmaker() {
  usePageMetadata(PAGE_METADATA.loanMatchmaker);

  return (
    <div className="pt-[calc(var(--site-header-height)+0.25rem)]">
      <LoanMatchmakerCalculator />
      <Nexio />
    </div>
  );
}
