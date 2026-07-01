import { toPng } from "html-to-image";

export type SocialExportMeta = {
  collection: string;
  postId: string;
  platform: string;
  width: number;
  height: number;
};

export function buildSocialExportFilename(
  collection: string,
  postId: string,
  platform: string,
  date = new Date(),
): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}-${collection}-${postId}-${platform}.png`;
}

async function waitForCanvasAssets(canvas: HTMLElement): Promise<void> {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const images = [...canvas.querySelectorAll("img")];
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }

          const finish = () => resolve();
          img.addEventListener("load", finish, { once: true });
          img.addEventListener("error", finish, { once: true });
        }),
    ),
  );
}

function triggerDownload(dataUrl: string, filename: string): void {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

/** Capture the social canvas at true 1:1 export resolution (no preview scaling). */
export async function exportSocialCanvasPng(
  canvas: HTMLElement,
  meta: SocialExportMeta,
): Promise<string> {
  await waitForCanvasAssets(canvas);

  const dataUrl = await toPng(canvas, {
    width: meta.width,
    height: meta.height,
    canvasWidth: meta.width,
    canvasHeight: meta.height,
    pixelRatio: 1,
    backgroundColor: "#ffffff",
    cacheBust: true,
    skipAutoScale: true,
    style: {
      transform: "none",
      margin: "0",
    },
  });

  const filename = buildSocialExportFilename(
    meta.collection,
    meta.postId,
    meta.platform,
  );
  triggerDownload(dataUrl, filename);
  return filename;
}
