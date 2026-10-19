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

`/home-equity-review` serves the campaign page from `public/home-equity-review/index.html`. Its logo, poster and video use `/home-equity-review-assets/`, an isolated asset prefix. Keep the media origin public. Preserve the earlier `/My-Home-Equity-Review` assessment route.

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
