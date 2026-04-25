import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

const envPath = path.resolve(process.cwd(), ".env");

/** `override: true` so root `.env` wins over stale shell exports (e.g. old LEAD_ADVISOR_EMAIL). */
const result = dotenv.config({ path: envPath, override: true });

if (result.error) {
  console.error("❌ FAILED TO LOAD .env FROM:", envPath);
} else {
  console.log("✅ .env LOADED FROM:", envPath);
}

if (fs.existsSync(envPath)) {
  console.log("📁 .env FILE EXISTS");
} else {
  console.error("🚨 .env FILE DOES NOT EXIST AT:", envPath);
}
