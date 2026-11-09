/**
 * Free Consultation isolation regression guard.
 * Run: node scripts/verify-free-consultation.mjs
 * This deliberately tests wiring, not submission delivery or rendered UI.
 */
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const app = read("src/App.tsx");
const page = read("src/pages/FreeConsultation.tsx");
const vercel = JSON.parse(read("vercel.json"));
for (const route of ["/free-consultation", "/free-consultation/es"]) {
 assert(app.includes('path="' + route + '" element={<FreeConsultation />}'), "Missing standalone route: " + route);
 assert(app.includes('pathname === "' + route + '"'), "Missing chrome exclusion: " + route);
}
assert(app.includes('!onCareers && <Navbar />'), "Navbar exclusion changed");
assert(app.includes('isCareersChromeHidden(pathname)'), "Footer exclusion changed");
assert(app.includes('!onCareers &&') && app.includes('<MortgageConcierge />'), "Floating agent exclusion changed");
assert(!vercel.rewrites.some(r => r.source.toLowerCase().startsWith("/free-consultation")), "External rewrite shadows Free Consultation");
assert(page.includes('apiUrl("/api/submit-lead")'), "Lead submission endpoint changed");
assert(page.includes('smsConsentSource:"/free-consultation"'), "Consent attribution changed");
assert(page.includes('"/free-consultation/es"'), "Spanish page toggle missing");
assert(page.includes('"/knowledge/knowledge-buying-home.png"'), "Local hero image changed");
console.log("Free Consultation isolation checks passed.");
