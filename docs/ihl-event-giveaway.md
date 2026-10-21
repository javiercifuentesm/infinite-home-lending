# IHL event giveaway — October 21, 2026

Public path: /The-IHL-Event-Giveaway. Dedicated static HTML, CSS and JS in public/The-IHL-Event-Giveaway; no main-site UI changes. Rules: /The-IHL-Event-Giveaway/rules.

Backend: /api/event-giveaway/entries, proxied to existing Railway API. Uses existing HUBSPOT_API_KEY, S3_BUCKET and AWS configuration. Never put server credentials in the Vite bundle. Private encrypted S3 object: uploads/automation/ihl-event-giveaway-2026-10-21.json. Conditional writes protect concurrent updates; email deduplication; persistent CRM queue retries with exponential backoff, max 12 attempts. Unresolved jobs stay saved for review. No test or date bypass in production.

Readiness: GET /api/event-giveaway/readiness (configuration booleans only; no participant data). Contact read/write and notes read/write scopes are needed. Optional marketing opt-in additionally needs HubSpot communication_preferences.read and communication_preferences.write (or read_write) and one active Email/Marketing subscription named Marketing Information. Existing global/type opt-outs are preserved; re-subscription requires a separate supported process. Without opt-in, no subscription API is called. No marketing emails are sent by this code and no SMS consent is collected. Marketing-contact billing status and existing HubSpot workflow enrollment must be reviewed separately before campaigns.

New contacts receive name/email/company/role/optional phone and Javier as owner. Existing contacts are reused without overwriting their profile or owner. Event, company/role supplied, entry reference, timestamp, exact checkbox wording and consent version are recorded in an associated note. No mortgage deal is created. The event-specific queue does not enter calculator nurture.

## RESPA review — not a legal clearance

Primary sources checked October 15, 2026:
- https://www.consumerfinance.gov/compliance/compliance-resources/mortgage-resources/real-estate-settlement-procedures-act/real-estate-settlement-procedures-act-faqs/
- https://www.consumerfinance.gov/rules-policy/regulations/1024/14/

Section 8 has no gift-value safe harbor. The normal promotional/educational exception requires no conditioning on referrals and no defraying costs a referral source would otherwise incur. A broad one-time drawing with equal opportunities and no referral or business condition is favorable, but does not by itself resolve every condition. CFPB's drawing example uses a recreational item, not an unrestricted gift card. Our concern about unrestricted Amazon cards as expense substitutes is an inference, not an express CFPB determination about this event. Obtain RESPA counsel's review of the prize choice and actual event arrangement before running the promotion. Also review applicable Maryland giveaway requirements separately. No claim is made that no-purchase wording alone establishes compliance.

Rules currently use 11 a.m.–3:30 p.m. Eastern, two distinct winners ($75/$25), total prize value $100, one entry per person, no application/transaction/referral or email subscription required, and 48 hours to respond to winner notice. Confirm these operational choices with Lina and Alma before the event.

## Verification
- npm run build
- node --import tsx scripts/tests/event-giveaway.ts (mocked services only)
- focused TypeScript check on src/server/eventGiveawayRoute.ts
- Check public URL and readiness after deployment; real HubSpot write/subscription verification still needed before launch.
