import { motion, useReducedMotion } from "motion/react";
import type { TranscriptItem, WidgetKind } from "../../lib/agent-v2/agentV2Types";
import { AgentV2Message } from "./AgentV2Message";

function widgetSnapshotLabel(widgetType: WidgetKind, data: unknown): string {
  if (widgetType === "quick_replies" && data && typeof data === "object" && "options" in data) {
    const opts = (data as { options: string[] }).options;
    return opts?.length ? `Options · ${opts.slice(0, 4).join(" · ")}${opts.length > 4 ? "…" : ""}` : "Quick options";
  }
  if (widgetType === "recap") return "Summary";
  if (widgetType === "contact_card") return "Contact details";
  if (widgetType === "schedule_card") return "Schedule";
  if (widgetType === "confirmation") return "Confirmation";
  if (widgetType === "fallback") return "Guided format";
  return "Next step";
}

export function AgentV2Transcript({ items }: { items: TranscriptItem[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-5">
      {items.map((item, i) => {
        if (item.kind === "message") {
          const body = (
            <AgentV2Message role={item.role === "user" ? "user" : "assistant"}>{item.text}</AgentV2Message>
          );
          if (reduceMotion || item.role === "user") {
            return (
              <div key={item.id} className="max-w-full">
                {body}
              </div>
            );
          }
          return (
            <motion.div
              key={item.id}
              className="max-w-full"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.34, delay: Math.min(i, 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              {body}
            </motion.div>
          );
        }
        if (item.kind === "widget") {
          return (
            <motion.div
              key={item.id}
              className="rounded-[4px] border border-dashed border-slate-200/90 bg-white/60 px-3 py-2.5 text-[12px] leading-snug text-slate-500"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.28 }}
            >
              <span className="font-medium text-slate-600">{widgetSnapshotLabel(item.widgetType, item.data)}</span>
            </motion.div>
          );
        }
        return null;
      })}
    </div>
  );
}
