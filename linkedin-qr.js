/* Volker's LinkedIn QR in the homepage contact area. */
(function(){
  var contact=document.getElementById('contact');
  if(!contact||contact.querySelector('.contact-linkedin'))return;
  var container=contact.querySelector('.btns');
  if(!container)return;
  var link=document.createElement('a');
  link.className='contact-linkedin';
  link.href='https://www.linkedin.com/in/volkerheistermann/';
  link.target='_blank';link.rel='noopener noreferrer';
  link.setAttribute('aria-label','Volker Heistermann on LinkedIn');
  link.style.cssText='display:inline-flex;flex-direction:column;align-items:center;gap:7px;margin-top:24px;color:#fff;text-decoration:none;font-size:13px;font-weight:650;letter-spacing:.02em';
  var qr=document.createElement('img');
  qr.src='data:image/png;base64,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';
  qr.alt="QR code for Volker Heistermann's LinkedIn profile";
  qr.width=144;qr.height=144;qr.style.cssText='display:block;width:144px;height:144px;padding:6px;border-radius:8px;background:#fff;box-sizing:content-box;image-rendering:pixelated';
  var label=document.createElement('span');label.textContent='LinkedIn';
  link.append(qr,label);container.insertAdjacentElement('afterend',link);
  link.addEventListener('focus',function(){link.style.outline='2px solid #fff';link.style.outlineOffset='6px'});
  link.addEventListener('blur',function(){link.style.outline=''});
})();
