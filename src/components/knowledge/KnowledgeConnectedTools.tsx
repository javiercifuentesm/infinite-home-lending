import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const PANEL_CLASS =
  "flex flex-col rounded-[10px] border-t-2 border-[#C9A84C] bg-[#1B2A4A] p-4 transition-colors duration-300 hover:bg-[#243560]";

const PANEL_COL_WIDTH =
  "w-full md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]";

function stripTrailingColon(label: string): string {
  return label.replace(/:\s*$/, "");
}

function GoldPillLink({
  to,
  label,
  className = "",
  arrowSize = 10,
}: {
  to: string;
  label: string;
  className?: string;
  arrowSize?: number;
}) {
  return (
    <Link
      to={to}
      className={`inline-flex w-fit items-center gap-1.5 rounded-[20px] bg-[#C9A84C] font-medium text-[#1B2A4A] transition-opacity hover:opacity-90 ${className}`.trim()}
    >
      {label}
      <ArrowRight size={arrowSize} strokeWidth={2.5} aria-hidden="true" />
    </Link>
  );
}

function ToolRow({
  to,
  titleKey,
  descKey,
  t,
}: {
  to: string;
  titleKey: string;
  descKey: string;
  t: (key: string) => string;
}) {
  return (
    <div className="border-b border-white/10 py-2.5 first:pt-0 last:border-0 last:pb-0">
      <Link
        to={to}
        className="text-[11px] font-medium text-[#C9A84C] transition-colors hover:text-white"
      >
        {t(titleKey)}
      </Link>
      <p className="mt-0.5 text-[10px] leading-[1.6] text-[rgba(255,255,255,0.55)]">{t(descKey)}</p>
    </div>
  );
}

function CategoryPanel({
  titleKey,
  t,
  children,
  className = "",
}: {
  titleKey: string;
  t: (key: string) => string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article className={`${PANEL_CLASS} ${className}`.trim()}>
      <h3 className="mb-3 text-[12px] font-medium text-white">{stripTrailingColon(t(titleKey))}</h3>
      <div className="flex-1">{children}</div>
      <GoldPillLink
        to="/smart-tools"
        label={t("knowledge.tools.exploreTools")}
        className="mt-4 px-3 py-1 text-[9px]"
      />
    </article>
  );
}

type Props = {
  t: (key: string) => string;
};

/** Flagship connected-tools bridge — pairs Knowledge reading paths with Smart Tools. */
export function KnowledgeConnectedTools({ t }: Props) {
  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="mx-auto mb-12 lg:mb-14 max-w-6xl"
    >
      <motion.div variants={fadeUp} className="mb-8 text-center">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          {t("knowledge.tools.sectionLabel")}
        </p>
        <p className="mx-auto max-w-2xl text-[15px] leading-relaxed text-slate-600">
          {t("knowledge.tools.sectionSubline")}
        </p>
      </motion.div>

      <motion.article
        variants={fadeUp}
        className="mb-5 flex flex-col gap-6 rounded-[12px] border-t-2 border-[#C9A84C] bg-[#1B2A4A] p-6 transition-colors duration-300 hover:bg-[#243560] sm:flex-row sm:items-center sm:gap-8"
      >
        <div className="flex shrink-0 items-center justify-center sm:w-[88px]">
          <Clock className="h-14 w-14 text-[#C9A84C] sm:h-16 sm:w-16" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="mb-3 inline-flex w-fit rounded-full border border-[#C9A84C]/35 bg-[#C9A84C]/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#C9A84C]">
            {t("smartTools.mostUsed")}
          </span>
          <h2 className="text-[15px] font-medium text-white">{t("tool.trueCostOfWaiting.name")}</h2>
          <p className="mt-2 max-w-2xl text-[11px] leading-[1.6] text-white/60">
            {t("tool.trueCostOfWaiting.desc")}
          </p>
          <GoldPillLink
            to="/tools/true-cost-of-waiting"
            label={t("smartTools.launchTool")}
            className="mt-5 px-[14px] py-[6px] text-[11px]"
            arrowSize={12}
          />
        </div>
      </motion.article>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
        <motion.div variants={fadeUp} className="min-h-0">
          <CategoryPanel titleKey="knowledge.tools.intro" t={t} className="h-full">
            <ToolRow
              to="/tools/true-cost-of-waiting"
              titleKey="knowledge.tools.waitingLink"
              descKey="knowledge.tools.waitingDesc"
              t={t}
            />
            <ToolRow
              to="/tools/buy-vs-rent"
              titleKey="knowledge.tools.buyRentLink"
              descKey="knowledge.tools.buyRentDesc"
              t={t}
            />
            <ToolRow
              to="/tools/conventional-vs-fha"
              titleKey="knowledge.tools.fhaLink"
              descKey="knowledge.tools.fhaDesc"
              t={t}
            />
          </CategoryPanel>
        </motion.div>

        <motion.div variants={fadeUp} className="min-h-0">
          <CategoryPanel titleKey="knowledge.tools.loanTypes" t={t} className="h-full">
            <ToolRow
              to="/tools/conventional-vs-fha"
              titleKey="knowledge.tools.fhaCalcLink"
              descKey="knowledge.tools.fhaCalcDesc"
              t={t}
            />
          </CategoryPanel>
        </motion.div>

        <motion.div variants={fadeUp} className="min-h-0 md:col-span-2 lg:col-span-1">
          <CategoryPanel titleKey="knowledge.tools.refiEquity" t={t} className="h-full">
            <ToolRow
              to="/tools/principal-accelerator"
              titleKey="knowledge.tools.acceleratorLink"
              descKey="knowledge.tools.acceleratorDesc"
              t={t}
            />
            <ToolRow
              to="/tools/heloc-planner"
              titleKey="knowledge.tools.helocLink"
              descKey="knowledge.tools.helocDesc"
              t={t}
            />
          </CategoryPanel>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="col-span-1 flex flex-wrap items-stretch justify-center md:col-span-2 lg:col-span-3"
        >
          <article className={`${PANEL_CLASS} ${PANEL_COL_WIDTH}`}>
            <h3 className="mb-3 text-[12px] font-medium text-white">
              {stripTrailingColon(t("knowledge.tools.reverse"))}
            </h3>
            <ToolRow
              to="/tools/reverse-mortgage-planner"
              titleKey="knowledge.tools.reverseLink"
              descKey="knowledge.tools.reverseDesc"
              t={t}
            />
            <GoldPillLink
              to="/tools/reverse-mortgage-planner"
              label={t("smartTools.launchTool")}
              className="mt-4 px-3 py-1 text-[9px]"
            />
          </article>
        </motion.div>
      </div>
    </motion.div>
  );
}
