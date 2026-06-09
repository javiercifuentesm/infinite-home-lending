import type { ReactNode } from "react";

const BODY_COLOR = "rgba(247,247,245,0.92)";

function parseBold(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} style={{ fontWeight: 600, color: BODY_COLOR }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function renderLines(text: string): ReactNode {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const trimmed = line.trim();

    if (/^\*\*[^*]+\*\*:?$/.test(trimmed)) {
      const label = trimmed.replace(/\*\*/g, "").replace(/:$/, "");
      return (
        <div
          key={i}
          style={{
            color: BODY_COLOR,
            fontWeight: 600,
            fontSize: "14px",
            marginTop: i > 0 ? "8px" : "0",
            marginBottom: "4px",
          }}
        >
          {label}
        </div>
      );
    }

    const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) {
      return (
        <div
          key={i}
          style={{ display: "flex", gap: "10px", marginBottom: "5px", alignItems: "flex-start" }}
        >
          <span
            style={{
              color: BODY_COLOR,
              fontWeight: 600,
              minWidth: "22px",
              flexShrink: 0,
              fontSize: "14px",
            }}
          >
            {numberedMatch[1]}.
          </span>
          <span style={{ flex: 1, color: BODY_COLOR }}>{parseBold(numberedMatch[2])}</span>
        </div>
      );
    }

    const bulletMatch = trimmed.match(/^[·\-•]\s+(.+)/);
    if (bulletMatch) {
      return (
        <div
          key={i}
          style={{ display: "flex", gap: "10px", marginBottom: "5px", alignItems: "flex-start" }}
        >
          <span
            style={{
              color: BODY_COLOR,
              fontWeight: 600,
              flexShrink: 0,
              fontSize: "14px",
              lineHeight: "1.4",
            }}
          >
            ›
          </span>
          <span style={{ flex: 1, color: BODY_COLOR }}>{parseBold(bulletMatch[1])}</span>
        </div>
      );
    }

    if (trimmed === "") {
      return <div key={i} style={{ height: "8px" }} />;
    }

    return (
      <div key={i} style={{ marginBottom: "4px", lineHeight: "1.7", color: BODY_COLOR }}>
        {parseBold(trimmed)}
      </div>
    );
  });
}

/** Limited markdown subset for Careers Sarah — safe plain-text fallback. */
export function renderSarahCareersMarkdown(text: string): ReactNode {
  if (!text) return null;
  try {
    return renderLines(text);
  } catch {
    return <span style={{ whiteSpace: "pre-wrap", color: BODY_COLOR }}>{text}</span>;
  }
}
