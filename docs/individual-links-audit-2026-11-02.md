# IHL individual links — audit and protection status

Verified November 2, 2026 (America/New_York).

**Result:** 19 primary entry URLs now render their intended pages. One advisor entry URL and its five known child routes remain unavailable because the original advisor-site implementation could not be recovered. Twenty-eight persistent domain-routing rules are live, with no staged changes remaining. Four external form/report routing rules remain blocked by automatic approval review; complete lead/report delivery is not certified.

All paths below use **https://www.infinitehomelending.com**. A slash added by the static host is an expected canonical redirect.

| Published entry URL | Page check | Protection / limitation |
|---|---|---|
| `/free-consultation` | English consultation renders; images and required fields checked | Independent page and persistent page/API routes |
| `/free-consultation/ES` | Spanish consultation renders, including direct reload | Same protected page; lowercase `/es` also supported |
| `/Talk-to-Alma` | Alma digital card renders | Persistent card and asset subtree route |
| `/talk-to-javier` | Javier digital card restored and renders | Persistent card and asset subtree route |
| `/home-financing-with-alma/temporary-buydowns` | Original newsletter restored and renders | Persistent article route |
| `/home-financing-with-alma` | Newsletter index restored and renders | Persistent index and asset subtree routes |
| `/my-homeownership-path` | Homeownership assessment renders | Page/assets protected; report/feedback API locking awaits approval |
| `/My-Home-Equity-Review` | Original equity assessment renders | Persistent page route; its source uses origin-hosted assets |
| `/home-equity-review` | Newer home-equity educational page restored and renders | Preserved static page, image/poster/video namespace; CTA uses callback form |
| `/my-reverse-mortgage-review` | Reverse assessment renders | Page/assets protected; report API locking awaits approval |
| `/FREE-Homebuying-Review` | Homebuying review restored and renders | Page/compiled assets protected; review-request API restoration awaits approval |
| `/FREE-Home-Equity-Review` | Free equity review restored and renders | Canonical redirect corrected; same review-request API limitation |
| `/The-IHL-Event-Giveaway` | Giveaway archive restored and renders | Explicit closed-event notice; submit button disabled; backend confirms event closed |
| `/The-IHL-Event-Giveaway/rules` | Official rules restored and render | Persistent archived page/assets |
| `/realtor-partnership` | Realtor partnership page restored and renders | Preserved application build/assets; original Railway endpoint validates empty input |
| `/contact-us` | Contact form restored and renders | Preserved application build/assets; original Railway endpoint validates empty input |
| `/request-a-call` | Callback form renders | Preserved application build/assets; original Railway endpoint validates empty input |
| `/links.html` | Social link hub renders after redirect to `/links` | Both original entry and canonical `/links` protected |
| `/ES` | Spanish homepage restored and renders in Spanish | Preserved Spanish entry and compiled assets; lowercase `/es` supported |
| `/alma-jaramillo` | **Unavailable: blank application shell** | Original advisor-subsite source/deployment not found; not replaced with a different page |

## Advisor subtree needing recovery

These are known published advisor destinations, not verified working pages:

- `/alma-jaramillo/about`
- `/alma-jaramillo/loan-solutions`
- `/alma-jaramillo/tools`
- `/alma-jaramillo/resources`
- `/alma-jaramillo/contact`

The Git history, accessible branches, connected Site inventory, and relevant recovered Library material did not contain the original advisor implementation. Available advisor documentation was a proposed architecture. Recovery needs the original project/source or a separately authorized rebuild. Alma’s working digital card is a different page and has not been substituted for her advisor site.

## Signature images recovered

Nine validated PNGs from the existing Alma Teams signature package are preserved under `/assets/email-signatures/alma/`:

`ihl-logo.png`, `alma-website-qr.png`, `alma-headshot-circle.png`, `phone-icon.png`, `mail-icon.png`, `instagram-icon.png`, `pin-icon.png`, `equal-housing-opportunity.png`, `web-icon.png`.

The branded logo-image URL was checked in the browser; all nine source images passed PNG validation and are covered by the same persistent route. Their file hashes are recorded in the archive registry.

## What is protected

The public domain’s routing rules now exist at project level, outside replaceable website builds. Rebuilding or replacing the main website does not remove these rules. Existing independent assessment/card/newsletter origins remain their destinations. Recoverable missing static and contact pages are preserved in a separately deployed archive with namespaced application assets.

The archive checks the existence and SHA-256 hash of 146 published files before packaging. Future intentional edits must update that registry deliberately. No unrelated main-site deployment was replaced during this audit. Closed owner-test pages were excluded from the published archive.

This protection addresses the observed old-deployment regression. It does not prevent domain expiry, hosting outages, deliberate routing deletion, or failures inside an upstream page or backend.

## Form/report routes requiring approval

Automatic approval review rejected adding persistent external routing for these actions because visitor information would be sent to an external hosted origin without explicit approval naming the payload and destination. These rules were not added through another method.

| Route | Existing IHL destination to preserve | Visitor information involved |
|---|---|---|
| `/api/review-requests` | `https://free-homebuying-review.javiercifuentesm.chatgpt.site/api/review-requests` | Contact details and homebuying/equity review request information |
| `/api/send-plan` | `https://my-homeownership-path-ihl.javiercifuentesm.chatgpt.site/api/send-plan` | Contact details, questionnaire answers and personalized-plan request |
| `/api/send-feedback` | `https://my-homeownership-path-ihl.javiercifuentesm.chatgpt.site/api/send-feedback` | Submitted participant feedback and identifying information included in it |
| `/api/send-reverse-report` | `https://my-reverse-mortgage-review-ihl.javiercifuentesm.chatgpt.site/api/send-reverse-report` | Contact details, reverse-review answers and report request |

Some of these API paths remain present in the current website build, but they are not protected against replacement by a future build. `/api/review-requests` also needs its missing branded route restored. Page rendering alone is not proof of submission or report delivery.

## Testing evidence and limits

- Browser checks covered all 20 primary entries above; 19 rendered their expected content after repair.
- English/Spanish consultation switching, direct Spanish reload, loaded images and required-field validation were checked.
- Empty JSON requests to the existing Railway callback, contact and Realtor endpoints each returned HTTP 400 with the expected required-name error. These did not create leads or send emails.
- Empty giveaway submission returned HTTP 403 confirming the entry window is closed. The archived UI also disables submission.
- No real lead was submitted, no report was emailed, and no email was sent for this audit. Successful CRM creation, advisor notification and report delivery remain untested.
- The public link hub’s clean-URL redirect and Alma signature logo were checked after routing publication.

## Future release rule

Before publishing a new individual link: add it to this inventory, use its own asset namespace, register persistent domain routing, verify page content (not only HTTP 200), check validation and backend behavior, and confirm existing registered links still render. Preserve the current production-routing export. Do not promote older website branches as a way to change a single page.
