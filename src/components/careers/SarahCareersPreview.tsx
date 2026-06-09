import { careersColors, careersFonts } from "./careersTheme";

const CONVERSATION = [
  {
    role: "user" as const,
    text: "What does day one look like for a new advisor at IHL?",
  },
  {
    role: "sarah" as const,
    text: "Day one means full platform access — Sarah for client education, the Income Analyzer for structured income review, and the MA Command Center for pipeline and operations. You are not building systems from scratch.",
  },
  {
    role: "user" as const,
    text: "How does IHL approach compensation and independence?",
  },
  {
    role: "sarah" as const,
    text: "IHL is broker-independent with no bank overlays. Compensation is discussed directly and tied to the value you create. The founders are accessible — there is no layered bureaucracy between you and firm leadership.",
  },
  {
    role: "user" as const,
    text: "What kind of advisor tends to thrive here?",
  },
  {
    role: "sarah" as const,
    text: "Advisors who think strategically, communicate clearly, and prefer depth in one market over volume across many. Washington, DC is where the firm is focused.",
  },
];

export function SarahCareersPreview() {
  return (
    <div
      className="flex min-h-[380px] min-w-0 flex-col rounded-sm p-4 sm:min-h-[420px] sm:p-6"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.1)",
      }}
      aria-label="Sarah careers conversation preview"
    >
      <div className="mb-4 border-b pb-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-sm font-medium text-white">Sarah</p>
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Careers Assistant · Preview
        </p>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-hidden">
        {CONVERSATION.map((msg, i) => (
          <div
            key={i}
            className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className="max-w-[92%] break-words rounded-sm px-3.5 py-2.5 text-[12px] leading-relaxed sm:max-w-[88%]"
              style={
                msg.role === "user"
                  ? {
                      background: "rgba(198,161,91,0.12)",
                      border: "0.5px solid rgba(198,161,91,0.2)",
                      color: "rgba(255,255,255,0.82)",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.72)",
                    }
              }
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="min-w-0 flex-1 rounded-sm px-4 py-3 text-sm"
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.25)",
            border: "0.5px solid rgba(255,255,255,0.08)",
            fontFamily: careersFonts.body,
          }}
        >
          Ask Sarah about the opportunity…
        </div>
        <button
          type="button"
          disabled
          className="shrink-0 px-4 py-3 text-[11px] uppercase tracking-[0.1em] sm:min-h-[44px]"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.35)",
            border: "none",
            cursor: "not-allowed",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
