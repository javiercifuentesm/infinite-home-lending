import assert from "node:assert/strict";
import express from "express";
import { once } from "node:events";

if (process.env.RAILWAY_ENVIRONMENT_NAME !== "sonnet55-isolated-test" || process.env.STAGING_SONNET55 !== "1" || !process.env.ANTHROPIC_API_KEY) {
  console.log("NOT RUN: requires explicitly enabled isolated test environment and separate API key");
  process.exit(0);
}
if (process.env.RAILWAY_PUBLIC_DOMAIN) {
  console.log("NOT RUN: public domain is not permitted");
  process.exit(0);
}
process.env.RESEND_API_KEY = "";
delete process.env.ANTHROPIC_BASE_URL;
const originalFetch=globalThis.fetch;
const requests: string[]=[];
globalThis.fetch=async (input, init)=>{
  const req=new Request(input,init);
  if(req.url==="https://synthetic.example/market") {
    return new Response("<p>For this synthetic test, a housing market report says inventory was unchanged from the prior month in a sample Maryland county. The report cites no specific percentage or price. Buyers and sellers should compare local property listings and discuss financing with qualified professionals.</p>");
  }
  if(req.url!=="https://api.anthropic.com/v1/messages") throw Error("Unexpected external request blocked");
  const body=await req.clone().json();
  assert.equal(body.model,"claude-sonnet-5-5");
  assert.deepEqual(body.thinking,{type:"between_tools"});
  assert.deepEqual(body.output_config,{effort:"medium"});
  requests.push(body.model);
  if(requests.length>8) throw Error("Test request cap exceeded");
  const res=await originalFetch(req);
  console.log("Anthropic HTTP",res.status);
  return res;
};
const deadline=setTimeout(()=>{console.log("FAIL: test time limit exceeded");process.exit(0)},180000);
let server: ReturnType<ReturnType<typeof express>["listen"]>|undefined;
try {
  const {createSarahChatRouter}=await import("./src/server/sarahChatRoute.ts");
  const {createSarahCareersRouter}=await import("./src/server/sarahCareersRoute.ts");
  const {createSarahCareersDiscoveryRouter}=await import("./src/server/sarahCareersDiscoveryRoute.ts");
  const {createIntelligenceBriefRouter}=await import("./src/server/intelligenceBriefRoute.ts");
  const {runBriefScheduler,getCachedBrief}=await import("./src/server/intelligenceBriefCache.ts");
  const app=express();app.use(express.json());app.use(createSarahChatRouter());app.use(createSarahCareersRouter());app.use(createSarahCareersDiscoveryRouter());app.use(createIntelligenceBriefRouter());
  server=app.listen(0,"127.0.0.1");await once(server,"listening");const base="http://127.0.0.1:"+(server.address() as any).port;
  async function post(path:string,data:any){return originalFetch(base+path,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});}
  async function chat(label:string,path:string,prompt:string,lang?:string){
    const start=Date.now();const res=await post(path,{messages:[{role:"user",content:prompt}],lang,sessionId:"synthetic-test"});
    assert.equal(res.status,200);
    const frames=(await res.text()).split("\n").filter(x=>x.startsWith("data: ")).map(x=>JSON.parse(x.slice(6)));
    const response=frames.map(x=>x.text??"").join("");
    assert.equal(frames.at(-1).done,true);
    assert.ok(!frames.some(x=>x.error)&&response.trim());
    console.log("PASS",label,Date.now()-start,"ms",JSON.stringify(response));
  }
  await chat("consumer EN","/sarah-chat","What is a mortgage?","en");
  await chat("consumer ES","/sarah-chat","¿Qué es una hipoteca?","es");
  for(const path of ["/sarah-careers-chat","/sarah-careers-discovery-chat"]){
    await chat(path+" experienced",path,"I've been originating for 12 years. Why would I move to IHL?");
    await chat(path+" newcomer",path,"I'm new to the mortgage industry. How would I start at IHL?");
  }
  const data={url:"https://synthetic.example/market",title:"Sample housing inventory unchanged",source:"Synthetic fixture",tag:"Market"};
  const r=await post("/intelligence-brief",data);const j=await r.json();
  assert.equal(j.ok,true);assert.ok(Object.values(j.brief).every(x=>typeof x==="string"&&x.trim()));
  console.log("PASS on-demand brief",JSON.stringify(j.brief));
  await runBriefScheduler([{id:"synthetic-test",...data,tag:{label:"Market"}}]);
  const cached=getCachedBrief("synthetic-test");assert.ok(cached);console.log("PASS fresh cached brief",JSON.stringify(cached));
  assert.equal(requests.length,8);console.log("COMPLETE: 8 live provider calls; review synthetic responses for content quality.");
} catch(err) {
  console.log("FAIL: isolated test did not complete",err instanceof Error?err.name:"unknown");
} finally {
  clearTimeout(deadline);if(server)server.close();globalThis.fetch=originalFetch;process.exit(0);
}
