# IHL individual links

Production source: `main` in `javiercifuentesm/infinite-home-lending`.
Vercel project: `infinite-home-lending`.

## Release rules

Start every change from current `origin/main`. Merge isolated changes back to main before a production release. Never promote an older feature branch over production: deployments replace the complete routing configuration, not just the newest page. Never replace vercel.json with a branch's older copy.

The route registry is `config/individual-link-routes.json`. `npm run build` checks that every registered rewrite still exists with its destination and conditions intact, before the SPA fallback; it also checks the giveaway files and consultation app routes. Add new individual routes to both vercel.json and the registry. For intentional changes, review both together. This guard detects accidental omissions; it cannot protect deployments of older commits that predate the guard.

Before release, run the build. After release, open the affected branded URL, check its content and assets, and check the existing individual links. HTTP 200 alone is insufficient: the SPA fallback returns 200 for missing routes.

## Alma newsletter incident — October 16, 2026

The article's origin remained available at https://home-financing-with-alma.javiercifuentesm.chatgpt.site with title “Home Financing with Alma | Temporary Buydowns”. Newsletter rewrites were committed on `virginia-licensing-deploy` (1be581e, 7dddb38, e0867db), but were absent from main. Main's newer release therefore served the website SPA fallback for the article URL. Restore only those four newsletter rewrites onto current main, preserving newer giveaway and consultation work.

## Home equity campaign

`/home-equity-review` serves the campaign page from `public/home-equity-review/index.html`. Its logo, poster and video use `/home-equity-review-assets/`, an isolated asset prefix served from this same repository. The page and media deploy together without a preview-host dependency. Preserve the earlier `/My-Home-Equity-Review` assessment route.

## Public entry points

- `/home-financing-with-alma/temporary-buydowns` — Alma newsletter article
- `/Talk-to-Alma` — Alma digital business card
- `/talk-to-javier` — Javier digital business card
- `/free-consultation` and `/free-consultation/es` — consultation
- `/The-IHL-Event-Giveaway` and `/The-IHL-Event-Giveaway/rules` — event
- `/my-homeownership-path` — homeownership assessment
- `/My-Home-Equity-Review` — equity assessment
- `/my-reverse-mortgage-review` — reverse assessment
- `/FREE-Homebuying-Review` and `/FREE-Home-Equity-Review` — review entry points

External origin assets sharing root paths (such as /app.js or /_next) remain coupled through global rewrites. New pages should use page-specific asset paths. Existing integrations require separate browser verification before migrating their asset routing.

## Consultation isolation — November 2, 2026

Incident: production dpl_DJkAFkRPK1d9R5qdAG72JpXjap6o was created by CLI and identifies virginia-licensing-deploy / 91b79bc, predating the consultation page and registry. Main still has the page. Repository checks cannot run inside an old checkout that lacks them.

Recovery architecture: deploy standalone/free-consultation as a separate Vercel project. Main-domain project-level routing forwards /free-consultation and every child path there. This route exists outside any deployment's vercel.json and survives main-site rebuilds. All page assets and the form API use the /free-consultation namespace. Existing Railway submit-lead handles submissions; no server or CRM changes are required. The original English and Spanish form is retained, with /es and /ES accepted. Existing primary-site deployment remains untouched.

Do not deploy old main-site branches as production. Do not replace this project-level route with a build-local rewrite. Before changing the independent project, test EN/ES, images, form validation, backend responses, and sibling links. This architecture isolates the consultation only; other campaign routes still need deliberate migration.
