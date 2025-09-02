(()=>{
  const hdr = document.getElementById('hdr');
  let last = window.scrollY;
  addEventListener('scroll',()=>{
    const y = window.scrollY;
    hdr.classList.toggle('hide', y > last && y > 80);
    last = y;
  });

  // Mobile menu
  const menu = document.getElementById('menu');
  const burger = document.getElementById('burger');
  burger && burger.addEventListener('click',()=>{
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });

  // Theme toggle
  const theme = document.getElementById('theme');
  theme.addEventListener('click',()=>{
    document.body.classList.toggle('light');
    theme.setAttribute('aria-pressed', document.body.classList.contains('light'));
  });

  // Hero parallax
  addEventListener('pointermove',e=>{
    const x = (e.clientX/innerWidth - .5)*10;
    const y = (e.clientY/innerHeight - .5)*10;
    document.documentElement.style.setProperty('--mx', x+'px');
    document.documentElement.style.setProperty('--my', y+'px');
  });

  // Slider (drag/swipe with inertia + keyboard)
  const slider = document.getElementById('slider');
  let isDown=false,startX=0,scrollL=0,vel=0,raf=0,lastT=0,lastX=0;
  function inertia(){
    slider.scrollLeft += vel;
    vel *= 0.95;
    if(Math.abs(vel)>.3) raf = requestAnimationFrame(inertia);
  }
  slider.addEventListener('pointerdown',e=>{
    isDown=true; slider.setPointerCapture(e.pointerId);
    startX=e.clientX; scrollL=slider.scrollLeft; vel=0; cancelAnimationFrame(raf);
    lastT=performance.now(); lastX=e.clientX;
  });
  slider.addEventListener('pointermove',e=>{
    if(!isDown) return;
    const dx=e.clientX-startX;
    slider.scrollLeft = scrollL - dx;
    const now=performance.now();
    vel = (e.clientX - lastX) / (now - lastT) * 20; // px/frame approx
    lastT=now; lastX=e.clientX;
  });
  addEventListener('pointerup',()=>{ isDown=false; inertia(); });
  // keyboard
  slider.addEventListener('keydown',e=>{
    if(e.key==='ArrowRight') slider.scrollBy({left: innerWidth*.4, behavior:'smooth'});
    if(e.key==='ArrowLeft') slider.scrollBy({left: -innerWidth*.4, behavior:'smooth'});
  });
  // horizontal wheel support
  slider.addEventListener('wheel',e=>{
    if(Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // deixa vertical normal
    slider.scrollLeft += e.deltaX;
  }, {passive:true});

  // Reveal on scroll
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); });
  },{threshold:0.2});
  document.querySelectorAll('.reveal,.card').forEach(el=>io.observe(el));

  // Year
  year.textContent = new Date().getFullYear();

  // Copy contact
  window.copyWhats = () => {
    navigator.clipboard.writeText('+55 (21) 9 9999-9999');
    alert('WhatsApp copiado!');
  }
})();