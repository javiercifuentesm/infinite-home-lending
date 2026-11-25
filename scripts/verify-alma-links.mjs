import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

export function verifyAlmaLinks(root = fileURLToPath(new URL('../', import.meta.url))) {
  const errors = [];
  const read = path => readFileSync(resolve(root, path), 'utf8');
  const requireFile = path => {
    if (!existsSync(resolve(root, path)) || statSync(resolve(root, path)).size === 0) {
      errors.push(`Missing or empty protected asset: ${path}`);
      return false;
    }
    return true;
  };
  const config = JSON.parse(read('vercel.json'));
  for (const source of ['/Talk-to-Alma', '/Talk-to-Alma/']) {
    const rule = config.rewrites.find(r => r.source === source);
    if (rule?.destination !== '/Talk-to-Alma/index.html') errors.push(`Card route must serve the bundled card: ${source}`);
  }
  if (config.rewrites.some(r => r.source.startsWith('/Talk-to-Alma') && /^https?:/.test(r.destination))) {
    errors.push('Card route must not depend on a second hosting service.');
  }

  const tree = ts.createSourceFile('App.tsx', read('src/App.tsx'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const attr = (node, name) => node.attributes.properties.find(a => a.name?.getText(tree) === name);
  let advisorRoute;
  const visit = node => {
    if (ts.isJsxElement(node) && node.openingElement.tagName.getText(tree) === 'Route' &&
        attr(node.openingElement, 'path')?.initializer?.text === '/alma-jaramillo') advisorRoute = node;
    ts.forEachChild(node, visit);
  };
  visit(tree);
  if (!advisorRoute || !attr(advisorRoute.openingElement, 'element')?.getText(tree).includes('AdvisorSiteLayout')) {
    errors.push('Missing Alma route with AdvisorSiteLayout.');
  } else {
    const pages = new Map([['', 'AdvisorHomePage'], ['about', 'AdvisorAboutPage'], ['loan-solutions', 'AdvisorLoanSolutionsPage'], ['tools', 'AdvisorSmartToolsPage'], ['resources', 'AdvisorResourcesPage'], ['contact', 'AdvisorContactPage']]);
    for (const [path, component] of pages) {
      const child = advisorRoute.children.find(n => ts.isJsxSelfClosingElement(n) &&
        n.tagName.getText(tree) === 'Route' && (path ? attr(n, 'path')?.initializer?.text === path : !!attr(n, 'index')));
      if (!child || !attr(child, 'element')?.getText(tree).includes(component)) errors.push(`Missing Alma page: /alma-jaramillo${path ? '/' + path : ''}`);
      requireFile(`src/pages/advisor/${component}.tsx`);
    }
  }
  const profile = read('src/config/advisors/almaJaramillo.ts');
  const calendar = 'https://meetings-na2.hubspot.com/alma-jaramillo';
  if (!profile.includes(`schedulingUrl: "${calendar}"`)) errors.push('Alma must use the approved HubSpot calendar.');
  if (!read('src/config/advisors/registry.ts').includes('[almaJaramillo.slug]: almaJaramillo')) errors.push('Alma must stay in the advisor registry.');
  for (const [, path] of profile.matchAll(/["'](\/about\/[^"']+)["']/g)) requireFile('public' + path);
  requireFile('src/components/advisor/contact/AdvisorHubSpotEmbed.tsx');
  if (!read('src/components/advisor/contact/AdvisorContactSchedulingStudio.tsx').includes('<AdvisorHubSpotEmbed')) errors.push('Alma contact page must render the HubSpot calendar.');

  if (requireFile('public/Talk-to-Alma/index.html')) {
    const card = read('public/Talk-to-Alma/index.html');
    const images = [...card.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)].map(m => m[1]);
    if (images.length !== 3) errors.push('Card must retain its logo, portrait, and QR code.');
    for (const src of images) {
      if (!src.startsWith('/Talk-to-Alma/') || !requireFile('public' + src)) errors.push(`Broken card image: ${src}`);
      else {
        const bytes = readFileSync(resolve(root, 'public' + src));
        const valid = src.endsWith('.png') ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) :
          src.endsWith('.jpeg') ? bytes[0] === 255 && bytes[1] === 216 : src.endsWith('.svg') && bytes.toString().includes('<svg');
        if (!valid) errors.push(`Invalid card image: ${src}`);
      }
    }
    for (const href of [calendar, 'https://www.infinitehomelending.com/alma-jaramillo', 'https://www.infinitehomelending.com/Talk-to-Alma/alma.vcf']) {
      if (!card.includes(`href="${href}"`)) errors.push(`Missing card destination: ${href}`);
    }
  }
  if (requireFile('public/Talk-to-Alma/alma.vcf') && !read('public/Talk-to-Alma/alma.vcf').includes('URL:https://www.infinitehomelending.com/alma-jaramillo')) errors.push('Saved contact must retain Alma’s branded website URL.');
  const scripts = JSON.parse(read('package.json')).scripts;
  if (!scripts.build.includes('npm run verify:links') || !scripts['verify:links'].includes('node scripts/verify-alma-links.mjs')) errors.push('Production builds must run the Alma link guard.');
  return errors;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = verifyAlmaLinks();
  if (errors.length) {
    console.error('Alma link protection failed:\n' + errors.join('\n'));
    process.exit(1);
  }
  console.log('Alma link protection passed: branded card, six advisor pages, images, saved contact, and HubSpot booking.');
}
