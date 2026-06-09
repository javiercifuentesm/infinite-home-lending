import { MA_EMPLOYEE_IDS, MA_COOKIE_NAME, MA_COOKIE_DAYS } from "../config/maDashboardCodes";

export function useMAAuth() {
  function isAuthenticated() {
    if (typeof document === "undefined") return false;
    const cookies = document.cookie.split(";");
    return cookies.some((c) => c.trim().startsWith(`${MA_COOKIE_NAME}=valid`));
  }

  function validateEmployeeId(id) {
    const normalized = id.trim().toUpperCase();
    const validIds = MA_EMPLOYEE_IDS.map((c) => c.toUpperCase());
    if (validIds.includes(normalized)) {
      const expires = new Date();
      expires.setDate(expires.getDate() + MA_COOKIE_DAYS);
      document.cookie = `${MA_COOKIE_NAME}=valid; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
      return true;
    }
    return false;
  }

  function clearAccess() {
    document.cookie = `${MA_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  return { isAuthenticated, validateEmployeeId, clearAccess };
}
