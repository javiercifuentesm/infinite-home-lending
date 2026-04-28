import { useDealDeskAuth } from "./hooks/useDealDeskAuth";
import { DealDeskGate } from "./components/deal-desk/gate/DealDeskGate";
import DealDesk from "./pages/DealDesk";
import Nexio from "./components/Nexio";

export default function DealDeskEntry() {
  const { isAuthenticated } = useDealDeskAuth();
  return (
    <>
      {isAuthenticated() ? <DealDesk /> : <DealDeskGate />}
      <Nexio />
    </>
  );
}
