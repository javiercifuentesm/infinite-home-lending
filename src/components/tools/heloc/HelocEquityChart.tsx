import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { HelocResult } from "../../../hooks/useHelocMath";
import { chartYFmt, fmt } from "../../../hooks/useHelocMath";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

type Props = {
  results: HelocResult;
  chartKey: string;
};

export function HelocEquityChart({ results, chartKey }: Props) {
  const { data, options } = useMemo(() => {
    const { schedule, drawYrs, repayYrs } = results;
    const totalYrs = drawYrs + repayYrs;
    const skipNYr = Math.max(1, Math.floor(totalYrs / 8));

    const tickLabels = schedule.map((_, i) => {
      const mo = i + 1;
      if (mo % 12 !== 0) return "";
      const yr = mo / 12;
      if (yr % skipNYr === 0 || yr === totalYrs) return "Yr " + yr;
      return "";
    });

    const dataObj = {
      labels: schedule.map((_, i) => String(i + 1)),
      datasets: [
        {
          label: "Home equity",
          data: schedule.map((s) => Math.max(0, s.equity)),
          borderColor: "#3B6D11",
          backgroundColor: "rgba(59,109,17,0.07)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
        {
          label: "HELOC balance",
          data: schedule.map((s) => s.helBal),
          borderColor: "#C6A15B",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: false,
          borderDash: [5, 3],
        },
      ],
    };

    const optionsObj = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          bodyFont: { size: 14 },
          callbacks: {
            label(ctx: { datasetIndex?: number; parsed: { y: number } }) {
              const lab = ctx.datasetIndex === 0 ? "Equity" : "HELOC balance";
              return lab + ": " + fmt(Math.max(0, ctx.parsed.y));
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#888780",
            font: { size: 10 },
            maxRotation: 0,
            autoSkip: false,
            callback(_v: string | number, i: number) {
              return tickLabels[i] ?? "";
            },
          },
          grid: { color: "rgba(136,135,128,0.15)" },
        },
        y: {
          ticks: {
            color: "#888780",
            font: { size: 11 },
            callback: (v: string | number) => chartYFmt(typeof v === "string" ? parseFloat(v) : v),
          },
          grid: { color: "rgba(136,135,128,0.15)" },
        },
      },
    };

    return { data: dataObj, options: optionsObj };
  }, [results]);

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Remaining equity over the life of the HELOC</h3>
      <div className="mt-3 flex flex-wrap gap-6 text-[11px] text-[#888780]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#3B6D11]" aria-hidden />
          Home equity
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-0.5 w-5 border-t-2 border-dashed border-[#C6A15B]" aria-hidden />
          HELOC balance outstanding
        </span>
      </div>
      <div key={chartKey + "-eq"} className="relative mt-3 h-[190px] w-full">
        <Line data={data} options={options as never} />
      </div>
    </div>
  );
}
