import { useState } from "react";
import { SarahShowcase } from "./platform-showcases/SarahShowcase";
import { IncomeAnalyzerShowcase } from "./platform-showcases/IncomeAnalyzerShowcase";
import { MACommandCenterShowcase } from "./platform-showcases/MACommandCenterShowcase";

const SCREENSHOT_ASSETS = {
  Sarah: "/careers/platform-sarah.png",
  "Income Analyzer": "/careers/platform-income-analyzer.png",
  "MA Command Center": "/careers/platform-ma-command-center.png",
} as const;

type PlatformKey = keyof typeof SCREENSHOT_ASSETS;

function ShowcaseContent({ platform }: { platform: PlatformKey }) {
  if (platform === "Sarah") return <SarahShowcase />;
  if (platform === "Income Analyzer") return <IncomeAnalyzerShowcase />;
  return <MACommandCenterShowcase />;
}

/** Editorial product frame with captured platform screenshot. */
export function PlatformScreenshot({ platform }: { platform: PlatformKey }) {
  const [useFallback, setUseFallback] = useState(false);
  const src = SCREENSHOT_ASSETS[platform];
  const alt = `${platform} — Infinite Home Lending platform`;

  return (
    <figure className="careers-platform-shot mt-6">
      <div className="careers-platform-shot__frame" aria-label={`${platform} platform preview`}>
        {useFallback ? (
          <ShowcaseContent platform={platform} />
        ) : (
          <img
            src={src}
            alt={alt}
            className="careers-platform-shot__img"
            loading="lazy"
            decoding="async"
            onError={() => setUseFallback(true)}
          />
        )}
      </div>
    </figure>
  );
}
