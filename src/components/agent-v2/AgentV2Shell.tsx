import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAgentV2 } from "../../context/AgentV2Context";
import { getClientAgentModeOverride, isAgentV3DebugUiEnabled } from "../../lib/agent-v3/agentV3ClientDebug";
import { nextMissingSignalKey } from "../../lib/agent-v2/agentV2FlowEngine";
import type { QuickReplyTarget, RecapEditableField, WidgetRequest } from "../../lib/agent-v2/agentV2Types";
import type { MockSlot } from "../../lib/agent/mortgageAgentMockSlots";
import { AgentV2ConfirmationCard } from "./AgentV2ConfirmationCard";
import { AgentV2ContactCard } from "./AgentV2ContactCard";
import { AgentV2FallbackCard } from "./AgentV2FallbackCard";
import { AgentV2Header } from "./AgentV2Header";
import { AgentV2QuickReplies } from "./AgentV2QuickReplies";
import { AgentV2RecapCard } from "./AgentV2RecapCard";
import { AgentV2ScheduleCard, type ScheduleCardData } from "./AgentV2ScheduleCard";
import { AgentV2Transcript } from "./AgentV2Transcript";
import { AgentV2TypingRow } from "./AgentV2TypingRow";

const SCROLL_NEAR_BOTTOM_PX = 96;

function QuickReplyData(props: { widget: WidgetRequest; onSelect: (q: string, t: QuickReplyTarget) => void }) {
  const data = props.widget.data as { options: string[]; targetField: QuickReplyTarget };
  return (
    <AgentV2QuickReplies options={data.options} targetField={data.targetField} onSelect={props.onSelect} />
  );
}

function RecapData(props: {
  widget: WidgetRequest;
  onContinue: () => void;
  onEditField?: (field: RecapEditableField) => void;
}) {
  const data = props.widget.data as {
    lines: { label: string; value: string; field?: RecapEditableField }[];
  };
  return (
    <AgentV2RecapCard
      lines={data.lines}
      onContinue={props.onContinue}
      onEditField={props.onEditField}
    />
  );
}

function ConfirmationData(props: {
  widget: WidgetRequest;
  onDone: () => void;
}) {
  const data = props.widget.data as {
    slot?: string;
    contactPreference?: string;
    preferredContactTime?: string;
    schedulingTimezoneUsed?: string;
    subjectPropertyAddress?: string;
    subjectCity?: string;
    subjectState?: string;
    subjectZip?: string;
  };
  return (
    <AgentV2ConfirmationCard
      slotLabel={data.slot ?? "—"}
      contactPreference={data.contactPreference}
      preferredContactTime={data.preferredContactTime}
      schedulingTimezoneUsed={data.schedulingTimezoneUsed}
      subjectPropertyAddress={data.subjectPropertyAddress}
      subjectCity={data.subjectCity}
      subjectState={data.subjectState}
      subjectZip={data.subjectZip}
      onDone={props.onDone}
    />
  );
}

const USE_AGENT_V3 =
  import.meta.env.VITE_AGENT_V3_API === "1" || import.meta.env.VITE_AGENT_V3_API === "true";

export function AgentV2Shell() {
  const {
    state,
    agentV3Debug,
    sendQuickReply,
    sendUserMessage,
    dispatchOrchestratorAction,
    openV1Fallback,
    closeAgentV2,
  } = useAgentV2();
  const [draft, setDraft] = useState("");
  const [devPanelOpen, setDevPanelOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const [stickToBottom, setStickToBottom] = useState(true);

  const scrollToLatest = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      const nearBottom = scrollHeight - scrollTop - clientHeight < SCROLL_NEAR_BOTTOM_PX;
      setStickToBottom(nearBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollIfStuck = useCallback(() => {
    if (!stickToBottom) return;
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [stickToBottom]);

  useEffect(() => {
    scrollIfStuck();
  }, [state.transcript, state.activeWidget, state.isTyping, scrollIfStuck]);

  useEffect(() => {
    const inner = scrollContentRef.current;
    if (!inner) return;
    const ro = new ResizeObserver(() => scrollIfStuck());
    ro.observe(inner);
    return () => ro.disconnect();
  }, [scrollIfStuck]);

  const showComposer = useMemo(() => {
    const k = state.activeWidget?.kind;
    if (!k) return true;
    return k !== "contact_card" && k !== "schedule_card" && k !== "confirmation" && k !== "fallback" && k !== "recap";
  }, [state.activeWidget?.kind]);

  const composerAddressHint = useMemo(() => {
    if (!showComposer || state.stage !== "discovery") return null;
    const nk = nextMissingSignalKey(state.requiredSignalsCaptured, state.answers);
    if (nk === "subjectPropertyAddress") {
      return {
        placeholder: "123 Main St, Bethesda, MD 20814",
        helperText:
          "Full address is best, but area details are enough if you’re still narrowing it down.",
      };
    }
    if (nk === "subjectArea") {
      return {
        placeholder: "Bethesda, MD 20814",
        helperText: "City, state, and ZIP is enough for now if you don’t have a full address yet.",
      };
    }
    return null;
  }, [showComposer, state.stage, state.requiredSignalsCaptured, state.answers]);

  const onSend = useCallback(() => {
    const t = draft.trim();
    if (!t) return;
    sendUserMessage(t);
    setDraft("");
    setStickToBottom(true);
  }, [draft, sendUserMessage]);

  const sendQuickReplyAndStick = useCallback(
    (option: string, target: QuickReplyTarget) => {
      setStickToBottom(true);
      sendQuickReply(option, target);
    },
    [sendQuickReply],
  );

  const widget = state.activeWidget;

  const agentV3DebugUi = isAgentV3DebugUiEnabled();
  const showAgentV3DevUi = USE_AGENT_V3 && agentV3DebugUi;
  const showApiModeOffBanner = agentV3DebugUi && !USE_AGENT_V3;
  const liveModeRequestedButDeterministic =
    agentV3DebugUi &&
    USE_AGENT_V3 &&
    getClientAgentModeOverride() === "live" &&
    agentV3Debug?.mode === "agent_v3_deterministic";
  const devBadge =
    showAgentV3DevUi && agentV3Debug ? (
      <>
        <span className="inline-flex items-center rounded border border-amber-200/90 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-950">
          {agentV3Debug.mode === "agent_v3_live_llm" ? "Live LLM" : "Deterministic"}
        </span>
        {agentV3Debug.modelUsed ? (
          <span className="text-[10px] font-normal normal-case tracking-normal text-slate-500">
            · {agentV3Debug.modelUsed}
          </span>
        ) : null}
      </>
    ) : undefined;

  return (
    <div className="flex h-full max-h-[100dvh] flex-col overflow-hidden rounded-[4px] border border-slate-200/90 bg-[#fafbfc] shadow-[0_24px_80px_rgba(10,25,47,0.14)] sm:max-h-[min(92vh,880px)]">
      <AgentV2Header
        onClose={closeAgentV2}
        title="Strategy conversation"
        subtitle="A calm, structured way to outline your next step."
        devBadge={devBadge}
      />

      {showApiModeOffBanner ? (
        <div
          role="status"
          className="shrink-0 border-b border-amber-300/80 bg-amber-100/90 px-4 py-2 text-[11px] leading-snug text-amber-950 sm:px-6"
        >
          VITE_AGENT_V3_API is off — the UI does not call /api/agent-v3 (local mock orchestrator only). Enable
          VITE_AGENT_V3_API=1 to use the Agent V3 API client.
        </div>
      ) : null}
      {liveModeRequestedButDeterministic ? (
        <div
          role="status"
          className="shrink-0 border-b border-amber-300/80 bg-amber-100/90 px-4 py-2 text-[11px] leading-snug text-amber-950 sm:px-6"
        >
          Live mode requested, but deterministic mode is active:{" "}
          {agentV3Debug?.fallbackReason ?? "unknown"}
        </div>
      ) : null}

      <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-6">
        <div ref={scrollContentRef}>
          <AgentV2Transcript items={state.transcript} />
          {state.isTyping ? <AgentV2TypingRow /> : null}

          {widget ? (
            <div className="mt-6 space-y-6 pt-1">
            {widget.kind === "quick_replies" ? (
              <QuickReplyData widget={widget} onSelect={sendQuickReplyAndStick} />
            ) : null}
            {widget.kind === "recap" ? (
              <RecapData
                widget={widget}
                onContinue={() => {
                  setStickToBottom(true);
                  dispatchOrchestratorAction({ type: "recap_continue" });
                }}
                onEditField={(field) => {
                  setStickToBottom(true);
                  dispatchOrchestratorAction({ type: "edit_recap_field", field });
                }}
              />
            ) : null}
            {widget.kind === "contact_card" ? (
              <AgentV2ContactCard
                initial={state.answers}
                onPatch={(payload) =>
                  dispatchOrchestratorAction({ type: "contact_answers_patch", payload })
                }
                onSubmit={(payload) => {
                  setStickToBottom(true);
                  dispatchOrchestratorAction({ type: "contact_submit", payload });
                }}
              />
            ) : null}
            {widget.kind === "schedule_card" ? (
              <AgentV2ScheduleCard
                data={widget.data as ScheduleCardData | undefined}
                onSelect={(slot: MockSlot) => {
                  setStickToBottom(true);
                  dispatchOrchestratorAction({ type: "schedule_select", slot: slot.label });
                }}
              />
            ) : null}
            {widget.kind === "confirmation" ? <ConfirmationData widget={widget} onDone={closeAgentV2} /> : null}
            {widget.kind === "fallback" ? <AgentV2FallbackCard onContinue={openV1Fallback} /> : null}
            </div>
          ) : null}
          <div ref={bottomSentinelRef} className="h-px w-full shrink-0" aria-hidden />
        </div>
      </div>

      {!stickToBottom ? (
        <div className="flex justify-center border-t border-slate-200/60 bg-[#fafbfc]/95 py-1.5">
          <button
            type="button"
            onClick={() => {
              setStickToBottom(true);
              requestAnimationFrame(() => scrollToLatest("smooth"));
            }}
            className="rounded-full border border-slate-200/90 bg-white px-3 py-1.5 text-[12px] font-medium text-navy shadow-sm hover:bg-slate-50"
          >
            Jump to latest
          </button>
        </div>
      ) : null}

      {showAgentV3DevUi ? (
        <div className="shrink-0 border-t border-amber-200/50 bg-amber-50/40 px-4 py-2 sm:px-6">
          <button
            type="button"
            onClick={() => setDevPanelOpen((o) => !o)}
            className="text-[11px] font-medium text-amber-950/90 underline-offset-2 hover:underline"
          >
            {devPanelOpen ? "Hide" : "Show"} dev instrumentation
          </button>
          {devPanelOpen ? (
            <dl className="mt-2 space-y-1 font-mono text-[10px] leading-relaxed text-slate-700">
              <div>
                <dt className="inline text-slate-500">mode:</dt>{" "}
                <dd className="inline">{agentV3Debug?.mode ?? "(no payload yet)"}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">model:</dt>{" "}
                <dd className="inline">{agentV3Debug?.modelUsed ?? "—"}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">responseId:</dt>{" "}
                <dd className="inline break-all">{agentV3Debug?.responseId ?? "—"}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">tools:</dt>{" "}
                <dd className="inline">{(agentV3Debug?.toolCallsExecuted ?? []).join(", ") || "—"}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">stage:</dt> <dd className="inline">{state.stage}</dd>
              </div>
              <div>
                <dt className="inline text-slate-500">fallbackReason:</dt>{" "}
                <dd className="inline">{agentV3Debug?.fallbackReason ?? "—"}</dd>
              </div>
            </dl>
          ) : null}
        </div>
      ) : null}

      {showComposer ? (
        <footer className="shrink-0 border-t border-slate-200/80 bg-white/95 px-4 py-4 sm:px-6">
          <label htmlFor="agent-v2-input" className="sr-only">
            Your message
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <textarea
                id="agent-v2-input"
                rows={2}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend();
                  }
                }}
                placeholder={
                  composerAddressHint?.placeholder ??
                  "Ask a brief question, or share a detail in your own words."
                }
                className="type-input min-h-[3.25rem] w-full resize-none text-[15px] leading-relaxed"
              />
              {composerAddressHint?.helperText ? (
                <p className="text-[12px] leading-snug text-slate-500">{composerAddressHint.helperText}</p>
              ) : null}
            </div>
            <button type="button" onClick={onSend} className="btn-secondary shrink-0 px-6 py-3.5 sm:self-stretch">
              Send
            </button>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
