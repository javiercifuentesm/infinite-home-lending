import { useEffect, useState, type MouseEvent } from "react";
import { SarahKeyframes } from "../sarah/SarahKeyframes";
import { SarahOrb } from "../sarah/SarahOrb";
import { isCareersSarahDiscoveryMode } from "../../config/careersSarah";
import SarahCareersChat, {
  DISCOVERY_CHAT_ENDPOINT,
} from "./SarahCareersChat";

const IS_MOBILE = () => typeof window !== "undefined" && window.innerWidth < 768;

const NUDGE_SESSION_KEY = "ihl-sarah-careers-nudge-seen";
const NUDGE_DELAY_MS = 3500;

const NUDGE_COPY =
  "Welcome — I'm Sarah. I'm here if you'd like a warm introduction to Infinite Home Lending, our platform, and the Mortgage Advisor opportunity.";

type Screen = "idle" | "open";

const PANEL_SHADOW = "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(198,161,91,0.15)";

/** Floating bottom-right Careers Sarah — opens centered modal immediately on click. */
export function SarahCareersFloating() {
  const [screen, setScreen] = useState<Screen>("idle");
  const [showNudge, setShowNudge] = useState(false);
  const [chatSession, setChatSession] = useState(0);
  const [discoveryMode] = useState(isCareersSarahDiscoveryMode);
  const mobile = IS_MOBILE();

  useEffect(() => {
    if (sessionStorage.getItem(NUDGE_SESSION_KEY)) return;
    const timer = window.setTimeout(() => setShowNudge(true), NUDGE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (screen === "open") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [screen]);

  const dismissNudge = () => {
    sessionStorage.setItem(NUDGE_SESSION_KEY, "1");
    setShowNudge(false);
  };

  const handleOpen = () => {
    dismissNudge();
    setChatSession((s) => s + 1);
    setScreen("open");
  };

  const handleClose = () => {
    setScreen("idle");
  };

  const handleDismissClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dismissNudge();
  };

  return (
    <>
      <SarahKeyframes />

      {screen === "idle" && (
        <div
          className="fixed z-50"
          style={{
            bottom: mobile ? "16px" : "16px",
            right: mobile ? "16px" : "16px",
            display: "flex",
            flexDirection: mobile ? "column" : "row-reverse",
            alignItems: "flex-end",
            gap: "12px",
            maxWidth: mobile ? "calc(100vw - 32px)" : "none",
          }}
        >
          {showNudge && (
            <div
              style={{
                background: "linear-gradient(160deg, rgba(10,37,64,0.97) 0%, rgba(11,42,74,0.97) 100%)",
                border: "1px solid rgba(198,161,91,0.22)",
                borderRadius: "12px",
                padding: "14px 36px 14px 16px",
                maxWidth: mobile ? "100%" : "280px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)",
                position: "relative",
                animation: "sarahMsgIn 0.5s ease forwards",
              }}
            >
              <button
                type="button"
                onClick={handleDismissClick}
                aria-label="Dismiss welcome message"
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "none",
                  border: "none",
                  color: "rgba(247,247,245,0.35)",
                  fontSize: "16px",
                  lineHeight: 1,
                  padding: "2px 4px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
              <button
                type="button"
                onClick={handleOpen}
                aria-label="Open Sarah — welcome message"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color: "rgba(247,247,245,0.9)",
                    fontSize: "13px",
                    lineHeight: "1.65",
                    fontWeight: 400,
                  }}
                >
                  {NUDGE_COPY}
                </p>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={handleOpen}
            aria-label="Meet Sarah — Careers Assistant"
            style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flexShrink: 0 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                animation: "sarahBtnFloat 3.5s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "70px",
                  height: "70px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {[0, 0.9, 1.8].map((delay, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      border: "2px solid rgba(198,161,91,0.5)",
                      animation: `sarahBtnRing 2.8s ease-out ${delay}s infinite`,
                      pointerEvents: "none",
                    }}
                  />
                ))}
                <SarahOrb size="lg" fab className="relative z-[2]" />
              </div>
              <span
                style={{
                  color: "#C6A15B",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                  textShadow: "0 2px 8px rgba(0,0,0,0.6)",
                  textTransform: "uppercase",
                }}
              >
                Meet Sarah
              </span>
            </div>
          </button>
        </div>
      )}

      {screen === "open" && (
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
            padding: IS_MOBILE() ? "16px" : "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="flex min-h-0 w-full flex-col overflow-hidden md:mx-8 md:rounded-2xl"
            style={{
              maxWidth: "900px",
              height: IS_MOBILE() ? "100%" : "min(90vh, 700px)",
              maxHeight: IS_MOBILE() ? "100dvh" : "90vh",
              background: "linear-gradient(160deg, #0a2540 0%, #0B2A4A 50%, #071a2e 100%)",
              boxShadow: PANEL_SHADOW,
              animation: "sarahWidgetExpand 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <SarahCareersChat
              key={chatSession}
              floating
              onClose={handleClose}
              chatEndpoint={discoveryMode ? DISCOVERY_CHAT_ENDPOINT : undefined}
              variantLabel={discoveryMode ? "Discovery Prototype v1" : undefined}
            />
          </div>
        </div>
      )}
    </>
  );
}
