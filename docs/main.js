(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const cfg = window.SITE_CONFIG || {};
  const { t, set, onChange, state } = window.I18N;

  $('#year').textContent = new Date().getFullYear();

  /* ── Film grain tile ── */
  (function grain() {
    const c = document.createElement('canvas'); c.width = c.height = 160;
    const x = c.getContext('2d'); const d = x.createImageData(160, 160);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0);
    document.body.style.setProperty('--grain', `url(${c.toDataURL()})`);
  })();

  /* ── Toast ── */
  let toastTimer;
  function toast(msg, ms = 3200) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('is-on'), ms);
  }

  /* ── Links from config ── */
  $$('.js-linkedin').forEach(a => {
    if (cfg.linkedin) a.href = cfg.linkedin;
    else a.addEventListener('click', e => { e.preventDefault(); toast(t('toast.linkedin')); });
  });
  $$('.js-telegram').forEach(a => { if (cfg.telegram) a.href = cfg.telegram; else a.classList.add('is-hidden'); });
  $$('.js-email').forEach(a => {
    if (cfg.email) { a.href = 'mailto:' + cfg.email; $('.js-email-text', a).textContent = cfg.email; }
    else a.classList.add('is-hidden');
  });
  $$('[data-cv]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast(t('toast.cv')); }));

  /* ── Split text ── */
  function split(el) {
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split(' ').map(w =>
      `<span class="word" aria-hidden="true">${Array.from(w).map(ch => `<span class="char">${ch}</span>`).join('')}</span>`
    ).join(' ');
    return $$('.char', el);
  }
  function splitWords(el) {
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    el.innerHTML = text.split(' ').map(w => `<span class="word">${w}</span>`).join(' ');
    return $$('.word', el);
  }

  /* ── Language ── */
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === state.lang) return;
    const go = () => set(b.dataset.lang, true);
    if (hasGsap && !reduce) {
      const flash = document.createElement('div');
      flash.style.cssText = 'position:fixed;inset:0;background:#000;z-index:140;pointer-events:none;opacity:0';
      document.body.appendChild(flash);
      gsap.timeline({ onComplete: () => flash.remove() })
        .to(flash, { opacity: 1, duration: .22, ease: 'power2.in' })
        .add(go)
        .to(flash, { opacity: 0, duration: .5, ease: 'power2.out' });
    } else go();
  }));

  /* ── Mobile menu ── */
  const burger = $('#burger'), menu = $('#menu');
  function closeMenu() { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open'); setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 700); }
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); } else closeMenu();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(); });

  /* ── Smooth scroll ── */
  let lenis = null;
  if (!reduce && typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, easing: x => Math.min(1, 1.001 - Math.pow(2, -10 * x)) });
    if (hasGsap) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = time => { lenis.raf(time); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    }
  }
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const target = $(id); if (!target) return;
    e.preventDefault(); closeMenu();
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 }); else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  }));

  /* ── Nav state, progress, timecode, scene HUD ── */
  const nav = $('#nav'), bar = $('#progressBar'), tc = $('#timecode'), hudScene = $('#hudScene');
  const RUNTIME = 5 * 60; // «хронометраж» сайта — 5 минут
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? y / max : 0;
    bar.style.transform = `scaleX(${p})`;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 400 && !menu.classList.contains('is-open'));
    lastY = y;
    const s = p * RUNTIME, f = Math.floor((s % 1) * 24), pad = n => String(n).padStart(2, '0');
    tc.textContent = `00:${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}:${pad(f)}`;
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const navLinks = $$('.nav__links a');
  const sceneIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    hudScene.textContent = 'SC ' + en.target.dataset.scene;
    const id = en.target.id === 'about' ? 'home' : en.target.id;
    navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('.scene').forEach(s => sceneIO.observe(s));

  /* ── Reveal on scroll ── */
  const revealIO = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 90}ms`; revealIO.observe(el); });

  /* ── Custom cursor + magnetic buttons + card spotlight ── */
  if (fine && !reduce) {
    const cur = $('#cursor'); let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cur.classList.add('is-on'); }, { passive: true });
    document.addEventListener('mouseleave', () => cur.classList.remove('is-on'));
    (function loop() { cx += (mx - cx) * .18; cy += (my - cy) * .18; cur.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); })();
    $$('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
    });
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
    $$('.case').forEach(c => c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - r.left}px`); c.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
  }

  /* ── Blog reader ── */
  const reader = $('#reader');
  $('#openPost').addEventListener('click', () => { lenis && lenis.stop(); reader.showModal(); });
  $('#closePost').addEventListener('click', () => reader.close());
  reader.addEventListener('close', () => lenis && lenis.start());
  reader.addEventListener('click', e => { if (e.target === reader) reader.close(); });

  /* ── Region toast (shown once per visit, after the intro) ── */
  function regionToast() {
    if (state.reason === 'cis') toast(t('toast.cis'), 4200);
    else if (state.reason === 'west') toast(t('toast.west'), 4200);
    else if (state.reason === 'browser') toast(t('toast.browser'), 4200);
  }

  /* ═════════ GSAP choreography ═════════ */
  let heroIn = () => {};
  if (hasGsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);

    const heroChars = () => $$('.hero__name .char');
    $$('.split').forEach(split);

    heroIn = () => {
      gsap.fromTo(heroChars(), { yPercent: 110, rotateX: -80, opacity: 0 },
        { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.4, ease: 'expo.out', stagger: .05 });
      gsap.fromTo('.portrait__frame img, .portrait__mono', { scale: 1.4, filter: 'blur(14px)' }, { scale: 1.12, filter: 'blur(0px)', duration: 2.2, ease: 'expo.out' });
      gsap.fromTo('.portrait__film', { clipPath: 'inset(50% 0 50% 0)' }, { clipPath: 'inset(0% 0 0% 0)', duration: 1.6, ease: 'expo.inOut' });
    };

    // headings outside hero: char cascade on enter
    function bindSplitScroll() {
      $$('.split').filter(el => !el.closest('.hero__name')).forEach(el => {
        gsap.fromTo($$('.char', el), { yPercent: 120, opacity: 0, rotate: 6 }, {
          yPercent: 0, opacity: 1, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: .025,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });
    }
    bindSplitScroll();

    // about paragraph: word-by-word "exposure"
    const lead = $('.scrub');
    function bindScrub() {
      gsap.fromTo(splitWords(lead), { opacity: .12 }, {
        opacity: 1, stagger: .08, ease: 'none',
        scrollTrigger: { trigger: lead, start: 'top 80%', end: 'bottom 45%', scrub: true }
      });
    }
    bindScrub();

    // hero parallax out
    gsap.to('.hero__text', { yPercent: -18, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.portrait', { yPercent: 14, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    // big outlined scene numbers drift
    $$('.scene__num').forEach(n => gsap.fromTo(n, { yPercent: 30 }, { yPercent: -30, ease: 'none', scrollTrigger: { trigger: n.closest('.scene'), start: 'top bottom', end: 'bottom top', scrub: true } }));

    // marquee skew with scroll velocity
    const mq = $('.marquee__track');
    ScrollTrigger.create({ onUpdate: self => gsap.to(mq, { skewX: gsap.utils.clamp(-8, 8, self.getVelocity() / -300), duration: .4, overwrite: true }) });

    // steps line draws
    gsap.fromTo('.steps__line line', { '--dash': 1000 }, { '--dash': 0, ease: 'none', scrollTrigger: { trigger: '#steps', start: 'top 75%', end: 'bottom 55%', scrub: true } });
    gsap.from('.step__n', { scale: 0, duration: .9, ease: 'back.out(2)', stagger: .2, scrollTrigger: { trigger: '#steps', start: 'top 75%', once: true } });

    // portfolio: pinned horizontal reel on desktop
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1100px)', () => {
      const reel = $('#reel'), track = $('#reelTrack');
      reel.classList.add('is-pinned');
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      const tw = gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: reel, start: 'center center', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true }
      });
      $$('.case', track).forEach(c => gsap.from(c, { rotateY: -12, opacity: .4, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tw, start: 'left right', end: 'center center', scrub: true } }));
      return () => reel.classList.remove('is-pinned');
    });

    // portrait 3D tilt
    if (fine) {
      const film = $('.portrait__film');
      $('#portrait').addEventListener('mousemove', e => {
        const r = e.currentTarget.getBoundingClientRect();
        gsap.to(film, { rotateY: ((e.clientX - r.left) / r.width - .5) * 14, rotateX: -((e.clientY - r.top) / r.height - .5) * 14, transformPerspective: 900, duration: .6, ease: 'power2.out' });
      });
      $('#portrait').addEventListener('mouseleave', () => gsap.to(film, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, .5)' }));
    }

    // language switch: rebuild split text in final state
    onChange(() => {
      $$('.split').forEach(el => { split(el); gsap.set($$('.char', el), { yPercent: 0, opacity: 1, rotate: 0, rotateX: 0 }); });
      splitWords(lead); // after a switch keep the paragraph fully exposed
      ScrollTrigger.refresh();
    });
  }

  /* ═════════ INTRO ═════════ */
  const intro = $('#intro');
  let seen = false; try { seen = sessionStorage.getItem('ig-intro') === '1'; } catch (e) {}
  function finishIntro() {
    intro.classList.add('is-done');
    try { sessionStorage.setItem('ig-intro', '1'); } catch (e) {}
    heroIn(); setTimeout(regionToast, 900);
    if (hasGsap) ScrollTrigger.refresh();
  }

  if (!hasGsap || reduce || seen) { finishIntro(); return; }

  lenis && lenis.stop();
  const num = $('#leaderNum');
  const tl = gsap.timeline({ onComplete: () => { lenis && lenis.start(); finishIntro(); } });
  tl.set(num, { textContent: 3 })
    .to({}, { duration: .55 }).set(num, { textContent: 2 })
    .to({}, { duration: .55 }).set(num, { textContent: 1 })
    .to({}, { duration: .5 })
    .to('.leader', { scale: 1.6, opacity: 0, duration: .5, ease: 'power3.in' })
    .fromTo('.intro__titles', { opacity: 0 }, { opacity: 1, duration: .1 })
    .fromTo('.intro__presents', { letterSpacing: '1.2em', opacity: 0 }, { letterSpacing: '.5em', opacity: 1, duration: 1.2, ease: 'expo.out' }, '<')
    .fromTo('.intro__name', { yPercent: 40, opacity: 0, filter: 'blur(18px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out' }, '-=.9')
    .to('.intro__titles', { opacity: 0, scale: .96, duration: .6, ease: 'power2.in' }, '+=.5')
    .to('.intro__bar--top', { yPercent: -100, duration: 1, ease: 'expo.inOut' })
    .to('.intro__bar--bottom', { yPercent: 100, duration: 1, ease: 'expo.inOut' }, '<')
    .to(intro, { backgroundColor: 'rgba(0,0,0,0)', duration: 1, ease: 'expo.inOut' }, '<')
    .add(() => heroIn(), '<+.2')
    .eventCallback('onComplete', () => { lenis && lenis.start(); intro.classList.add('is-done'); try { sessionStorage.setItem('ig-intro', '1'); } catch (e) {} setTimeout(regionToast, 400); ScrollTrigger.refresh(); });

  function skip() { tl.progress(1); }
  $('#introSkip').addEventListener('click', skip);
  window.addEventListener('keydown', function k(e) { if (e.key === 'Escape' || e.key === 'Enter') { skip(); window.removeEventListener('keydown', k); } });
})();
