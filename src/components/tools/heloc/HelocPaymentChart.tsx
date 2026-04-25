import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { HelocResult } from "../../../hooks/useHelocMath";
import { chartYFmt, fmt } from "../../../hooks/useHelocMath";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  results: HelocResult;
  chartKey: string;
};

const GOLD = "rgba(198,161,91,0.7)";
const NAVY = "rgba(11,42,74,0.8)";

export function HelocPaymentChart({ results, chartKey }: Props) {
  const { data, options } = useMemo(() => {
    const { schedule, drawYrs, repayYrs } = results;
    const totalYrs = drawYrs + repayYrs;
    const skipNYr = Math.max(1, Math.floor(totalYrs / 8));

    const labels = schedule.map((_, i) => {
      const mo = i + 1;
      if (mo % 12 !== 0) return "";
      const yr = mo / 12;
      if (yr % skipNYr === 0 || yr === totalYrs) return "Yr " + yr;
      return "";
    });

    const bg = schedule.map((s) => (s.inDraw ? GOLD : NAVY));
    const pmts = schedule.map((s) => s.pmt);

    const dataObj = {
      labels: schedule.map((_, i) => String(i + 1)),
      datasets: [
        {
          label: "Payment",
          data: pmts,
          backgroundColor: bg,
          borderRadius: 0,
          borderSkipped: false as const,
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
            title(items: { dataIndex: number }[]) {
              const i = items[0]?.dataIndex ?? 0;
              return "Month " + (i + 1);
            },
            label(ctx: { parsed: { y: number } }) {
              return fmt(ctx.parsed.y) + "/mo";
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
              return labels[i] ?? "";
            },
          },
          grid: { display: false },
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
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">
        The payment journey — draw period vs. repayment period
      </h3>
      <div className="mt-3 flex flex-wrap gap-6 text-[11px] text-[#888780]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: GOLD }} aria-hidden />
          Interest-only payment (draw period)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: NAVY }} aria-hidden />
          Principal + interest (repayment period)
        </span>
      </div>
      <div key={chartKey} className="relative mt-3 h-[200px] w-full">
        <Bar data={data} options={options as never} />
      </div>
    </div>
  );
}
