import { CREDIT_ACTIONS } from "../../../data/creditActions";

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
  return (
    <div>
      <p className="mb-3 text-[13px] font-semibold text-[#0B2A4A]">Select the moves you&apos;re willing to make</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CREDIT_ACTIONS.map((action) => {
          const isOn = selected.has(action.id);
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
                <span className="block text-[12px] font-medium text-[#0B2A4A]">{action.name}</span>
                <span className="mt-0.5 block text-[11px] font-medium text-[#3B6D11]">
                  +{action.pts[0]}–{action.pts[1]} points
                </span>
                <span className="mt-1 block text-[10px] leading-snug text-slate-500">{action.detail}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
