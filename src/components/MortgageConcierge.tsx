import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const IHL_THINKING_STYLE_ID = "ihl-thinking-animations";
import { jsPDF } from "jspdf";
import { useConversation, useRawConversation } from "@elevenlabs/react";
import { sendLeadEmail } from "../api/sendLead";

const AGENT_ID = "agent_3401kpnqkz31f85a1efq42k7fn9e";

const PDF_ASSISTANT_LABEL = "Luna — IHL Mortgage Concierge";

function MortgageConciergeInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<
    { role: "user" | "assistant"; text: string; time: string; eventId?: number }[]
  >([]);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone: "",
    bestDay: "",
    bestTime: "",
    preferredContact: "",
  });
  const leadDataRef = useRef(leadData);
  leadDataRef.current = leadData;
  const [isThinking, setIsThinking] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [showLeadFormRecovery, setShowLeadFormRecovery] = useState(false);
  /** Lead capture form visible — silence reminder / automated agent pings suppressed while true */
  const [isFormOpen, setIsFormOpen] = useState(false);

  const coolingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFormOpenRef = useRef(false);
  const leadSubmittedRef = useRef(false);
  const setMicMutedRef = useRef<((muted: boolean) => void) | null>(null);
  const sendContextualUpdateRef = useRef<((text: string) => void) | null>(null);
  const statusRef = useRef<"disconnected" | "connecting" | "connected" | "disconnecting">("disconnected");
  const silenceReminderRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const captureLeadAttemptsRef = useRef(0);
  const captureLeadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerLeadFormRef = useRef<(() => void) | null>(null);
  const leadFormAnchorRef = useRef<HTMLDivElement | null>(null);
  const agentSpokenForThinkingRef = useRef(false);
  const prevIsSpeakingForThinkingRef = useRef(false);

  const stopSilenceReminder = useCallback(() => {
    if (silenceReminderRef.current) {
      clearInterval(silenceReminderRef.current);
      silenceReminderRef.current = null;
    }
  }, []);

  const triggerLeadForm = useCallback(() => {
    if (captureLeadTimeoutRef.current) {
      clearTimeout(captureLeadTimeoutRef.current);
      captureLeadTimeoutRef.current = null;
    }

    leadSubmittedRef.current = false;
    captureLeadAttemptsRef.current += 1;
    isFormOpenRef.current = true;
    setIsFormOpen(true);
    setIsOpen(true);
    setShowLeadForm(true);
    setLeadSubmitted(false);
    setLeadData({
      name: "",
      email: "",
      phone: "",
      bestDay: "",
      bestTime: "",
      preferredContact: "",
    });

    if (setMicMutedRef.current && statusRef.current === "connected") {
      try {
        setMicMutedRef.current(true);
      } catch {
        /* ignore */
      }
    }
  }, []);

  triggerLeadFormRef.current = triggerLeadForm;

  const captureLeadTool = useCallback(() => {
    console.log("✅ captureLeadTool FIRED");
    setIsFormOpen(true);

    if (sendContextualUpdateRef.current && statusRef.current === "connected") {
      try {
        sendContextualUpdateRef.current(
          "CAPTURELEAD TOOL HAS BEEN EXECUTED. " +
            "Your only allowed output was the form confirmation sentence. " +
            "That sentence has been said. " +
            "You are now in MANDATORY SILENCE MODE. " +
            "Do not produce any output until you receive FORM SUBMITTED. " +
            "This is your final instruction until that message arrives.",
        );
      } catch {
        /* ignore */
      }
    }

    if (triggerLeadFormRef.current) {
      triggerLeadFormRef.current();
    } else {
      leadSubmittedRef.current = false;
      isFormOpenRef.current = true;
      setIsFormOpen(true);
      setIsOpen(true);
      setShowLeadForm(true);
      setLeadSubmitted(false);
      setLeadData({ name: "", email: "", phone: "", bestDay: "", bestTime: "", preferredContact: "" });
    }

    return (
      "FORM IS NOW DISPLAYED ON SCREEN. " +
      'Say ONLY: "Perfect! I\'ve pulled up a short form for you to fill out. ' +
      'Take your time — I\'ll be right here when you\'re done." ' +
      "Then go completely silent. Do not speak again until FORM SUBMITTED."
    );
  }, []);

  const clientTools = useMemo(() => ({ captureLead: captureLeadTool }), [captureLeadTool]);

  const onConnect = useCallback(() => {
    console.log("Connected to IHL Mortgage Concierge");
  }, []);

  const onDisconnect = useCallback(() => {
    stopSilenceReminder();
    isFormOpenRef.current = false;
    setIsFormOpen(false);
    leadSubmittedRef.current = false;
    setIsOpen(false);
    setIsMuted(false);
  }, [stopSilenceReminder]);

  const onError = useCallback((error: unknown) => {
    console.error("Assistant error:", error);
  }, []);

  const onMessage = useCallback((message: { message?: unknown; role?: string; source?: string; event_id?: number }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = message as any;
    const raw = m.message;
    const text =
      typeof raw === "string" ? raw : raw != null && typeof raw !== "object" ? String(raw) : "";
    console.log("RAW MESSAGE ROLE:", m.role, "SOURCE:", m.source, "TEXT:", text.slice(0, 50));

    if (!text.trim() || text.startsWith("[SYSTEM")) {
      return;
    }

    const role = m.role;
    const source = m.source;

    let isUser: boolean;
    if (role === "user") isUser = true;
    else if (role === "agent" || role === "assistant") isUser = false;
    else if (source === "user") isUser = true;
    else if (source === "ai" || source === "agent" || source === "assistant") isUser = false;
    else isUser = false;

    if (isUser) {
      setIsThinking(true);
    }

    setTranscript((prev) => {
      const last = prev[prev.length - 1];
      if (
        last &&
        last.text === text &&
        last.role === (isUser ? "user" : "assistant")
      ) {
        return prev;
      }

      const recentDuplicate = prev.slice(-3).some((t) => t.text === text);
      if (recentDuplicate) return prev;

      return [
        ...prev,
        {
          role: isUser ? "user" : "assistant",
          text,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ];
    });
  }, []);

  const conversationHookOptions = useMemo(
    () => ({
      agentId: AGENT_ID,
      clientTools,
      onConnect,
      onDisconnect,
      onError,
      onMessage,
    }),
    [clientTools, onConnect, onDisconnect, onError, onMessage],
  );

  useEffect(() => {
    const w = window as unknown as { __ihlThinkingStyleRef?: number };
    w.__ihlThinkingStyleRef = (w.__ihlThinkingStyleRef ?? 0) + 1;
    if (!document.getElementById(IHL_THINKING_STYLE_ID)) {
      const style = document.createElement("style");
      style.id = IHL_THINKING_STYLE_ID;
      style.textContent = `
  @keyframes ihlBreathe {
    0%, 100% {
      transform: scale(1) translateY(0px);
      box-shadow:
        0 8px 24px rgba(198, 161, 91, 0.2),
        0 0 20px rgba(198, 161, 91, 0.1),
        inset 0 -6px 16px rgba(0,0,0,0.6),
        inset 0 6px 12px rgba(198,161,91,0.15);
    }
    50% {
      transform: scale(1.16) translateY(0px);
      box-shadow:
        0 0 0 18px rgba(198, 161, 91, 0),
        0 0 36px rgba(198, 161, 91, 0.5),
        inset 0 -6px 16px rgba(0,0,0,0.6),
        inset 0 6px 12px rgba(198,161,91,0.15);
    }
  }

  @keyframes ihlFloat {
    0%, 100% {
      transform: scale(1) translateY(0px);
      box-shadow:
        0 8px 24px rgba(198, 161, 91, 0.2),
        0 0 20px rgba(198, 161, 91, 0.1),
        inset 0 -6px 16px rgba(0,0,0,0.6),
        inset 0 6px 12px rgba(198,161,91,0.15);
    }
    50% {
      transform: scale(1) translateY(-7px);
      box-shadow:
        0 18px 36px rgba(198, 161, 91, 0.22),
        0 0 28px rgba(198, 161, 91, 0.15),
        inset 0 -6px 16px rgba(0,0,0,0.6),
        inset 0 6px 12px rgba(198,161,91,0.15);
    }
  }

  @keyframes ihlFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
      document.head.appendChild(style);
    }
    return () => {
      w.__ihlThinkingStyleRef = Math.max(0, (w.__ihlThinkingStyleRef ?? 1) - 1);
      if (w.__ihlThinkingStyleRef === 0) {
        document.getElementById(IHL_THINKING_STYLE_ID)?.remove();
      }
    };
  }, []);

  const { startSession, endSession, sendContextualUpdate, sendUserActivity, setVolume, setMuted: setMicMuted, status, isSpeaking } =
    useConversation(conversationHookOptions);

  console.log("[MortgageConcierge] useConversation status:", status, "session reinit check");

  const rawConversation = useRawConversation();

  setMicMutedRef.current = setMicMuted;
  sendContextualUpdateRef.current = sendContextualUpdate;
  statusRef.current = status;

  const endSessionRef = useRef(endSession);
  endSessionRef.current = endSession;

  useEffect(() => {
    return () => {
      try {
        endSessionRef.current();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const isSpeakingRef = useRef(false);
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  const downloadPDF = useCallback(() => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = 20;

    doc.setFillColor(11, 42, 74);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(198, 161, 91);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Infinite Home Lending", margin, 18);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Mortgage Conversation Transcript", margin, 28);
    doc.setTextColor(255, 255, 255);
    doc.text(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      margin,
      36,
    );

    y = 55;

    transcript.forEach((entry) => {
      const isUser = entry.role === "user";
      const label = isUser ? "You" : PDF_ASSISTANT_LABEL;
      const labelColor: [number, number, number] = isUser ? [46, 46, 46] : [11, 42, 74];

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...labelColor);
      doc.text(`${label}  ${entry.time}`, margin, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(46, 46, 46);
      const lines = doc.splitTextToSize(entry.text, maxWidth);
      lines.forEach((line) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 6;
      });

      y += 4;
    });

    doc.setFillColor(11, 42, 74);
    doc.rect(0, 282, pageWidth, 15, "F");
    doc.setTextColor(198, 161, 91);
    doc.setFontSize(8);
    doc.text(
      "Infinite Home Lending · Maryland · DC · Virginia · infinitehomelending.com",
      margin,
      290,
    );

    doc.save(`IHL-Conversation-${Date.now()}.pdf`);
  }, [transcript]);

  const scoreLead = () => {
    let score = 0;
    const transcriptText = transcript
      .map((t) => t.text.toLowerCase())
      .join(" ");

    if (
      transcriptText.includes("next few months") ||
      transcriptText.includes("ready") ||
      transcriptText.includes("soon") ||
      transcriptText.includes("spring") ||
      transcriptText.includes("summer") ||
      transcriptText.includes("this year")
    ) {
      score += 3;
    } else if (
      transcriptText.includes("planning") ||
      transcriptText.includes("early stage") ||
      transcriptText.includes("just started")
    ) {
      score += 1;
    }

    if (
      transcriptText.includes("working with") ||
      transcriptText.includes("have an agent") ||
      transcriptText.includes("my agent")
    ) {
      score += 2;
    }

    if (
      transcriptText.includes("credit score") ||
      transcriptText.includes("pulled my credit") ||
      transcriptText.includes("checked my credit")
    ) {
      score += 2;
    }

    if (
      transcriptText.includes("budget") ||
      transcriptText.includes("price range") ||
      transcriptText.includes("afford") ||
      transcriptText.includes("looking at homes")
    ) {
      score += 2;
    }

    if (
      transcriptText.includes("first time") ||
      transcriptText.includes("first home") ||
      transcriptText.includes("never bought")
    ) {
      score += 1;
    }

    if (
      transcriptText.includes("purchase") ||
      transcriptText.includes("buy") ||
      transcriptText.includes("buying")
    ) {
      score += 1;
    }

    if (transcript.length >= 6) {
      score += 2;
    }

    if (score >= 8) {
      return {
        grade: "HOT",
        emoji: "🔥",
        color: "#DC2626",
        bg: "#FEF2F2",
        priority: "HIGH PRIORITY — Contact within 2 hours",
      };
    }
    if (score >= 4) {
      return {
        grade: "WARM",
        emoji: "🌡️",
        color: "#D97706",
        bg: "#FFFBEB",
        priority: "WARM LEAD — Contact within 24 hours",
      };
    }
    return {
      grade: "NEUTRAL",
      emoji: "🤍",
      color: "#6B7280",
      bg: "#F9FAFB",
      priority: "NURTURE — Add to follow-up sequence",
    };
  };

  const handleLeadSubmit = async () => {
    console.log("handleLeadSubmit called — leadData:", JSON.stringify(leadData));
    console.log("leadSubmittedRef.current:", leadSubmittedRef.current);

    if (
      !leadData.name.trim() ||
      !leadData.email.trim() ||
      !leadData.phone.trim() ||
      !leadData.preferredContact
    ) {
      console.log("Guard failed — missing fields:", {
        name: !!leadData.name.trim(),
        email: !!leadData.email.trim(),
        phone: !!leadData.phone.trim(),
        preferredContact: !!leadData.preferredContact,
      });
      return;
    }
    if (leadSubmittedRef.current) {
      console.log("Guard failed — already submitted");
      return;
    }

    stopSilenceReminder();

    const lead = scoreLead();
    const transcriptSummary = transcript
      .map((t) => `${t.role === "user" ? "Visitor" : "Luna"} (${t.time}): ${t.text}`)
      .join("\n");

    try {
      await sendLeadEmail({
        lead_name: leadData.name,
        lead_email: leadData.email,
        lead_phone: leadData.phone,
        best_day: leadData.bestDay || "Not specified",
        best_time: leadData.bestTime || "Not specified",
        preferred_contact: leadData.preferredContact,
        lead_grade: lead.grade,
        lead_emoji: lead.emoji,
        lead_color: lead.color,
        lead_bg: lead.bg,
        lead_priority: lead.priority,
        date: new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        transcript: transcriptSummary,
      });
    } catch (error) {
      console.error("Failed to send lead email:", error);
      return;
    }

    const nameSnap = leadData.name.trim();
    const preferredSnap = leadData.preferredContact.trim();
    const daySnap = leadData.bestDay;
    const timeSnap = leadData.bestTime;

    if (!nameSnap || !preferredSnap) {
      return;
    }

    isFormOpenRef.current = false;
    setIsFormOpen(false);
    leadSubmittedRef.current = true;
    setLeadSubmitted(true);
    setShowLeadForm(false);

    if (statusRef.current === "connected" && !isSpeakingRef.current) {
      try {
        setMicMuted(false);
      } catch {
        /* ignore */
      }
    }

    if (statusRef.current === "connected") {
      try {
        sendContextualUpdate(
          `FORM SUBMITTED. The visitor ${nameSnap} has just clicked Connect Me and submitted their contact form. ` +
            `Their name is ${nameSnap}. ` +
            `They prefer to be contacted by ${preferredSnap}` +
            `${daySnap && daySnap !== "Not specified" ? ` on ${daySnap}` : ""}` +
            `${timeSnap && timeSnap !== "Not specified" ? ` during ${timeSnap}` : ""}. ` +
            `Please immediately thank ${nameSnap} warmly by their first name, confirm an IHL advisor will reach out on their preferred day and time via ${preferredSnap}, and wish them well on their homebuying journey.`,
        );
      } catch {
        /* ignore */
      }
    }
  };

  const handleOpen = useCallback(() => {
    if (captureLeadTimeoutRef.current) {
      clearTimeout(captureLeadTimeoutRef.current);
      captureLeadTimeoutRef.current = null;
    }
    captureLeadAttemptsRef.current = 0;
    setShowLeadFormRecovery(false);
    stopSilenceReminder();
    agentSpokenForThinkingRef.current = false;
    prevIsSpeakingForThinkingRef.current = false;
    setIsThinking(false);
    setTranscript([]);
    setShowLeadForm(false);
    setLeadSubmitted(false);
    setLeadData({ name: "", email: "", phone: "", bestDay: "", bestTime: "", preferredContact: "" });
    isFormOpenRef.current = false;
    setIsFormOpen(false);
    leadSubmittedRef.current = false;
    setIsCoolingDown(false);
    setIsOpen(true);
    startSession({ agentId: AGENT_ID, connectionType: "websocket" });
  }, [startSession, stopSilenceReminder]);

  const handleClose = useCallback(() => {
    endSession();
    setIsOpen(false);
  }, [endSession]);

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  useLayoutEffect(() => {
    if (!showLeadForm || leadSubmitted) return;
    leadFormAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showLeadForm, leadSubmitted]);

  useEffect(() => {
    if (!showLeadForm) return;

    const verifyTimer = setTimeout(() => {
      if (isFormOpenRef.current && !leadSubmittedRef.current) {
        if (!document.getElementById("ihl-lead-form") && captureLeadAttemptsRef.current < 3) {
          const d = leadDataRef.current;
          const hasUserInput =
            (d.name && d.name.trim() !== "") ||
            (d.email && d.email.trim() !== "") ||
            (d.phone && d.phone.trim() !== "") ||
            !!d.bestDay ||
            !!d.bestTime ||
            !!d.preferredContact;
          if (hasUserInput) {
            console.log(
              "Form verify: ihl-lead-form not found but user has entered data — skip triggerLeadForm retry (avoids wiping form)",
            );
            return;
          }
          console.log("Form may not have rendered — retrying...");
          triggerLeadForm();
        }
      }
    }, 2000);

    return () => clearTimeout(verifyTimer);
  }, [showLeadForm, triggerLeadForm]);

  useEffect(() => {
    const handleVisibility = () => {
      if (
        document.visibilityState === "visible" &&
        isFormOpenRef.current &&
        !leadSubmittedRef.current &&
        !showLeadForm
      ) {
        setShowLeadForm(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [showLeadForm]);

  useEffect(() => {
    if (!isConnected || leadSubmitted) {
      setShowLeadFormRecovery(false);
      return;
    }
    if (showLeadForm) {
      setShowLeadFormRecovery(false);
      return;
    }
    if (!isFormOpenRef.current) {
      setShowLeadFormRecovery(false);
      return;
    }
    const t = setTimeout(() => {
      if (isFormOpenRef.current && !showLeadForm) {
        setShowLeadFormRecovery(true);
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [isConnected, leadSubmitted, showLeadForm]);

  useEffect(() => {
    if (!isSpeaking && !isThinking && isConnected) {
      setIsCoolingDown(true);
      if (coolingTimeoutRef.current) clearTimeout(coolingTimeoutRef.current);
      coolingTimeoutRef.current = setTimeout(() => {
        setIsCoolingDown(false);
      }, 1200);
    } else {
      if (coolingTimeoutRef.current) clearTimeout(coolingTimeoutRef.current);
      setIsCoolingDown(false);
    }
    return () => {
      if (coolingTimeoutRef.current) clearTimeout(coolingTimeoutRef.current);
    };
  }, [isSpeaking, isThinking, isConnected]);

  useEffect(() => {
    if (isSpeaking) {
      agentSpokenForThinkingRef.current = true;
      setIsThinking(false);
    } else if (
      prevIsSpeakingForThinkingRef.current &&
      isConnected &&
      status === "connected" &&
      agentSpokenForThinkingRef.current
    ) {
      setIsThinking(true);
      const gapTimer = setTimeout(() => {
        setIsThinking(false);
      }, 800);
      prevIsSpeakingForThinkingRef.current = isSpeaking;
      return () => clearTimeout(gapTimer);
    }
    prevIsSpeakingForThinkingRef.current = isSpeaking;
  }, [isSpeaking, isConnected, status]);

  useEffect(() => {
    if (status !== "connected") {
      setIsThinking(false);
      agentSpokenForThinkingRef.current = false;
      prevIsSpeakingForThinkingRef.current = false;
    }
  }, [status]);

  useEffect(() => {
    if (!isConnected) {
      setIsMuted(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (status !== "connected") return;
    if (isFormOpenRef.current) return;
    try {
      if (isSpeaking) {
        setMicMuted(true);
        // Luna is speaking — only explicit Stop button should end her turn; mic stays muted
      } else {
        setMicMuted(false);
      }
    } catch {
      // ignore
    }
  }, [isSpeaking, status, setMicMuted]);

  useEffect(() => {
    return () => {
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
        thinkingTimeoutRef.current = null;
      }
      if (coolingTimeoutRef.current) clearTimeout(coolingTimeoutRef.current);
      if (captureLeadTimeoutRef.current) clearTimeout(captureLeadTimeoutRef.current);
      stopSilenceReminder();
    };
  }, [stopSilenceReminder]);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          <style>{`
            @keyframes ihlRingExpand {
              0% { transform: scale(0.85); opacity: 0.5; }
              100% { transform: scale(1.55); opacity: 0; }
            }
            @keyframes ihlOrbPulse {
              0%, 100% { box-shadow: 0 0 24px rgba(198,161,91,0.3); }
              50% { box-shadow: 0 0 48px rgba(198,161,91,0.6); }
            }
            @keyframes ihlBtnFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-6px); }
            }
            .ihl-ring { position: absolute; border-radius: 50%; border: 2px solid rgba(198,161,91,0.55); animation: ihlRingExpand 2.8s ease-out infinite; pointer-events: none; z-index: 49; }
          `}</style>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', animation: 'ihlBtnFloat 3.5s ease-in-out infinite' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="ihl-ring" style={{ width: '80px', height: '80px', animationDelay: '0s' }} />
              <div className="ihl-ring" style={{ width: '80px', height: '80px', animationDelay: '0.8s' }} />
              <div className="ihl-ring" style={{ width: '80px', height: '80px', animationDelay: '1.6s' }} />
              <div style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 28%, rgba(255,240,190,0.95) 0%, rgba(198,161,91,0.9) 15%, rgba(15,55,100,0.95) 38%, rgba(5,25,55,0.98) 65%, rgba(2,8,22,1) 100%)',
                border: '3px solid rgba(198,161,91,0.95)',
                animation: 'ihlOrbPulse 2.5s ease-in-out infinite',
                boxShadow: '0 0 0 4px rgba(11,42,74,0.4), 0 8px 32px rgba(0,0,0,0.5)',
                position: 'relative', zIndex: 2,
              }} />
            </div>
            <span style={{ color: '#C6A15B', fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px', whiteSpace: 'nowrap', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              Ask Luna
            </span>
          </div>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ backgroundColor: "#0B2A4A", maxHeight: "720px" }}
          role="dialog"
          aria-label="IHL Mortgage Concierge"
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: "#C6A15B33" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: isConnected ? "#22c55e" : isConnecting ? "#C6A15B" : "#6b7280",
                }}
              />
              <span className="text-sm font-semibold" style={{ color: "#C6A15B" }}>
                IHL Mortgage Concierge
              </span>
            </div>
            <div className="flex items-center">
              {transcript.length > 0 && (
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="text-xs opacity-60 hover:opacity-100 transition-opacity mr-2"
                  style={{ color: "#C6A15B" }}
                  title="Download conversation as PDF"
                >
                  ↓ Save
                </button>
              )}
              {isConnected && (
                <button
                  type="button"
                  onClick={() => {
                    const next = !isMuted;
                    setIsMuted(next);
                    setVolume({ volume: next ? 0 : 1 });
                  }}
                  className="text-xs opacity-60 hover:opacity-100 transition-opacity mr-2"
                  style={{ color: "#F7F7F5" }}
                  title={isMuted ? "Unmute Luna" : "Mute Luna"}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="text-xs opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: "#F7F7F5" }}
              >
                ✕ End
              </button>
            </div>
          </div>

          <div
            className="relative flex flex-col items-center justify-center pt-5 pb-3"
            style={{ flexShrink: 0 }}
          >
            <div
              style={{
                position: "relative",
                width: "64px",
                height: "64px",
                flexShrink: 0,
              }}
            >
              {(isThinking || isSpeaking) && isConnected && (
                <div
                  style={{
                    position: "absolute",
                    inset: "-6px",
                    borderRadius: "50%",
                    background: "radial-gradient(circle, rgba(198,161,91,0.15) 0%, transparent 70%)",
                    animation: "ihlBreathe 2s ease-in-out infinite",
                    pointerEvents: "none",
                  }}
                />
              )}

              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 30% 28%,
      rgba(255, 240, 190, 0.95) 0%,
      rgba(198, 161, 91, 0.8)  15%,
      rgba(15,  55,  100, 0.9) 38%,
      rgba(5,   25,  55,  0.97) 65%,
      rgba(2,   8,   22,  1)   100%
    )`,
                  border: "1.5px solid rgba(198, 161, 91, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  opacity: isConnected ? 1 : 0.35,
                  transition: "opacity 0.4s ease",
                  animation: isConnected
                    ? (isThinking || isSpeaking || isCoolingDown)
                      ? "ihlBreathe 2s ease-in-out infinite"
                      : "ihlFloat 3.5s ease-in-out infinite"
                    : "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "13px",
                    width: "22px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.28)",
                    filter: "blur(4px)",
                    transform: "rotate(-20deg)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    width: "14px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "rgba(198, 161, 91, 0.4)",
                    filter: "blur(5px)",
                    pointerEvents: "none",
                    zIndex: 2,
                  }}
                />
              </div>
            </div>

          </div>

          <div className="flex-1 min-h-0 overflow-y-auto">
            {isConnected &&
              showLeadFormRecovery &&
              !showLeadForm &&
              !leadSubmitted && (
                <div className="flex flex-col items-center px-4 py-4 gap-3">
                  <p className="text-xs text-center" style={{ color: "#F7F7F5", opacity: 0.75 }}>
                    Loading your form...
                  </p>
                  <button
                    type="button"
                    onClick={triggerLeadForm}
                    className="px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#C6A15B22", color: "#C6A15B", border: "1px solid #C6A15B44" }}
                  >
                    Tap here if form doesn&apos;t appear
                  </button>
                </div>
              )}

            {showLeadForm && !leadSubmitted && (
              <div id="ihl-lead-form" className="flex flex-col px-4 py-2 gap-2" ref={leadFormAnchorRef}>
                <p className="text-sm font-semibold" style={{ color: "#C6A15B" }}>
                  Connect with a Mortgage Advisor
                </p>
                <p className="text-xs" style={{ color: "#F7F7F5", opacity: 0.75 }}>
                  An IHL advisor will reach out on your preferred day and time.
                </p>

                <input
                  type="text"
                  placeholder="Full name"
                  value={leadData.name}
                  onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: "#0d3560", color: "#F7F7F5", border: "1px solid #C6A15B44" }}
                />

                <input
                  type="email"
                  placeholder="Email address"
                  value={leadData.email}
                  onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: "#0d3560", color: "#F7F7F5", border: "1px solid #C6A15B44" }}
                />

                <input
                  type="tel"
                  placeholder="Phone number"
                  value={leadData.phone}
                  onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ backgroundColor: "#0d3560", color: "#F7F7F5", border: "1px solid #C6A15B44" }}
                />

                <select
                  value={leadData.bestDay}
                  onChange={(e) => setLeadData({ ...leadData, bestDay: e.target.value })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{
                    backgroundColor: "#0d3560",
                    color: leadData.bestDay ? "#F7F7F5" : "#F7F7F580",
                    border: "1px solid #C6A15B44",
                  }}
                >
                  <option value="" disabled>
                    Best day to reach you
                  </option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Any weekday">Any weekday</option>
                  <option value="Any day">Any day works</option>
                </select>

                <select
                  value={leadData.bestTime}
                  onChange={(e) => setLeadData({ ...leadData, bestTime: e.target.value })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{
                    backgroundColor: "#0d3560",
                    color: leadData.bestTime ? "#F7F7F5" : "#F7F7F580",
                    border: "1px solid #C6A15B44",
                  }}
                >
                  <option value="" disabled>
                    Best time to reach you
                  </option>
                  <option value="Morning (8am – 11am)">Morning (8am – 11am)</option>
                  <option value="Midday (11am – 1pm)">Midday (11am – 1pm)</option>
                  <option value="Afternoon (1pm – 5pm)">Afternoon (1pm – 5pm)</option>
                  <option value="Evening (5pm – 7pm)">Evening (5pm – 7pm)</option>
                  <option value="Anytime">Anytime works</option>
                </select>

                <select
                  value={leadData.preferredContact}
                  onChange={(e) => setLeadData({ ...leadData, preferredContact: e.target.value })}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{
                    backgroundColor: "#0d3560",
                    color: leadData.preferredContact ? "#F7F7F5" : "#F7F7F580",
                    border: "1px solid #C6A15B44",
                  }}
                >
                  <option value="" disabled>
                    Preferred contact method
                  </option>
                  <option value="Phone call">Phone call</option>
                  <option value="Text message">Text message</option>
                  <option value="Email">Email</option>
                  <option value="Any">Any — whatever&apos;s easiest</option>
                </select>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleLeadSubmit}
                    disabled={
                      !leadData.name.trim() ||
                      !leadData.email.trim() ||
                      !leadData.phone.trim() ||
                      !leadData.preferredContact ||
                      leadSubmittedRef.current ||
                      leadSubmitted
                    }
                    className="flex-1 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
                    style={{ backgroundColor: "#C6A15B", color: "#0B2A4A" }}
                  >
                    Connect Me
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      stopSilenceReminder();
                      isFormOpenRef.current = false;
                      setIsFormOpen(false);
                      leadSubmittedRef.current = false;
                      setShowLeadForm(false);
                      if (status === "connected") {
                        try {
                          setMicMuted(false);
                        } catch {
                          /* ignore */
                        }
                      }
                    }}
                    className="px-3 py-2 rounded-lg text-sm transition-opacity hover:opacity-80"
                    style={{ backgroundColor: "#0d3560", color: "#F7F7F5", border: "1px solid #C6A15B44" }}
                  >
                    Not now
                  </button>
                </div>
              </div>
            )}

            {leadSubmitted && (
              <div className="flex flex-col items-center px-4 py-4 gap-3">
                <div style={{ color: "#C6A15B", fontSize: "20px" }}>✓</div>
                <p className="text-sm font-semibold text-center" style={{ color: "#C6A15B" }}>
                  Thank you, {leadData.name.split(" ")[0]}!
                </p>
                <p className="text-xs text-center" style={{ color: "#F7F7F5", opacity: 0.85 }}>
                  It was truly a pleasure helping you today. An IHL mortgage advisor will be reaching out to you on{" "}
                  <strong style={{ color: "#C6A15B" }}>{leadData.bestDay || "your preferred day"}</strong> during{" "}
                  <strong style={{ color: "#C6A15B" }}>{leadData.bestTime || "your preferred time"}</strong> via{" "}
                  {leadData.preferredContact.toLowerCase()}. We look forward to helping you make your homeownership
                  goals a reality!
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await endSession();
                    } catch {
                      /* ignore */
                    }
                    setIsOpen(false);
                  }}
                  className="w-full py-2 rounded-lg text-sm font-semibold text-center transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "#0d3560", color: "#F7F7F5", border: "1px solid #C6A15B44" }}
                >
                  End Conversation
                </button>
              </div>
            )}

            {!showLeadForm && !leadSubmitted && (
              <div className="flex flex-col items-center justify-center px-4 py-4 gap-2">
                {!isConnected && !isConnecting && (
                  <p className="text-xs text-center" style={{ color: "#F7F7F5", opacity: 0.5 }}>
                    Ready to connect
                  </p>
                )}
                {isConnecting && (
                  <p className="text-xs text-center" style={{ color: "#F7F7F5", opacity: 0.6 }}>
                    Connecting...
                  </p>
                )}
              </div>
            )}
          </div>

          {isConnected && (
            <div style={{ borderTop: "1px solid #C6A15B22", flexShrink: 0 }}>
            <div className="px-4 pb-2 flex items-center justify-center gap-2">
              <span className="text-xs text-center" style={{ color: "#F7F7F5", opacity: 0.5 }}>
                🎤 Speak with Luna
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 pb-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: isSpeaking ? "#C6A15B" : isMuted ? "#6b7280" : "#22c55e",
                  boxShadow: isSpeaking ? "0 0 6px #C6A15B" : isMuted ? "none" : "0 0 6px #22c55e",
                }}
              />
              <span className="text-xs" style={{ color: "#F7F7F5", opacity: 0.6 }}>
                {isSpeaking
                  ? "Luna is speaking..."
                  : isMuted
                    ? "Mic muted"
                    : "Mic active"}
              </span>

              {isSpeaking && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const c = rawConversation as (typeof rawConversation) & {
                        output?: { interrupt?: (resetDuration?: number) => void };
                      };
                      if (c?.output && typeof c.output.interrupt === "function") {
                        c.output.interrupt(0);
                        sendUserActivity();
                      } else {
                        setVolume({ volume: 0 });
                        setTimeout(() => {
                          try {
                            setVolume({ volume: 1 });
                          } catch {
                            /* ignore */
                          }
                        }, 100);
                        sendUserActivity();
                      }
                    } catch {
                      /* ignore */
                    }
                  }}
                  title="Stop Luna"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C6A15B44";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#C6A15B";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#C6A15B22";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#C6A15B66";
                  }}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "4px",
                    backgroundColor: "#C6A15B22",
                    border: "1px solid #C6A15B66",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                    marginLeft: "2px",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "1px",
                      backgroundColor: "#C6A15B",
                    }}
                  />
                </button>
              )}
            </div>
            </div>
          )}

          {isConnected && (
            <div
              style={{
                margin: "0 12px 8px",
                background: "rgba(198, 161, 91, 0.06)",
                border: "1px solid rgba(198, 161, 91, 0.15)",
                borderRadius: "6px",
                padding: "6px 10px",
                display: "flex",
                gap: "6px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: "rgba(198, 161, 91, 0.2)",
                  border: "1px solid rgba(198, 161, 91, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              >
                <span style={{ color: "#C6A15B", fontSize: "8px", fontWeight: "bold", lineHeight: 1 }}>i</span>
              </div>
              <p
                style={{
                  color: "rgba(247, 247, 245, 0.4)",
                  fontSize: "9px",
                  lineHeight: "1.4",
                  margin: 0,
                }}
              >
                Luna is our Virtual IHL Mortgage Concierge — not a licensed advisor. Information is educational only. Consult a licensed mortgage professional before making decisions.
              </p>
            </div>
          )}

          <div className="px-4 py-3 text-center border-t" style={{ borderColor: "#C6A15B33" }}>
            <p className="text-xs" style={{ color: "#C6A15B", opacity: 0.6 }}>
              Infinite Home Lending · Your Mortgage Guide
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default function MortgageConcierge() {
  const location = useLocation();
  if (location.pathname.startsWith("/deal-desk")) {
    return null;
  }
  return <MortgageConciergeInner />;
}
