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
import type { ScheduleResult } from "../../hooks/useAcceleratorMath";
import { chartYFmt, tooltipMoney } from "../../hooks/useAcceleratorMath";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

type Props = {
  base: ScheduleResult;
  accel: ScheduleResult;
  chartKey: string;
};

export function AcceleratorCharts({ base, accel, chartKey }: Props) {
  const { interestData, balanceData, chartOptions } = useMemo(() => {
    const maxYrs = Math.max(1, Math.ceil(base.months / 12));
    const labels = Array.from({ length: maxYrs }, (_, i) => "Yr " + (i + 1));
    const skipN = Math.max(1, Math.floor(maxYrs / 10));
    const tickLabels = labels.map((l, i) => (i % skipN === 0 ? l : ""));

    const lastBaseInt = base.byYear[base.byYear.length - 1]?.totalInterest ?? 0;
    const lastAccelInt = accel.byYear[accel.byYear.length - 1]?.totalInterest ?? 0;

    const baseIntArr = Array.from({ length: maxYrs }, (_, i) => {
      const d = base.byYear.find((b) => b.year === i + 1);
      return d ? d.totalInterest : lastBaseInt;
    });
    const accelIntArr = Array.from({ length: maxYrs }, (_, i) => {
      const d = accel.byYear.find((b) => b.year === i + 1);
      return d ? d.totalInterest : lastAccelInt;
    });

    const baseBalArr = Array.from({ length: maxYrs }, (_, i) => {
      const d = base.byYear.find((b) => b.year === i + 1);
      return d ? d.balance : 0;
    });
    const accelBalArr = Array.from({ length: maxYrs }, (_, i) => {
      const d = accel.byYear.find((b) => b.year === i + 1);
      return d ? d.balance : 0;
    });

    const interestData = {
      labels,
      datasets: [
        {
          label: "Without extra payments",
          data: baseIntArr,
          borderColor: "#0B2A4A",
          backgroundColor: "transparent",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: false,
        },
        {
          label: "With extra payments",
          data: accelIntArr,
          borderColor: "#C6A15B",
          backgroundColor: "rgba(198,161,91,0.08)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
      ],
    };

    const balanceData = {
      labels,
      datasets: [
        {
          label: "Without extra payments",
          data: baseBalArr,
          borderColor: "#0B2A4A",
          backgroundColor: "rgba(11,42,74,0.05)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
        {
          label: "With extra payments",
          data: accelBalArr,
          borderColor: "#C6A15B",
          backgroundColor: "rgba(198,161,91,0.08)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(ctx: { datasetIndex?: number; parsed: { y: number } }) {
              const y = ctx.parsed.y;
              const who = ctx.datasetIndex === 0 ? "Without extras" : "With extras";
              return who + ": " + tooltipMoney(y);
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

    return { interestData, balanceData, chartOptions };
  }, [base, accel]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Interest paid over the life of your loan</h3>
        <div className="mt-2 flex flex-wrap gap-6 text-[11px] text-[#888780]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0B2A4A]" aria-hidden />
            Without extra payments
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#C6A15B]" aria-hidden />
            With extra payments
          </span>
        </div>
        <div key={chartKey + "-i"} className="relative mt-3 h-[200px] w-full">
          <Line data={interestData} options={chartOptions as never} />
        </div>
      </div>
      <div>
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Remaining loan balance over time</h3>
        <div className="mt-2 flex flex-wrap gap-6 text-[11px] text-[#888780]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0B2A4A]" aria-hidden />
            Without extra payments
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#C6A15B]" aria-hidden />
            With extra payments
          </span>
        </div>
        <div key={chartKey + "-b"} className="relative mt-3 h-[200px] w-full">
          <Line data={balanceData} options={chartOptions as never} />
        </div>
      </div>
    </div>
  );
}
