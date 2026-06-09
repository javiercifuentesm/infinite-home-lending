import { SARAH_ORB_GRADIENT, type SarahOrbSize, sarahOrbDiameter } from "./sarahIdentity";

type SarahOrbProps = {
  size?: SarahOrbSize;
  /** Message bubble / thinking state */
  streaming?: boolean;
  /** Idle header orb — subtle presence without breathe */
  static?: boolean;
  /** Floating action button orb */
  fab?: boolean;
  /** Header orb with green online indicator */
  showOnlineDot?: boolean;
  className?: string;
};

export function SarahOrb({
  size = "sm",
  streaming = false,
  static: isStatic = false,
  fab = false,
  showOnlineDot = false,
  className = "",
}: SarahOrbProps) {
  const px = sarahOrbDiameter(size);

  let borderWidth = "1.5px";
  let borderColor = "rgba(198,161,91,0.5)";
  let boxShadow = streaming
    ? "0 0 12px rgba(198,161,91,0.4)"
    : "0 0 8px rgba(198,161,91,0.2)";
  let animation: string | undefined;
  let extraClass = "";

  if (size === "md") {
    borderWidth = "2px";
    borderColor = "rgba(198,161,91,0.6)";
    boxShadow = "0 0 20px rgba(198,161,91,0.2)";
  }

  if (fab || size === "lg") {
    borderWidth = "3px";
    borderColor = "rgba(198,161,91,0.95)";
    boxShadow = "0 0 0 4px rgba(11,42,74,0.4), 0 8px 32px rgba(0,0,0,0.5)";
    animation = "sarahBtnPulse 2.5s ease-in-out infinite";
    extraClass = "sarah-orb--fab";
  } else if (streaming) {
    animation = "sarahOrbBreathe 1.6s ease-in-out infinite";
    extraClass = "sarah-orb--streaming";
  } else if (!isStatic) {
    animation = "sarahOrbBreathe 1.6s ease-in-out infinite";
    extraClass = "sarah-orb--animated";
  }

  const orb = (
    <div
      className={`sarah-orb ${extraClass} ${className}`.trim()}
      style={{
        width: px,
        height: px,
        borderRadius: "50%",
        background: SARAH_ORB_GRADIENT,
        border: `${borderWidth} solid ${borderColor}`,
        boxShadow,
        animation,
        flexShrink: 0,
      }}
      aria-hidden
    />
  );

  if (!showOnlineDot || size !== "md") {
    return orb;
  }

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {orb}
      <div
        style={{
          position: "absolute",
          bottom: "1px",
          right: "1px",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#22c55e",
          border: "2px solid #0B2A4A",
        }}
        aria-hidden
      />
    </div>
  );
}
