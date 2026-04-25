import type { PowerMapResults } from "../../../hooks/usePowerMapMath";

type Props = { results: PowerMapResults };

export function PMPowerBar({ results }: Props) {
  const { currentPrice, improvedPrice } = results;

  const wImproved = Math.min(98, Math.round((improvedPrice / 1_000_000) * 100));
  const wCurrent = Math.min(95, Math.round((currentPrice / 1_000_000) * 100));

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        Your buying power trajectory — current to fully improved
      </h3>

      <div className="relative mt-5 h-7 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="absolute bottom-0 left-0 top-0 rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${wImproved}%`,
            background: "linear-gradient(90deg, #0B2A4A, #3B6D11)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 top-0 rounded-r-none transition-[width] duration-500 ease-out"
          style={{
            width: `${wCurrent}%`,
            background: "#0B2A4A",
            borderRadius: "9999px",
          }}
        />
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-slate-500">
        <span>$200k</span>
        <span>$400k</span>
        <span>$600k</span>
        <span>$800k</span>
        <span>$1M+</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "#0B2A4A" }} />
          Today
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: "linear-gradient(90deg, #0B2A4A, #3B6D11)" }}
          />
          With improvements
        </span>
      </div>
    </div>
  );
}
