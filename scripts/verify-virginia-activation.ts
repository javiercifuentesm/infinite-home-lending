import fs from "node:fs";
import path from "node:path";
import {
  detectPropertyState,
  generateAssignmentSection,
  getMortgageAdvisors,
  isAdvisorAuthorizedForState,
} from "../src/server/mortgageConciergeSendLeadRoute";

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");
const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const en = read("src/i18n/en.ts");
const es = read("src/i18n/es.ts");
const contact = read("src/components/contact/StrategicContactExperience.tsx");
const requestCall = read("src/pages/RequestACall.tsx");
const sitemap = read("public/sitemap.xml");

assert(en.includes("Virginia Broker License — MC-8214"), "English Virginia license disclosure is missing.");
assert(es.includes("Virginia Broker License — MC-8214"), "Spanish Virginia license disclosure is missing.");
assert(!en.includes("Virginia License Pending Approval"), "English pending-license copy remains.");
assert(!es.includes("Licencia de Virginia pendiente de aprobación"), "Spanish pending-license copy remains.");
assert(contact.includes('<option value="VA">Virginia</option>'), "Contact form is missing Virginia.");
assert(requestCall.includes('<option value="VA">Virginia</option>'), "Request-a-call form is missing Virginia.");
assert(sitemap.includes("https://www.infinitehomelending.com/licensing"), "Licensing route is missing from sitemap.");
assert(!/loan-solutions|how-we-work|\/knowledge<\/loc>/.test(sitemap), "A stale sitemap route remains.");

process.env.MORTGAGE_ADVISORS =
  "MD Advisor:md@example.com:MD|DC,VA Advisor:va@example.com:VA|DC";
const advisors = getMortgageAdvisors();
const vaEligible = advisors.filter((advisor) => isAdvisorAuthorizedForState(advisor, "VA"));

assert(detectPropertyState("My property is in Fairfax, Virginia") === "VA", "Virginia detection failed.");
assert(vaEligible.length === 1 && vaEligible[0]?.email === "va@example.com", "Virginia advisor filtering failed.");
assert(
  generateAssignmentSection([], "https://example.com").includes("Manual assignment required"),
  "Fail-closed assignment notice is missing.",
);

console.log("Virginia activation verification passed.");
