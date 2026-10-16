import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { IHLLogo } from "../components/IHLLogo";
import { apiUrl } from "../lib/apiBase";
import { usePageMetadata } from "../hooks/usePageMetadata";

const copy = {
 en: { eyebrow:"A personal conversation, at your pace", heading:"Your FREE Mortgage Consultation", sub:"Buying, refinancing, exploring home equity or investment financing? Share a few details and we’ll reach out to help you explore your options. No pressure, no obligation.", name:"Full name", email:"Email address", phone:"Phone number", state:"Property state", purpose:"What would you like to discuss? (optional)", choose:"Select an option", purchase:"Buying a home", refinance:"Refinancing", equity:"Home equity / HELOC", reverse:"Reverse mortgage", investment:"Investment property", other:"Something else", notes:"Anything else you'd like us to know? (optional)", sms:"I agree to receive text messages from Infinite Home Lending at the number provided, including responses to my inquiry. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not required to receive mortgage services.", submit:"Request my free consultation", sending:"Sending your request…", thanks:"Thank you for reaching out!", confirmation:"We've received your request. A member of our team will be in touch soon.", error:"We couldn't submit your request. Please try again or call us at (301) 507-7609.", privacy:"Privacy Policy", terms:"SMS Terms & Conditions", note:"No pressure. Just clear guidance.", lang:"Español", disclosure:"For educational purposes only. This is not a loan application, approval or commitment to lend. Program eligibility is subject to complete review." },
 es: { eyebrow:"Una conversación personal comienza aquí", heading:"Su consulta hipotecaria GRATIS", sub:"Ya sea que desee comprar una vivienda, refinanciar o explorar opciones sobre el valor acumulado de su hogar, cuéntenos sus objetivos. Nos comunicaremos con usted sin presión ni compromiso.", name:"Nombre completo", email:"Correo electrónico", phone:"Número de teléfono", state:"Estado de la propiedad", purpose:"¿De qué le gustaría hablar? (opcional)", choose:"Seleccione una opción", purchase:"Comprar una vivienda", refinance:"Refinanciar", equity:"Valor acumulado / HELOC", reverse:"Hipoteca inversa", investment:"Propiedad de inversión", other:"Otro asunto", notes:"¿Algo más que quiera compartir? (opcional)", sms:"Acepto recibir mensajes de texto de Infinite Home Lending al número proporcionado, incluyendo respuestas a mi consulta. La frecuencia varía. Pueden aplicarse cargos por mensajes y datos. Responda STOP para cancelar o HELP para ayuda. No es obligatorio aceptar para recibir servicios hipotecarios.", submit:"Solicitar mi consulta gratuita", sending:"Enviando solicitud…", thanks:"¡Gracias por comunicarse!", confirmation:"Hemos recibido su solicitud. Un miembro de nuestro equipo se comunicará con usted pronto.", error:"No pudimos enviar su solicitud. Inténtelo de nuevo o llámenos al (301) 507-7609.", privacy:"Política de privacidad", terms:"Términos y condiciones de SMS", note:"Sin presión y sin compromiso.", lang:"English", disclosure:"Información con fines educativos. No constituye una solicitud, aprobación ni compromiso de préstamo. La elegibilidad de los programas está sujeta a una evaluación completa." }
};
type Lang = keyof typeof copy;
export default function FreeConsultation() {
 const [lang,setLang] = useState<Lang>(()=>window.location.pathname.endsWith("/es")?"es":"en");
 const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState(""); const [purpose,setPurpose]=useState(""); const [propertyState,setPropertyState]=useState(""); const [notes,setNotes]=useState(""); const [smsConsent,setSmsConsent]=useState(false);
 const [sending,setSending]=useState(false);const [success,setSuccess]=useState(false);const [error,setError]=useState("");
 const c=copy[lang];
 usePageMetadata({title:"Free Mortgage Consultation | Infinite Home Lending",description:"Request a free, no-pressure mortgage consultation with Infinite Home Lending.",canonical:"https://www.infinitehomelending.com/free-consultation"});
 async function submit(e:FormEvent) {
  e.preventDefault(); if(sending)return; setError("");
  if(phone.replace(/\D/g,"").length<10){setError(lang==="es"?"Ingrese un teléfono válido.":"Please enter a valid phone number.");return;}
  setSending(true);
  const parts=name.trim().split(/\s+/);
  const params=new URLSearchParams(window.location.search);
  const utms=Object.fromEntries(["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].filter(k=>params.has(k)).map(k=>[k,params.get(k)]));
  try{
   const response=await fetch(apiUrl("/api/submit-lead"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({firstName:parts[0],lastName:parts.slice(1).join(" "),email:email.trim(),phone:phone.trim(),propertyState,smsConsent,smsConsentSource:"/free-consultation",path:"explore",answers:{"Loan interest":purpose,"Property state":propertyState,"Additional notes":notes.trim(),"Entry context":"Standalone Free Consultation landing page",...utms},hasUploadedStatement:false,submittedLang:lang})});
   const data=await response.json().catch(()=>({}));
   if(!response.ok||data.ok!==true)throw new Error("Submission unsuccessful");
   setSuccess(true);
  }catch{setError(c.error);}finally{setSending(false);}
 }
 return <div className="min-h-screen bg-[#F7F7F5] text-[#0B2A4A]">
  <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
   <Link to="/" aria-label="Infinite Home Lending home"><IHLLogo className="h-14 w-auto sm:h-16"/></Link>
   <button type="button" onClick={()=>{const next=lang==="en"?"es":"en";setLang(next);window.history.replaceState(null,"",next==="es"?"/free-consultation/es"+window.location.search:"/free-consultation"+window.location.search);}} className="rounded-full border border-[#C6A15B] px-5 py-2 text-xs font-semibold uppercase tracking-widest">{c.lang}</button>
  </header>
  <main className="mx-auto grid max-w-6xl items-center gap-5 px-5 pb-4 pt-1 sm:px-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-12 lg:py-5">
   <section className="relative isolate flex min-h-[205px] flex-col justify-center overflow-hidden rounded-2xl px-5 py-8 sm:min-h-[260px] sm:px-8 lg:min-h-[540px] lg:overflow-visible lg:px-0">
    <img src="/knowledge/knowledge-buying-home.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-30 lg:relative lg:inset-auto lg:order-2 lg:mt-7 lg:h-[315px] lg:rounded-xl lg:object-cover lg:opacity-100"/>
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#F7F7F5]/95 via-[#F7F7F5]/75 to-[#F7F7F5]/30 lg:hidden"/>
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[.20em] text-[#A8823F]">{c.eyebrow}</p>
    <h1 className="font-display text-[2.2rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.8rem]">{lang==="en"?<>Get your <strong className="font-bold">FREE</strong> consultation</>:<>Obtenga su consulta <strong className="font-bold">GRATIS</strong></>}</h1>
    <div className="my-4 h-0.5 w-14 bg-[#C6A15B]"/>
    <p className="max-w-md text-[15px] leading-6 text-[#465B6D]">{c.sub}</p>
   </section>
   <section className="rounded-2xl border border-[#E6E1D7] bg-white p-5 shadow-[0_14px_44px_rgba(11,42,74,.07)] sm:p-7" aria-label={c.heading}>
   {success?<div role="status" className="py-14 text-center"><h2 className="font-display text-3xl">{lang==="en"?"Thank you!":"¡Gracias!"}</h2><p className="mt-4 leading-7 text-[#465B6D]">{lang==="en"?"We will be in touch in the next 24 hours or sooner.":"Nos pondremos en contacto en las próximas 24 horas o antes."}</p><p className="mt-3 text-[#465B6D]">{lang==="en"?"We can’t wait to connect with you!":"¡Esperamos poder conversar con usted!"}</p></div>:
   <form onSubmit={submit} className="space-y-3">
    <div><label htmlFor="fc-name" className="mb-1 block text-xs font-semibold">{c.name} *</label><input id="fc-name" autoComplete="name" required maxLength={120} value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-lg border border-[#D7DDE1] px-3 py-2.5 outline-none focus:border-[#C6A15B]"/></div>
    <div><label htmlFor="fc-email" className="mb-1 block text-xs font-semibold">{c.email} *</label><input id="fc-email" type="email" autoComplete="email" required maxLength={200} value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-lg border border-[#D7DDE1] px-3 py-2.5 outline-none focus:border-[#C6A15B]"/></div>
    <div className="grid grid-cols-2 gap-3"><div><label htmlFor="fc-phone" className="mb-1 block text-xs font-semibold">{c.phone} *</label><input id="fc-phone" type="tel" autoComplete="tel" required value={phone} onChange={e=>setPhone(e.target.value)} className="w-full min-w-0 rounded-lg border border-[#D7DDE1] px-3 py-2.5 outline-none focus:border-[#C6A15B]"/></div><div><label htmlFor="fc-state" className="mb-1 block text-xs font-semibold">{c.state} *</label><select id="fc-state" required value={propertyState} onChange={e=>setPropertyState(e.target.value)} className="w-full min-w-0 rounded-lg border border-[#D7DDE1] bg-white px-3 py-2.5 outline-none focus:border-[#C6A15B]"><option value="">{c.choose}</option><option value="MD">Maryland</option><option value="DC">Washington, DC</option><option value="VA">Virginia</option></select></div></div>
    <div><label htmlFor="fc-purpose" className="mb-1 block text-xs font-semibold">{c.purpose}</label><select id="fc-purpose" value={purpose} onChange={e=>setPurpose(e.target.value)} className="w-full rounded-lg border border-[#D7DDE1] bg-white px-3 py-2.5 outline-none focus:border-[#C6A15B]"><option value="">{c.choose}</option>{(["purchase","refinance","equity","reverse","investment","other"] as const).map(k=><option key={k} value={k}>{c[k]}</option>)}</select></div>
    <div><label htmlFor="fc-notes" className="mb-1 block text-xs font-semibold">{c.notes}</label><textarea id="fc-notes" rows={2} maxLength={1500} value={notes} onChange={e=>setNotes(e.target.value)} className="w-full resize-y rounded-lg border border-[#D7DDE1] px-3 py-2.5 outline-none focus:border-[#C6A15B]"/></div>
    <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-4 text-[#465B6D]"><input type="checkbox" checked={smsConsent} onChange={e=>setSmsConsent(e.target.checked)} className="mt-0.5 accent-[#0B2A4A]"/><span>{c.sms} <Link to="/privacy-policy" className="underline">{c.privacy}</Link> · <Link to="/sms-terms" className="underline">{c.terms}</Link>.</span></label>
    {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={sending} type="submit" className="w-full rounded-lg bg-[#0B2A4A] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#143C62] disabled:opacity-60">{sending?c.sending:c.submit}</button>
   </form>}
   </section>
  </main>
  <footer className="mx-auto max-w-6xl px-5 pb-5 text-center text-[11px] leading-5 text-[#637486] sm:px-8"><p>{c.disclosure}</p><p className="mt-2">Infinite Home Lending L.L.C. | NMLS #2831765 · MD, DC & VA · Equal Housing Opportunity · <Link to="/privacy-policy" className="underline">{c.privacy}</Link></p></footer>
 </div>;
}
