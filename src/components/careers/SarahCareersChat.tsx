import { useCallback, useEffect, useRef, useState, type FormEvent, type RefObject } from "react";
import { getApiBaseUrl } from "../../lib/apiBase";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { SarahKeyframes } from "../sarah/SarahKeyframes";
import { SarahOrb } from "../sarah/SarahOrb";
import { SarahStreamingCursor } from "../sarah/SarahStreamingCursor";
import { renderSarahCareersMarkdown } from "./sarahCareersMarkdown";

const CAREERS_GREETING = `Welcome.

I'm Sarah, and I'm glad you're here.

Whether you're an experienced mortgage professional looking to expand your practice or someone exploring a future in mortgage advisory, this page was created to help you better understand who we are, what we're building, and the kind of advisors we hope to grow alongside.

Take your time looking around. Learn about our philosophy, our founders, the technology we've built, and the standards we believe great advisors deserve.

If questions come up, I'm here to help. I'd be happy to share more about our culture, what makes Infinite Home Lending different, how we think about serving clients, and the role technology plays in creating a better advisor and client experience.

And if, at some point, you'd like to explore whether there may be a fit, I'd be delighted to help connect you with our team.

I will be here in case I can be of assistance.`;

/** ChatGPT/Claude-like pace — progressive but engaging (~187 chars/sec). */
const CAREERS_TYPING_CHARS_PER_TICK = 3;
const CAREERS_TYPING_INTERVAL_MS = 16;

type Message = {
  role: "user" | "assistant";
  content: string;
  time: string;
  /** True while the UI is still revealing text (independent of network). */
  streaming?: boolean;
  /** True once all SSE text has been received (local greeting is true from start). */
  networkComplete?: boolean;
};

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function useCareersTypewriter(
  fullText: string,
  isRevealing: boolean,
  networkComplete: boolean,
  reducedMotion: boolean,
  scrollIfAllowed: () => void,
  onRevealComplete?: () => void,
) {
  const [displayed, setDisplayed] = useState(isRevealing && !reducedMotion ? "" : fullText);
  const posRef = useRef(isRevealing && !reducedMotion ? 0 : fullText.length);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const revealDoneRef = useRef(!isRevealing || reducedMotion);
  const fullTextRef = useRef(fullText);
  const networkCompleteRef = useRef(networkComplete);
  const isRevealingRef = useRef(isRevealing);
  const onCompleteRef = useRef(onRevealComplete);
  const scrollRef = useRef(scrollIfAllowed);

  fullTextRef.current = fullText;
  networkCompleteRef.current = networkComplete;
  isRevealingRef.current = isRevealing;
  onCompleteRef.current = onRevealComplete;
  scrollRef.current = scrollIfAllowed;

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tryFinishReveal = useCallback(() => {
    if (revealDoneRef.current) return;
    const target = fullTextRef.current;
    if (posRef.current < target.length || !networkCompleteRef.current) return;
    revealDoneRef.current = true;
    stopInterval();
    onCompleteRef.current?.();
    scrollRef.current();
  }, [stopInterval]);

  useEffect(() => {
    if (reducedMotion) {
      stopInterval();
      setDisplayed(fullText);
      posRef.current = fullText.length;
      if (!revealDoneRef.current) {
        revealDoneRef.current = true;
        onCompleteRef.current?.();
      }
      scrollRef.current();
      return;
    }

    if (!isRevealing) {
      stopInterval();
      setDisplayed(fullText);
      posRef.current = fullText.length;
      return;
    }

    if (posRef.current < fullText.length) {
      revealDoneRef.current = false;
    }

    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        if (!isRevealingRef.current || revealDoneRef.current) return;
        const target = fullTextRef.current;
        if (posRef.current < target.length) {
          posRef.current = Math.min(posRef.current + CAREERS_TYPING_CHARS_PER_TICK, target.length);
          setDisplayed(target.slice(0, posRef.current));
          scrollRef.current();
        }
        tryFinishReveal();
      }, CAREERS_TYPING_INTERVAL_MS);
    }

    tryFinishReveal();
  }, [fullText, isRevealing, networkComplete, reducedMotion, stopInterval, tryFinishReveal]);

  useEffect(() => () => stopInterval(), [stopInterval]);

  const showCursor =
    isRevealing && !reducedMotion && (displayed.length < fullText.length || !networkComplete);

  return { displayed, showCursor, isRevealing: isRevealing && !reducedMotion };
}

function MessageBubble({
  msg,
  showMessageOrb = true,
  scrollRef,
  reducedMotion,
  onRevealComplete,
}: {
  msg: Message;
  showMessageOrb?: boolean;
  scrollRef?: RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
  onRevealComplete?: () => void;
}) {
  const scrollIfAllowed = useCallback(() => {
    const container = scrollRef?.current;
    if (!container) return;
    const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    if (distFromBottom <= 80) {
      container.scrollTop = container.scrollHeight;
    }
  }, [scrollRef]);

  const networkComplete = msg.networkComplete !== false;

  const { displayed, showCursor, isRevealing } = useCareersTypewriter(
    msg.content,
    !!msg.streaming,
    networkComplete,
    reducedMotion,
    scrollIfAllowed,
    onRevealComplete,
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: msg.role === "user" ? "flex-end" : "flex-start",
      }}
    >
      {msg.role === "assistant" && (!msg.streaming || msg.content.trim() !== "") && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: showMessageOrb ? "10px" : 0,
            maxWidth: showMessageOrb ? "92%" : "100%",
            width: showMessageOrb ? undefined : "100%",
          }}
        >
          {showMessageOrb && (
            <div style={{ flexShrink: 0, marginTop: "2px" }}>
              <SarahOrb size="sm" streaming={!!msg.streaming} static={!msg.streaming} />
            </div>
          )}
          <div style={{ flex: 1, animation: "sarahMsgIn 0.35s ease forwards" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(198,161,91,0.12)",
                borderRadius: "4px 16px 16px 16px",
                padding: "13px 16px",
                color: "rgba(247,247,245,0.92)",
                fontSize: "14px",
                lineHeight: "1.7",
                borderLeft: "3px solid rgba(198,161,91,0.4)",
              }}
            >
              {renderSarahCareersMarkdown(isRevealing ? displayed : msg.content)}
              {showCursor && <SarahStreamingCursor />}
            </div>
            <p
              style={{
                color: "rgba(247,247,245,0.25)",
                fontSize: "10px",
                marginTop: "4px",
                paddingLeft: "4px",
              }}
            >
              Sarah · {msg.time}
            </p>
          </div>
        </div>
      )}
      {msg.role === "user" && (
        <div style={{ maxWidth: "80%", animation: "sarahMsgIn 0.35s ease forwards" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #C6A15B 0%, #d4b06a 100%)",
              borderRadius: "16px 4px 16px 16px",
              padding: "13px 16px",
              color: "#0B2A4A",
              fontSize: "14px",
              lineHeight: "1.7",
              fontWeight: 500,
            }}
          >
            {msg.content}
          </div>
          <p
            style={{
              color: "rgba(247,247,245,0.25)",
              fontSize: "10px",
              marginTop: "4px",
              textAlign: "right",
              paddingRight: "4px",
            }}
          >
            You · {msg.time}
          </p>
        </div>
      )}
    </div>
  );
}

const STARTERS = [
  "What's the culture like at IHL?",
  "Tell me about the Mortgage Advisor role",
  "What tools do advisors get on day one?",
  "How is compensation structured?",
];

const PRODUCTION_CHAT_ENDPOINT = "/api/sarah-careers-chat";
export const DISCOVERY_CHAT_ENDPOINT = "/api/sarah-careers-discovery-chat";

type SarahCareersChatProps = {
  /** Render inside floating centered modal shell (fills panel height). */
  floating?: boolean;
  /** Close modal back to sphere. */
  onClose?: () => void;
  /** API endpoint override for isolated prototype testing. */
  chatEndpoint?: string;
  /** Optional subtitle badge (e.g. Discovery Prototype v1). */
  variantLabel?: string;
};

export default function SarahCareersChat({
  floating = false,
  onClose,
  chatEndpoint = PRODUCTION_CHAT_ENDPOINT,
  variantLabel,
}: SarahCareersChatProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [greetingComplete, setGreetingComplete] = useState(reducedMotion);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: CAREERS_GREETING,
      time: formatTime(),
      streaming: true,
      networkComplete: true,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userScrolledAwayRef = useRef(false);
  const sessionIdRef = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `careers-${Date.now()}`,
  );
  const isSendingRef = useRef(false);

  const scrollToBottom = useCallback((force = false) => {
    const el = scrollRef.current;
    if (!el) return;
    if (!force && userScrolledAwayRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setGreetingComplete(true);
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].role === "assistant") {
          return [{ ...prev[0], streaming: false }];
        }
        return prev;
      });
    }
  }, [reducedMotion]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      userScrolledAwayRef.current = distFromBottom > 80;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    if (messages.length === 1 && !greetingComplete) {
      scrollToBottom();
      return;
    }
    scrollToBottom();
  }, [messages, isThinking, greetingComplete, scrollToBottom]);

  useEffect(() => {
    if (floating && greetingComplete) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(timer);
    }
  }, [floating, greetingComplete]);

  const handleGreetingComplete = useCallback(() => {
    setGreetingComplete(true);
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [{ ...prev[0], streaming: false, networkComplete: true }];
      }
      return prev;
    });
  }, []);

  const handleAssistantRevealComplete = useCallback((index: number) => {
    setMessages((prev) => {
      const next = [...prev];
      const msg = next[index];
      if (msg?.role === "assistant" && msg.streaming) {
        next[index] = { ...msg, streaming: false };
      }
      return next;
    });
  }, []);

  const streamFromApi = useCallback(
    async (
      apiMessages: { role: "user" | "assistant"; content: string }[],
      onChunk: (text: string) => void,
      onDone: () => void,
    ) => {
      const response = await fetch(`${getApiBaseUrl()}${chatEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          sessionId: sessionIdRef.current,
        }),
      });
      if (!response.ok) throw new Error("API error");
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.text) onChunk(data.text);
          } catch {
            /* ignore */
          }
        }
      }
      onDone();
    },
    [],
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isThinking || isSendingRef.current || !greetingComplete) return;
      isSendingRef.current = true;
      setShowStarters(false);
      userScrolledAwayRef.current = false;

      const userMsg: Message = {
        role: "user",
        content: text.trim(),
        time: formatTime(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
      setIsThinking(true);

      const apiMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const assistantPlaceholder: Message = {
        role: "assistant",
        content: "",
        time: formatTime(),
        streaming: true,
        networkComplete: false,
      };
      setMessages((prev) => [...prev, assistantPlaceholder]);

      try {
        await streamFromApi(
          apiMessages,
          (chunk) => {
            setIsThinking(false);
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === "assistant") {
                next[next.length - 1] = {
                  ...last,
                  content: last.content + chunk,
                  streaming: true,
                };
              }
              return next;
            });
          },
          () => {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last?.role === "assistant") {
                next[next.length - 1] = { ...last, networkComplete: true };
              }
              return next;
            });
            setIsThinking(false);
            isSendingRef.current = false;
          },
        );
      } catch {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last?.role === "assistant" && !last.content) {
            next[next.length - 1] = {
              role: "assistant",
              content: "I'm having trouble connecting right now. Please try again in a moment.",
              time: formatTime(),
              streaming: false,
            };
          }
          return next;
        });
        setIsThinking(false);
        isSendingRef.current = false;
      }
    },
    [greetingComplete, isThinking, messages, streamFromApi],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void sendMessage(inputText);
  };

  const inputReady = greetingComplete && !isThinking;

  return (
    <div
      className={floating ? "flex h-full min-h-0 flex-col" : "flex h-[400px] flex-col md:h-[480px]"}
      style={
        floating
          ? undefined
          : {
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(198,161,91,0.2)",
              borderRadius: "4px",
            }
      }
    >
      {!floating && <SarahKeyframes />}

      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid rgba(198,161,91,0.12)",
          background: "linear-gradient(135deg, rgba(198,161,91,0.08) 0%, transparent 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <SarahOrb size="md" showOnlineDot static />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <p
                style={{
                  color: "#C6A15B",
                  fontSize: "15px",
                  fontWeight: 700,
                  margin: 0,
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Sarah
              </p>
              <span
                style={{
                  backgroundColor: "rgba(34,197,94,0.15)",
                  color: "#22c55e",
                  fontSize: "10px",
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: "20px",
                  border: "1px solid rgba(34,197,94,0.3)",
                }}
              >
                ONLINE
              </span>
            </div>
            <p
              style={{
                color: "rgba(247,247,245,0.4)",
                fontSize: "11px",
                margin: 0,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {variantLabel ?? "Careers Assistant"}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Sarah"
            style={{
              color: "rgba(247,247,245,0.4)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              padding: "6px 8px",
              borderRadius: "6px",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          minHeight: 0,
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(198,161,91,0.15) transparent",
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            msg={msg}
            showMessageOrb={!floating}
            scrollRef={scrollRef}
            reducedMotion={reducedMotion}
            onRevealComplete={
              msg.role === "assistant" && msg.streaming
                ? i === 0 && messages.length === 1
                  ? handleGreetingComplete
                  : i === messages.length - 1
                    ? () => handleAssistantRevealComplete(i)
                    : undefined
                : undefined
            }
          />
        ))}
        {isThinking && messages[messages.length - 1]?.content === "" && (
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(198,161,91,0.12)",
                borderRadius: "4px 16px 16px 16px",
                padding: "13px 16px",
                borderLeft: "3px solid rgba(198,161,91,0.4)",
              }}
            >
              <SarahStreamingCursor />
            </div>
          </div>
        )}
        {showStarters && greetingComplete && messages.length === 1 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              animation: reducedMotion ? undefined : "sarahMsgIn 0.45s ease forwards",
            }}
          >
            {STARTERS.map((starter, i) => (
              <button
                key={starter}
                type="button"
                onClick={() => void sendMessage(starter)}
                style={{
                  background: "rgba(198,161,91,0.08)",
                  border: "1px solid rgba(198,161,91,0.25)",
                  color: "#C6A15B",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "12.5px",
                  fontWeight: 500,
                  padding: "7px 14px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  textAlign: "left",
                  animation: reducedMotion
                    ? undefined
                    : `sarahStarterIn 0.4s ease ${i * 0.08}s both`,
                }}
              >
                {starter}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: floating ? "12px 16px 16px" : "12px 16px",
          borderTop: floating ? undefined : "0.5px solid rgba(198,161,91,0.15)",
          background: floating ? "rgba(0,0,0,0.15)" : undefined,
          display: "flex",
          gap: "8px",
          flexShrink: 0,
          opacity: greetingComplete ? 1 : 0.55,
          transition: "opacity 0.35s ease",
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            greetingComplete
              ? "Ask Sarah about the opportunity..."
              : "Sarah is welcoming you..."
          }
          disabled={!inputReady}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(198,161,91,0.2)",
            color: "#fff",
            padding: "12px 14px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            borderRadius: "2px",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={!inputReady || !inputText.trim()}
          style={{
            background: "#C6A15B",
            color: "#080F1A",
            border: "none",
            padding: "12px 18px",
            fontFamily: "Inter, sans-serif",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 500,
            borderRadius: "2px",
            cursor: !inputReady || !inputText.trim() ? "not-allowed" : "pointer",
            opacity: !inputReady || !inputText.trim() ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
