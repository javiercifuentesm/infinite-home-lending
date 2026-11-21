# Reviewed bilingual article publishing

Draft implementation, November 16, 2026. This extends the existing IHL website. No consumer articles, approvals or releases are included. Uploading this branch and opening a draft PR was explicitly approved by Javier on November 16. Merge, production deployment, form-to-CRM attribution and scheduled end-to-end publishing are not established by this PR.

## Cadence and owners

Thursday mornings Eastern: prepare up to two distinct EN/ES topic pairs for Javier's review, retaining seven full days before publication. Tuesday and Friday mornings: release at most one due approved pair. These weekdays are an initial operating choice, not a proven ranking advantage. Existing social schedules remain unchanged. Derivatives go through the existing social approval workflow.

Hosted preparation/publication tasks manage the workflow. This implementation adds no GitHub cron workflow, API key or new subscription. The publisher stays paused until the infrastructure is merged/deployed, one real pair is explicitly approved, and the live consultation journey is verified.

## Source contract

Create `content/knowledge/articles/<topic>.<language>.json` with the fields below. One EN and one ES record must share the topic ID, with unique localized slugs. This example is a schema illustration, not approved copy or authorship.

```json
{
  "id": "credit-inquiries",
  "lang": "en",
  "slug": "exploring-mortgage-options-and-credit",
  "title": "Reviewed title",
  "description": "Reviewed summary",
  "author": "Verified authorized author",
  "authorNmls": "210090",
  "disclosure": "Verified applicable disclosures",
  "sections": [{"heading": "Borrower question", "paragraphs": ["Source-checked answer"]}],
  "sources": [{"label": "Primary source", "url": "https://www.consumerfinance.gov/", "checkedOn": "2026-11-16"}]
}
```

All content is escaped plain text; raw HTML/scripts are not accepted. Use primary sources supporting the exact claim. Automated shape validation cannot determine relevance, truthfulness, disclosure sufficiency or reviewer authenticity. Human editorial review is required. Never store borrower data, credentials or private communications in this public repository.

`npm run knowledge:hash` computes the exact serialized EN/ES pair hash. JSON property order is part of that hash; editing or reordering reviewed content requires a fresh review/hash confirmation.

Only after exact-version approval, record `content/knowledge/approvals/<topic>.json`:

```json
{
  "id": "credit-inquiries",
  "contentSha256": "<actual pair SHA-256>",
  "reviewedBy": "<actual reviewer>",
  "approvalEvidence": "<non-sensitive approval reference>",
  "approvedAt": "2026-11-19T15:00:00Z",
  "publishAt": "2026-12-01T13:00:00Z"
}
```

Never invent evidence or put private chat contents in approvalEvidence. This record is not a cryptographic human signature. The task must recover the actual approval and exact content before creating it.

## Release procedure

1. Confirm infrastructure deployment, exact approval evidence, current facts and source/consultation links.
2. Use current main and run `npm run knowledge:test` and `npm run knowledge:release`. UTC timestamps are explicit. One earliest-due pair is released per Eastern calendar day, including retries. No approvals or drafts alone trigger release.
3. Review the diff: only `content/knowledge/releases.json` should change in a normal release. Use a current blob SHA or branch-head lease when committing; never force push or bypass protections. If branch policy requires a PR, follow it and report the wait.
4. The existing Vercel Git integration must build/deploy the commit. `npm run build` emits substantive static HTML, language indexes and sitemap entries. A commit does not prove deployment.
5. Verify production EN/ES URLs, full initial HTML, exact approved text, language/canonical/source links, sitemap inclusion and consultation destinations. Test form confirmation, CRM routing and source capture before accepting the first real pair. UTM links alone do not prove attribution persistence.
6. Report verified production URLs and deployment version to Javier and update the authoritative project record. If blocked, distinguish committed, deploying, failed and live. Do not claim publication after a failed request.

Paths: `/knowledge-center/articles/en/<slug>` and `/knowledge-center/articles/es/<slug>`, with corresponding language index pages. Normal anchors avoid React interception. Existing consultation/advisor routes remain protected by `npm run verify:links`.

## Verification and recovery

Run `npm run knowledge:test` and `npm run build`. Tests use artificial content in temporary directories, never real consumer pages. Deployment acceptance must additionally cover mobile rendering, trailing-slash routing, nonexistent article URLs, assets, form/CRM behavior and scheduled execution. Existing SPA catch-all handling of nonexistent article URLs still needs live verification. Search Console indexing remains a separate observation.

Published content is immutable in this first implementation: editing a released pair without coordinated reapproval fails the build. Prepare a separately reviewed revision path before changing published copy. For urgent removal, remove only the affected release receipt, retain its source/approval history, build and deploy; generated article output is recreated on each build. Search caches may persist after removal.

No consumer content or fabricated approvals are included. The first actual article pair remains subject to Javier's review. The empty language indexes provide a consultation link until reviewed articles are released.
