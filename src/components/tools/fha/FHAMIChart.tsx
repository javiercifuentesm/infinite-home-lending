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
import type { FHAResult } from "../../../hooks/useFHAMath";
import { chartCostYFmt, fmt } from "../../../hooks/useFHAMath";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

type Props = {
  results: FHAResult;
  chartKey: string;
};

export function FHAMIChart({ results, chartKey }: Props) {
  const { data, options } = useMemo(() => {
    const { labels, convMiArr, fhaMiArr } = results;
    const n = labels.length;
    const skipN = Math.max(1, Math.floor(Math.max(n, 1) / 8));

    const ticks = labels.map((_, i) => {
      const yr = i + 1;
      if (yr % skipN === 0 || yr === n) return "Yr " + yr;
      return "";
    });

    const dataObj = {
      labels: labels.map((_, i) => String(i + 1)),
      datasets: [
        {
          label: "Conventional PMI",
          data: convMiArr,
          borderColor: "#0B2A4A",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0,
          fill: false,
          borderDash: [5, 3],
        },
        {
          label: "FHA MIP",
          data: fhaMiArr,
          borderColor: "#3B6D11",
          backgroundColor: "rgba(59,109,17,0.08)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0,
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
          callbacks: {
            title(items: { dataIndex: number }[]) {
              const i = items[0]?.dataIndex ?? 0;
              return labels[i] ?? "";
            },
            label(ctx: { datasetIndex?: number; parsed: { y: number } }) {
              const lab = ctx.datasetIndex === 0 ? "Conventional PMI" : "FHA MIP";
              return lab + ": " + fmt(Math.max(0, ctx.parsed.y)) + "/mo";
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
              return ticks[i] ?? "";
            },
          },
          grid: { color: "rgba(136,135,128,0.15)" },
        },
        y: {
          ticks: {
            color: "#888780",
            font: { size: 11 },
            callback: (v: string | number) => chartCostYFmt(typeof v === "string" ? parseFloat(v) : v),
          },
          grid: { color: "rgba(136,135,128,0.15)" },
        },
      },
    };

    return { data: dataObj, options: optionsObj };
  }, [results]);

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Monthly mortgage insurance cost over time</h3>
      <div className="mt-3 flex flex-wrap gap-6 text-[11px] text-[#888780]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-0 w-3 border-t-2 border-dashed border-[#0B2A4A]" aria-hidden />
          Conventional PMI
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#3B6D11]" aria-hidden />
          FHA MIP
        </span>
      </div>
      <div key={chartKey} className="relative mt-3 h-[180px] w-full">
        <Line data={data} options={options as never} />
      </div>
    </div>
  );
}
