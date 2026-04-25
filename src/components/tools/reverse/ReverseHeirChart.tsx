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
import type { ReverseResult } from "../../../hooks/useReverseMath";
import { chartYFmt, fmt } from "../../../hooks/useReverseMath";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BAR_COLORS = ["#B5D4F4", "#378ADD", "#185FA5", "#0C447C"];

type Props = {
  results: ReverseResult;
  chartKey: string;
};

export function ReverseHeirChart({ results, chartKey }: Props) {
  const { data, options } = useMemo(() => {
    const labels = results.heirData.map((d) => "Year " + d.yr);
    const values = results.heirData.map((d) => Math.max(0, d.equity));

    const dataObj = {
      labels,
      datasets: [
        {
          label: "Equity to heirs",
          data: values,
          backgroundColor: BAR_COLORS,
          borderRadius: 4,
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
          titleFont: { size: 14 },
          callbacks: {
            label(ctx: { parsed: { y: number } }) {
              return fmt(Math.max(0, ctx.parsed.y));
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#888780", font: { size: 11 } },
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
        What your heirs see — equity projection at years 5, 10, 15, 20
      </h3>
      <div key={chartKey + "-heir"} className="relative mt-3 h-[180px] w-full">
        <Bar data={data} options={options as never} />
      </div>
    </div>
  );
}
