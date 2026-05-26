import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { WealthResults } from "../../../hooks/useWealthMath";
import { useLanguage } from "../../../i18n/LanguageContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

function formatYAxis(v: number): string {
  const a = Math.abs(v);
  if (a >= 1_000_000) return "$" + (v / 1_000_000).toFixed(1) + "M";
  if (a >= 1_000) return "$" + Math.round(v / 1_000) + "k";
  return "$" + Math.round(v);
}

type Props = { results: WealthResults; chartKey: string };

export function WTWealthChart({ results, chartKey }: Props) {
  const { t } = useLanguage();
  const { ownerNWArr, renterNWArr, labels } = results;
  const ownerLabel = t("wt.chart.ownerLabel");
  const renterLabel = t("wt.chart.renterLabel");

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: ownerLabel,
          data: ownerNWArr,
          borderColor: "#0B2A4A",
          backgroundColor: "rgba(11,42,74,0.07)",
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
        {
          label: renterLabel,
          data: renterNWArr,
          borderColor: "#C6A15B",
          backgroundColor: "rgba(198,161,91,0.06)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
          borderDash: [5, 3],
        },
      ],
    }),
    [ownerNWArr, renterNWArr, labels, ownerLabel, renterLabel],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: { parsed: { y: number } }) => formatYAxis(ctx.parsed.y),
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            maxRotation: 0,
            autoSkip: false,
            callback: function (this: unknown, _val: string | number, index: number) {
              return index % 4 === 0 ? labels[index] : "";
            },
          },
        },
        y: {
          ticks: {
            callback: (v: string | number) => formatYAxis(Number(v)),
          },
        },
      },
    }),
    [labels],
  );

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("wt.chart.title")}</h3>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-6 rounded-sm" style={{ background: "#0B2A4A" }} />
          {ownerLabel}
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-0 w-8 border-t-2 border-dashed"
            style={{ borderColor: "#C6A15B" }}
          />
          {renterLabel}
        </span>
      </div>

      <div className="relative mt-4 h-[220px] w-full" key={chartKey}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
