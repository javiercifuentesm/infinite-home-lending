import type { RLEResults } from "../../../hooks/useRLEMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: RLEResults };

export function RLETimelineStrip({ results }: Props) {
  const { t } = useLanguage();
  const { daysToClose, daysBuffer, lockWindowEnd } = results;

  const f1 = Math.max(1, lockWindowEnd - 5);
  const f2 = Math.min(daysToClose, 15);
  const f3 = daysBuffer;
  const f4 = 3;

  const floatDays = Math.max(0, lockWindowEnd - 5);

  const note =
    daysToClose <= 10
      ? t("tool.rle.timeline.noteUrgent").replace("{days}", String(daysToClose))
      : daysToClose >= 30 && daysToClose <= 45
        ? t("tool.rle.timeline.noteOptimal")
        : daysToClose > 45
          ? t("tool.rle.timeline.noteFar").replace("{days}", String(daysToClose))
          : t("tool.rle.timeline.noteApproach");

  const floatDaysLabel = t("tool.rle.timeline.floatDays").replace("{days}", String(floatDays));
  const bufferLabel = t("tool.rle.timeline.bufferDays").replace("{days}", String(daysBuffer));
  const closingLabel = t("tool.rle.timeline.closingDay").replace("{days}", String(daysToClose));

  return (
    <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-[Georgia,serif] text-[15px] font-medium text-[#0B2A4A]">{t("tool.rle.timeline.title")}</h3>

      <div
        className="mt-4 flex w-full overflow-hidden rounded-lg"
        style={{ minHeight: "4.5rem" }}
      >
        <div
          className="flex min-w-0 flex-col justify-center px-1.5 py-2 text-center sm:px-2"
          style={{ flex: f1, background: "#854F0B" }}
        >
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.85)" }}>
            {t("tool.rle.timeline.floatWindow")}
          </span>
          <span className="mt-0.5 text-[11px] font-semibold text-white">{floatDaysLabel}</span>
        </div>
        <div
          className="flex min-w-0 flex-col justify-center px-1.5 py-2 text-center sm:px-2"
          style={{ flex: f2, background: "#27500A" }}
        >
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.85)" }}>
            {t("tool.rle.timeline.lockSpot")}
          </span>
          <span className="mt-0.5 text-[10px] font-semibold leading-tight text-white sm:text-[11px]">{t("tool.rle.timeline.lockRange")}</span>
        </div>
        <div
          className="flex min-w-0 flex-col justify-center px-1.5 py-2 text-center sm:px-2"
          style={{ flex: f3, background: "#185FA5" }}
        >
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.85)" }}>
            {t("tool.rle.timeline.buffer")}
          </span>
          <span className="mt-0.5 text-[11px] font-semibold text-white">{bufferLabel}</span>
        </div>
        <div
          className="flex min-w-0 flex-col justify-center px-1.5 py-2 text-center sm:px-2"
          style={{ flex: f4, background: "#0B2A4A" }}
        >
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.85)" }}>
            {t("tool.rle.timeline.closing")}
          </span>
          <span className="mt-0.5 text-[11px] font-semibold text-white">{closingLabel}</span>
        </div>
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-slate-500">{note}</p>
    </div>
  );
}
