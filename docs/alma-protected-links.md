# Alma’s protected public links

- https://www.infinitehomelending.com/Talk-to-Alma
- https://www.infinitehomelending.com/alma-jaramillo

The canonical business card is bundled in `public/Talk-to-Alma/` and served by the two explicit Vercel rewrites (with and without a trailing slash). Its images, QR code, and vCard are in the same deployment. It no longer proxies a separate Sites publication. The old Sites copy remains available, but changes there do not update the canonical IHL card.

The advisor website is the registered `/alma-jaramillo` React route, with Home, About, Loan Solutions, Tools, Resources, and Contact children. Both booking entry points use https://meetings-na2.hubspot.com/alma-jaramillo.

`npm run build` runs `npm run verify:links` before Vite. This verifies the protected rewrite registry plus `scripts/verify-alma-links.mjs`. Missing pages, assets, card destinations, advisor registration, or the approved booking connection fail the build. Do not remove or disable these checks. Deliberate URL or calendar changes require updating the guard and verifying both public links.

Run `node --test tests/almaLinks.test.mjs` to verify the guard rejects representative regressions. After deployment, check both public URLs, the card images and saved contact, advisor navigation, and the HubSpot calendar. Keep the latest working deployment available for rollback.

These are deployment safeguards against accidental source changes. They cannot guarantee availability during domain, DNS, hosting, or HubSpot outages, or if someone disables the safeguards or publishes outside this build pipeline.
