/**
 * Capture careers platform showcase frames as static WebP assets.
 * Requires dev server at http://localhost:3000
 *
 * Usage: node scripts/capture-careers-platform-assets.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = join(ROOT, "public", "careers");
const BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:3000";

const ASSETS = [
  { slug: "sarah", filename: "platform-sarah.webp" },
  { slug: "income-analyzer", filename: "platform-income-analyzer.webp" },
  { slug: "ma-command-center", filename: "platform-ma-command-center.webp" },
];

async function capture() {
  await mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 640, height: 400 } });

  for (const asset of ASSETS) {
    const url = `${BASE}/careers-asset-capture/${asset.slug}`;
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector("#careers-asset-capture");

    const buffer = await page.locator("#careers-asset-capture").screenshot({ type: "png" });
    const outPath = join(OUT_DIR, asset.filename.replace(".webp", ".png"));
    await writeFile(outPath, buffer);
    console.log(`Captured ${outPath}`);
  }

  await browser.close();
  console.log("Done. Convert PNG to WebP if desired, or update PlatformScreenshot paths.");
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
