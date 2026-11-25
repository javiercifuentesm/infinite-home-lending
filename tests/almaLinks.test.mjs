import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, cpSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { verifyAlmaLinks } from '../scripts/verify-alma-links.mjs';

const root = new URL('../', import.meta.url);
function fixture(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'ihl-alma-links-'));
  try {
    for (const path of ['src/App.tsx', 'src/config/advisors', 'src/pages/advisor', 'src/components/advisor/contact', 'public/about', 'public/Talk-to-Alma', 'vercel.json', 'package.json']) {
      mkdirSync(dirname(join(dir, path)), { recursive: true });
      cpSync(new URL(path, root), join(dir, path), { recursive: true });
    }
    fn(dir);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
test('current branded links pass the production guard', () => assert.deepEqual(verifyAlmaLinks(), []));
test('losing a nested advisor page blocks publication', () => fixture(dir => {
  const path = join(dir, 'src/App.tsx');
  writeFileSync(path, readFileSync(path, 'utf8').replace('<Route path="contact" element={<AdvisorContactPage />} />', ''));
  assert(verifyAlmaLinks(dir).some(e => e.includes('/alma-jaramillo/contact')));
}));
test('missing card images block publication even when card HTML exists', () => fixture(dir => {
  rmSync(join(dir, 'public/Talk-to-Alma/alma.jpeg'));
  assert(verifyAlmaLinks(dir).some(e => e.includes('alma.jpeg')));
}));
test('moving the card back to an external host blocks publication', () => fixture(dir => {
  const path = join(dir, 'vercel.json');
  const config = JSON.parse(readFileSync(path, 'utf8'));
  config.rewrites.find(r => r.source === '/Talk-to-Alma').destination = 'https://example.com';
  writeFileSync(path, JSON.stringify(config));
  assert(verifyAlmaLinks(dir).some(e => e.includes('second hosting service')));
}));
test('replacing HubSpot booking with Calendly blocks publication', () => fixture(dir => {
  const path = join(dir, 'public/Talk-to-Alma/index.html');
  writeFileSync(path, readFileSync(path, 'utf8').replace('https://meetings-na2.hubspot.com/alma-jaramillo', 'https://calendly.com/old-calendar'));
  assert(verifyAlmaLinks(dir).some(e => e.includes('Missing card destination')));
}));
