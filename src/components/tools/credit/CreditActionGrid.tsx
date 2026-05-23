import { CREDIT_ACTIONS } from "../../../data/creditActions";
import { useLanguage } from "../../../i18n/LanguageContext";

type Props = {
  selected: Set<string>;
  onToggle: (id: string) => void;
};

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden className="text-white">
      <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CreditActionGrid({ selected, onToggle }: Props) {
  const { t } = useLanguage();

  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold text-[#0B2A4A]">{t("tool.credit.actions.lead")}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CREDIT_ACTIONS.map((action) => {
          const isOn = selected.has(action.id);
          const name = t(`tool.credit.action.${action.id}.name` as never);
          const detail = t(`tool.credit.action.${action.id}.detail` as never);
          const pts = t("tool.credit.actions.ptsRange")
            .replace("{lo}", String(action.pts[0]))
            .replace("{hi}", String(action.pts[1]));
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => onToggle(action.id)}
              className={`flex w-full gap-3 rounded-lg border p-3 text-left transition-colors ${
                isOn
                  ? "border-2 border-[#C6A15B] bg-[rgba(198,161,91,0.04)]"
                  : "border-[0.5px] border-slate-200 bg-white hover:bg-slate-50/80"
              }`}
            >
              <span
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-[1.5px] ${
                  isOn ? "border-[#C6A15B] bg-[#C6A15B]" : "border-slate-300 bg-white"
                }`}
                aria-hidden
              >
                {isOn ? <CheckIcon /> : null}
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-medium text-[#0B2A4A]">{name}</span>
                <span className="mt-0.5 block text-[11px] font-medium text-[#3B6D11]">{pts}</span>
                <span className="mt-1 block text-[10px] leading-snug text-slate-500">{detail}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
