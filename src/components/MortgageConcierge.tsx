import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import { sendLeadEmail } from "../api/sendLead";
import { getApiBaseUrl } from "../lib/apiBase";
import { useLanguage } from "../i18n/LanguageContext";

const PDF_ASSISTANT_LABEL = "Sarah — IHL Mortgage Concierge";
const IS_MOBILE = () => window.innerWidth < 768;

type Screen = "idle" | "widget" | "fullscreen" | "goodbye";

type Message = {
  role: "user" | "assistant";
  content: string;
  time: string;
  streaming?: boolean;
  docName?: string;
};

type LeadData = {
  name: string;
  email: string;
  phone: string;
  bestDay: string;
  bestTime: string;
  preferredContact: string;
};

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
  | { type: "document"; source: { type: "base64"; media_type: string; data: string } };

const ORB_BG = "radial-gradient(circle at 30% 28%, rgba(255,240,190,0.95) 0%, rgba(198,161,91,0.9) 15%, rgba(15,55,100,0.95) 38%, rgba(5,25,55,0.98) 65%, rgba(2,8,22,1) 100%)";

/** Web Speech API — not modeled in TS's default DOM lib */
type SpeechRecognitionEvent = {
  results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> & { length: number };
};
type SpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  start(): void;
  stop(): void;
};

// ─── SUB-COMPONENTS (defined OUTSIDE the main component to prevent re-mount on every render) ───

function parseBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} style={{ color: "#C6A15B", fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();

    // Bold-only line (header): **text** or **text:**
    if (/^\*\*[^*]+\*\*:?$/.test(trimmed)) {
      const label = trimmed.replace(/\*\*/g, "").replace(/:$/, "");
      return (
        <div key={i} style={{ color: "#C6A15B", fontWeight: 700, fontSize: "15px", marginTop: i > 0 ? "12px" : "0", marginBottom: "6px", letterSpacing: "0.3px" }}>
          {label}
        </div>
      );
    }

    // Numbered list: "1. text" or "1. **bold** text"
    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      return (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "6px", alignItems: "flex-start" }}>
          <span style={{ color: "#C6A15B", fontWeight: 700, minWidth: "22px", flexShrink: 0, fontSize: "14px" }}>{numberedMatch[1]}.</span>
          <span style={{ flex: 1 }}>{parseBold(numberedMatch[2])}</span>
        </div>
      );
    }

    // Bullet: "· text" or "- text"
    const bulletMatch = trimmed.match(/^[·\-•]\s+(.+)/);
    if (bulletMatch) {
      return (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "5px", alignItems: "flex-start" }}>
          <span style={{ color: "#C6A15B", fontWeight: 700, flexShrink: 0, fontSize: "16px", lineHeight: "1.4" }}>›</span>
          <span style={{ flex: 1 }}>{parseBold(bulletMatch[1])}</span>
        </div>
      );
    }

    // Checkmark ✓ or ✗
    const checkMatch = trimmed.match(/^([✓✗])\s+(.+)/);
    if (checkMatch) {
      return (
        <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "5px", alignItems: "flex-start" }}>
          <span style={{ color: checkMatch[1] === "✓" ? "#22c55e" : "#ef4444", fontWeight: 700, flexShrink: 0, fontSize: "15px" }}>{checkMatch[1]}</span>
          <span style={{ flex: 1 }}>{parseBold(checkMatch[2])}</span>
        </div>
      );
    }

    // Empty line
    if (trimmed === "") return <div key={i} style={{ height: "10px" }} />;

    // Default paragraph with inline bold
    return <div key={i} style={{ marginBottom: "4px", lineHeight: "1.7" }}>{parseBold(trimmed)}</div>;
  });
}

// Typewriter: smoothly renders characters one-by-one when streaming
const MessageBubble = ({ msg, index, scrollRef }: { msg: Message; index: number; scrollRef?: React.RefObject<HTMLDivElement | null> }) => {
  void index;

  const [displayed, setDisplayed] = useState(msg.streaming ? "" : msg.content);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // When content grows (streaming chunks arriving), animate new chars
    if (!msg.streaming && !msg.content.includes("FORM_SUBMITTED")) {
      // Streaming done — jump to full content immediately
      setDisplayed(msg.content);
      posRef.current = msg.content.length;
      if (scrollRef?.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }
      return;
    }

    const target = msg.content;
    if (posRef.current >= target.length) return;

    const tick = () => {
      posRef.current = Math.min(posRef.current + 3, target.length); // 3 chars per frame ≈ smooth
      setDisplayed(target.slice(0, posRef.current));
      if (scrollRef?.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }
      if (posRef.current < target.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        if (scrollRef?.current) { scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [msg.content, msg.streaming, scrollRef]);

  if (msg.content.includes("FORM_SUBMITTED")) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", animation: "sarahMsgIn 0.35s ease forwards" }}>
      {msg.role === "assistant" && (!msg.streaming || msg.content.trim() !== "") && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", maxWidth: "88%" }}>
          <div style={{ flexShrink: 0, marginTop: "2px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: ORB_BG, border: "1.5px solid rgba(198,161,91,0.5)", boxShadow: msg.streaming ? "0 0 12px rgba(198,161,91,0.4)" : "0 0 8px rgba(198,161,91,0.2)", animation: msg.streaming ? "sarahOrbBreathe 1.6s ease-in-out infinite" : "none" }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,161,91,0.12)", borderRadius: "4px 16px 16px 16px", padding: "13px 16px", color: "rgba(247,247,245,0.92)", fontSize: "14px", lineHeight: "1.7", borderLeft: "3px solid rgba(198,161,91,0.4)", whiteSpace: "pre-wrap" }}>
              {msg.streaming ? displayed : renderMarkdown(displayed)}
              {msg.streaming && <span style={{ display: "inline-block", width: "2px", height: "14px", backgroundColor: "#C6A15B", marginLeft: "3px", verticalAlign: "middle", animation: "sarahCursor 0.7s ease infinite", borderRadius: "1px" }} />}
            </div>
            <p style={{ color: "rgba(247,247,245,0.25)", fontSize: "10px", marginTop: "4px", paddingLeft: "4px" }}>Sarah · {msg.time}</p>
          </div>
        </div>
      )}
      {msg.role === "user" && (
        <div style={{ maxWidth: "75%" }}>
          {msg.docName && (
            <div style={{ backgroundColor: "rgba(198,161,91,0.15)", border: "1px solid rgba(198,161,91,0.3)", borderRadius: "10px 10px 0 0", padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "16px" }}>📎</span>
              <span style={{ color: "#C6A15B", fontSize: "12px", fontWeight: 600 }}>{msg.docName}</span>
            </div>
          )}
          {msg.content && msg.content !== `📎 ${msg.docName}` && (
            <div style={{ background: "linear-gradient(135deg, #C6A15B 0%, #d4b06a 100%)", borderRadius: msg.docName ? "0 0 16px 16px" : "16px 4px 16px 16px", padding: "13px 16px", color: "#0B2A4A", fontSize: "14px", lineHeight: "1.7", fontWeight: 500 }}>
              {msg.content}
            </div>
          )}
          <p style={{ color: "rgba(247,247,245,0.25)", fontSize: "10px", marginTop: "4px", textAlign: "right", paddingRight: "4px" }}>You · {msg.time}</p>
        </div>
      )}
    </div>
  );
};

type SarahHeaderProps = {
  onEnd: () => void;
  onSave?: () => void;
  messageCount?: number;
};

const SarahHeader = ({ onEnd, onSave, messageCount = 0 }: SarahHeaderProps) => (
  <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(198,161,91,0.12)", background: "linear-gradient(135deg, rgba(198,161,91,0.08) 0%, transparent 100%)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: ORB_BG, border: "2px solid rgba(198,161,91,0.6)" }} />
        <div style={{ position: "absolute", bottom: "1px", right: "1px", width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#22c55e", border: "2px solid #0B2A4A" }} />
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <p style={{ color: "#C6A15B", fontSize: "15px", fontWeight: 700 }}>Sarah</p>
          <span style={{ backgroundColor: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: "10px", fontWeight: 600, padding: "2px 6px", borderRadius: "20px", border: "1px solid rgba(34,197,94,0.3)" }}>ONLINE</span>
        </div>
        <p style={{ color: "rgba(247,247,245,0.4)", fontSize: "11px" }}>IHL Mortgage Concierge · MD · DC · VA</p>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {onSave && messageCount > 1 && (
        <button type="button" onClick={onSave}
          style={{ color: "rgba(198,161,91,0.6)", background: "none", border: "none", cursor: "pointer", fontSize: "11px", padding: "6px 8px", borderRadius: "6px" }}>
          ↓ Save
        </button>
      )}
      <button type="button" onClick={onEnd}
        style={{ color: "rgba(247,247,245,0.4)", background: "none", border: "none", cursor: "pointer", fontSize: "11px", padding: "6px 8px", borderRadius: "6px" }}>
        ✕ End
      </button>
    </div>
  </div>
);

type InputBarProps = {
  inputText: string;
  setInputText: (v: string) => void;
  isThinking: boolean;
  isLockdown: boolean;
  isMicActive: boolean;
  micSupported: boolean;
  pendingDoc: { name: string; base64: string; mediaType: string } | null;
  setPendingDoc: (v: null) => void;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onSend: () => void;
  onMic: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  compact?: boolean;
};

const InputBar = ({
  inputText, setInputText, isThinking, isLockdown, isMicActive, micSupported,
  pendingDoc, setPendingDoc, inputRef, fileInputRef, onSend, onMic, onFileUpload, compact = false
}: InputBarProps) => (
  <div style={{ padding: compact ? "10px 14px 12px" : "12px 16px 16px", flexShrink: 0, background: "rgba(0,0,0,0.15)" }}>
    {pendingDoc && (
      <div style={{ backgroundColor: "rgba(198,161,91,0.1)", border: "1px solid rgba(198,161,91,0.3)", borderRadius: "8px", padding: "6px 10px", marginBottom: "8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>📎</span>
          <span style={{ color: "#C6A15B", fontSize: "12px" }}>{pendingDoc.name}</span>
        </div>
        <button type="button" onClick={() => setPendingDoc(null)} style={{ color: "rgba(247,247,245,0.5)", background: "none", border: "none", cursor: "pointer", fontSize: "14px" }}>✕</button>
      </div>
    )}
    {isLockdown ? (
      <div style={{ textAlign: "center", padding: "12px", color: "rgba(247,247,245,0.4)", fontSize: "12px" }}>
        <span style={{ animation: "sarahGlow 2s ease-in-out infinite", display: "inline-block" }}>✦</span>
        {" "}Please complete the form above{" "}
        <span style={{ animation: "sarahGlow 2s ease-in-out infinite 1s", display: "inline-block" }}>✦</span>
      </div>
    ) : (
      <>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <input type="file" ref={fileInputRef} onChange={onFileUpload} accept=".pdf,image/*" style={{ display: "none" }} />
          <button type="button" onClick={() => fileInputRef.current?.click()}
            title="Upload document"
            style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, backgroundColor: "rgba(198,161,91,0.1)", transition: "all 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(198,161,91,0.2)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(198,161,91,0.1)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
            </svg>
          </button>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,161,91,0.18)", borderRadius: "14px", padding: "10px 14px", transition: "border-color 0.2s", minHeight: "44px" }}>
            <textarea
              ref={inputRef}
              autoFocus
              placeholder={isMicActive ? "🎤 Listening..." : "Ask Sarah anything..."}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSend();
                }
              }}
              onFocus={e => (e.currentTarget.parentElement!.style.borderColor = "rgba(198,161,91,0.45)")}
              onBlur={e => (e.currentTarget.parentElement!.style.borderColor = "rgba(198,161,91,0.18)")}
              disabled={isThinking}
              rows={1}
              style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#F7F7F5", fontSize: "14px", width: "100%", resize: "none", lineHeight: "1.5", maxHeight: "120px", overflowY: "auto", fontFamily: "inherit", caretColor: "#C6A15B" }}
            />
          </div>
          {micSupported && (
            <button type="button" onClick={onMic} title={isMicActive ? "Stop" : "Speak"}
              style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, backgroundColor: isMicActive ? "#C6A15B" : "rgba(198,161,91,0.1)", animation: isMicActive ? "sarahMicPulse 1.5s ease-in-out infinite" : "none", transition: "all 0.2s" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isMicActive ? "#0B2A4A" : "#C6A15B"}>
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke={isMicActive ? "#0B2A4A" : "#C6A15B"} strokeWidth="2" fill="none" strokeLinecap="round"/>
                <line x1="12" y1="19" x2="12" y2="23" stroke={isMicActive ? "#0B2A4A" : "#C6A15B"} strokeWidth="2" strokeLinecap="round"/>
                <line x1="8" y1="23" x2="16" y2="23" stroke={isMicActive ? "#0B2A4A" : "#C6A15B"} strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
          <button type="button" onClick={onSend}
            disabled={(!inputText.trim() && !pendingDoc) || isThinking}
            style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", cursor: (!inputText.trim() && !pendingDoc) || isThinking ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: (inputText.trim() || pendingDoc) && !isThinking ? "linear-gradient(135deg, #C6A15B 0%, #d4b06a 100%)" : "rgba(198,161,91,0.1)", transition: "all 0.2s" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={(inputText.trim() || pendingDoc) && !isThinking ? "#0B2A4A" : "rgba(198,161,91,0.4)"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p style={{ color: "rgba(247,247,245,0.2)", fontSize: "10px", textAlign: "center", marginTop: "8px", lineHeight: 1.4 }}>
          Sarah is our IHL Mortgage Concierge — not a licensed advisor. Information is educational only.
        </p>
      </>
    )}
  </div>
);

type LeadFormProps = {
  leadData: LeadData;
  setLeadData: React.Dispatch<React.SetStateAction<LeadData>>;
  onSubmit: () => void;
  onDismiss: () => void;
};

const LeadForm = ({ leadData, setLeadData, onSubmit, onDismiss }: LeadFormProps) => (
  <div style={{ animation: "sarahMsgIn 0.4s ease forwards", background: "linear-gradient(135deg, rgba(198,161,91,0.07) 0%, rgba(198,161,91,0.03) 100%)", border: "1px solid rgba(198,161,91,0.2)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "2px" }}>
      <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "rgba(198,161,91,0.1)", border: "1px solid rgba(198,161,91,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: "15px" }}>🏡</span>
      </div>
      <div>
        <p style={{ color: "#C6A15B", fontSize: "14px", fontWeight: 700, lineHeight: 1.2 }}>Connect with an IHL Advisor</p>
        <p style={{ color: "rgba(247,247,245,0.45)", fontSize: "11px" }}>We'll reach out on your schedule</p>
      </div>
    </div>
    {[
      { placeholder: "Full name", key: "name", type: "text" },
      { placeholder: "Email address", key: "email", type: "email" },
      { placeholder: "Phone number", key: "phone", type: "tel" },
    ].map(field => (
      <input key={field.key} type={field.type} placeholder={field.placeholder}
        value={leadData[field.key as keyof LeadData]}
        onChange={e => setLeadData(prev => ({ ...prev, [field.key]: e.target.value }))}
        style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(198,161,91,0.18)", borderRadius: "10px", padding: "11px 14px", color: "#F7F7F5", fontSize: "14px", outline: "none", width: "100%" }}
        onFocus={e => (e.currentTarget.style.borderColor = "rgba(198,161,91,0.5)")}
        onBlur={e => (e.currentTarget.style.borderColor = "rgba(198,161,91,0.18)")}
      />
    ))}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
      {[
        { key: "bestDay", placeholder: "Best day", options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Any weekday", "Any day works"] },
        { key: "bestTime", placeholder: "Best time", options: ["Morning (8–11am)", "Midday (11am–1pm)", "Afternoon (1–5pm)", "Evening (5–7pm)", "Anytime works"] },
      ].map(field => (
        <select key={field.key} value={leadData[field.key as keyof LeadData]}
          onChange={e => setLeadData(prev => ({ ...prev, [field.key]: e.target.value }))}
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(198,161,91,0.18)", borderRadius: "10px", padding: "11px 10px", color: leadData[field.key as keyof LeadData] ? "#F7F7F5" : "rgba(247,247,245,0.35)", fontSize: "13px", outline: "none", width: "100%" }}>
          <option value="" disabled style={{ backgroundColor: "#0B2A4A" }}>{field.placeholder}</option>
          {field.options.map(opt => <option key={opt} value={opt} style={{ backgroundColor: "#0B2A4A" }}>{opt}</option>)}
        </select>
      ))}
    </div>
    <select value={leadData.preferredContact}
      onChange={e => setLeadData(prev => ({ ...prev, preferredContact: e.target.value }))}
      style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(198,161,91,0.18)", borderRadius: "10px", padding: "11px 14px", color: leadData.preferredContact ? "#F7F7F5" : "rgba(247,247,245,0.35)", fontSize: "14px", outline: "none", width: "100%" }}>
      <option value="" disabled style={{ backgroundColor: "#0B2A4A" }}>Preferred contact method</option>
      {["Phone call", "Text message", "Email", "Any — whatever's easiest"].map(opt => (
        <option key={opt} value={opt} style={{ backgroundColor: "#0B2A4A" }}>{opt}</option>
      ))}
    </select>
    <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
      <button type="button" onClick={onSubmit}
        disabled={!leadData.name.trim() || !leadData.email.trim() || !leadData.phone.trim() || !leadData.preferredContact}
        style={{ flex: 1, background: "linear-gradient(135deg, #C6A15B 0%, #d4b06a 100%)", color: "#0B2A4A", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: 700, cursor: "pointer", opacity: (!leadData.name.trim() || !leadData.email.trim() || !leadData.phone.trim() || !leadData.preferredContact) ? 0.4 : 1, transition: "all 0.2s" }}>
        Connect Me →
      </button>
      <button type="button" onClick={onDismiss}
        style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(247,247,245,0.6)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px 14px", fontSize: "13px", cursor: "pointer" }}>
        Not now
      </button>
    </div>
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

function MortgageConciergeInner() {
  const { lang, t } = useLanguage();

  const STARTERS = lang === "es"
    ? [
        "¿Cuánto puedo pagar?",
        "¿Cómo obtengo una pre-aprobación?",
        "¿Cuál es mi primer paso?",
        "Cuéntame sobre los préstamos FHA",
      ]
    : [
        "What can I afford?",
        "How do I get pre-approved?",
        "What's my first step?",
        "Tell me about FHA loans",
      ];

  const GREETINGS = lang === "es"
    ? [
        "¡Hola! Soy Sarah de Infinite Home Lending. Mi trabajo es ayudarle a tomar la mejor decisión hipotecaria para su situación — ya sea que esté comprando una vivienda, refinanciando, accediendo al patrimonio de su hogar o explorando una hipoteca inversa. ¿Por dónde le gustaría comenzar?",
        "¡Bienvenido! Soy Sarah, su asesora hipotecaria en Infinite Home Lending. Estoy aquí para ayudarle a navegar sus opciones — desde comprar su hogar ideal hasta refinanciar, acceder a su patrimonio con un HELOC o aprender sobre hipotecas inversas. ¿Qué le trae por aquí hoy?",
        "¡Hola! Soy Sarah de Infinite Home Lending. Ya sea que esté listo para comprar, pensando en refinanciar, buscando acceder al patrimonio de su vivienda o con curiosidad sobre una hipoteca inversa — estoy aquí para hacer el proceso simple y sin estrés. ¿En qué puedo ayudarle?",
        "¡Hola y bienvenido! Soy Sarah de Infinite Home Lending. Mi objetivo es ayudarle a encontrar el mejor camino — ya sea comprando una nueva vivienda, refinanciando la actual, explorando un HELOC o considerando una hipoteca inversa. ¿Qué tiene en mente hoy?",
        "¡Hola! Soy Sarah, su guía hipotecaria personal en Infinite Home Lending. Puedo ayudarle con todo, desde comprar su primera vivienda hasta refinanciar, desbloquear el patrimonio de su hogar o explorar opciones de hipoteca inversa. Sin presión — solo orientación útil. ¿Por dónde le gustaría comenzar?",
        "¡Hola! Soy Sarah de Infinite Home Lending, atendiendo Maryland, DC y Virginia. Ayudo a compradores y propietarios a encontrar la solución correcta — ya sea un préstamo de compra, una refinanciación, un HELOC o una hipoteca inversa. ¿Qué le gustaría explorar hoy?",
      ]
    : [
        "Hi there! I'm Sarah with Infinite Home Lending. My job is to help you make the best mortgage decision for your situation — whether that's buying a home, refinancing, accessing your home equity, or exploring a reverse mortgage. Where would you like to start?",
        "Welcome! I'm Sarah, your mortgage concierge at Infinite Home Lending. I'm here to help you navigate your options — from purchasing your dream home to refinancing, tapping into your equity with a HELOC, or learning about reverse mortgages. What brings you here today?",
        "Hi! Sarah here from Infinite Home Lending. Whether you're ready to buy, thinking about refinancing, looking to access your home equity, or curious about a reverse mortgage — I'm here to make the process simple and stress-free. What can I help you with?",
        "Hello and welcome! I'm Sarah with Infinite Home Lending. My goal is to help you find the right path forward — whether that means purchasing a new home, refinancing your current one, exploring a HELOC, or considering a reverse mortgage. What's on your mind today?",
        "Hi there! I'm Sarah, your personal mortgage guide at Infinite Home Lending. I can help with everything from buying your first home to refinancing, unlocking your home equity, or exploring reverse mortgage options. No pressure — just helpful guidance. Where would you like to begin?",
        "Hi! I'm Sarah with Infinite Home Lending, serving Maryland, DC, and Virginia. I help homebuyers and homeowners find the right solution — whether that's a purchase loan, a refinance, a HELOC, or a reverse mortgage. What would you like to explore today?",
      ];

  const [screen, setScreen] = useState<Screen>("idle");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const [isLockdown, setIsLockdown] = useState(false);
  const [goodbyeMessage, setGoodbyeMessage] = useState("");
  const [pendingDoc, setPendingDoc] = useState<{ name: string; base64: string; mediaType: string } | null>(null);
  const [leadData, setLeadData] = useState<LeadData>({
    name: "", email: "", phone: "", bestDay: "", bestTime: "", preferredContact: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const leadSubmittedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const leadFormShownRef = useRef(false);
  const greetingRef = useRef("");
  const isSendingRef = useRef(false);

  useEffect(() => {
    const SR = (window as unknown as Window & {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;
    if (SR) setMicSupported(true);
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) { scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight; }
  }, [messages, showLeadForm, isThinking]);

  // MutationObserver — auto-scroll whenever message content changes height (most reliable on iOS Safari)
  useEffect(() => {
    if (screen !== "fullscreen") return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const observer = new MutationObserver(() => {
      container.scrollTop = container.scrollHeight;
    });
    observer.observe(container, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [screen]);

  useEffect(() => {
    if (screen === "fullscreen") {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [screen]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [inputText]);

  useEffect(() => {
    if (screen === "fullscreen") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [screen]);

  const scoreLead = useCallback(() => {
    const text = messages.map(m => m.content.toLowerCase()).join(" ");
    let score = 0;
    if (text.match(/ready|soon|next few months|spring|summer|this year/)) score += 3;
    if (text.match(/planning|early stage|just started/)) score += 1;
    if (text.match(/working with|have an agent|my agent/)) score += 2;
    if (text.match(/credit score|pulled my credit/)) score += 2;
    if (text.match(/budget|price range|afford|looking at homes/)) score += 2;
    if (text.match(/first time|first home|never bought/)) score += 1;
    if (text.match(/purchase|buy|buying/)) score += 1;
    if (messages.length >= 6) score += 2;
    if (score >= 8) return { grade: "HOT", emoji: "🔥", color: "#DC2626", bg: "#FEF2F2", priority: "HIGH PRIORITY — Contact within 2 hours" };
    if (score >= 4) return { grade: "WARM", emoji: "🌡️", color: "#D97706", bg: "#FFFBEB", priority: "WARM LEAD — Contact within 24 hours" };
    return { grade: "NEUTRAL", emoji: "🤍", color: "#6B7280", bg: "#F9FAFB", priority: "NURTURE — Add to follow-up sequence" };
  }, [messages]);

  const streamFromApi = useCallback(async (
    apiMessages: { role: "user" | "assistant"; content: string | ContentBlock[] }[],
    onChunk: (text: string) => void,
    onDone: () => void,
    signal?: AbortSignal
  ) => {
    const response = await fetch(`${getApiBaseUrl()}/api/sarah-chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages, lang }),
      signal,
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
          // data.ping = keepalive heartbeat, ignore
        } catch { /* ignore */ }
      }
    }
    // Call onDone after reader closes (stream fully consumed)
    onDone();
  }, [lang]);

  const checkForGoodbye = useCallback((fullText: string) => {
    if (!leadSubmittedRef.current) return;
    const lower = fullText.toLowerCase();
    const isGoodbye = lower.includes("good luck") || lower.includes("have a great") ||
      lower.includes("best of luck") || lower.includes("take care") ||
      lower.includes("goodbye") || lower.includes("talk to you soon") ||
      lower.includes("we'll be in touch") || lower.includes("we look forward") ||
      lower.includes("congratulations") || lower.includes("wonderful day") ||
      lower.includes("have a wonderful") || lower.includes("exciting step") ||
      lower.includes("have a great day") || lower.includes("best wishes");
    if (isGoodbye) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          setGoodbyeMessage(fullText);
          setScreen("goodbye");
          setTimeout(() => {
            setScreen("idle");
            setMessages([]);
          }, 4000);
        }, 600);
      }, 1500);
    }
  }, []);

  const sendMessage = useCallback(async (text: string, doc?: { name: string; base64: string; mediaType: string } | null) => {
    if ((!text.trim() && !doc) || isThinking || isLockdown || isSendingRef.current) return;
    isSendingRef.current = true;
    setShowStarters(false);

    let userContent: string | ContentBlock[];
    if (doc) {
      const blocks: ContentBlock[] = [];
      if (doc.mediaType === "application/pdf") {
        blocks.push({ type: "document", source: { type: "base64", media_type: doc.mediaType, data: doc.base64 } });
      } else {
        blocks.push({ type: "image", source: { type: "base64", media_type: doc.mediaType, data: doc.base64 } });
      }
      if (text.trim()) blocks.push({ type: "text", text: text.trim() });
      else blocks.push({ type: "text", text: "Please review this document and help me understand what it means for my mortgage situation." });
      userContent = blocks;
    } else {
      userContent = text.trim();
    }

    const userMessage: Message = {
      role: "user",
      content: text.trim() || (doc ? `📎 ${doc.name}` : ""),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      docName: doc?.name,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setPendingDoc(null);
    setIsThinking(true);

    const placeholder: Message = {
      role: "assistant", content: "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      streaming: true,
    };
    setMessages(prev => [...prev, placeholder]);

    try {
      abortControllerRef.current = new AbortController();

      const apiMsgs = messages
        .filter(m => !m.content.includes("FORM_SUBMITTED"))
        .map(m => ({ role: m.role, content: m.content }));

      if (doc) {
        apiMsgs.push({ role: "user", content: userContent as any });
      } else {
        apiMsgs.push({ role: "user", content: text.trim() });
      }

      let fullText = "";

      await streamFromApi(
        apiMsgs,
        (chunk) => {
          setIsThinking(false);
          fullText += chunk;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText, streaming: true };
            return updated;
          });
        },
        () => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], streaming: false };
            return updated;
          });
          checkForGoodbye(fullText);
        },
        abortControllerRef.current.signal
      );

      if (fullText.includes("SHOW_LEAD_FORM") && !leadFormShownRef.current) {
        leadFormShownRef.current = true;
        const cleanText = fullText.replace("SHOW_LEAD_FORM", "").trim();
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: cleanText, streaming: false };
          return updated;
        });
        setTimeout(() => { setShowLeadForm(true); setIsLockdown(true); }, 600);
      }
    } catch (error: any) {
      if (error.name === "AbortError") return;
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: "I'm sorry, I ran into a connection issue. Please try again.", streaming: false };
        return updated;
      });
    } finally {
      setIsThinking(false);
      isSendingRef.current = false;
    }
  }, [messages, isThinking, isLockdown, streamFromApi, checkForGoodbye]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { alert("Please upload a PDF or image file (JPG, PNG, WebP)."); return; }
    if (file.size > 10 * 1024 * 1024) { alert("File size must be under 10MB."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setPendingDoc({ name: file.name, base64, mediaType: file.type });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleMic = useCallback(() => {
    if (!micSupported || isLockdown) return;
    const SR = (window as unknown as Window & {
      SpeechRecognition?: new () => SpeechRecognition;
      webkitSpeechRecognition?: new () => SpeechRecognition;
    }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) return;
    if (isMicActive) { recognitionRef.current?.stop(); setIsMicActive(false); return; }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsMicActive(true);
    recognition.onend = () => setIsMicActive(false);
    recognition.onerror = () => setIsMicActive(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join("");
      setInputText(transcript);
      if (event.results[event.results.length - 1].isFinal) {
        recognition.stop();
        if (!isSendingRef.current) {
          sendMessage(transcript);
          setInputText("");
        }
      }
    };
    recognitionRef.current = recognition;
    recognition.start();
  }, [isMicActive, micSupported, sendMessage, isLockdown]);

  const handleOpenWidget = useCallback(() => {
    const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    greetingRef.current = greeting;
    setShowStarters(true);
    setShowLeadForm(false);
    setLeadSubmitted(false);
    setIsLockdown(false);
    leadFormShownRef.current = false;
    leadSubmittedRef.current = false;
    setGoodbyeMessage("");
    setLeadData({ name: "", email: "", phone: "", bestDay: "", bestTime: "", preferredContact: "" });
    setMessages([{
      role: "assistant",
      content: greeting,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setScreen("widget");
  }, [lang]);

  const handleEnterFullscreen = useCallback(() => {
    setScreen("fullscreen");
  }, []);

  const handleEndConversation = useCallback(() => {
    abortControllerRef.current?.abort();
    recognitionRef.current?.stop();
    setIsMicActive(false);
    setIsLockdown(false);
    setScreen("idle");
    setMessages([]);
  }, []);

  const handleLeadSubmit = useCallback(async () => {
    if (!leadData.name.trim() || !leadData.email.trim() || !leadData.phone.trim() || !leadData.preferredContact) return;
    if (leadSubmittedRef.current) return;
    leadSubmittedRef.current = true;

    const lead = scoreLead();
    const transcriptSummary = messages
      .filter(m => !m.content.includes("FORM_SUBMITTED"))
      .map(m => `${m.role === "user" ? "Visitor" : "Sarah"} (${m.time}): ${m.content}`)
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
        date: new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        transcript: transcriptSummary,
      });
    } catch (error) {
      console.error("Failed to send lead email:", error);
      leadSubmittedRef.current = false;
      return;
    }

    setLeadSubmitted(true);
    setShowLeadForm(false);
    setIsLockdown(false);

    const formSubmittedMsg = `FORM_SUBMITTED. Visitor name: ${leadData.name}. Preferred contact: ${leadData.preferredContact}. Best day: ${leadData.bestDay || "flexible"}. Best time: ${leadData.bestTime || "flexible"}. Please respond warmly using their first name, confirm an IHL advisor will reach out on their preferred schedule via their preferred method, and close warmly.`;

    const historyForApi = [
      ...messages.filter(m => !m.content.includes("FORM_SUBMITTED")).map(m => ({ role: m.role, content: m.content })),
      { role: "user" as const, content: formSubmittedMsg },
    ];

    const thankYouPlaceholder: Message = {
      role: "assistant", content: "",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      streaming: true,
    };
    setMessages(prev => [...prev, thankYouPlaceholder]);
    setIsThinking(true);

    try {
      let fullText = "";
      await streamFromApi(
        historyForApi,
        (chunk) => {
          setIsThinking(false);
          fullText += chunk;
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText, streaming: true };
            return updated;
          });
        },
        () => {
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], streaming: false };
            return updated;
          });
        }
      );

      // Auto-close after goodbye
      if (fullText) {
        const lower = fullText.toLowerCase();
        const isGoodbye = lower.includes("good luck") || lower.includes("have a great") ||
          lower.includes("best of luck") || lower.includes("take care") ||
          lower.includes("goodbye") || lower.includes("talk to you soon") ||
          lower.includes("we'll be in touch") || lower.includes("we look forward") ||
          lower.includes("congratulations") || lower.includes("wonderful day") ||
          lower.includes("have a wonderful") || lower.includes("exciting step") ||
          lower.includes("have a great day") || lower.includes("best wishes");
        if (isGoodbye) {
          setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => {
              setGoodbyeMessage(fullText);
              setScreen("goodbye");
              setTimeout(() => {
                setScreen("idle");
                setMessages([]);
              }, 4000);
            }, 600);
          }, 1500);
        }
      }
    } catch { /* ignore */ } finally {
      setIsThinking(false);
    }
  }, [leadData, messages, scoreLead, streamFromApi]);

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
    doc.text(new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }), margin, 36);
    y = 55;
    messages.forEach(entry => {
      if (entry.content.includes("FORM_SUBMITTED")) return;
      const isUser = entry.role === "user";
      const label = isUser ? "You" : PDF_ASSISTANT_LABEL;
      const labelColor: [number, number, number] = isUser ? [46, 46, 46] : [11, 42, 74];
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...labelColor);
      doc.text(`${label}  ${entry.time}`, margin, y); y += 6;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(46, 46, 46);
      const lines = doc.splitTextToSize(entry.content, maxWidth);
      lines.forEach((line: string) => { if (y > 270) { doc.addPage(); y = 20; } doc.text(line, margin, y); y += 6; });
      y += 4;
    });
    doc.setFillColor(11, 42, 74); doc.rect(0, 282, pageWidth, 15, "F");
    doc.setTextColor(198, 161, 91); doc.setFontSize(8);
    doc.text("Infinite Home Lending · Maryland · DC · Virginia · infinitehomelending.com", margin, 290);
    doc.save(`IHL-Conversation-${Date.now()}.pdf`);
  }, [messages]);

  const handleSend = useCallback(() => {
    sendMessage(inputText, pendingDoc);
  }, [inputText, pendingDoc, sendMessage]);

  // ─── RENDER ───────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes sarahBtnFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        @keyframes sarahBtnPulse{0%,100%{box-shadow:0 0 24px rgba(198,161,91,0.3)}50%{box-shadow:0 0 52px rgba(198,161,91,0.75)}}
        @keyframes sarahBtnRing{0%{transform:scale(0.85);opacity:0.6}100%{transform:scale(1.65);opacity:0}}
        @keyframes sarahMsgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sarahCursor{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes sarahMicPulse{0%,100%{box-shadow:0 0 0 0 rgba(198,161,91,0.5)}50%{box-shadow:0 0 0 12px rgba(198,161,91,0)}}
        @keyframes sarahOrbBreathe{0%,100%{transform:scale(1);box-shadow:0 0 20px rgba(198,161,91,0.2)}50%{transform:scale(1.22);box-shadow:0 0 40px rgba(198,161,91,0.6)}}
        @keyframes sarahGlow{0%,100%{opacity:0.4}50%{opacity:1}}
        @keyframes sarahStarterIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes sarahWidgetExpand{from{transform:scale(0.95);opacity:0.8}to{transform:scale(1);opacity:1}}
        @keyframes sarahFullscreenIn{from{opacity:0;transform:scale(0.98)}to{opacity:1;transform:scale(1)}}
        @keyframes sarahGoodbyeIn{from{opacity:0;transform:translateY(30px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>

      {/* SCREEN 1 — Idle orb */}
      {screen === "idle" && (
        <button type="button" onClick={handleOpenWidget} className="fixed bottom-4 right-4 z-50"
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", animation: "sarahBtnFloat 3.5s ease-in-out infinite" }}>
            <div style={{ position: "relative", width: "70px", height: "70px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {[0, 0.9, 1.8].map((delay, i) => (
                <div key={i} style={{ position: "absolute", width: "70px", height: "70px", borderRadius: "50%", border: "2px solid rgba(198,161,91,0.5)", animation: `sarahBtnRing 2.8s ease-out ${delay}s infinite`, pointerEvents: "none" }} />
              ))}
              <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: ORB_BG, border: "3px solid rgba(198,161,91,0.95)", animation: "sarahBtnPulse 2.5s ease-in-out infinite", boxShadow: "0 0 0 4px rgba(11,42,74,0.4), 0 8px 32px rgba(0,0,0,0.5)", position: "relative", zIndex: 2 }} />
            </div>
            <span style={{ color: "#C6A15B", fontSize: "12px", fontWeight: 700, letterSpacing: "0.5px", whiteSpace: "nowrap", textShadow: "0 2px 8px rgba(0,0,0,0.6)", textTransform: "uppercase" }}>{t("sarah.askSarah")}</span>
          </div>
        </button>
      )}

      {/* SCREEN 2 — Widget */}
      {screen === "widget" && (
        <div className="fixed z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{
            bottom: IS_MOBILE() ? "16px" : "24px",
            right: IS_MOBILE() ? "16px" : "24px",
            width: "420px",
            maxWidth: "calc(100vw - 48px)",
            maxHeight: "min(700px, calc(100dvh - 100px))",
            background: "linear-gradient(160deg, #0a2540 0%, #0B2A4A 40%, #0a1f35 100%)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,161,91,0.15)",
            animation: "sarahWidgetExpand 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
          }}>
          <SarahHeader onEnd={handleEndConversation} messageCount={messages.length} />
          <div style={{ padding: "18px 18px 12px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {messages.slice(0, 1).map((msg, i) => (
              <React.Fragment key={i}>
                <MessageBubble msg={msg} index={i} />
              </React.Fragment>
            ))}
            {showStarters && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {STARTERS.map((starter, i) => (
                  <button key={i} type="button"
                    onClick={() => {
                      setScreen("fullscreen");
                      setTimeout(() => sendMessage(starter), 400);
                    }}
                    style={{ backgroundColor: "rgba(198,161,91,0.08)", border: "1px solid rgba(198,161,91,0.25)", borderRadius: "20px", padding: "7px 14px", color: "#C6A15B", fontSize: "12.5px", fontWeight: 500, cursor: "pointer", transition: "all 0.2s", animation: `sarahStarterIn 0.4s ease ${i * 0.08}s both` }}>
                    {starter}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Tap-to-chat area */}
          <div style={{ padding: "10px 16px 16px", flexShrink: 0, background: "rgba(0,0,0,0.15)" }}>
            <div onClick={handleEnterFullscreen} style={{ display: "flex", gap: "8px", alignItems: "center", cursor: "pointer" }}>
              <button type="button" style={{ width: "40px", height: "40px", borderRadius: "50%", border: "none", backgroundColor: "rgba(198,161,91,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C6A15B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              <div style={{ flex: 1, display: "flex", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,161,91,0.18)", borderRadius: "14px", padding: "12px 16px", minHeight: "44px" }}>
                <span style={{ color: "rgba(247,247,245,0.35)", fontSize: "14px", flex: 1 }}>Ask Sarah anything...</span>
              </div>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(198,161,91,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#C6A15B">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#C6A15B" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="#C6A15B" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="#C6A15B" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(198,161,91,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(198,161,91,0.4)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </div>
            </div>
            <p style={{ color: "rgba(247,247,245,0.2)", fontSize: "10px", textAlign: "center", marginTop: "8px" }}>
              Sarah is our IHL Mortgage Concierge — not a licensed advisor. Information is educational only.
            </p>
          </div>
        </div>
      )}

      {/* SCREEN 3 — Fullscreen chat */}
      {screen === "fullscreen" && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            padding: "20px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) handleEndConversation(); }}
        >
          {/* Inner chat panel — full height on mobile, constrained on desktop */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%",
              maxWidth: "900px",
              maxHeight: "100dvh",
              background: "linear-gradient(160deg, #0a2540 0%, #0B2A4A 50%, #071a2e 100%)",
              // On desktop (md+), add rounded corners and limit height
              borderRadius: "0",
              overflow: "hidden",
            }}
            className="md:max-h-[90vh] md:rounded-2xl md:mx-8"
          >
            <SarahHeader onEnd={handleEndConversation} onSave={downloadPDF} messageCount={messages.length} />

            {/* Messages */}
            <div ref={scrollContainerRef} style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: "16px", scrollbarWidth: "thin", scrollbarColor: "rgba(198,161,91,0.15) transparent" }}>
              {messages.map((msg, i) => (
                <React.Fragment key={i}>
                  <MessageBubble msg={msg} index={i} scrollRef={scrollContainerRef} />
                </React.Fragment>
              ))}

              {isThinking && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", animation: "sarahMsgIn 0.3s ease forwards" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0, marginTop: "2px", background: ORB_BG, border: "1.5px solid rgba(198,161,91,0.6)", animation: "sarahOrbBreathe 1.6s ease-in-out infinite" }} />
                </div>
              )}

              {showLeadForm && !leadSubmitted && (
                <LeadForm
                  leadData={leadData}
                  setLeadData={setLeadData}
                  onSubmit={handleLeadSubmit}
                  onDismiss={() => { setShowLeadForm(false); setIsLockdown(false); }}
                />
              )}

              <div ref={messagesEndRef} />
            </div>

            <InputBar
              inputText={inputText}
              setInputText={setInputText}
              isThinking={isThinking}
              isLockdown={isLockdown}
              isMicActive={isMicActive}
              micSupported={micSupported}
              pendingDoc={pendingDoc}
              setPendingDoc={() => setPendingDoc(null)}
              inputRef={inputRef}
              fileInputRef={fileInputRef}
              onSend={handleSend}
              onMic={handleMic}
              onFileUpload={handleFileUpload}
            />
          </div>
        </div>
      )}

      {/* SCREEN 4 — Goodbye widget */}
      {screen === "goodbye" && (
        <div className="fixed z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{ bottom: "12px", left: "12px", right: "12px", width: "auto", maxWidth: "520px", margin: "0 auto", background: "linear-gradient(160deg, #0a2540 0%, #0B2A4A 40%, #0a1f35 100%)", boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,161,91,0.15)", animation: "sarahGoodbyeIn 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) forwards" }}>
          <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(198,161,91,0.12)", background: "linear-gradient(135deg, rgba(198,161,91,0.08) 0%, transparent 100%)", display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: ORB_BG, border: "2px solid rgba(198,161,91,0.6)" }} />
            <div>
              <p style={{ color: "#C6A15B", fontSize: "15px", fontWeight: 700 }}>Sarah</p>
              <p style={{ color: "rgba(247,247,245,0.4)", fontSize: "11px" }}>IHL Mortgage Concierge</p>
            </div>
          </div>
          <div style={{ padding: "20px 18px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0, marginTop: "2px", background: ORB_BG, border: "1.5px solid rgba(198,161,91,0.5)" }} />
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(198,161,91,0.12)", borderRadius: "4px 16px 16px 16px", padding: "14px 16px", color: "rgba(247,247,245,0.92)", fontSize: "14px", lineHeight: "1.7", borderLeft: "3px solid rgba(198,161,91,0.4)", flex: 1 }}>
                {goodbyeMessage}
              </div>
            </div>
            <p style={{ color: "rgba(247,247,245,0.2)", fontSize: "10px", textAlign: "center", marginTop: "4px" }}>
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
  if (location.pathname.startsWith("/deal-desk")) return null;
  return <MortgageConciergeInner />;
}