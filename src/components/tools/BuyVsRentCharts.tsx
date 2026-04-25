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
import type { YearlySnapshot } from "../../hooks/useBuyVsRentMath";
import { yFmt } from "../../hooks/useBuyVsRentMath";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

type Props = {
  yearlyData: YearlySnapshot[];
  chartInputKey: string;
};

const skipN = 3;

export function BuyVsRentCharts({ yearlyData, chartInputKey }: Props) {
  const wealth = useMemo(() => {
    const labels = yearlyData.map((d) => "Yr " + d.yr);
    const tickLabels = labels.map((l, i) => (i % skipN === 0 ? l : ""));
    const buyW = yearlyData.map((d) => d.buyNetWealth);
    const rentW = yearlyData.map((d) => d.rentPortfolio);
    return {
      labels,
      tickLabels,
      data: {
        labels,
        datasets: [
          {
            label: "Buying",
            data: buyW,
            borderColor: "#0B2A4A",
            backgroundColor: "rgba(11,42,74,0.06)",
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
          },
          {
            label: "Renting + investing",
            data: rentW,
            borderColor: "#C6A15B",
            backgroundColor: "rgba(198,161,91,0.06)",
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx: { datasetIndex?: number; parsed: { y: number } }) {
                const y = ctx.parsed.y;
                const who = ctx.datasetIndex === 0 ? "Buying" : "Renting + investing";
                return who + ": " + yFmt(y);
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
              callback: (v: string | number) => yFmt(typeof v === "string" ? parseFloat(v) : v),
            },
            grid: { color: "rgba(136,135,128,0.15)" },
          },
        },
      },
    };
  }, [yearlyData]);

  const monthly = useMemo(() => {
    const labels = yearlyData.map((d) => "Yr " + d.yr);
    const tickLabels = labels.map((l, i) => (i % skipN === 0 ? l : ""));
    const buyC = yearlyData.map((d) => d.monthlyBuyCost);
    const rentC = yearlyData.map((d) => d.monthlyRent);
    return {
      labels,
      tickLabels,
      data: {
        labels,
        datasets: [
          {
            label: "Buy",
            data: buyC,
            borderColor: "#0B2A4A",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            fill: false,
          },
          {
            label: "Rent",
            data: rentC,
            borderColor: "#C6A15B",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label(ctx: { datasetIndex?: number; parsed: { y: number } }) {
                return yFmt(ctx.parsed.y);
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
              callback: (v: string | number) => yFmt(typeof v === "string" ? parseFloat(v) : v),
            },
            grid: { color: "rgba(136,135,128,0.15)" },
          },
        },
      },
    };
  }, [yearlyData]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Net wealth comparison over time</h3>
        <div className="mt-2 flex flex-wrap gap-6 text-[11px] text-[#888780]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0B2A4A]" aria-hidden />
            Buying — net wealth
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#C6A15B]" aria-hidden />
            Renting + investing — portfolio value
          </span>
        </div>
        <div key={chartInputKey + "-w"} className="relative mt-3 h-[220px] w-full">
          <Line data={wealth.data} options={wealth.options as never} />
        </div>
      </div>
      <div>
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Monthly cost comparison</h3>
        <div className="mt-2 flex flex-wrap gap-6 text-[11px] text-[#888780]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0B2A4A]" aria-hidden />
            True monthly cost of buying
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#C6A15B]" aria-hidden />
            Monthly rent
          </span>
        </div>
        <div key={chartInputKey + "-m"} className="relative mt-3 h-[180px] w-full">
          <Line data={monthly.data} options={monthly.options as never} />
        </div>
      </div>
    </div>
  );
}
