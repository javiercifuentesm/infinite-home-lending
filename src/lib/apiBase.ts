/**
 * Browser → Express API base URL.
 * - **Local dev:** leave empty; Vite dev server proxies `/api` to the Express port.
 * - **Production (Vercel):** set `VITE_API_BASE_URL` to your Railway public URL, e.g. `https://xxxx.up.railway.app` (no trailing slash).
 */
export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (raw?.trim().replace(/\/$/, "") ?? "");
}

/** Build an absolute URL for same-origin (dev) or cross-origin (prod) API calls. */
export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base = getApiBaseUrl();
  return base ? `${base}${p}` : p;
}
