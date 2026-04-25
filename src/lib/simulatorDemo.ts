/**
 * Optional short demo video for “Watch how it works” (modal opens → muted autoplay).
 * Set `VITE_SIMULATOR_DEMO_VIDEO` to a URL (e.g. mp4 in /public). Leave unset to hide the link.
 */
const raw = import.meta.env.VITE_SIMULATOR_DEMO_VIDEO as string | undefined;
export const SIMULATOR_DEMO_VIDEO_URL: string | null =
  raw && typeof raw === "string" && raw.trim() ? raw.trim() : null;
