/* =============================================================
   DIALED IN CNC — interactions
   Restrained, precision-instrument micro-interactions.
   ============================================================= */
(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Generate dial tick marks ---------- */
  const ticks = $('#ticks');
  if (ticks) {
    const cx = 200, cy = 200;
    let out = '';
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
      const major = i % 5 === 0;
      const r1 = 170, r2 = major ? 156 : 163;
      const x1 = cx + Math.cos(a) * r1, y1 = cy + Math.sin(a) * r1;
      const x2 = cx + Math.cos(a) * r2, y2 = cy + Math.sin(a) * r2;
      out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="${major ? 2 : 1}" opacity="${major ? 0.7 : 0.3}"/>`;
    }
    ticks.innerHTML = out;
  }

  /* ---------- Duplicate ticker for seamless marquee ---------- */
  const ticker = $('#ticker');
  if (ticker) ticker.innerHTML += ticker.innerHTML;

  /* ---------- Custom reticle cursor ---------- */
  if (finePointer) {
    const ring = $('.cursor__ring'), dot = $('.cursor__dot');
    let rx = innerWidth / 2, ry = innerHeight / 2, dx = rx, dy = ry;
    addEventListener('mousemove', e => { dx = e.clientX; dy = e.clientY; dot.style.transform = `translate(${dx}px,${dy}px)`; });
    (function loop() {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    })();
    const hoverTargets = 'a, button, [data-hover], .svc, .pain, .step, .platforms__grid div';
    $$(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('-hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('-hovering'));
    });
  }

  /* ---------- Nav scroll state ---------- */
  const nav = $('#nav');
  const onScrollNav = () => nav.classList.toggle('-scrolled', scrollY > 40);
  onScrollNav();
  addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = $('#burger'), menu = $('#menu');
  if (burger) {
    burger.addEventListener('click', () => document.body.classList.toggle('-menu'));
    $$('#menu a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('-menu')));
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('.reveal, .reveal-lines').forEach(el => io.observe(el));

  /* ---------- Hero headline line reveal ---------- */
  requestAnimationFrame(() => {
    const head = $('.hero__head');
    if (head) setTimeout(() => head.classList.add('-in'), 180);
    $$('.hero .reveal').forEach((el, i) => setTimeout(() => el.classList.add('-in'), 260 + i * 90));
  });

  /* ---------- Counters ---------- */
  const counters = $$('[data-count]');
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count;
      if (reduce) { el.textContent = target; cIO.unobserve(el); return; }
      const dur = 1400, start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(el => cIO.observe(el));

  /* ---------- Scroll gauge + hero dial needle ---------- */
  const gauge = $('.gauge'), prog = $('.gauge .prog'), pct = $('.gauge__pct');
  const needle = $('#needle');
  const heroBg = $('.hero__bg-word');
  const R = 27, CIRC = 2 * Math.PI * R;
  if (prog) { prog.style.strokeDasharray = CIRC; prog.style.strokeDashoffset = CIRC; }
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? scrollY / max : 0;
      if (prog) prog.style.strokeDashoffset = CIRC * (1 - p);
      if (pct) pct.textContent = String(Math.round(p * 100)).padStart(2, '0');
      if (gauge) gauge.classList.toggle('-show', scrollY > innerHeight * 0.6);
      // hero dial needle sweeps -60deg -> +150deg across first viewport
      if (needle && !reduce) {
        const hp = Math.min(scrollY / innerHeight, 1);
        needle.style.transform = `rotate(${-60 + hp * 210}deg)`;
        needle.style.transformOrigin = '200px 200px';
      }
      if (heroBg && !reduce) heroBg.style.transform = `translate(-50%,-50%) translateY(${scrollY * 0.12}px)`;
      ticking = false;
    });
  };
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduce) {
    $$('[data-magnetic]').forEach(btn => {
      const strength = 0.32;
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- Interactive process ---------- */
  const stepData = [
    {
      i: '01', t: 'You Call Kevin',
      d: 'Machine down? You get the owner on the phone — not a queue. A decade of CNC experience starts triaging the symptom, the platform and the alarm code before the truck even rolls.',
      m: [['Response', 'FAST'], ['Who you reach', 'THE OWNER'], ['Coverage', '150 MILES']]
    },
    {
      i: '02', t: 'On-Site Diagnosis',
      d: 'Kevin arrives and reads the machine the way a machinist does — servo faults, encoders, drives, geometry, communication. Accurate diagnosis the first time, so you only pay to fix the real problem.',
      m: [['Method', 'HANDS-ON'], ['Accuracy', 'FIRST TIME'], ['Scope', 'ELEC + MECH']]
    },
    {
      i: '03', t: 'Repair & Calibrate',
      d: 'Electrical and mechanical repair, alignment and 5-axis calibration performed on-site. Wiring, drives, sensors, spindle and axis accuracy brought back to spec across every major platform.',
      m: [['Platforms', 'ALL MAJOR'], ['Specialty', '5-AXIS'], ['Standard', 'TO SPEC']]
    },
    {
      i: '04', t: 'Verify & Prevent',
      d: 'Accuracy is validated before Kevin leaves — because precision is the job, not the goal. Then a preventive maintenance plan keeps the next breakdown from ever reaching your floor.',
      m: [['Validation', 'CONFIRMED'], ['Follow-up', 'PM PLAN'], ['Outcome', 'UPTIME']]
    }
  ];
  const steps = $$('.step');
  const panel = $('#stepPanel');
  const pIndex = $('#panelIndex'), pTitle = $('#panelTitle'), pDesc = $('#panelDesc'), pMeta = $('#panelMeta');
  const stepsProgress = $('#stepsProgress');
  let activeStep = 0;

  function setStep(n) {
    if (n === activeStep && panel.dataset.init) return;
    panel.dataset.init = '1';
    activeStep = n;
    const d = stepData[n];
    steps.forEach((s, i) => s.classList.toggle('-active', i === n));
    pIndex.textContent = d.i; pTitle.textContent = d.t; pDesc.textContent = d.d;
    pMeta.innerHTML = d.m.map(([k, v]) => `<div><small>${k}</small><b>${v}</b></div>`).join('');
    if (!reduce) { panel.classList.remove('-swap'); void panel.offsetWidth; panel.classList.add('-swap'); }
    if (stepsProgress) stepsProgress.style.height = `${(n / (steps.length - 1)) * 100}%`;
  }
  steps.forEach((s, i) => {
    s.addEventListener('click', () => setStep(i));
    s.addEventListener('mouseenter', () => finePointer && setStep(i));
  });
  if (panel && steps.length) setStep(0);

  // Auto-advance process while it's in view (pauses on interaction)
  if (!reduce) {
    let auto = null, userTouched = false;
    const processSec = $('#process');
    steps.forEach(s => s.addEventListener('click', () => { userTouched = true; clearInterval(auto); auto = null; }));
    const pIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && !userTouched && !auto) {
          auto = setInterval(() => setStep((activeStep + 1) % stepData.length), 3200);
        } else if (!e.isIntersecting && auto) {
          clearInterval(auto); auto = null;
        }
      });
    }, { threshold: 0.4 });
    if (processSec) pIO.observe(processSec);
  }

  /* ---------- Smooth anchor scroll (respects reduced motion) ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    });
  });

  /* ---------- Contact form → pre-filled email (no backend) ---------- */
  const form = $('#serviceForm');
  if (form) {
    const status = $('#formStatus');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const g = (k) => (data.get(k) || '').toString().trim();
      const urgent = g('urgency') === 'down';
      const subject = urgent
        ? `MACHINE DOWN — Service Request${g('shop') ? ' · ' + g('shop') : ''}`
        : `CNC Service Request${g('shop') ? ' · ' + g('shop') : ''}`;
      const body = [
        `Shop / company: ${g('shop')}`,
        `Contact name:   ${g('name')}`,
        `Best number:    ${g('phone')}`,
        `Machine / platform: ${g('platform')}`,
        `Urgency:        ${urgent ? 'MACHINE DOWN — need help now' : 'Scheduled / planning'}`,
        `Location:       ${g('location')}`,
        '',
        'Symptom / alarm code:',
        g('message')
      ].join('\n');
      const href = `mailto:dialedincnc@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      if (status) {
        status.hidden = false;
        status.textContent = 'Opening your email app… if nothing happens, call 937-901-0935 or email dialedincnc@gmail.com directly.';
      }
    });
  }
})();
