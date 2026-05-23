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
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { CreditCalcResult } from "../../../hooks/useCreditMath";
import { useLanguage } from "../../../i18n/LanguageContext";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

function chartYFmt(v: number): string {
  const x = Math.round(v);
  if (Math.abs(x) >= 1000) return "$" + Math.round(x / 1000) + "k";
  return "$" + x;
}

type Props = {
  results: CreditCalcResult;
  curScore: number;
  chartKey: string;
};

export function CreditCostChart({ results, curScore, chartKey }: Props) {
  const { t } = useLanguage();
  const { chartLabels, curCumArr, tgtCumArr, effectiveTgt } = results;
  const chartTitle = t("tool.credit.costChart.title");
  const lblCurrent = `${t("tool.credit.costChart.current")} (${curScore}+)`;
  const lblTarget = `${t("tool.credit.costChart.target")} (${effectiveTgt}+)`;
  const tipCur = t("tool.credit.costChart.tooltipCurrent");
  const tipTgt = t("tool.credit.costChart.tooltipTarget");

  const { data, options } = useMemo(() => {
    const dataObj = {
      labels: chartLabels,
      datasets: [
        {
          label: lblCurrent,
          data: curCumArr,
          borderColor: "#A32D2D",
          backgroundColor: "rgba(163,45,45,0.06)",
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.3,
          fill: true,
        },
        {
          label: lblTarget,
          data: tgtCumArr,
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
          callbacks: {
            label(ctx: { datasetIndex?: number; parsed: { y: number } }) {
              const lab = ctx.datasetIndex === 0 ? tipCur : tipTgt;
              return lab + ": " + chartYFmt(ctx.parsed.y);
            },
          },
        },
      },
      scales: {
        x: {
          ticks: { color: "#64748b", font: { size: 10 }, maxRotation: 0 },
          grid: { color: "rgba(148,163,184,0.2)" },
        },
        y: {
          ticks: {
            color: "#64748b",
            font: { size: 11 },
            callback: (v: string | number) => chartYFmt(typeof v === "string" ? parseFloat(v) : v),
          },
          grid: { color: "rgba(148,163,184,0.2)" },
        },
      },
    };

    return { data: dataObj, options: optionsObj };
  }, [chartLabels, curCumArr, tgtCumArr, lblCurrent, lblTarget, tipCur, tipTgt]);

  return (
    <div className="rounded-lg border border-[var(--color-border-tertiary,#e2e8f0)] bg-white px-4 py-5 sm:px-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{chartTitle}</h3>
      <div className="mt-4 flex flex-wrap items-center gap-6 text-[12px]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-[#A32D2D]" aria-hidden />
          <span className="text-slate-600">{lblCurrent}</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-[#3B6D11]" aria-hidden />
          <span className="text-slate-600">{lblTarget}</span>
        </span>
      </div>
      <div key={chartKey} className="relative mt-4 h-[200px] w-full">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
