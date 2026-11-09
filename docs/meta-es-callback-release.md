# META ES nurture — callback release and recovery record

Status: implementation tested locally; deployment and creation of the two server credentials approved by Javier on November 9, 2026; **live verification still pending; Brevo automation 11 remains inactive**.
Observed: November 9, 2026, Eastern time. This record supersedes historical claims that the last five emails were still missing. It does not certify live delivery.

## Brevo audit observed in this session

- Workflow: `IHL | Meta ES | 50 | Alternate Fridays`, automation 11.
- Trigger: contact added to `IHL | Meta | ES | Purchase | Eligible`, list 6.
- All 50 email nodes are present. The visible chain alternates an email and a 13-day wait, with 49 waits and an exit after email 50; no adjacent email sends or consecutive leftover waits were observed.
- Anchor checks: email 1 step 2, email 15 step 52, email 25 step 72, email 36 step 94, email 42 step 106, 43 step 108, 44 step 110, 45 step 112, 46 step 113, 47 step 114, 48 step 115, 49 step 116, 50 step 117.
- Subjects and previews 42–50 match the approved review source. Templates 46–50 are present. A transient template synchronization error on email 50 cleared after reloading; its saved design was then visible.
- Email 50 sends Friday 10:00–10:15, timezone New York; sender and reply-to Javier.Cifuentes@infinitehomelending.com. This window must still be checked across every send action before release.
- Re-entry is off. Exit rules: removal from list 6 and unsubscribe from any email. Settings saved successfully.
- The first email uses `{{ contact.IHL_META_CTA_01 }}`. The campaign uses analogous per-email fields; these have not been populated or tested live.
- The existing `Solicitud de contacto` form is unfinished. It is not the deployed callback solution and should not be used to claim a successful callback test.
- Approved source contains 18 of 50 program-focused emails (36%), exceeding the requested 30%.

## Implementation in this branch

- Signed, per-contact/per-email confirmation URLs; email and phone do not appear in the URL.
- GET renders a Spanish confirmation page with no mutations. Signed POST queues one contact-level request for this campaign version; repeated clicks, including other emails in the same journey, do not duplicate it.
- Encrypted private S3 storage with conditional writes and persisted job claims.
- Pause removes only list 6 membership and verifies removal, firing the existing Brevo exit rule. It does not unsubscribe the contact globally or alter consent.
- Associated HubSpot task preserves existing contact ownership, includes campaign and trigger-email attribution, and creates a contact only if the email does not already exist.
- Internal alert goes to Javier. A failed/uncertain task is held for review and is identified in the alert when the contact can be resolved. Uncertain external writes are never blindly repeated; service logs identify jobs requiring review.
- Authenticated provisioning creates 50 text URL attributes and the boolean `IHL_META_READY`, stores contacts durably, verifies all 50 URL values, then sets the ready flag. It never subscribes or enrolls anyone.
- Feature is disabled by default. Availability endpoint exposes only the boolean availability, not private contact data.

## Release configuration

Existing integrations: `BREVO_API_KEY`, `HUBSPOT_API_KEY`, AWS/S3 settings. Required new settings:

| Setting | Value or requirement |
| --- | --- |
| `META_ES_CALLBACK_ENABLED` | `true` only at controlled release |
| `META_ES_ELIGIBLE_LIST_ID` | `6`, after verifying the current Brevo list |
| `META_ES_LINK_SECRET` | New random secret, at least 32 characters; preserve it so existing links remain valid |
| `META_ES_ADMIN_SECRET` | Separate new random secret, at least 32 characters; server/operator only |
| `API_BASE_URL` | Verify it is the public API origin serving this deployment; production fallback is the existing Railway API |

Do not place secrets or prospect data in Git, PR text, files committed to this branch, browser URLs, or public logs.

## Deployment dependency

The existing Railway `cooperative-passion / infinite-home-lending` service tracks `main` and auto-deploys GitHub pushes. Its current active deployment is the Realtor partnership callback release. There is **one pre-existing, unrelated staged employee-ID configuration change** (`VITE_MA_EMPLOYEE_IDS`). Its values were inspected privately, left pending, and are not reproduced here. Do not apply or discard that pending change as part of this release without resolving it with the owner. This branch is based on current `main`; it does not include the separate frontend `production/individual-links` branch.

## Mandatory remaining release checks

1. Review the branch, identify the unrelated pending Railway change, and obtain the required approval to create new server credentials and enable the authenticated callback service. Deploy only the intended change.
2. Verify the authenticated prepare endpoint and S3 permissions with Javier's existing Brevo test contact first. `POST /api/meta-es/prepare` accepts `{ "contactIds": ["<existing Brevo ID>"] }` with bearer authorization. It returns a per-contact result; do not treat partial failure as success.
3. Add an initial Brevo readiness gate (`IHL_META_READY` is true) before the first email. Verify the gate's actual behavior for new entries; contacts must not reach a send while their links are blank.
4. Send individual controlled tests from emails 1 and 50. Confirm actual delivery, first-name rendering, all CTA URLs, phone layout, unsubscribe link, and the reply address. Brevo's top-level Test sends **all 50 messages** and does not test non-message actions; it cannot establish stop-rule correctness.
5. Confirm live GET makes no task, no alert, and no pause. Confirm POST removes the test contact from list 6, the Brevo activity shows exit, the associated HubSpot task appears, and Javier actually receives the internal alert with correct source-email attribution.
6. Repeat the click and confirm there is still one task/alert for that contact and version. Check failure/restart behavior in a controlled environment.
7. Provision all approved contacts and verify ready flags. Verify the existing lead-entry/sync path provisions new contacts before their first send. This branch does not assume a Meta form submission grants marketing permission and does not create that synchronization.
8. Check Friday windows/timezones on all 50 actions. Confirm 13-day waits plus Friday gating produce alternate Fridays in the actual Brevo activity, including timezone/DST behavior.
9. Wire and test application/active-borrower, reply/appointment, and manual-pause signals to removal from list 6. **This branch handles confirmed callback requests, not those upstream CRM events.** Unsubscribe/list removal rules alone do not prove these signals are connected.
10. Verify permissions, exclusions, hard-bounce/complaint handling, sender authentication, and the current actual audience. Only then activate automation 11. Do not enroll unrelated refinance, equity, or reverse leads.

## Validation evidence

- Callback HTTP, queue, scanner, tampering, restart, duplicate-click, and provisioning tests; provider payload/readback tests; existing calculator regression tests.
- Run with `node --import tsx --test tests/metaNurtureCallback.test.ts tests/metaNurtureProviders.test.ts tests/calculatorAutomation.test.ts`.
- Local tests use fake provider responses and an in-memory store. They do not certify live S3/Brevo/HubSpot permissions, delivery, or production behavior.
- All 30 selected tests passed (16 new callback/provider tests and 14 existing calculator tests), including concurrent worker claims, no job writes for completed requests, and password-authenticated browser provisioning without URL credentials.
- Production build passed; the individual-link protection check passed all 44 registered rewrites.
- TypeScript on unchanged main `ce852211326e6ad93c9d4bb01e219760ea5493d1`: 32 errors. This branch: 32 errors, byte-identical diagnostic output. No new TypeScript errors.

Primary API references: [Brevo update contact](https://developers.brevo.com/reference/update-contact), [Brevo contact attributes](https://developers.brevo.com/reference/create-attribute), [HubSpot tasks](https://developers.hubspot.com/docs/api-reference/legacy/crm/activities/tasks/guide).
