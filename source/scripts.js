    // Enviar o Email
    function sendEmail(){
    Swal.fire({
        title: 'Aviso',
        html: 'Enviando Email, aguarde <b id="swal-timer">5</b>s…',
        timer: 5000,
        timerProgressBar: true,
        didOpen: () => {
        const b = document.getElementById('swal-timer');
        let left = 5;
        const int = setInterval(() => { left--; if (left >= 0) b.textContent = left; }, 1000);
        Swal.showLoading();
        Swal.stopTimer(); Swal.resumeTimer(); // garante início correto
        Swal.getPopup().addEventListener('mouseenter', Swal.stopTimer);
        Swal.getPopup().addEventListener('mouseleave', Swal.resumeTimer);
        Swal.willClose = () => clearInterval(int);
        }
    });
    
    var name = document.getElementById('fName').value.trim();
    var email = document.getElementById('fEmail').value.trim();
    var about = document.getElementById('fAbout').value.trim();

    if (!name || !email || !about) {
        Swal.fire({
            icon: 'error',
            title: 'Preencha todos os campos!',
            confirmButtonText: 'Ok'
        });
        return false;
    } else {
        let params = {
            name: name,
            email: email,
            about: about
        };

        const serviceID = "service_wqeg9sc";
        const templateID = "template_88cgj0r";

        emailjs
            .send(serviceID, templateID, params)
            .then((res) => {
                document.getElementById("fName").value = "";
                document.getElementById("fEmail").value = "";
                document.getElementById("fAbout").value = "";
                console.log(res);
                Swal.fire({
                    icon: 'success',
                    title: 'Email enviado com sucesso!',
                    confirmButtonText: 'Ok'
                });
            })
            .catch((err) => console.log(err));
        }
    }

    // ------------------------------
    // Utilidades
    // ------------------------------
    const $ = (s, r=document) => r.querySelector(s);
    const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

    // Ano footer
    $('#year').textContent = new Date().getFullYear();

    // Header sticky
    const hdr = $('#hdr');
    const onScrollHdr = () => hdr.classList.toggle('stuck', window.scrollY > 10);
    onScrollHdr();
    addEventListener('scroll', onScrollHdr, { passive: true });

    //Tema
    const themeToggle = $('#themeToggle');           // mantém sua função $
    const sol = document.getElementById('sol');
    const lua = document.getElementById('lua');

    const setIconForTheme = (t) => {
    const isDark = t === 'dark';
    // Mostrar SOL no modo escuro; mostrar LUA no modo claro
    sol.style.display = isDark ? 'inline-block' : 'none';
    lua.style.display = isDark ? 'none' : 'inline-block';
    // Acessibilidade (opcional)
    themeToggle.setAttribute('aria-label', isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro');
    };

    const applyTheme = (t) => {
    document.body.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    setIconForTheme(t); // atualiza os ícones sempre que o tema mudar
    };

    // Estado inicial
    applyTheme(localStorage.getItem('theme') || 'dark');

    // Toggle no clique
    themeToggle.addEventListener('click', () => {
    const next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    });

    // Voltar ao topo via logo
    $('#logo').addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));






    // HEADER MENU (dropdown abaixo do header)
    document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuToggle');
    const nav = document.getElementById('primaryNav');
    const hdr = document.getElementById('hdr');

    if (!menuBtn || !nav) {
        console.warn('Menu: verifique se #menuToggle e #primaryNav existem.');
        return;
    }

    const headerOffset = () => (hdr ? hdr.offsetHeight : 0);

    function openMenu() {
        menuBtn.setAttribute('aria-expanded', 'true');
        nav.classList.add('is-open');
        // foca primeiro link
        const firstLink = nav.querySelector('a[href]');
        (firstLink || nav).focus?.();
    }

    function closeMenu() {
        menuBtn.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
    }

    function isOpen() {
        return menuBtn.getAttribute('aria-expanded') === 'true';
    }

    // Toggle
    menuBtn.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));

    // Fechar no ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen()) closeMenu();
    });

    // Fechar ao rolar a página (experiência comum para dropdown)
    window.addEventListener('scroll', () => { if (isOpen()) closeMenu(); }, { passive: true });

    // Ajuste de foco tab (sem trap – não é overlay)
    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!isOpen()) return;
        const withinHeader = e.target.closest('#hdr');
        const withinNav = e.target.closest('#primaryNav');
        const withinBtn = e.target.closest('#menuToggle');
        if (!withinHeader && !withinNav && !withinBtn) closeMenu();
    });

    // Navegação dos links: mesma página = rolagem suave com offset; externo = padrão
    nav.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener('click', (e) => {
        const url = new URL(link.getAttribute('href'), window.location.href);

        // Mesmo path e possui hash -> é âncora na mesma página
        const isSamePageAnchor = url.pathname === window.location.pathname && !!url.hash;

        if (isSamePageAnchor) {
            const id = url.hash.slice(1);
            const target = document.getElementById(id);

            if (target) {
            e.preventDefault();
            closeMenu();
            // rola com offset do header (e pequena margem)
            const y = window.pageYOffset + target.getBoundingClientRect().top - headerOffset() - 8;
            window.scrollTo({ top: y, behavior: 'smooth' });
            history.pushState(null, '', `#${id}`);
            } // se não achar o alvo, deixa o comportamento padrão
        } else {
            // Link externo ou outra página: apenas fecha e segue
            closeMenu();
        }
        });
    });

    // Ao entrar em desktop, garante estado fechado
    const mq = window.matchMedia('(min-width: 768px)');
    mq.addEventListener('change', (ev) => { if (ev.matches) closeMenu(); });

    // Corrige ancoragem em carregamento com hash (evita ficar atrás do header)
    if (location.hash) {
        const el = document.getElementById(location.hash.slice(1));
        if (el) {
        setTimeout(() => {
            const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 8;
            window.scrollTo({ top: y });
        }, 0);
        }
    }
    });

    // HEADER MENU FIM

    // Parallax leve no hero
    const heroTitle = $('#heroTitle');
    const parallax = () => {
      const y = Math.min(40, window.scrollY * 0.12);
      heroTitle.style.transform = `translateY(${-y}px)`;
      requestAnimationFrame(() => {});
    };
    addEventListener('scroll', parallax, { passive: true });

    // Reveal on Scroll
    const io = new IntersectionObserver((entries)=>{
      for (const e of entries){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }
    }, { threshold: .25 });
    $$('.reveal').forEach(el=>io.observe(el));

    // Cards gradientes a partir do data-attr
    $$('.card').forEach(card=>{ const g = card.getAttribute('data-grad'); if(g) card.querySelector('.grad').style.background = g; });

    // Carousel
    const track = $('#carouselTrack');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const updateArrows = () => {
      const canLeft = track.scrollLeft > 0;
      const canRight = track.scrollLeft + track.clientWidth < track.scrollWidth - 1;
      prevBtn.disabled = !canLeft; nextBtn.disabled = !canRight;
    };

    // Força o carrossel a rolar SOMENTE na horizontal (wheel + touch)
    function makeHorizontalScrollOnly(el) {
    if (!el) return;

    // Acessível ao teclado (Home/End, Up/Down viram esquerda/direita)
    el.setAttribute('tabindex', '0');

    // Converte rolagem vertical do mouse (deltaY) em rolagem horizontal
    el.addEventListener(
        'wheel',
        (e) => {
        // Se o usuário rolou mais no Y do que no X, tratamos como X
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault(); // impede a página de rolar verticalmente
            el.scrollBy({ left: e.deltaY, behavior: 'auto' });
        }
        // Se já veio deltaX, o navegador cuidará (não impedimos)
        },
        { passive: false }
    );

    // iOS/Android (fallback ao touch-action): bloqueia tentativas de rolagem vertical
    let startX = 0, startY = 0, touching = false;
    el.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        startX = t.clientX; startY = t.clientY; touching = true;
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
        if (!touching) return;
        const t = e.touches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        // Se o gesto está mais vertical que horizontal, bloqueia para não "puxar" a página
        if (Math.abs(dy) > Math.abs(dx)) e.preventDefault();
    }, { passive: false });

    el.addEventListener('touchend',   () => { touching = false; }, { passive: true });
    el.addEventListener('touchcancel',() => { touching = false; }, { passive: true });

    // Teclado: Up/Down, PageUp/PageDown, Home/End
    el.addEventListener('keydown', (e) => {
        const by = Math.round(el.clientWidth * 0.8);
        if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); el.scrollBy({ left:  by, behavior: 'smooth' }); }
        if (e.key === 'ArrowUp'   || e.key === 'PageUp')   { e.preventDefault(); el.scrollBy({ left: -by, behavior: 'smooth' }); }
        if (e.key === 'Home')                              { e.preventDefault(); el.scrollTo({ left: 0, behavior: 'smooth' }); }
        if (e.key === 'End')                               { e.preventDefault(); el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' }); }
    });
    }

    // Chamada (já existe const track = $('#carouselTrack'); acima)
    makeHorizontalScrollOnly(track);

    const scrollByAmount = () => Math.round(track.clientWidth * 0.8);
    prevBtn.addEventListener('click', ()=> track.scrollBy({ left: -scrollByAmount(), behavior:'smooth'}));
    nextBtn.addEventListener('click', ()=> track.scrollBy({ left: scrollByAmount(), behavior:'smooth'}));
    track.addEventListener('scroll', updateArrows, { passive:true });
    addEventListener('resize', updateArrows);
    updateArrows();

    // Arraste (drag to scroll)
    let isDown = false, startX = 0, startLeft = 0;
    track.addEventListener('pointerdown', (e)=>{ isDown = true; startX = e.clientX; startLeft = track.scrollLeft; track.setPointerCapture(e.pointerId); track.style.cursor='grabbing'; });
    track.addEventListener('pointermove', (e)=>{ if(!isDown) return; const dx = e.clientX - startX; track.scrollLeft = startLeft - dx; });
    const endDrag = (e)=>{ isDown=false; track.releasePointerCapture?.(e.pointerId); track.style.cursor=''; };
    track.addEventListener('pointerup', endDrag); track.addEventListener('pointercancel', endDrag); track.addEventListener('pointerleave', endDrag);

    // Duplicar cards para grid desktop
    const gridDesktop = $('#gridDesktop');
    gridDesktop.innerHTML = track.innerHTML;

    // Cursor custom suave
    const dot = $('#dot');
    let tx = innerWidth/2, ty = innerHeight/2, cx = tx, cy = ty;
    const lerp = (a,b,t)=>a+(b-a)*t;
    const loop = ()=>{ cx = lerp(cx, tx, .18); cy = lerp(cy, ty, .18); dot.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); };
    loop();
    addEventListener('pointermove', (e)=>{ tx = e.clientX; ty = e.clientY; });
    addEventListener('pointerdown', ()=> dot.style.scale = .9);
    addEventListener('pointerup', ()=> dot.style.scale = 1);

    // Acessibilidade: esconder cursor custom em toque
    addEventListener('touchstart', ()=>{ dot.style.display='none'; }, { once:true });

    // Mostrar CTA desktop quando grande
    const mq = matchMedia('(min-width:1100px)');
    const toggleCTA = ()=> $('#ctaDesktop').style.display = mq.matches ? 'inline-flex' : 'none';
    mq.addEventListener('change', toggleCTA); toggleCTA();