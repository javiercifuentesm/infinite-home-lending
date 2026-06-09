import type { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { IncomeAnalyzer } from "../components/ma-dashboard/IncomeAnalyzer";
import { MADashboardShell } from "../components/ma-dashboard/MADashboardShell";
import MortgageConcierge from "../components/MortgageConcierge";

const CAPTURE_FRAME = {
  width: 640,
  height: 400,
} as const;

function CaptureFrame({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      style={{
        width: CAPTURE_FRAME.width,
        height: CAPTURE_FRAME.height,
        overflow: "hidden",
        margin: 0,
        padding: 0,
        position: "relative",
        background: "#F8F7F4",
      }}
    >
      <div
        style={{
          width: 1280,
          height: 800,
          transform: "scale(0.5)",
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Internal route for generating careers platform screenshot assets from live UI. */
export default function CareersAssetCapture() {
  const { asset } = useParams<{ asset: string }>();

  if (asset === "sarah") {
    return (
      <div
        id="careers-asset-capture"
        style={{
          width: CAPTURE_FRAME.width,
          height: CAPTURE_FRAME.height,
          overflow: "hidden",
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#0a1f35",
        }}
      >
        <MortgageConcierge assetCapture />
      </div>
    );
  }

  if (asset === "income-analyzer") {
    return (
      <CaptureFrame id="careers-asset-capture">
        <div className="p-8">
          <IncomeAnalyzer />
        </div>
      </CaptureFrame>
    );
  }

  if (asset === "ma-command-center") {
    return (
      <CaptureFrame id="careers-asset-capture">
        <MADashboardShell
          onLogout={() => {}}
          initialModule="market-pulse"
          captureMode
        />
      </CaptureFrame>
    );
  }

  return null;
}
