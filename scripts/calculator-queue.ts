import "../src/server/loadEnv";
import { S3CalculatorStore } from "../src/server/calculatorAutomationStore";
import { getS3Client } from "../src/server/lib/s3Upload";
// Run in the backend environment: npx tsx scripts/calculator-queue.ts
// Does not send messages, change jobs, or print contact details/tokens.
const store = new S3CalculatorStore(getS3Client(), process.env.S3_BUCKET!);
const state = await store.read();
console.log(JSON.stringify({ totalRequests: Object.keys(state.leads).length, suppressedEmails: Object.keys(state.suppressedEmails).length, requests: Object.entries(state.leads).map(([submissionId, l]) => ({ submissionId, createdAt: new Date(l.createdAt).toISOString(), stopReason: l.stopReason, jobs: l.jobs })) }, null, 2));
