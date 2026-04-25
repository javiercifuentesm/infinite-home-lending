import { useDealDeskAuth } from "./hooks/useDealDeskAuth";
import { DealDeskGate } from "./components/deal-desk/gate/DealDeskGate";
import DealDesk from "./pages/DealDesk";
import DealDeskAssistant from "./components/DealDeskAssistant";

export default function DealDeskEntry() {
  const { isAuthenticated } = useDealDeskAuth();
  return (
    <>
      {isAuthenticated() ? <DealDesk /> : <DealDeskGate />}
      <DealDeskAssistant />
    </>
  );
}
