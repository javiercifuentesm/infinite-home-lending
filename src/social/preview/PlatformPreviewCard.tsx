import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { SocialPlatformFormat } from "../config/platformFormats";
import { SOCIAL_EXPORT_DEFAULTS } from "../config/platformFormats";
import { exportSocialCanvasPng } from "./exportSocialCanvasPng";

type PlatformPreviewCardProps = {
  platform: SocialPlatformFormat;
  postId?: string;
  canvasSelector?: string;
  children: ReactNode;
};

export function PlatformPreviewCard({
  platform,
  postId,
  canvasSelector,
  children,
}: PlatformPreviewCardProps) {
  const [scale, setScale] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateScale = () => {
      const availableWidth = frame.clientWidth;
      const scaleW = availableWidth / platform.width;
      setScale(Math.min(1, scaleW));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [platform.width]);

  const viewportWidth = platform.width * scale;
  const viewportHeight = platform.height * scale;

  const handleExport = useCallback(async () => {
    const selector = canvasSelector ?? platform.canvasSelector;
    const canvas = canvasHostRef.current?.querySelector<HTMLElement>(selector);

    if (!canvas) {
      setExportError("Canvas not found. Refresh and try again.");
      return;
    }

    setExporting(true);
    setExportError(null);

    try {
      await exportSocialCanvasPng(canvas, {
        collection: SOCIAL_EXPORT_DEFAULTS.collection,
        postId: postId ?? SOCIAL_EXPORT_DEFAULTS.postId,
        platform: platform.platformSuffix,
        width: platform.width,
        height: platform.height,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Export failed. Please try again.";
      setExportError(message);
    } finally {
      setExporting(false);
    }
  }, [canvasSelector, platform, postId]);

  return (
    <article className="social-platform-card">
      <header className="social-platform-card__header">
        <div>
          <h2 className="social-platform-card__title">{platform.label}</h2>
          <p className="social-platform-card__dimensions">
            {platform.width} × {platform.height} px
          </p>
        </div>
        <button
          type="button"
          className="social-preview-export-btn social-platform-card__export"
          onClick={handleExport}
          disabled={exporting}
          aria-busy={exporting}
        >
          Export PNG
        </button>
      </header>

      {exportError ? (
        <p className="social-platform-card__error" role="alert">
          {exportError}
        </p>
      ) : null}

      <div className="social-platform-card__frame" ref={frameRef}>
        <div
          className="social-platform-card__viewport"
          style={{ width: viewportWidth, height: viewportHeight }}
        >
          <div
            ref={canvasHostRef}
            className="social-preview-scale"
            style={{
              transform: `scale(${scale})`,
              width: platform.width,
              height: platform.height,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}
