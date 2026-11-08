const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav-links');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close':'Menu'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu'}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu'}})}

const projectSidebar = document.querySelector('.case-aside');
if (projectSidebar) {
  const sections = Array.from(projectSidebar.querySelectorAll('a[href^="#"]'), link => ({
    link,
    section: document.getElementById(link.hash.slice(1))
  })).filter(({ section }) => section);

  // The reading line sits just below the page's anchor scroll offset.
  const readingLine = 140;
  let activeLink;
  let pending = false;

  function updateCurrentSection() {
    pending = false;
    let nextLink;
    for (const { link, section } of sections) {
      if (section.getBoundingClientRect().top > readingLine) break;
      nextLink = link;
    }
    if (activeLink === nextLink) return;
    activeLink?.removeAttribute('aria-current');
    nextLink?.setAttribute('aria-current', 'location');
    activeLink = nextLink;
  }

  function scheduleSectionUpdate() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(updateCurrentSection);
  }

  window.addEventListener('scroll', scheduleSectionUpdate, { passive: true });
  window.addEventListener('resize', scheduleSectionUpdate);
  window.addEventListener('hashchange', scheduleSectionUpdate);
  window.addEventListener('pageshow', scheduleSectionUpdate);
  scheduleSectionUpdate();
}

function enableDialogDismissal(dialog) {
  dialog.querySelector('.modal-close, .contact-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
}

const imageViewer = document.querySelector('#image-viewer');
if (imageViewer) {
  const image = imageViewer.querySelector('img');
  const caption = imageViewer.querySelector('.modal-caption');
  document.querySelector('main').addEventListener('click', event => {
    const trigger = event.target.closest('button[data-image]');
    if (!trigger) return;
    image.src = trigger.dataset.image;
    image.alt = caption.textContent = trigger.dataset.caption;
    imageViewer.showModal();
  });
  enableDialogDismissal(imageViewer);
}

document.querySelectorAll('[data-slide-step]').forEach(button=>button.addEventListener('click',()=>{const deck=button.closest('.case-section').querySelector('.slide-deck');deck.scrollBy({left:Number(button.dataset.slideStep)*(deck.clientWidth+20),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));

const awardViewer = document.querySelector('#award-viewer');
if (awardViewer) {
  const image = awardViewer.querySelector('img');
  document.querySelector('[data-award-open]').addEventListener('click', () => {
    if (!image.hasAttribute('src')) image.src = image.dataset.src;
    awardViewer.showModal();
  });
  enableDialogDismissal(awardViewer);
}

const contactDialog=document.querySelector('#contact-dialog');
if(contactDialog&&typeof contactDialog.showModal==='function'){
 const emailField=contactDialog.querySelector('#contact-email');
 const copyButton=contactDialog.querySelector('[data-copy-email]');
 const copyStatus=contactDialog.querySelector('.contact-copy-status');
 document.querySelectorAll('[data-contact-open]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();copyButton.textContent='Copy email';copyStatus.textContent='';contactDialog.showModal()}));
 enableDialogDismissal(contactDialog);
 copyButton.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(emailField.value);copyButton.textContent='Copied';copyStatus.textContent='Email address copied.'}
  catch{emailField.focus();emailField.select();emailField.setSelectionRange(0,emailField.value.length);copyButton.textContent='Email selected';copyStatus.textContent='Press Ctrl+C (Windows) or ⌘C (Mac) to copy.'}
 });
}
