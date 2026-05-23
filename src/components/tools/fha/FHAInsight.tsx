import type { FHAInputs, FHAResult } from "../../../hooks/useFHAMath";
import { fmt } from "../../../hooks/useFHAMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  inputs: FHAInputs;
  results: FHAResult;
};

export function FHAInsight({ inputs, results }: Props) {
  const { t } = useLanguage();
  const { convWins, stay, fhaUFMIP, cs, dpPercentFha } = results;

  let text: string;

  if (inputs.dp >= 20) {
    text = t("tool.fha.insight.dp20");
  } else if (cs >= 720 && convWins) {
    const mipPhrase =
      dpPercentFha < 10 ? t("tool.fha.insight.mipNeverLoan") : t("tool.fha.insight.mip11WithDp").replace("{dp}", String(inputs.dp));
    text = t("tool.fha.insight.conv720").replace("{cs}", String(cs)).replace("{mipPhrase}", mipPhrase);
  } else if (!convWins && stay <= 7) {
    text = t("tool.fha.insight.fhaShortStay").replace("{stay}", String(stay)).replace("{ufmip}", fmt(fhaUFMIP));
  } else if (cs < 680) {
    text = t("tool.fha.insight.lowCs").replace("{cs}", String(cs));
  } else {
    text = t("tool.fha.insight.nuance");
  }

  return (
    <blockquote
      className="border-l-[3px] border-[#C6A15B] py-[0.9rem] pl-4 pr-4 font-[Georgia,serif] text-[15px] italic leading-relaxed text-[#0B2A4A]"
      style={{ background: "var(--color-background-secondary)" }}
    >
      {text}
    </blockquote>
  );
}
