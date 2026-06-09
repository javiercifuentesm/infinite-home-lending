/** Blinking cursor shown while Sarah streams a reply. */
export function SarahStreamingCursor() {
  return (
    <span
      style={{
        display: "inline-block",
        width: "2px",
        height: "14px",
        backgroundColor: "#C6A15B",
        marginLeft: "3px",
        verticalAlign: "middle",
        animation: "sarahCursor 0.7s ease infinite",
        borderRadius: "1px",
      }}
      aria-hidden
    />
  );
}
