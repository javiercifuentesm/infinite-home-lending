import { readFileSync, existsSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';

// Deliberate route changes must update the registry in the same reviewed commit.
const registry = JSON.parse(readFileSync(new URL('../config/individual-link-routes.json', import.meta.url)));
const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url)));
const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8');
const errors = [];
const fallback = config.rewrites.findIndex(r => r.source === '/(.*)');
for (const route of registry.rewrites) {
  const index = config.rewrites.findIndex(r => isDeepStrictEqual(r, route));
  if (index < 0) errors.push(`Missing or changed registered route: ${route.source}`);
  else if (route.source !== '/(.*)' && (fallback < 0 || index > fallback)) errors.push(`Route shadowed by SPA fallback: ${route.source}`);
}
for (const file of registry.requiredFiles) {
  if (!existsSync(new URL(`../${file}`, import.meta.url))) errors.push(`Missing standalone page: ${file}`);
}
for (const route of registry.requiredAppRoutes) {
  if (!app.includes(`<Route path="${route}"`)) errors.push(`Missing application route: ${route}`);
}
if (errors.length) {
  console.error(`Individual link protection failed:\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`Individual link protection passed (${registry.rewrites.length} registered rewrites).`);
