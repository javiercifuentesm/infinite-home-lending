import type { FrQuestion } from "../../lib/financialReality/questions";

type Props = {
  question: FrQuestion;
  questionIndex: number;
  total: number;
  selectedIndex: number | null;
  onSelect: (optionIndex: number) => void;
};

export function QuizQuestionBlock({
  question,
  questionIndex,
  total,
  selectedIndex,
  onSelect,
}: Props) {
  const pct = ((questionIndex + 1) / total) * 100;

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-10">
        <p className="text-[12px] font-medium text-navy/85">Building your diagnosis…</p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gold transition-[width] duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <h2 className="font-heading text-xl font-semibold leading-snug text-navy sm:text-2xl">{question.prompt}</h2>
      <ul className="mt-8 space-y-3">
        {question.options.map((opt, i) => {
          const active = selectedIndex === i;
          return (
            <li key={opt.label}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                className={`w-full rounded-xl border px-4 py-3.5 text-left text-[14px] leading-snug transition-colors ${
                  active
                    ? "border-gold/60 bg-gold/10 text-navy shadow-sm"
                    : "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-8 text-center text-[12px] leading-relaxed text-slate-500">
        Directional only — not an approval or quote.
      </p>
    </div>
  );
}
