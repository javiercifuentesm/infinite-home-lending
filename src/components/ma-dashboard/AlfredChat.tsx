import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { apiUrl } from "../../lib/apiBase";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Props = {
  currentModule: string;
};

const MODULE_LABELS: Record<string, string> = {
  "market-pulse": "Market Pulse",
  "dmv-feed": "DMV Intelligence",
  guidelines: "Guidelines Intel",
  "income-analyzer": "Income Analyzer",
  "asset-iq": "Asset IQ",
  "deal-war-room": "Deal War Room",
  playbook: "MA Playbook",
  pipeline: "Pipeline",
};

const SUGGESTED_PROMPTS = [
  "What's the FHA DTI limit with a 580 score?",
  "Draft a rate lock script for today's market",
  "Explain the latest Fannie Mae student loan update",
  "What MD programs stack with conventional loans?",
];

const FOMC_MEETING_START = new Date("2026-06-17T00:00:00");

function daysUntilFedMeeting(): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const meeting = new Date(FOMC_MEETING_START);
  meeting.setHours(0, 0, 0, 0);
  return Math.max(0, Math.ceil((meeting.getTime() - today.getTime()) / 86400000));
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function getWelcomeMessage(): string {
  return `Good ${getTimeGreeting()}, I'm Alfred — your MA intelligence assistant. Ask me anything: guidelines, income calculations, rate strategy, deal structuring, or DMV market specifics. I'm here to help you close.`;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-white border border-slate-200/80 rounded-2xl rounded-bl-md w-fit">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

export function AlfredChat({ currentModule }: Props) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const moduleLabel = MODULE_LABELS[currentModule] ?? currentModule;
  const fedDays = daysUntilFedMeeting();

  const apiContext = useMemo(
    () => ({
      currentModule: moduleLabel,
      rates: {
        summary: `30yr fixed ~6.53%, FOMC meeting in ${fedDays} day${fedDays === 1 ? "" : "s"}`,
      },
    }),
    [moduleLabel, fedDays],
  );

  const displayMessages = useMemo(() => {
    if (hasOpened && messages.length === 0) {
      return [
        {
          id: "welcome",
          role: "assistant" as const,
          content: getWelcomeMessage(),
        },
      ];
    }
    return messages;
  }, [hasOpened, messages]);

  const showSuggestedPrompts = messages.length === 0 && !loading;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayMessages, loading, open]);

  useEffect(() => {
    if (open && !minimized) {
      inputRef.current?.focus();
    }
  }, [open, minimized]);

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setHasOpened(true);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(apiUrl("/api/alfred-chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-10).map(({ role, content }) => ({ role, content })),
          context: apiContext,
        }),
      });

      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        role?: "assistant";
      };

      if (data.ok && data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: data.message!,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            content: data.message ?? "Alfred is temporarily unavailable. Please try again.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: "Alfred is temporarily unavailable. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  return (
    <>
      <style>{`
        @keyframes alfredFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .alfred-float {
          animation: alfredFloat 3s ease-in-out infinite;
        }
      `}</style>

      {open && !minimized && (
        <div
          className="fixed z-50 bottom-28 right-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[70vh] sm:h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden"
        >
          <div className="bg-[#0B2A4A] px-4 py-3 flex items-start justify-between gap-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <img
                src="/alfred-icon.png"
                alt="Alfred"
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div>
                <p className="font-heading text-[15px] font-semibold text-white">Alfred</p>
                <p className="font-sans text-[11px] text-white/60">MA Intelligence Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMinimized(true)}
                className="font-sans text-[12px] text-white/70 hover:text-white transition-colors"
                aria-label="Minimize Alfred chat"
              >
                minimize
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="font-sans text-[16px] leading-none text-white/70 hover:text-white transition-colors"
                aria-label="Close Alfred chat"
              >
                ×
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F8F7F4]">
            {displayMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl font-sans text-[13px] leading-relaxed whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-[#C6A15B] text-[#0B2A4A] rounded-br-md"
                      : "bg-white text-slate-700 border border-slate-200/80 rounded-bl-md"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}

            {showSuggestedPrompts && (
              <div className="space-y-2 pt-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendMessage(prompt)}
                    className="block w-full text-left font-sans text-[12px] px-3 py-2 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:border-[#C6A15B]/50 hover:text-[#0B2A4A] transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200/80 bg-white px-3 py-3 flex items-end gap-2 flex-shrink-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Ask Alfred anything..."
              className="flex-1 resize-none font-sans text-[13px] px-3 py-2 rounded-xl border border-slate-200/80 focus:outline-none focus:border-[#0B2A4A]/30 max-h-24"
            />
            <button
              type="button"
              onClick={() => void sendMessage(input)}
              disabled={loading || !input.trim()}
              className="font-sans text-[12px] font-semibold px-4 py-2 rounded-xl bg-[#0B2A4A] text-white hover:bg-[#0d3258] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send →
            </button>
          </div>
        </div>
      )}

      {open && minimized && (
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="fixed z-50 bottom-28 right-6 bg-[#0B2A4A] text-white px-4 py-2 rounded-xl shadow-lg border border-[#C6A15B]/30 font-sans text-[12px] font-semibold hover:bg-[#0d3258] transition-colors"
        >
          🦇 Alfred — click to expand
        </button>
      )}

      <button
        type="button"
        onClick={open && !minimized ? () => setOpen(false) : handleOpen}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="alfred-float"
        aria-label="Ask Alfred"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          border: "none",
          background: "transparent",
          padding: 0,
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        <img
          src="/alfred-icon.png"
          alt="Alfred AI Assistant"
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
          }}
        />
        {showTooltip && (
          <div
            style={{
              position: "absolute",
              bottom: "80px",
              right: "0px",
              background: "#0B2A4A",
              color: "#C6A15B",
              fontSize: "12px",
              fontWeight: 600,
              padding: "6px 14px",
              borderRadius: "20px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.05em",
            }}
          >
            Ask Alfred
          </div>
        )}
      </button>
    </>
  );
}
