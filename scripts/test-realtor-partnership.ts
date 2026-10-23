import assert from 'node:assert/strict';
import express from 'express';
import { createRealtorPartnershipRouter } from '../src/server/realtorPartnershipRoute';
const nativeFetch = globalThis.fetch;
process.env.RESEND_API_KEY = 'test-only';
let sent: any;
globalThis.fetch = (async (url: any, init: any) => {
  assert.equal(url, 'https://api.resend.com/emails');
  sent = JSON.parse(init.body);
  return new Response(JSON.stringify({id:'test'}), {status:200});
}) as typeof fetch;
const app = express(); app.use(express.json()); app.use('/api',createRealtorPartnershipRouter());
const server = app.listen(0,'127.0.0.1');
await new Promise<void>(r=>server.once('listening',r));
const port = (server.address() as any).port;
const submit = (body: any) => nativeFetch(`http://127.0.0.1:${port}/api/realtor-partnership`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
try {
 assert.equal((await submit({})).status,400); assert.equal(sent,undefined);
 const valid={fullName:'Test <Agent>',email:'agent@example.com',phone:'2025550100',topic:'partnership',leadSource:'Other',bestDay:'Monday',bestTime:'10:00 AM',focusNotes:'<script>bad</script>',smsConsent:false};
 assert.equal((await submit({...valid,topic:'toString'})).status,400);
 assert.equal((await submit({...valid,focusNotes:'x'.repeat(5001)})).status,400);
 const response=await submit(valid); assert.equal(response.status,200); assert.equal((await response.json()).emailSent,true);
 assert.match(sent.subject,/New Realtor Call Request/); assert.match(sent.html,/&lt;script&gt;/); assert.doesNotMatch(sent.html,/<script>/); assert.match(sent.html,/SMS Consent/); assert.match(sent.html,/\/realtor-partnership/);
 console.log('Passed: required fields, valid topic, length limit, successful notification, escaped content, consent record. No real email sent.');
} finally {server.close();globalThis.fetch=nativeFetch;}
