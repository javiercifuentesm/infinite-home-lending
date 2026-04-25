import { useCallback, useEffect, useRef, useState } from "react";
import { jsPDF } from "jspdf";
import { ConversationProvider, useConversation, useRawConversation } from "@elevenlabs/react";

const IHL_THINKING_STYLE_ID = "ihl-thinking-animations";

const AGENT_ID = "agent_1001kpnehp1vfx9t2pjy4nb2pz8m";

const PDF_ASSISTANT_LABEL = "Sarah — Deal Desk Assistant";

function DealDeskAssistantInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<
    { role: "user" | "assistant"; text: string; time: string; eventId?: number }[]
  >([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const coolingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const agentSpokenForThinkingRef = useRef(false);
  const prevIsSpeakingForThinkingRef = useRef(false);

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

  const { startSession, endSession, sendUserMessage, sendUserActivity, setVolume, setMuted: setMicMuted, status, isSpeaking, message } =
    useConversation({
    agentId: AGENT_ID,
    onConnect: () => console.log("Connected to Deal Desk Assistant"),
    onDisconnect: () => setIsOpen(false),
    onError: (error) => console.error("Assistant error:", error),
    onMessage: (payload) => {
      const text = payload.message;
      if (text == null || String(text).trim() === "") return;
      const transcriptRole = payload.role === "user" ? "user" : "assistant";
      if (transcriptRole === "user") {
        setIsThinking(true);
      }
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const eventId = payload.event_id;

      setTranscript((prev) => {
        const last = prev[prev.length - 1];

        if (eventId !== undefined && last?.eventId === eventId) {
          if (last.text === text) return prev;
          return [...prev.slice(0, -1), { ...last, text, time, eventId }];
        }

        if (last && last.role === transcriptRole && last.text === text) {
          return prev;
        }

        return [...prev, { role: transcriptRole, text, time, eventId }];
      });
    },
  });

  const rawConversation = useRawConversation();

  const statusRef = useRef(status);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

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
    doc.text("Deal Desk Conversation Transcript", margin, 28);
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

  const handleOpen = useCallback(() => {
    agentSpokenForThinkingRef.current = false;
    prevIsSpeakingForThinkingRef.current = false;
    setIsThinking(false);
    setIsCoolingDown(false);
    setTranscript([]);
    setIsOpen(true);
    startSession({ agentId: AGENT_ID, connectionType: "websocket" });
  }, [startSession]);

  const handleClose = useCallback(() => {
    endSession();
    setIsOpen(false);
  }, [endSession]);

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

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
    if (!isConnected) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      setIsMuted(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (status !== "connected") return;
    try {
      if (isSpeaking) {
        setMicMuted(true);
        // Sarah is speaking — only explicit Stop button should end her turn; mic stays muted
      } else {
        setMicMuted(false);
      }
    } catch {
      // ignore
    }
  }, [isSpeaking, status, setMicMuted]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (thinkingTimeoutRef.current) {
        clearTimeout(thinkingTimeoutRef.current);
        thinkingTimeoutRef.current = null;
      }
      if (coolingTimeoutRef.current) clearTimeout(coolingTimeoutRef.current);
    };
  }, []);

  const handleSend = useCallback(() => {
    if (isSpeaking) return;
    if (textInput.trim() && status === "connected") {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (status === "connected") {
        setMicMuted(false);
      }
      sendUserMessage(textInput.trim());
      setTextInput("");
      setIsThinking(true);
    }
  }, [textInput, status, isSpeaking, sendUserMessage, setMicMuted]);

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
          style={{ backgroundColor: "#0B2A4A", color: "#C6A15B" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
          <span className="text-sm font-semibold tracking-wide whitespace-nowrap">Ask the Deal Desk Assistant</span>
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{ backgroundColor: "#0B2A4A", maxHeight: "480px" }}
          role="dialog"
          aria-label="Deal Desk Assistant"
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
                Deal Desk Assistant
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
                  title={isMuted ? "Unmute Sarah" : "Mute Sarah"}
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

          <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-4 min-h-[200px] w-full">
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
                    ? (isThinking || isSpeaking)
                      ? "ihlBreathe 2s ease-in-out infinite"
                      : isCoolingDown
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

          {isConnected && (
            <>
            <div className="px-4 pb-2 flex gap-2 items-end">
              <textarea
                value={textInput}
                onChange={(e) => {
                  setTextInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;

                  if (status === "connected") {
                    setMicMuted(true);
                  }

                  if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                  }

                  typingTimeoutRef.current = setTimeout(() => {
                    if (statusRef.current === "connected" && !isSpeakingRef.current) {
                      setMicMuted(false);
                    }
                  }, 1500);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && textInput.trim() && !isSpeaking) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="🎤 Talk or type your question..."
                rows={1}
                style={{
                  backgroundColor: "#0d3560",
                  color: "#F7F7F5",
                  border: "1px solid #C6A15B44",
                  resize: "none",
                  overflow: "hidden",
                  minHeight: "36px",
                  maxHeight: "120px",
                }}
                className="min-w-0 flex-1 rounded-lg px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={handleSend}
                disabled={!textInput.trim() || isSpeaking}
                className="rounded-lg p-2 transition-opacity hover:opacity-80 disabled:opacity-40 flex-shrink-0"
                style={{ backgroundColor: "#C6A15B", color: "#0B2A4A" }}
                title="Send message"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
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
                  ? "Sarah is speaking..."
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
                  title="Stop Sarah"
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
            </>
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
                This is our Virtual IHL Deal Desk Assistant — not licensed mortgage advice. All scenarios are estimates only. Consult a licensed IHL loan officer before advising clients.
              </p>
            </div>
          )}

          <div className="px-4 py-3 text-center border-t" style={{ borderColor: "#C6A15B33" }}>
            <p className="text-xs" style={{ color: "#C6A15B", opacity: 0.6 }}>
              Infinite Home Lending · Deal Desk
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default function DealDeskAssistant() {
  return (
    <ConversationProvider>
      <DealDeskAssistantInner />
    </ConversationProvider>
  );
}
