import { useState, useEffect } from "react";
import { useMAAuth } from "../hooks/useMAAuth";
import { MAGate } from "../components/ma-dashboard/MAGate";
import { MADashboardShell } from "../components/ma-dashboard/MADashboardShell";

export default function MADashboard() {
  const { isAuthenticated } = useMAAuth();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(isAuthenticated());
  }, []);

  if (!authed) {
    return <MAGate onAuth={() => setAuthed(true)} />;
  }

  return <MADashboardShell onLogout={() => setAuthed(false)} />;
}
