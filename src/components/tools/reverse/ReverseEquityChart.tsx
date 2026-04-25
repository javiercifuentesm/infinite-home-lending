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
import type { ReverseResult } from "../../../hooks/useReverseMath";
import { chartYFmt, fmt } from "../../../hooks/useReverseMath";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

type Props = {
  results: ReverseResult;
  chartKey: string;
};

export function ReverseEquityChart({ results, chartKey }: Props) {
  const { data, options } = useMemo(() => {
    const yearlyData = results.yearlyData;
    const labels = yearlyData.map((d) => "Yr " + d.yr);
    const skipN = Math.max(1, Math.floor(20 / 8));
    const tickLabels = labels.map((l, i) => (i % skipN === 0 ? l : ""));

    const homeVals = yearlyData.map((d) => d.homeValue);
    const loanBals = yearlyData.map((d) => d.loanBalance);
    const equities = yearlyData.map((d) => Math.max(0, d.equity));

    const dataObj = {
      labels,
      datasets: [
        {
          label: "Home value (appreciating)",
          data: homeVals,
          borderColor: "#0B2A4A",
          backgroundColor: "rgba(11,42,74,0.04)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
        {
          label: "Loan balance (growing)",
          data: loanBals,
          borderColor: "#C6A15B",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          borderDash: [5, 3],
          fill: false,
        },
        {
          label: "Remaining equity",
          data: equities,
          borderColor: "#3B6D11",
          backgroundColor: "rgba(59,109,17,0.06)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
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
          titleFont: { size: 14 },
          callbacks: {
            label(ctx: { datasetIndex?: number; parsed: { y: number } }) {
              const y = Math.max(0, ctx.parsed.y);
              const labelsL = ["Home value", "Loan balance", "Equity"];
              return (labelsL[ctx.datasetIndex ?? 0] ?? "") + ": " + fmt(y);
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: "#888780",
            font: { size: 11 },
            maxRotation: 0,
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
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Equity and loan balance over 20 years</h3>
      <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-[#888780]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0B2A4A]" aria-hidden />
          Home value (appreciating)
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[#C6A15B]"
            style={{ borderStyle: "dashed" }}
            aria-hidden
          />
          Loan balance (growing)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#3B6D11]" aria-hidden />
          Remaining equity
        </span>
      </div>
      <div key={chartKey} className="relative mt-3 h-[220px] w-full">
        <Line data={data} options={options as never} />
      </div>
    </div>
  );
}
