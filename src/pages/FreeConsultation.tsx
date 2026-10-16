import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { IHLLogo } from "../components/IHLLogo";
import { apiUrl } from "../lib/apiBase";
import { usePageMetadata } from "../hooks/usePageMetadata";

const copy = {
 en: { eyebrow:"A personal conversation starts here", heading:"Your FREE Mortgage Consultation", sub:"Whether you're buying a home, exploring a refinance, or considering your equity options, tell us a little about your goals. We'll reach out to start a conversation—no pressure, no obligation.", name:"Full name", email:"Email address", phone:"Phone number", purpose:"What can we help you with?", choose:"Select an option", purchase:"Buying a home", refinance:"Refinancing", equity:"Home equity / HELOC", reverse:"Reverse mortgage", investment:"Investment property", other:"Something else", notes:"Anything else you'd like us to know? (optional)", sms:"I agree to receive text messages from Infinite Home Lending at the number provided, including responses to my inquiry. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not required to receive mortgage services.", submit:"Request my free consultation", sending:"Sending your request…", thanks:"Thank you for reaching out!", confirmation:"We've received your request. A member of our team will be in touch soon.", error:"We couldn't submit your request. Please try again or call us at (301) 507-7609.", privacy:"Privacy Policy", terms:"SMS Terms & Conditions", note:"No pressure. Just clear guidance.", lang:"Español", disclosure:"Submitting this form does not constitute a mortgage application or a commitment to lend." },
 es: { eyebrow:"Una conversación personal comienza aquí", heading:"Su consulta hipotecaria GRATIS", sub:"Ya sea que desee comprar una vivienda, refinanciar o explorar opciones sobre el valor acumulado de su hogar, cuéntenos sus objetivos. Nos comunicaremos con usted sin presión ni compromiso.", name:"Nombre completo", email:"Correo electrónico", phone:"Número de teléfono", purpose:"¿En qué podemos ayudarle?", choose:"Seleccione una opción", purchase:"Comprar una vivienda", refinance:"Refinanciar", equity:"Valor acumulado / HELOC", reverse:"Hipoteca inversa", investment:"Propiedad de inversión", other:"Otro asunto", notes:"¿Algo más que quiera compartir? (opcional)", sms:"Acepto recibir mensajes de texto de Infinite Home Lending al número proporcionado, incluyendo respuestas a mi consulta. La frecuencia varía. Pueden aplicarse cargos por mensajes y datos. Responda STOP para cancelar o HELP para ayuda. No es obligatorio aceptar para recibir servicios hipotecarios.", submit:"Solicitar mi consulta gratuita", sending:"Enviando solicitud…", thanks:"¡Gracias por comunicarse!", confirmation:"Hemos recibido su solicitud. Un miembro de nuestro equipo se comunicará con usted pronto.", error:"No pudimos enviar su solicitud. Inténtelo de nuevo o llámenos al (301) 507-7609.", privacy:"Política de privacidad", terms:"Términos y condiciones de SMS", note:"Sin presión y sin compromiso.", lang:"English", disclosure:"Enviar este formulario no constituye una solicitud de préstamo ni un compromiso de financiamiento." }
};
type Lang = keyof typeof copy;
export default function FreeConsultation() {
 const [lang,setLang] = useState<Lang>(()=>window.location.pathname.endsWith("/es")?"es":"en");
 const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [phone,setPhone]=useState(""); const [purpose,setPurpose]=useState(""); const [notes,setNotes]=useState(""); const [smsConsent,setSmsConsent]=useState(false);
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
   const response=await fetch(apiUrl("/api/submit-lead"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({firstName:parts[0],lastName:parts.slice(1).join(" "),email:email.trim(),phone:phone.trim(),smsConsent,smsConsentSource:"/free-consultation",path:"explore",answers:{"Loan interest":purpose,"Additional notes":notes.trim(),"Entry context":"Standalone Free Consultation landing page",...utms},hasUploadedStatement:false,submittedLang:lang})});
   const data=await response.json().catch(()=>({}));
   if(!response.ok||data.ok!==true)throw new Error("Submission unsuccessful");
   setSuccess(true);
  }catch{setError(c.error);}finally{setSending(false);}
 }
 return <div className="min-h-screen bg-[#F7F7F5] text-[#0B2A4A]">
  <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
   <Link to="/" aria-label="Infinite Home Lending home"><IHLLogo className="h-16 w-auto sm:h-20"/></Link>
   <button type="button" onClick={()=>{const next=lang==="en"?"es":"en";setLang(next);window.history.replaceState(null,"",next==="es"?"/free-consultation/es"+window.location.search:"/free-consultation"+window.location.search);}} className="rounded-full border border-[#C6A15B] px-5 py-2 text-xs font-semibold uppercase tracking-widest">{c.lang}</button>
  </header>
  <main className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-12 pt-4 sm:px-8 md:grid-cols-[1fr_1fr] md:gap-16 md:pb-20 md:pt-14">
   <section className="max-w-lg">
    <p className="mb-5 text-xs font-semibold uppercase tracking-[.22em] text-[#A8823F]">{c.eyebrow}</p>
    <h1 className="font-display text-4xl font-semibold leading-[1.13] tracking-tight sm:text-5xl lg:text-[3.5rem]">{c.heading}</h1>
    <div className="my-7 h-1 w-16 bg-[#C6A15B]"/>
    <p className="text-lg leading-8 text-[#465B6D]">{c.sub}</p>
    <p className="mt-8 font-display text-xl italic text-[#A8823F]">{c.note}</p>
   </section>
   <section className="rounded-2xl border border-[#E6E1D7] bg-white p-6 shadow-[0_18px_55px_rgba(11,42,74,.08)] sm:p-9" aria-label={c.heading}>
   {success?<div role="status" className="py-16 text-center"><div className="mb-5 text-5xl text-[#A8823F]">✓</div><h2 className="font-display text-3xl">{c.thanks}</h2><p className="mt-4 leading-7 text-[#465B6D]">{c.confirmation}</p></div>:
   <form onSubmit={submit} className="space-y-4">
    <div><label htmlFor="fc-name" className="mb-1.5 block text-sm font-medium">{c.name} *</label><input id="fc-name" autoComplete="name" required maxLength={120} value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-lg border border-[#D7DDE1] px-4 py-3 outline-none focus:border-[#C6A15B]"/></div>
    <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="fc-email" className="mb-1.5 block text-sm font-medium">{c.email} *</label><input id="fc-email" type="email" autoComplete="email" required maxLength={200} value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-lg border border-[#D7DDE1] px-4 py-3 outline-none focus:border-[#C6A15B]"/></div><div><label htmlFor="fc-phone" className="mb-1.5 block text-sm font-medium">{c.phone} *</label><input id="fc-phone" type="tel" autoComplete="tel" required value={phone} onChange={e=>setPhone(e.target.value)} className="w-full rounded-lg border border-[#D7DDE1] px-4 py-3 outline-none focus:border-[#C6A15B]"/></div></div>
    <div><label htmlFor="fc-purpose" className="mb-1.5 block text-sm font-medium">{c.purpose} *</label><select id="fc-purpose" required value={purpose} onChange={e=>setPurpose(e.target.value)} className="w-full rounded-lg border border-[#D7DDE1] bg-white px-4 py-3 outline-none focus:border-[#C6A15B]"><option value="">{c.choose}</option>{(["purchase","refinance","equity","reverse","investment","other"] as const).map(k=><option key={k} value={k}>{c[k]}</option>)}</select></div>
    <div><label htmlFor="fc-notes" className="mb-1.5 block text-sm font-medium">{c.notes}</label><textarea id="fc-notes" rows={3} maxLength={1500} value={notes} onChange={e=>setNotes(e.target.value)} className="w-full resize-y rounded-lg border border-[#D7DDE1] px-4 py-3 outline-none focus:border-[#C6A15B]"/></div>
    <label className="flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#465B6D]"><input type="checkbox" checked={smsConsent} onChange={e=>setSmsConsent(e.target.checked)} className="mt-1 accent-[#0B2A4A]"/><span>{c.sms} <Link to="/privacy-policy" className="underline">{c.privacy}</Link> · <Link to="/sms-terms" className="underline">{c.terms}</Link>.</span></label>
    {error&&<p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={sending} type="submit" className="w-full rounded-lg bg-[#0B2A4A] px-5 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-[#143C62] disabled:opacity-60">{sending?c.sending:c.submit}</button>
    <p className="text-center text-xs leading-5 text-[#687785]">{c.disclosure}</p>
   </form>}
   </section>
  </main>
  <footer className="border-t border-[#E6E1D7] px-5 py-6 text-center text-xs leading-6 text-[#637486]">© 2026 Infinite Home Lending L.L.C. · NMLS #2831765 · MD, DC & VA · Equal Housing Lender · <Link to="/privacy-policy" className="underline">{c.privacy}</Link></footer>
 </div>;
}
