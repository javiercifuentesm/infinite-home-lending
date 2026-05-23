import { useLanguage } from "../../../i18n/LanguageContext";

export function SEQDocChecklist() {
  const { t } = useLanguage();

  const taxItems = [t("tool.seq.docs.tax1"), t("tool.seq.docs.tax2"), t("tool.seq.docs.tax3"), t("tool.seq.docs.tax4"), t("tool.seq.docs.tax5")];
  const bsItems = [t("tool.seq.docs.bs1"), t("tool.seq.docs.bs2"), t("tool.seq.docs.bs3"), t("tool.seq.docs.bs4"), t("tool.seq.docs.bs5")];
  const bothItems = [t("tool.seq.docs.both1"), t("tool.seq.docs.both2"), t("tool.seq.docs.both3"), t("tool.seq.docs.both4"), t("tool.seq.docs.both5")];

  return (
    <section className="mb-10">
      <h3 className="mb-4 font-serif text-lg font-semibold text-[#0B2A4A]">{t("tool.seq.docs.title")}</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[12px] font-medium text-[#0B2A4A]">{t("tool.seq.docs.taxTitle")}</p>
          <ul className="space-y-2 text-[11px] leading-[1.6] text-slate-600">
            {taxItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[12px] font-medium text-[#3B6D11]">{t("tool.seq.docs.bsTitle")}</p>
          <ul className="space-y-2 text-[11px] leading-[1.6] text-slate-600">
            {bsItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200/90 bg-white p-4 shadow-sm">
          <p className="mb-3 text-[12px] font-medium text-[#854F0B]">{t("tool.seq.docs.bothTitle")}</p>
          <ul className="space-y-2 text-[11px] leading-[1.6] text-slate-600">
            {bothItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
