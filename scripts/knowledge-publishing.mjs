import {createHash} from 'node:crypto';
import {existsSync,readFileSync,readdirSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const BASE='https://www.infinitehomelending.com';
const safe=s=>typeof s==='string'&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
const need=(v,k)=>{if(typeof v!=='string'||!v.trim())throw Error(`Missing ${k}`);};
const iso=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(s)&&Number.isFinite(Date.parse(s));
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const day=d=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).format(d);
export const digest=pair=>createHash('sha256').update(JSON.stringify([...pair].sort((a,b)=>a.lang.localeCompare(b.lang)))).digest('hex');
export const articlePath=a=>`/knowledge-center/articles/${a.lang}/${a.slug}`;
export function validatePair(pair,approval){
 if(pair.length!==2||new Set(pair.map(a=>a.lang)).size!==2||!pair.every(a=>['en','es'].includes(a.lang))||pair[0].id!==pair[1].id)throw Error('One matching EN/ES pair required');
 for(const a of pair){
  if(!safe(a.id)||!safe(a.slug))throw Error('Unsafe ID or slug');
  for(const k of ['title','description','author','authorNmls','disclosure'])need(a[k],k);
  if(!/^\d+$/.test(a.authorNmls))throw Error('Invalid NMLS');
  if(!Array.isArray(a.sections)||!a.sections.length)throw Error('Missing sections');
  for(const s of a.sections){need(s.heading,'heading');if(!Array.isArray(s.paragraphs)||!s.paragraphs.length)throw Error('Empty section');s.paragraphs.forEach(p=>need(p,'paragraph'));}
  if(!Array.isArray(a.sources)||!a.sources.length)throw Error('Missing sources');
  for(const s of a.sources){need(s.label,'source label');const u=new URL(s.url);if(u.protocol!=='https:'||u.username||u.password)throw Error('HTTPS source required');if(!/^\d{4}-\d{2}-\d{2}$/.test(s.checkedOn))throw Error('Missing source date');}
 }
 if(!approval||approval.id!==pair[0].id||approval.contentSha256!==digest(pair))throw Error('Approval missing or exact content hash changed');
 need(approval.reviewedBy,'reviewer');need(approval.approvalEvidence,'approval evidence');
 if(!iso(approval.approvedAt)||!iso(approval.publishAt)||Date.parse(approval.approvedAt)>Date.parse(approval.publishAt))throw Error('Invalid approval/publication times');
 return true;
}
export function loadQueue(root=ROOT){
 const dir=path.join(root,'content/knowledge');const articles=readdirSync(path.join(dir,'articles')).filter(f=>f.endsWith('.json')).map(f=>read(path.join(dir,'articles',f)));
 const seen=new Set();for(const a of articles){if(!safe(a.id)||!safe(a.slug)||!['en','es'].includes(a.lang))throw Error('Unsafe article path');const key=articlePath(a);if(seen.has(key))throw Error('Duplicate URL');seen.add(key);}
 return [...new Set(articles.map(a=>a.id))].map(id=>{const f=path.join(dir,'approvals',id+'.json');return {id,pair:articles.filter(a=>a.id===id),approval:existsSync(f)?read(f):null};});
}
function released(root,queue){
 const releases=read(path.join(root,'content/knowledge/releases.json'));if(!Array.isArray(releases))throw Error('Invalid release ledger');const seen=new Set();
 for(const r of releases){const item=queue.find(x=>x.id===r.id);if(!item||seen.has(r.id))throw Error('Missing or duplicate release');seen.add(r.id);validatePair(item.pair,item.approval);if(r.contentSha256!==item.approval.contentSha256||!iso(r.releasedAt)||Date.parse(r.releasedAt)<Date.parse(item.approval.publishAt))throw Error('Invalid release receipt');}
 return releases;
}
export function releaseDue(root=ROOT,now=new Date()){
 const queue=loadQueue(root);for(const x of queue)if(x.approval)validatePair(x.pair,x.approval);
 const releases=released(root,queue);if(releases.some(r=>day(new Date(r.releasedAt))===day(now)))return releases;
 const due=queue.filter(x=>x.approval&&Date.parse(x.approval.publishAt)<=now.getTime()&&!releases.some(r=>r.id===x.id)).sort((a,b)=>Date.parse(a.approval.publishAt)-Date.parse(b.approval.publishAt));
 if(due.length){const x=due[0];releases.push({id:x.id,contentSha256:x.approval.contentSha256,releasedAt:now.toISOString()});writeFileSync(path.join(root,'content/knowledge/releases.json'),JSON.stringify(releases,null,2)+'\n');}
 return releases;
}
function shell(lang,title,desc,url,body,extra=''){
 const es=lang==='es';return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} | Infinite Home Lending</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${BASE}${url}">${extra}<style>body{margin:0;background:#faf9f6;color:#0b2a4a;font:18px/1.7 system-ui,sans-serif}header,main,footer{max-width:800px;margin:auto;padding:24px}header{border-bottom:1px solid #dbc994}header img{width:150px;max-height:90px;object-fit:contain}h1,h2{font-family:Georgia,serif;line-height:1.2}h1{font-size:clamp(2rem,5vw,3rem)}h2{margin-top:2em}a{color:#0b2a4a;text-underline-offset:4px}.cta{display:inline-block;background:#0b2a4a;color:white;padding:12px 20px;border-radius:4px}footer,.byline{font-size:.85rem}article{margin-bottom:40px}.skip{position:absolute;left:-9999px}.skip:focus{left:10px;background:white}</style></head><body><a class="skip" href="#main">${es?'Ir al contenido':'Skip to content'}</a><header><a href="/${es?'ES':''}"><img src="/IHL_-_Logo.png" alt="Infinite Home Lending"></a></header><main id="main">${body}</main><footer>Infinite Home Lending, L.L.C. · NMLS #2831765<br><img src="/equal-housing.png" width="24" height="24" alt="${es?'Igualdad de oportunidades de vivienda':'Equal Housing Opportunity'}"><br>Tailored Lending. Infinite Possibilities.<br><a href="/privacy-policy">${es?'Privacidad':'Privacy'}</a> · <a href="/knowledge-center">${es?'Centro de conocimiento':'Knowledge Center'}</a></footer></body></html>`;
}
export function renderArticle(a,other,approval){
 const es=a.lang==='es',url=articlePath(a),alt=articlePath(other);
 const schema={'@context':'https://schema.org','@type':'Article',headline:a.title,description:a.description,inLanguage:a.lang,datePublished:approval.publishAt,dateModified:approval.approvedAt,author:{'@type':'Person',name:a.author},publisher:{'@type':'Organization',name:'Infinite Home Lending, L.L.C.'},mainEntityOfPage:BASE+url};
 const extra=`<link rel="alternate" hreflang="${a.lang}" href="${BASE}${url}"><link rel="alternate" hreflang="${other.lang}" href="${BASE}${alt}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`;
 const body=`<nav><a href="/knowledge-center/articles/${a.lang}">${es?'Guías hipotecarias':'Mortgage guides'}</a> · <a href="${alt}" lang="${other.lang}">${es?'English':'Español'}</a></nav><article><h1>${esc(a.title)}</h1><p class="byline">${esc(a.author)} · NMLS #${esc(a.authorNmls)}<br>${es?'Revisado por':'Reviewed by'} ${esc(approval.reviewedBy)} · ${esc(approval.approvedAt.slice(0,10))}</p>${a.sections.map(s=>`<section><h2>${esc(s.heading)}</h2>${s.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</section>`).join('')}<h2>${es?'Fuentes':'Sources'}</h2><ul>${a.sources.map(s=>`<li><a href="${esc(s.url)}" rel="noopener noreferrer">${esc(s.label)}</a> (${esc(s.checkedOn)})</li>`).join('')}</ul><p>${esc(a.disclosure)}</p><a class="cta" href="${es?'/free-consultation/ES':'/free-consultation'}?utm_source=knowledge-center&amp;utm_medium=owned-content&amp;utm_campaign=${esc(a.id)}">${es?'Conversemos sobre tus opciones':'Discuss your mortgage options'}</a></article>`;
 return shell(a.lang,a.title,a.description,url,body,extra);
}
export function buildGuides(root=ROOT){
 const queue=loadQueue(root),receipts=released(root,queue);const items=receipts.map(r=>queue.find(x=>x.id===r.id));
 const output=path.join(root,'dist/knowledge-center/articles');rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});const urls=[];
 for(const item of items)for(const a of item.pair){const dir=path.join(root,'dist',articlePath(a));mkdirSync(dir,{recursive:true});writeFileSync(path.join(dir,'index.html'),renderArticle(a,item.pair.find(b=>b.lang!==a.lang),item.approval));urls.push({url:BASE+articlePath(a),date:item.approval.approvedAt.slice(0,10)});}
 for(const lang of ['en','es']){const es=lang==='es',title=es?'Guías hipotecarias':'Mortgage guides';const list=items.flatMap(x=>x.pair).filter(a=>a.lang===lang);const url=`/knowledge-center/articles/${lang}`;const body=`<h1>${title}</h1><p>${es?'Información para tomar decisiones con confianza.':'Practical guidance for confident home financing decisions.'}</p>${list.map(a=>`<article><h2><a href="${articlePath(a)}">${esc(a.title)}</a></h2><p>${esc(a.description)}</p></article>`).join('')}<a class="cta" href="${es?'/free-consultation/ES':'/free-consultation'}">${es?'Conversemos':'Start a conversation'}</a>`;const dir=path.join(output,lang);mkdirSync(dir,{recursive:true});writeFileSync(path.join(dir,'index.html'),shell(lang,title,title,url,body));urls.push({url:BASE+url});}
 const sitemap=path.join(root,'dist/sitemap.xml');let xml=readFileSync(sitemap,'utf8');if(!xml.includes('</urlset>'))throw Error('Missing sitemap urlset');for(const u of urls)if(!xml.includes(`<loc>${esc(u.url)}</loc>`))xml=xml.replace('</urlset>',`<url><loc>${esc(u.url)}</loc>${u.date?`<lastmod>${u.date}</lastmod>`:''}</url>\n</urlset>`);writeFileSync(sitemap,xml);return items.length;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 switch(process.argv[2]){case 'release':console.log(`Release records: ${releaseDue().length}`);break;case 'build':console.log(`Built ${buildGuides()} bilingual topics`);break;case 'hash':for(const x of loadQueue())console.log(x.id,digest(x.pair));break;default:throw Error('Use build, release, or hash');}
}
