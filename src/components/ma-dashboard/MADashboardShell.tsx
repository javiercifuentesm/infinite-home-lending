import { Fragment, useState } from "react";
import { useMAAuth } from "../../hooks/useMAAuth";
import { DailyIntelligence } from "./DailyIntelligence";
import { GuidelinesIntel } from "./GuidelinesIntel";
import { IncomeAnalyzer } from "./IncomeAnalyzer";
import { AlfredChat } from "./AlfredChat";

type Module =
  | "market-pulse"
  | "dmv-feed"
  | "guidelines"
  | "income-analyzer"
  | "asset-iq"
  | "deal-war-room"
  | "playbook"
  | "pipeline";

type NavItem = { id: Module; label: string; icon: string; badge?: string };

type Props = {
  onLogout: () => void;
  initialModule?: Module;
  captureMode?: boolean;
};

const PRIMARY_NAV: NavItem[] = [
  { id: "market-pulse", label: "Market Pulse", icon: "📊" },
  { id: "dmv-feed", label: "DMV Intelligence", icon: "🏠" },
];

const AI_TOOLS_NAV: NavItem[] = [
  { id: "guidelines", label: "Guidelines Intel", icon: "📋", badge: "LIVE" },
  { id: "income-analyzer", label: "Income Analyzer", icon: "📄", badge: "AI" },
  { id: "asset-iq", label: "Asset IQ", icon: "💰", badge: "AI" },
  { id: "deal-war-room", label: "Deal War Room", icon: "⚔️" },
  { id: "playbook", label: "MA Playbook", icon: "📖" },
  { id: "pipeline", label: "Pipeline", icon: "🎯", badge: "SOON" },
];

const ALL_NAV: NavItem[] = [...PRIMARY_NAV, ...AI_TOOLS_NAV];

function NavButton({
  item,
  active,
  onSelect,
}: {
  item: NavItem;
  active: boolean;
  onSelect: (id: Module) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-[13px] font-medium transition-all text-left ${
        active
          ? "bg-[#C6A15B] text-[#0B2A4A]"
          : "text-white/70 hover:text-white hover:bg-white/10"
      }`}
    >
      <span className="text-base">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md tracking-wide ${
            active ? "bg-[#0B2A4A]/20 text-[#0B2A4A]" : "bg-[#C6A15B]/20 text-[#C6A15B]"
          }`}
        >
          {item.badge}
        </span>
      )}
    </button>
  );
}

export function MADashboardShell({
  onLogout,
  initialModule = "market-pulse",
  captureMode = false,
}: Props) {
  const { clearAccess } = useMAAuth();
  const [activeModule, setActiveModule] = useState<Module>(initialModule);

  const handleLogout = () => {
    clearAccess();
    onLogout();
  };

  const activeLabel = ALL_NAV.find((n) => n.id === activeModule)?.label ?? "MA Command Center";
  const activeNavItem = ALL_NAV.find((n) => n.id === activeModule);

  return (
    <div
      className="min-h-screen bg-[#F8F7F4] flex"
      data-ihl-capture={captureMode ? "ma-command-center" : undefined}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B2A4A] flex flex-col flex-shrink-0 min-h-screen">
        {/* Logo area */}
        <div className="px-6 py-6 border-b border-white/10">
          <img
            src="/ihl-logo.png"
            alt="IHL"
            className="h-9 mb-1"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#C6A15B]">
            MA Command Center
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {PRIMARY_NAV.map((item) => (
            <Fragment key={item.id}>
              <NavButton
                item={item}
                active={activeModule === item.id}
                onSelect={setActiveModule}
              />
            </Fragment>
          ))}

          <div className="pt-4 pb-2 px-4">
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#C6A15B]">
              AI TOOLS
            </p>
          </div>

          {AI_TOOLS_NAV.map((item) => (
            <Fragment key={item.id}>
              <NavButton
                item={item}
                active={activeModule === item.id}
                onSelect={setActiveModule}
              />
            </Fragment>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-[12px] text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="font-heading text-[18px] font-semibold text-[#0B2A4A]">{activeLabel}</h1>
            <p className="font-sans text-[12px] text-slate-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              IHL Team
            </span>
            <div className="w-8 h-8 rounded-full bg-[#0B2A4A] flex items-center justify-center">
              <span className="font-sans text-[11px] font-bold text-[#C6A15B]">MA</span>
            </div>
          </div>
        </header>

        {/* Module content */}
        <div className="flex-1 p-8">
          {activeModule === "market-pulse" && <DailyIntelligence />}
          {activeModule === "guidelines" && <GuidelinesIntel />}
          {activeModule === "income-analyzer" && <IncomeAnalyzer />}
          {activeModule !== "market-pulse" &&
            activeModule !== "guidelines" &&
            activeModule !== "income-analyzer" &&
            activeNavItem && (
            <ComingSoonPlaceholder label={activeNavItem.label} icon={activeNavItem.icon} />
          )}
        </div>
      </main>
      {!captureMode && <AlfredChat currentModule={activeModule} />}
    </div>
  );
}

function ComingSoonPlaceholder({ label, icon }: { label: string; icon: string }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0B2A4A]/5 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">{icon}</span>
        </div>
        <h3 className="font-heading text-[18px] font-semibold text-[#0B2A4A] mb-2">{label}</h3>
        <p className="font-sans text-[12px] text-[#C6A15B] font-semibold">Coming soon — building next</p>
      </div>
    </div>
  );
}

function IncomeAnalyzerPlaceholder() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#0B2A4A]/5 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📄</span>
        </div>
        <h3 className="font-heading text-[18px] font-semibold text-[#0B2A4A] mb-2">AI Income Analyzer</h3>
        <p className="font-sans text-[13px] text-slate-500 max-w-sm mx-auto">
          Upload paystubs, W2s, and tax returns. Claude analyzes them and produces a clean, 1003-ready
          qualifying income figure.
        </p>
        <p className="font-sans text-[12px] text-[#C6A15B] font-semibold mt-4">Building now — coming next</p>
      </div>
    </div>
  );
}
