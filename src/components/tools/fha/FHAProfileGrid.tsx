type Profile = {
  id: string;
  range: string;
  name: string;
  rec: string;
  color: string;
};

const PROFILES: Profile[] = [
  {
    id: "760",
    range: "760+",
    name: "Excellent credit",
    rec: "Conventional almost always wins. PMI costs are low at this tier and often beat FHA MIP. With 20% down: no PMI at all.",
    color: "#185FA5",
  },
  {
    id: "720",
    range: "720–759",
    name: "Very good credit",
    rec: "Conventional wins on cost at most down payment levels. FHA may still make sense if qualifying is difficult.",
    color: "#185FA5",
  },
  {
    id: "680",
    range: "680–719",
    name: "Good credit",
    rec: "Competitive zone — run both numbers. Conv PMI is higher at this tier. FHA's lower rate may offset MIP for shorter stays.",
    color: "#854F0B",
  },
  {
    id: "640",
    range: "640–679",
    name: "Fair credit",
    rec: "FHA is often the better financial fit. PMI on Conventional is expensive at this credit level; FHA MIP may cost less monthly.",
    color: "#3B6D11",
  },
  {
    id: "600",
    range: "600–639",
    name: "Below average",
    rec: "FHA is the primary option. Conventional PMI may be prohibitively expensive or the loan may not qualify at all.",
    color: "#3B6D11",
  },
];

function activeProfileId(cs: number): string {
  if (cs >= 760) return "760";
  if (cs >= 720) return "720";
  if (cs >= 680) return "680";
  if (cs >= 640) return "640";
  return "600";
}

type Props = { cs: number };

export function FHAProfileGrid({ cs }: Props) {
  const active = activeProfileId(cs);

  return (
    <div>
      <h3 className="font-[Georgia,serif] text-lg font-medium text-[#0B2A4A]">Your buyer profile — how the verdict changes by credit score</h3>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {PROFILES.map((p) => {
          const isActive = p.id === active;
          return (
            <div
              key={p.id}
              className={`rounded-xl bg-white p-4 ${isActive ? "border-2 border-[#C6A15B]" : "border-[0.5px] border-[var(--color-border-tertiary)]"}`}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#C6A15B]">{p.range}</p>
              <p className="mt-1 text-[13px] font-medium text-[var(--color-text-primary,#0B2A4A)]">{p.name}</p>
              <p className="mt-2 text-[11px] leading-[1.4]" style={{ color: p.color }}>
                {p.rec}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
