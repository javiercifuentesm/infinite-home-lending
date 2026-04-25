import type { RLEResults } from "../../../hooks/useRLEMath";

type Props = { results: RLEResults };

export function RLETimelineStrip({ results }: Props) {
  const { daysToClose, daysBuffer, lockWindowEnd } = results;

  const f1 = Math.max(1, lockWindowEnd - 5);
  const f2 = Math.min(daysToClose, 15);
  const f3 = daysBuffer;
  const f4 = 3;

  const floatDays = Math.max(0, lockWindowEnd - 5);

  const note =
    daysToClose <= 10
      ? `⚠ With only ${daysToClose} days to close, floating is extremely high-risk. Lock immediately.`
      : daysToClose >= 30 && daysToClose <= 45
        ? "You are in the optimal lock window. Most advisors recommend locking 30–45 days before closing — you are right in it."
        : daysToClose > 45
          ? `You have ${daysToClose} days until closing. With significant time remaining, there is a case for floating — but every day of floating is a day of rate exposure.`
          : "You are approaching the lock window. Most advisors recommend locking now rather than waiting for a move that may not happen.";

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">Your rate lock timeline</h3>

      <div
        className="mt-4 flex w-full overflow-hidden rounded-lg"
        style={{ minHeight: "4.5rem" }}
      >
        <div
          className="flex min-w-0 flex-col justify-center px-1.5 py-2 text-center sm:px-2"
          style={{ flex: f1, background: "#854F0B" }}
        >
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.85)" }}>
            Float window
          </span>
          <span className="mt-0.5 text-[11px] font-semibold text-white">{floatDays} days</span>
        </div>
        <div
          className="flex min-w-0 flex-col justify-center px-1.5 py-2 text-center sm:px-2"
          style={{ flex: f2, background: "#27500A" }}
        >
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.85)" }}>
            Lock sweet spot
          </span>
          <span className="mt-0.5 text-[10px] font-semibold leading-tight text-white sm:text-[11px]">30–45 days out</span>
        </div>
        <div
          className="flex min-w-0 flex-col justify-center px-1.5 py-2 text-center sm:px-2"
          style={{ flex: f3, background: "#185FA5" }}
        >
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.85)" }}>
            Buffer
          </span>
          <span className="mt-0.5 text-[11px] font-semibold text-white">{daysBuffer} day buffer</span>
        </div>
        <div
          className="flex min-w-0 flex-col justify-center px-1.5 py-2 text-center sm:px-2"
          style={{ flex: f4, background: "#0B2A4A" }}
        >
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.85)" }}>
            Closing
          </span>
          <span className="mt-0.5 text-[11px] font-semibold text-white">Day {daysToClose}</span>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">{note}</p>
    </div>
  );
}
