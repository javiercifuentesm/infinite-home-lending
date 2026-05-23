import { useState, useEffect } from "react";
import { useDealDeskAuth } from "./hooks/useDealDeskAuth";
import { DealDeskGate } from "./components/deal-desk/gate/DealDeskGate";
import DealDesk from "./pages/DealDesk";

export default function DealDeskEntry() {
  const { isAuthenticated } = useDealDeskAuth();
  const [authed, setAuthed] = useState(() => isAuthenticated());

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  return authed ? <DealDesk /> : <DealDeskGate onAuth={() => setAuthed(true)} />;
}
