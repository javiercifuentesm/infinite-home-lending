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

Recovery architecture: deploy standalone/free-consultation as an independent static Site. Main-domain project-level routing forwards /free-consultation and every child path there. This route exists outside any deployment's vercel.json and survives main-site rebuilds. All page assets and the form API use the /free-consultation namespace. Existing Railway submit-lead handles submissions; no server or CRM changes are required. The original English and Spanish form is retained, with /es and /ES accepted. Existing primary-site deployment remains untouched.

Do not deploy old main-site branches as production. Do not replace this project-level route with a build-local rewrite. Before changing the independent project, test EN/ES, images, form validation, backend responses, and sibling links. This architecture isolates the consultation only; other campaign routes still need deliberate migration.

Actual hosting: Vercel refused independent project creation (403). The isolated consultation is instead public Site `appgprj_6ae8ed9ccc8481918fd36a9c2ada7c39`, origin https://ihl-free-consultation-live.javiercifuentesm.chatgpt.site. Its managed source repository holds the deployed static output; editable React source is in standalone/free-consultation on production/individual-links. Build then copy index, assets, and media beneath dist/free-consultation (including ES and es index documents) before packaging the Site.

Vercel project-level routes, production routing version c8534aed-1d53-48a5-8680-fa399b04629c:
1. Exact /free-consultation/api/submit-lead → Railway /api/submit-lead (route 434b4a10-7d86-441e-ba01-682d0ccb9f3a).
2. Case-insensitive ^/free-consultation(?:/(.*))?$ → Site /free-consultation/$1 (route d5088245-3e74-42a1-8295-3bdaf27afdc8).

Page and asset routing was verified in the branded browser. Backend rejection of an empty payload is tested without creating a real lead or sending notification emails. Successful lead delivery remains untested in this repair.

Alma card also restored with project-level route 742bb6ba-c571-4e1f-857a-1030bcfde8d3. Current combined production routing version: 140c0224-a3a9-4c1b-ac64-0912895af53b (3 rules). The primary-site deployment was not replaced.
