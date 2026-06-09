/** Shared Sarah visual identity — one orb, all experiences. */
export const SARAH_ORB_GRADIENT =
  "radial-gradient(circle at 30% 28%, rgba(255,240,190,0.95) 0%, rgba(198,161,91,0.9) 15%, rgba(15,55,100,0.95) 38%, rgba(5,25,55,0.98) 65%, rgba(2,8,22,1) 100%)";

export const SARAH_KEYFRAMES_CSS = `
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
  @media (prefers-reduced-motion: reduce) {
    .sarah-orb--animated, .sarah-orb--streaming, .sarah-orb--fab {
      animation: none !important;
    }
  }
`;

export type SarahOrbSize = "sm" | "md" | "lg";

const ORB_SIZE_PX: Record<SarahOrbSize, number> = {
  sm: 28,
  md: 38,
  lg: 70,
};

export function sarahOrbDiameter(size: SarahOrbSize): number {
  return ORB_SIZE_PX[size];
}
