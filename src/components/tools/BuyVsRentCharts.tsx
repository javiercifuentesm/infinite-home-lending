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
import { useLanguage } from "../../i18n/LanguageContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

type Props = {
  yearlyData: YearlySnapshot[];
  chartInputKey: string;
};

const skipN = 3;

export function BuyVsRentCharts({ yearlyData, chartInputKey }: Props) {
  const { t } = useLanguage();
  const legendBuyWealth = t("tool.bvr.charts.legendBuyWealth");
  const legendRentPortfolio = t("tool.bvr.charts.legendRentPortfolio");
  const legendBuyCost = t("tool.bvr.charts.legendBuyCost");
  const legendRent = t("tool.bvr.charts.legendRent");
  const tooltipBuy = t("tool.bvr.charts.tooltipBuy");
  const tooltipRent = t("tool.bvr.charts.tooltipRent");
  const yrPrefix = t("tool.bvr.charts.yr");

  const wealth = useMemo(() => {
    const labels = yearlyData.map((d) => yrPrefix + d.yr);
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
            label: legendBuyWealth,
            data: buyW,
            borderColor: "#0B2A4A",
            backgroundColor: "rgba(11,42,74,0.06)",
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
          },
          {
            label: legendRentPortfolio,
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
                const who = ctx.datasetIndex === 0 ? tooltipBuy : tooltipRent;
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
  }, [yearlyData, legendBuyWealth, legendRentPortfolio, tooltipBuy, tooltipRent, yrPrefix]);

  const monthly = useMemo(() => {
    const labels = yearlyData.map((d) => yrPrefix + d.yr);
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
            label: legendBuyCost,
            data: buyC,
            borderColor: "#0B2A4A",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.3,
            fill: false,
          },
          {
            label: legendRent,
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
                const y = ctx.parsed.y;
                const who = ctx.datasetIndex === 0 ? tooltipBuy : tooltipRent;
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
  }, [yearlyData, legendBuyCost, legendRent, tooltipBuy, tooltipRent, yrPrefix]);

  const wealthTitle = t("tool.bvr.charts.wealthTitle");
  const monthlyTitle = t("tool.bvr.charts.monthlyTitle");

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{wealthTitle}</h3>
        <div className="mt-2 flex flex-wrap gap-6 text-[11px] text-[#888780]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0B2A4A]" aria-hidden />
            {legendBuyWealth}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#C6A15B]" aria-hidden />
            {legendRentPortfolio}
          </span>
        </div>
        <div key={chartInputKey + "-w"} className="relative mt-3 h-[220px] w-full">
          <Line data={wealth.data} options={wealth.options as never} />
        </div>
      </div>
      <div>
        <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{monthlyTitle}</h3>
        <div className="mt-2 flex flex-wrap gap-6 text-[11px] text-[#888780]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#0B2A4A]" aria-hidden />
            {legendBuyCost}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#C6A15B]" aria-hidden />
            {legendRent}
          </span>
        </div>
        <div key={chartInputKey + "-m"} className="relative mt-3 h-[180px] w-full">
          <Line data={monthly.data} options={monthly.options as never} />
        </div>
      </div>
    </div>
  );
}
