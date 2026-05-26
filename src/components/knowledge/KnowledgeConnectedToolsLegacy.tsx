import { Link } from "react-router-dom";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

type Props = {
  t: (key: string) => string;
};

/** Original inline-link tool cross-sells (pre–Connected Tools v2). */
export function KnowledgeConnectedToolsLegacy({ t }: Props) {
  return (
    <>
      <motion.p
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mx-auto mb-10 max-w-2xl text-center text-[13px] leading-relaxed text-slate-600"
      >
        <span className="font-semibold text-navy">{t("knowledge.tools.intro")}</span>{" "}
        <Link to="/tools/true-cost-of-waiting" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
          {t("knowledge.tools.waitingLink")}
        </Link>{" "}
        {t("knowledge.tools.waitingDesc")}{" "}
        <Link to="/tools/buy-vs-rent" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
          {t("knowledge.tools.buyRentLink")}
        </Link>{" "}
        {t("knowledge.tools.buyRentDesc")}{" "}
        <Link to="/tools/conventional-vs-fha" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
          {t("knowledge.tools.fhaLink")}
        </Link>{" "}
        {t("knowledge.tools.fhaDesc")}
      </motion.p>

      <motion.p
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mx-auto mb-10 max-w-2xl text-center text-[13px] leading-relaxed text-slate-600"
      >
        <span className="font-semibold text-navy">{t("knowledge.tools.loanTypes")}</span>{" "}
        <Link to="/tools/conventional-vs-fha" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
          {t("knowledge.tools.fhaCalcLink")}
        </Link>{" "}
        {t("knowledge.tools.fhaCalcDesc")}
      </motion.p>

      <motion.p
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mx-auto mb-10 max-w-2xl text-center text-[13px] leading-relaxed text-slate-600"
      >
        <span className="font-semibold text-navy">{t("knowledge.tools.refiEquity")}</span>{" "}
        <Link to="/tools/principal-accelerator" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
          {t("knowledge.tools.acceleratorLink")}
        </Link>{" "}
        {t("knowledge.tools.acceleratorDesc")}{" "}
        <Link to="/tools/heloc-planner" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
          {t("knowledge.tools.helocLink")}
        </Link>{" "}
        {t("knowledge.tools.helocDesc")}
      </motion.p>

      <motion.p
        variants={fadeUp}
        initial="initial"
        animate="animate"
        className="mx-auto mb-10 max-w-2xl text-center text-[13px] leading-relaxed text-slate-600"
      >
        <span className="font-semibold text-navy">{t("knowledge.tools.reverse")}</span>{" "}
        <Link to="/tools/reverse-mortgage-planner" className="font-medium text-gold underline decoration-gold/40 hover:text-navy">
          {t("knowledge.tools.reverseLink")}
        </Link>{" "}
        {t("knowledge.tools.reverseDesc")}
      </motion.p>
    </>
  );
}
