import type { WealthResults } from "../../../hooks/useWealthMath";
import { fmt, fmtK } from "../../../hooks/useWealthMath";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = { results: WealthResults };

export function WTRenterPath({ results }: Props) {
  const { t } = useLanguage();
  const {
    ownerFinal,
    monthlyToMatch,
    rent,
    rentAtYear30,
    rentInc,
    totalRentInflationExtra,
    invReturn,
  } = results;

  const row5 = invReturn >= 8 ? t("wt.renter.aggressive") : t("wt.renter.reasonable");

  const rows = [
    {
      label: t("wt.renter.toAccumulate").replace("{amount}", fmtK(ownerFinal)),
      value: <span className="font-semibold">{fmt(monthlyToMatch)}/mo</span>,
    },
    { label: t("wt.renter.rentStarting"), value: <span className="font-medium">{fmt(rent)}/mo</span> },
    {
      label: t("wt.renter.rentAtYear30").replace("{rate}", rentInc.toFixed(1)),
      value: <span className="font-medium text-[#A32D2D]">{fmt(rentAtYear30)}/mo</span>,
    },
    {
      label: t("wt.renter.rentInflation"),
      value: <span className="font-medium text-[#A32D2D]">{fmtK(totalRentInflationExtra)}</span>,
    },
    {
      label: t("wt.renter.investReturn"),
      value: (
        <span className="font-medium">
          {invReturn.toFixed(1)}%/yr {row5}
        </span>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-slate-200/80 bg-slate-50/90 p-5 sm:p-6">
      <h3 className="font-[Georgia,serif] text-[13px] font-medium text-[#0B2A4A]">{t("wt.renter.title")}</h3>
      <p className="mt-2 text-[11px] leading-[1.5] text-slate-500">{t("wt.renter.subtitle")}</p>
      <dl className="mt-4 divide-y divide-slate-200/80">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col justify-between gap-1 py-3 sm:flex-row sm:items-start">
            <dt className="max-w-xl text-[12px] text-slate-500">{row.label}</dt>
            <dd className="text-right text-[12px] text-slate-800">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
