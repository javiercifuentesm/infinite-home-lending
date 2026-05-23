import { useLanguage } from "../../../i18n/LanguageContext";
import type { UseCaseKey } from "./HelocUseCaseSelector";

type VerdictDef = {
  title: string;
  verdict: string;
  detail: string;
  tags: { text: string; bg: string }[];
};

function buildVerdictData(t: (key: string) => string): Record<UseCaseKey, VerdictDef> {
  return {
    reno: {
      title: t("tool.heloc.verdict.reno.title"),
      verdict: t("tool.heloc.verdict.reno.verdict"),
      detail: t("tool.heloc.verdict.reno.detail"),
      tags: [
        { text: t("tool.heloc.verdict.reno.tag1"), bg: "#EAF3DE" },
        { text: t("tool.heloc.verdict.reno.tag2"), bg: "#E6F1FB" },
        { text: t("tool.heloc.verdict.reno.tag3"), bg: "#EAF3DE" },
      ],
    },
    debt: {
      title: t("tool.heloc.verdict.debt.title"),
      verdict: t("tool.heloc.verdict.debt.verdict"),
      detail: t("tool.heloc.verdict.debt.detail"),
      tags: [
        { text: t("tool.heloc.verdict.debt.tag1"), bg: "#EAF3DE" },
        { text: t("tool.heloc.verdict.debt.tag2"), bg: "#FCEBEB" },
        { text: t("tool.heloc.verdict.debt.tag3"), bg: "#FAEEDA" },
      ],
    },
    edu: {
      title: t("tool.heloc.verdict.edu.title"),
      verdict: t("tool.heloc.verdict.edu.verdict"),
      detail: t("tool.heloc.verdict.edu.detail"),
      tags: [
        { text: t("tool.heloc.verdict.edu.tag1"), bg: "#EAF3DE" },
        { text: t("tool.heloc.verdict.edu.tag2"), bg: "#FAEEDA" },
        { text: t("tool.heloc.verdict.edu.tag3"), bg: "#E6F1FB" },
      ],
    },
    emergency: {
      title: t("tool.heloc.verdict.emergency.title"),
      verdict: t("tool.heloc.verdict.emergency.verdict"),
      detail: t("tool.heloc.verdict.emergency.detail"),
      tags: [
        { text: t("tool.heloc.verdict.emergency.tag1"), bg: "#EAF3DE" },
        { text: t("tool.heloc.verdict.emergency.tag2"), bg: "#EAF3DE" },
        { text: t("tool.heloc.verdict.emergency.tag3"), bg: "#E6F1FB" },
      ],
    },
    invest: {
      title: t("tool.heloc.verdict.invest.title"),
      verdict: t("tool.heloc.verdict.invest.verdict"),
      detail: t("tool.heloc.verdict.invest.detail"),
      tags: [
        { text: t("tool.heloc.verdict.invest.tag1"), bg: "#FAEEDA" },
        { text: t("tool.heloc.verdict.invest.tag2"), bg: "#FCEBEB" },
        { text: t("tool.heloc.verdict.invest.tag3"), bg: "#E6F1FB" },
      ],
    },
    other: {
      title: t("tool.heloc.verdict.other.title"),
      verdict: t("tool.heloc.verdict.other.verdict"),
      detail: t("tool.heloc.verdict.other.detail"),
      tags: [
        { text: t("tool.heloc.verdict.other.tag1"), bg: "#FAEEDA" },
        { text: t("tool.heloc.verdict.other.tag2"), bg: "#FAEEDA" },
        { text: t("tool.heloc.verdict.other.tag3"), bg: "#FAEEDA" },
      ],
    },
  };
}

type Props = {
  activeUse: UseCaseKey;
  rate: number;
};

export function HelocUseCaseVerdict({ activeUse, rate }: Props) {
  const { t } = useLanguage();
  const DATA = buildVerdictData(t);
  const d = DATA[activeUse];
  const detail = d.detail.replace("[RATE]", rate.toFixed(2));
  const tags = d.tags.map((tag) => ({
    ...tag,
    text: tag.text.replace("[RATE]", rate.toFixed(2)),
  }));

  return (
    <div className="rounded-xl border border-[var(--color-border-tertiary)] bg-white p-5 sm:p-6">
      <p className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">
        {d.title}: <span className="text-[#C6A15B]">{d.verdict}</span>
      </p>
      <p className="mt-3 text-[12px] leading-[1.5] text-[var(--color-text-tertiary)]">{detail}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={`${activeUse}-tag-${i}`}
            className="rounded-full px-2 py-0.5 text-[10px] font-medium text-[#444]"
            style={{ background: tag.bg }}
          >
            {tag.text}
          </span>
        ))}
      </div>
    </div>
  );
}
