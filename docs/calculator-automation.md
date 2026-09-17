# IHL calculator pilot — HubSpot and Brevo

The calculator keeps its public results and offers an optional emailed copy. The report is an illustration of separate scenarios, not a net cost of waiting. English and Spanish are supported. No SMS is sent.

## Flow

POST /api/calculator-reports validates assumptions and saves a durable request before returning HTTP 202 (queued, not delivered). Repeated identical submission IDs return the same acknowledgement; changed requests using an existing ID return 409.

A backend worker claims each job using conditional S3 writes. It finds or creates a HubSpot contact by email, preserves existing contact fields, and attaches the full assumptions, consent disclosure/version, timestamp and UTMs in a scenario note. New contacts are assigned to Javier; no deal is automatically created. Note markers let retries reconcile an existing note.

Brevo sends the requested report and a separate internal notification to Javier. Provider acceptance and confirmed delivery are distinct states. A missing/ambiguous provider response stops automatic resending for review. Known rate limits retry with bounded backoff. Delivery failures suppress follow-up emails.

Only an explicit, unchecked-by-default opt-in permits up to two follow-up emails: two days and five days after confirmed report delivery. Before each send, the worker checks scoped suppression, HubSpot opt-out, logged reply/contact/meeting activity, changed lead status, and Brevo blacklist. Failure to read those signals prevents the send. The second follow-up waits for confirmed first-follow-up delivery. Neither the requested report nor calculator follow-ups enroll contacts in existing Brevo journeys.

Signed links show a confirmation form. GET requests cannot opt out or request conversations, protecting against automated email link scanners. Confirmed conversation requests stop follow-ups and queue an advisor notification; they do not book a meeting. Calculator unsubscribe is scoped to these emails; it does not change unrelated CRM marketing subscriptions.

## Configuration and activation

Existing backend variables required: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET, HUBSPOT_API_KEY, BREVO_API_KEY. API keys stay on the server. Private encrypted state is at uploads/automation/calculator-pilot-v1.json. The bucket needs GetObject and conditional PutObject permission on this key. No new public bucket or database is required for this bounded pilot.

- CALCULATOR_REPORTS_ENABLED=true enables intake and the worker. Default: disabled.
- CALCULATOR_NURTURE_ENABLED=true enables follow-ups. Default: disabled. **Verify reply logging from the actual reply-to mailbox before enabling**, or unanswered replies outside HubSpot cannot reliably stop automated follow-ups.
- CALCULATOR_LINK_SECRET: optional stable private signing secret. Defaults to the existing Brevo API key; rotating that key invalidates old links unless a stable separate secret is configured.
- API_BASE_URL: public backend base URL, otherwise the existing Railway domain is used.
- CALCULATOR_SENDER_EMAIL: optional already-verified Brevo sender, default info@infinitehomelending.com.

The frontend shows the form only when the backend availability endpoint reports enabled. A Vercel rewrite provides a same-origin fallback. Existing Railway staged variable changes must be reviewed separately; do not bulk-deploy unrelated changes when enabling this feature.

## Verification

Automated tests: `node --import tsx --test tests/calculatorAutomation.test.ts`.
Production bundle: `npm run build`.
Repository-wide `npm run lint` has existing unrelated TypeScript failures; compare against baseline and fix any new feature errors before activation.

Live acceptance requires a designated test recipient:
1. Submit one report with follow-up consent unchecked. Confirm queued UI, saved private state, correct HubSpot contact and scenario note, Brevo message ID and delivered event, actual inbox content, and advisor notification.
2. Retry the same request. Confirm one contact/note/report per submission.
3. Submit an opted-in scenario. Verify signed unsubscribe GET does nothing and confirmed POST stops the calculator emails.
4. Verify conversation request notification and cancellation. Verify a real reply is logged in HubSpot before turning on nurture.
5. Confirm an existing contact's owner/status/profile is preserved. Verify Spanish content, negative home-price changes, lower future rate, zero rate, and all-cash scenarios.

There are no claims of live acceptance until those checks pass.

## Operation and limits

The pilot caps storage at 500 requests, intake at 100/day and three requests per email/hour. It is intentionally bounded; it is not a scalable database or a complete bot defense. Before paid traffic, add a challenge/rate limiter at the edge and migrate to a database/queue with retention policy if volume warrants it. At capacity intake stops rather than dropping records. No automatic deletion is performed.

Run `npx tsx scripts/calculator-queue.ts` in the backend environment daily during the pilot. It reads queue states and message IDs without contact details or signed tokens. Review `review` jobs in Brevo logs using the submission tag and message IDs, or HubSpot activity marker for CRM jobs. Never blindly requeue uncertain sends. This version does not automatically alert on stalled/review jobs; daily operator review is required. Turn CALCULATOR_REPORTS_ENABLED off to stop intake/worker, and CALCULATOR_NURTURE_ENABLED off to pause follow-ups.

## Acquisition rollout

Start with one organic calculator link using utm_source, utm_medium and utm_campaign. Ask a small number of existing Realtor partners to share individually tagged links after live acceptance. Measure requests, delivered reports, opt-ins, conversation requests, actual contacts and qualified opportunities. Do not treat opens as conversions.

Paid Meta traffic needs a separately agreed budget, audience, creatives and tracking consent implementation. No campaign is created or funded by this implementation. ManyChat, additional calculators, SMS and larger multi-journey nurture come after this funnel works and measured conversation quality justifies expansion. The Gemini lead-cost and conversion estimates are hypotheses, not forecasts.
