import { useLanguage } from "../../../i18n/LanguageContext";

const PROFILE_IDS = ["760", "720", "680", "640", "600"] as const;

function activeProfileId(cs: number): (typeof PROFILE_IDS)[number] {
  if (cs >= 760) return "760";
  if (cs >= 720) return "720";
  if (cs >= 680) return "680";
  if (cs >= 640) return "640";
  return "600";
}

const PROFILE_RANGE: Record<(typeof PROFILE_IDS)[number], string> = {
  "760": "760+",
  "720": "720–759",
  "680": "680–719",
  "640": "640–679",
  "600": "600–639",
};

const PROFILE_COLOR: Record<(typeof PROFILE_IDS)[number], string> = {
  "760": "#185FA5",
  "720": "#185FA5",
  "680": "#854F0B",
  "640": "#3B6D11",
  "600": "#3B6D11",
};

type Props = { cs: number };

export function FHAProfileGrid({ cs }: Props) {
  const { t } = useLanguage();
  const active = activeProfileId(cs);

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">{t("tool.fha.profile.title")}</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PROFILE_IDS.map((id) => {
          const isActive = id === active;
          return (
            <div
              key={id}
              className={`rounded-xl bg-white p-4 ${isActive ? "border-2 border-[#C6A15B]" : "border-[0.5px] border-[var(--color-border-tertiary)]"}`}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C6A15B]">{PROFILE_RANGE[id]}</p>
              <p className="mt-1 text-[13px] font-medium text-[var(--color-text-primary,#0B2A4A)]">{t(`tool.fha.profile.${id}.name`)}</p>
              <p className="mt-2 text-[11px] leading-[1.4]" style={{ color: PROFILE_COLOR[id] }}>
                {t(`tool.fha.profile.${id}.rec`)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
