const form=document.querySelector('form');
form.addEventListener('submit',async event=>{
 event.preventDefault();const button=form.querySelector('button');button.disabled=true;button.textContent='Checking contact capture…';form.querySelector('[role=status]')?.remove();form.querySelector('[role=alert]')?.remove();
 const data=new FormData(form);const auth=data.get('testAccess');data.delete('testAccess');
 try{
  const response=await fetch('/api/event-giveaway/test-entry',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+auth},body:JSON.stringify({...Object.fromEntries(data),eligible:data.has('eligible'),rules:data.has('eligible'),marketingConsent:false})});
  if(!response.headers.get('content-type')?.includes('application/json'))throw Error('Test service is not ready. Please try again shortly.');
  const result=await response.json();if(!response.ok)throw Error(result.error||'Test failed.');
  const box=document.createElement('div');box.setAttribute('role','status');box.className='success-note';
  const summary=document.createElement('p');summary.textContent=result.syncStatus==='done'&&result.contactId&&result.noteId?'PASS: test entry saved, HubSpot contact captured, and event note attached.':'Entry saved; HubSpot synchronization is still pending. This is not yet a successful contact-capture test.';box.append(summary);
  const detail=document.createElement('p');detail.textContent='Reference: '+result.reference+'. TEST ONLY — excluded from the drawing. Marketing subscription: '+(result.subscription||'not completed');box.append(detail);
  if(result.contactId){const link=document.createElement('a');link.href='https://app.hubspot.com/contacts/246447376/record/0-1/'+encodeURIComponent(result.contactId);link.target='_blank';link.rel='noopener';link.textContent='Open the captured contact in HubSpot →';box.append(link);}
  button.after(box);
 }catch(error){const box=document.createElement('p');box.setAttribute('role','alert');box.className='error';box.textContent=error.message||'Test failed.';button.after(box);}
 finally{button.disabled=false;button.textContent='Run contact test';}
});
