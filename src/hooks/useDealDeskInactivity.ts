import { useCallback, useEffect, useRef, useState } from "react";

const WARNING_MS = 4 * 60 * 1000;
const LOGOUT_MS = 5 * 60 * 1000;

const ACTIVITY_EVENTS = ["mousemove", "keydown", "mousedown", "touchstart", "scroll"] as const;

function clearDealDeskCookieAndRedirect() {
  document.cookie = "ihl_deal_desk_access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/deal-desk";
}

export function useDealDeskInactivity() {
  const [showWarning, setShowWarning] = useState(false);
  const warningTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (warningTimeoutRef.current !== null) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (logoutTimeoutRef.current !== null) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
  }, []);

  const logout = useCallback(() => {
    clearTimers();
    setShowWarning(false);
    clearDealDeskCookieAndRedirect();
  }, [clearTimers]);

  const resetTimer = useCallback(() => {
    clearTimers();
    setShowWarning(false);

    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
    }, WARNING_MS);

    logoutTimeoutRef.current = setTimeout(() => {
      logout();
    }, LOGOUT_MS);
  }, [clearTimers, logout]);

  useEffect(() => {
    resetTimer();

    const onActivity = () => resetTimer();

    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, onActivity, { passive: true }));

    return () => {
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, onActivity));
      clearTimers();
    };
  }, [resetTimer, clearTimers]);

  return { showWarning, resetTimer, logout };
}
