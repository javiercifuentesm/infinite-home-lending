import { VALID_CODES, COOKIE_NAME, COOKIE_DAYS } from "../config/dealDeskCodes";

export function useDealDeskAuth() {
  function isAuthenticated() {
    if (typeof document === "undefined") return false;
    const cookies = document.cookie.split(";");
    return cookies.some((c) => c.trim().startsWith(`${COOKIE_NAME}=valid`));
  }

  function validateCode(code) {
    const normalized = code.trim().toUpperCase();
    if (VALID_CODES.map((c) => c.toUpperCase()).includes(normalized)) {
      const expires = new Date();
      expires.setDate(expires.getDate() + COOKIE_DAYS);
      document.cookie = `${COOKIE_NAME}=valid; expires=${expires.toUTCString()}; path=/`;
      return true;
    }
    return false;
  }

  function clearAccess() {
    document.cookie = `${COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  return { isAuthenticated, validateCode, clearAccess };
}
