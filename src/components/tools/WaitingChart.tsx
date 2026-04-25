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
import type { WaitingCalcResult } from "../../hooks/useWaitingMath";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

function yTickFmt(v: number | string): string {
  const n = typeof v === "string" ? parseFloat(v) : v;
  if (!Number.isFinite(n)) return "";
  const a = Math.abs(n);
  if (a >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "m";
  if (a >= 1000) return "$" + Math.round(n / 1000) + "k";
  return "$" + Math.round(n);
}

type Props = {
  chartData: WaitingCalcResult[];
  chartMonths: number;
  chartKey: string;
};

export function WaitingChart({ chartData, chartMonths, chartKey }: Props) {
  const { data, options } = useMemo(() => {
    const labels = chartData.map((_, i) => `Mo ${i + 1}`);
    return {
      data: {
        labels,
        datasets: [
          {
            label: "Cumulative cost",
            data: chartData.map((d) => d.totalCost),
            borderColor: "#A32D2D",
            backgroundColor: "rgba(163,45,45,0.06)",
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            yAxisID: "y",
          },
          {
            label: "Monthly rate",
            data: chartData.map((d) => d.monthlyCostRate),
            borderColor: "#C6A15B",
            backgroundColor: "transparent",
            borderWidth: 1.5,
            pointRadius: 0,
            tension: 0.3,
            borderDash: [4, 3],
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: "index" as const, intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx: { datasetIndex?: number; parsed: { y: number } }) {
                const y = ctx.parsed.y;
                return (ctx.datasetIndex === 0 ? "Cumulative: " : "Monthly rate: ") + yTickFmt(y);
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
              autoSkip: true,
              maxTicksLimit: 9,
            },
            grid: { color: "rgba(136,135,128,0.15)" },
          },
          y: {
            type: "linear" as const,
            position: "left" as const,
            ticks: { color: "#888780", font: { size: 11 }, callback: (v: string | number) => yTickFmt(v) },
            grid: { color: "rgba(136,135,128,0.15)" },
          },
          y1: {
            type: "linear" as const,
            position: "right" as const,
            ticks: { color: "#C6A15B", font: { size: 10 }, callback: (v: string | number) => yTickFmt(v) },
            grid: { display: false },
          },
        },
      },
    };
  }, [chartData, chartMonths]);

  return (
    <div className="rounded-xl border border-[var(--tcw-border,#e2e8f0)] bg-[var(--tcw-surface,#fff)] p-4 sm:p-5">
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">How the cost grows over time</h3>
      <div className="mt-3 flex flex-wrap items-center gap-6 text-[11px]">
        <span className="inline-flex items-center gap-2 text-[#888780]">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#A32D2D]" aria-hidden />
          Cumulative cost of waiting
        </span>
        <span className="inline-flex items-center gap-2 text-[#C6A15B]">
          <span className="inline-block h-0.5 w-8 border-t border-dashed border-[#C6A15B]" aria-hidden />
          Monthly cost rate
        </span>
      </div>
      <div key={chartKey} className="relative mt-4 h-[200px] w-full">
        <Line data={data} options={options as object} />
      </div>
    </div>
  );
}
