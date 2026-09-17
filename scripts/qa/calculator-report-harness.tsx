// Isolated browser acceptance harness: actual component; fixture-only network responses.
import React from 'react';
import {createRoot} from 'react-dom/client';
import {LanguageProvider,useLanguage} from '../../src/i18n/LanguageContext';
import {CalculatorReportForm} from '../../src/components/tools/CalculatorReportForm';
let fail=false;let priorId='';
window.fetch=async (url,init)=>{
 if(String(url).endsWith('/availability'))return new Response(JSON.stringify({available:true}),{status:200});
 const payload=JSON.parse(String(init?.body));
 document.getElementById('receipt')!.textContent=JSON.stringify({fixtureOnly:true,lang:payload.lang,consent:payload.emailConsent,phone:payload.phone,state:payload.state,waitMonths:payload.waitMonths,validUuid:/^[0-9a-f-]{36}$/.test(payload.submissionId),sameIdOnRetry:priorId===payload.submissionId});
 priorId=payload.submissionId;
 return new Response('{}',{status:fail?503:202});
};
function App(){const {setLang}=useLanguage();return <><div className="p-4"><button onClick={()=>setLang('en')}>English</button> | <button onClick={()=>setLang('es')}>Español</button> | <button onClick={()=>{fail=true}}>Simulate failure</button> | <button onClick={()=>{fail=false}}>Allow retry</button><p>ISOLATED QA: no email or CRM writes.</p></div><div className="mx-auto max-w-5xl p-4"><CalculatorReportForm inputs={{hp:480000,rent:2400,dp:10,rate:6.75,appr:-3,ri:0,futureRate:5,lt:30}} waitMonths={6}/><pre id="receipt" className="whitespace-pre-wrap break-all"/></div></>}
createRoot(document.getElementById('root')!).render(<LanguageProvider><App/></LanguageProvider>);
