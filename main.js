// ================================================================
// Fundamento Matemático — landing editorial
// Preloader · reloj en vivo · progreso de lectura · capas parallax
// · scroll reveal · contadores animados · laboratorio interactivo
// ================================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  // Red de seguridad: si algo falla a mitad de la inicialización, el
  // contenido (marcado invisible por CSS solo cuando JS está activo)
  // nunca debe quedar oculto de forma permanente.
  try {
    initPreloader();
    initHeaderState();
    initProgressBar();
    initClock();
    initReveals();
    initParallax();
    initTabs();
    initShapes();
    initFunctionPlot();
    initMindMap();
    initCounters();
    initScrollCue();
    document.getElementById('year').textContent = new Date().getFullYear();
  } catch (err) {
    console.error('Fundamento Matemático — fallo de inicialización:', err);
    document.getElementById('preloader')?.classList.add('is-hidden');
    document.body.style.overflow = '';
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }
});

/* ---------------------------------------------------------
   Precarga: cuenta de 0 a 100% y desvanece
--------------------------------------------------------- */
function initPreloader() {
  const el = document.getElementById('preloader');
  const count = document.getElementById('preloaderCount');
  const bar = document.getElementById('preloaderBar');
  if (!el) return;

  if (prefersReducedMotion) {
    el.classList.add('is-hidden');
    document.body.style.overflow = '';
    return;
  }

  document.body.style.overflow = 'hidden';
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(1, elapsed / duration);
    const pct = Math.round(progress * 100);
    count.textContent = `${pct}%`;
    bar.style.width = `${pct}%`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(() => {
        el.classList.add('is-hidden');
        document.body.style.overflow = '';
      }, 180);
    }
  }
  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------
   Nav: fondo sólido tras hacer scroll
--------------------------------------------------------- */
function initHeaderState() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-solid', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------
   Barra de progreso de lectura
--------------------------------------------------------- */
function initProgressBar() {
  const fill = document.getElementById('progressFill');
  if (!fill) return;
  const onScroll = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    const pct = height > 0 ? (scrollTop / height) * 100 : 0;
    fill.style.width = `${pct}%`;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}

/* ---------------------------------------------------------
   Reloj en vivo — Bogotá
--------------------------------------------------------- */
function initClock() {
  const timeEls = [document.getElementById('clockTime'), document.getElementById('clockTimeFooter')].filter(Boolean);
  if (!timeEls.length) return;

  const formatter = new Intl.DateTimeFormat('es-CO', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'America/Bogota',
  });

  function tick() {
    const formatted = formatter.format(new Date());
    timeEls.forEach((el) => { el.textContent = formatted; });
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   Scroll reveal — variantes por sección (fade / lines / up / left / right)
--------------------------------------------------------- */
function initReveals() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (prefersReducedMotion) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Capas con parallax — profundidad ligada al centro de cada sección
--------------------------------------------------------- */
function initParallax() {
  const layers = Array.from(document.querySelectorAll('.parallax-layer'));
  if (!layers.length || prefersReducedMotion) return;

  let ticking = false;

  function update() {
    const viewportCenter = window.innerHeight / 2;
    layers.forEach((el) => {
      const speed = parseFloat(el.dataset.speed || '0.1');
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const delta = (viewportCenter - elementCenter) * speed;
      el.style.transform = `translate3d(0, ${delta.toFixed(1)}px, 0)`;
    });
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/* ---------------------------------------------------------
   Indicador "desliza para explorar": baja a la sección siguiente
--------------------------------------------------------- */
function initScrollCue() {
  const cue = document.getElementById('scrollCue');
  if (!cue) return;
  cue.addEventListener('click', () => {
    const next = document.querySelector('.manifesto');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------
   Contadores animados (cifras)
--------------------------------------------------------- */
function initCounters() {
  const numbers = document.querySelectorAll('.stat-number');
  if (!numbers.length) return;

  function animate(el) {
    const target = parseFloat(el.dataset.count || '0');
    const suffix = el.dataset.suffix || '';
    if (prefersReducedMotion) {
      el.textContent = `${target}${suffix}`;
      return;
    }
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  numbers.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------
   Laboratorio — pestañas
--------------------------------------------------------- */
function initTabs() {
  const tabs = document.querySelectorAll('.lab-tab');
  const panels = {
    manipulativos: document.getElementById('panel-manipulativos'),
    geometria: document.getElementById('panel-geometria'),
    mapas: document.getElementById('panel-mapas'),
  };
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');

      Object.values(panels).forEach((p) => p.classList.add('hidden'));
      panels[tab.dataset.tab].classList.remove('hidden');
    });
  });
}

/* ---------------------------------------------------------
   Laboratorio — manipulativos arrastrables
--------------------------------------------------------- */
function initShapes() {
  const canvas = document.getElementById('shapeCanvas');
  const areaLabel = document.getElementById('areaTotal');
  const resetBtn = document.getElementById('resetShapes');
  if (!canvas) return;

  const pieceDefs = [
    { area: 4, color: '#2563EB', w: 80, h: 80, shape: 'M0,0 H80 V80 H0 Z' },
    { area: 4.5, color: '#7C3AED', w: 100, h: 90, shape: 'M0,90 L50,0 L100,90 Z' },
    { area: 6, color: '#F97316', w: 120, h: 50, shape: 'M0,0 H120 V50 H0 Z' },
    { area: 3, color: '#EF4444', w: 70, h: 70, shape: 'M35,0 L70,35 L35,70 L0,35 Z' },
    { area: 4, color: '#16A34A', w: 80, h: 76, shape: 'M40,0 L80,29 L64,76 L16,76 L0,29 Z' },
  ];

  function layout() {
    canvas.innerHTML = '';
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    let total = 0;

    pieceDefs.forEach((def, i) => {
      total += def.area;
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.classList.add('manip-piece');
      el.setAttribute('width', def.w);
      el.setAttribute('height', def.h);
      el.setAttribute('viewBox', `0 0 ${def.w} ${def.h}`);
      el.innerHTML = `<path d="${def.shape}" fill="${def.color}" fill-opacity="0.85" stroke="${def.color}" stroke-width="2"/>`;

      const startX = 20 + (i % 3) * (cw - 60) / 3;
      const startY = 20 + Math.floor(i / 3) * (ch - 120) / 2 + (i % 2) * 20;
      el.style.left = `${Math.max(10, Math.min(cw - def.w - 10, startX))}px`;
      el.style.top = `${Math.max(10, Math.min(ch - def.h - 10, startY))}px`;

      makeDraggable(el, canvas);
      canvas.appendChild(el);
    });

    if (areaLabel) areaLabel.textContent = total.toFixed(1);
  }

  function makeDraggable(el, bounds) {
    let offsetX = 0, offsetY = 0, dragging = false;

    const onDown = (clientX, clientY) => {
      const rect = el.getBoundingClientRect();
      offsetX = clientX - rect.left;
      offsetY = clientY - rect.top;
      dragging = true;
      el.style.zIndex = 10;
    };
    const onMove = (clientX, clientY) => {
      if (!dragging) return;
      const boundsRect = bounds.getBoundingClientRect();
      let x = clientX - boundsRect.left - offsetX;
      let y = clientY - boundsRect.top - offsetY;
      x = Math.max(-20, Math.min(bounds.clientWidth - 20, x));
      y = Math.max(-20, Math.min(bounds.clientHeight - 20, y));
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };
    const onUp = () => { dragging = false; el.style.zIndex = 1; };

    el.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    window.addEventListener('mouseup', onUp);

    el.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      onDown(t.clientX, t.clientY);
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      const t = e.touches[0];
      onMove(t.clientX, t.clientY);
    }, { passive: true });
    window.addEventListener('touchend', onUp);
  }

  layout();
  if (resetBtn) resetBtn.addEventListener('click', layout);
  window.addEventListener('resize', () => {
    if (!document.getElementById('panel-manipulativos').classList.contains('hidden')) layout();
  });
}

/* ---------------------------------------------------------
   Laboratorio — graficador de f(x) = ax² + bx + c
--------------------------------------------------------- */
function initFunctionPlot() {
  const canvas = document.getElementById('functionPlot');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const sliderA = document.getElementById('sliderA');
  const sliderB = document.getElementById('sliderB');
  const sliderC = document.getElementById('sliderC');
  const coefA = document.getElementById('coefA');
  const coefB = document.getElementById('coefB');
  const coefC = document.getElementById('coefC');
  const readout = document.getElementById('functionReadout');

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    const a = parseFloat(sliderA.value);
    const b = parseFloat(sliderB.value);
    const c = parseFloat(sliderC.value);
    coefA.textContent = a;
    coefB.textContent = b;
    coefC.textContent = c;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const xRange = 10;
    const yRange = 10;
    const toPx = (x, y) => [
      w / 2 + (x / xRange) * (w / 2),
      h / 2 - (y / yRange) * (h / 2),
    ];

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let gx = -xRange; gx <= xRange; gx += 2) {
      const [px] = toPx(gx, 0);
      ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
    }
    for (let gy = -yRange; gy <= yRange; gy += 2) {
      const [, py] = toPx(0, gy);
      ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
    }
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    const [ox] = toPx(0, 0); const [, oy] = toPx(0, 0);
    ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(w, oy); ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;
    let started = false;
    for (let px = 0; px <= w; px++) {
      const x = ((px - w / 2) / (w / 2)) * xRange;
      const y = a * x * x + b * x + c;
      const [, py] = toPx(x, y);
      if (py < -50 || py > h + 50) { started = false; continue; }
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    if (a !== 0) {
      const vx = -b / (2 * a);
      const vy = a * vx * vx + b * vx + c;
      const [pvx, pvy] = toPx(vx, vy);
      if (pvx >= 0 && pvx <= w && pvy >= 0 && pvy <= h) {
        ctx.beginPath();
        ctx.fillStyle = '#7C3AED';
        ctx.arc(pvx, pvy, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      const disc = b * b - 4 * a * c;
      if (disc >= 0) {
        const r1 = (-b + Math.sqrt(disc)) / (2 * a);
        const r2 = (-b - Math.sqrt(disc)) / (2 * a);
        [r1, r2].forEach((r) => {
          const [prx, pry] = toPx(r, 0);
          if (prx >= 0 && prx <= w) {
            ctx.beginPath();
            ctx.fillStyle = '#EF4444';
            ctx.arc(prx, pry, 4.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      const discTxt = disc >= 0
        ? `dos raíces reales (${((-b + Math.sqrt(disc)) / (2 * a)).toFixed(2)} y ${((-b - Math.sqrt(disc)) / (2 * a)).toFixed(2)})`
        : 'sin raíces reales (el discriminante es negativo)';
      readout.textContent = `Vértice en (${vx.toFixed(2)}, ${vy.toFixed(2)}) · concavidad hacia ${a > 0 ? 'arriba' : 'abajo'} · ${discTxt}.`;
    } else {
      readout.textContent = 'Con a = 0, la función es lineal: b es la pendiente y c el corte con el eje y.';
    }
  }

  [sliderA, sliderB, sliderC].forEach((s) => s.addEventListener('input', draw));
  window.addEventListener('resize', resize);
  resize();
}

/* ---------------------------------------------------------
   Laboratorio — mapa conceptual clicable
--------------------------------------------------------- */
function initMindMap() {
  const svg = document.getElementById('mindMap');
  const readout = document.getElementById('mindMapReadout');
  if (!svg) return;

  const nodes = [
    { id: 'patrones', label: 'Patrones numéricos', x: 90, y: 160, color: '#2563EB',
      desc: 'Punto de partida: reconocer regularidades en secuencias de números.' },
    { id: 'funciones', label: 'Función', x: 260, y: 90, color: '#7C3AED',
      desc: 'Generaliza un patrón como una relación entre variables.' },
    { id: 'lineal', label: 'Función lineal', x: 260, y: 230, color: '#7C3AED',
      desc: 'Caso particular de función con razón de cambio constante.' },
    { id: 'cuadratica', label: 'Función cuadrática', x: 430, y: 90, color: '#16A34A',
      desc: 'Modela fenómenos con tasa de cambio variable — clave en el nivel 3 y 4 del Icfes.' },
    { id: 'sistemas', label: 'Sistemas de ecuaciones', x: 430, y: 230, color: '#16A34A',
      desc: 'Combina varias funciones lineales para resolver problemas con múltiples condiciones.' },
    { id: 'optimizacion', label: 'Modelos de optimización', x: 580, y: 160, color: '#F97316',
      desc: 'Aplica funciones cuadráticas y sistemas para maximizar o minimizar una cantidad.' },
  ];

  const edges = [
    ['patrones', 'funciones'], ['patrones', 'lineal'],
    ['funciones', 'cuadratica'], ['lineal', 'sistemas'],
    ['cuadratica', 'optimizacion'], ['sistemas', 'optimizacion'],
  ];

  const svgNS = 'http://www.w3.org/2000/svg';
  const edgeEls = [];

  edges.forEach(([fromId, toId]) => {
    const from = nodes.find((n) => n.id === fromId);
    const to = nodes.find((n) => n.id === toId);
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', from.x); line.setAttribute('y1', from.y);
    line.setAttribute('x2', to.x); line.setAttribute('y2', to.y);
    line.setAttribute('stroke', '#cbd5e1');
    line.setAttribute('stroke-width', '2');
    line.classList.add('map-edge');
    line.dataset.from = fromId;
    line.dataset.to = toId;
    svg.appendChild(line);
    edgeEls.push(line);
  });

  nodes.forEach((n) => {
    const g = document.createElementNS(svgNS, 'g');
    g.classList.add('map-node');
    g.dataset.id = n.id;

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y);
    circle.setAttribute('r', 30);
    circle.setAttribute('fill', n.color);
    circle.setAttribute('fill-opacity', '0.14');
    circle.setAttribute('stroke', n.color);
    circle.setAttribute('stroke-width', '2');
    g.appendChild(circle);

    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', n.x);
    text.setAttribute('y', n.y + 48);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.setAttribute('font-family', 'Manrope, sans-serif');
    text.setAttribute('font-weight', '600');
    text.setAttribute('fill', '#334155');
    text.textContent = n.label;
    g.appendChild(text);

    g.addEventListener('click', () => {
      nodes.forEach((other) => {
        const c = svg.querySelector(`g[data-id="${other.id}"] circle`);
        c.setAttribute('fill-opacity', other.id === n.id ? '0.85' : '0.14');
      });
      edgeEls.forEach((edge) => {
        const connected = edge.dataset.from === n.id || edge.dataset.to === n.id;
        edge.setAttribute('stroke', connected ? n.color : '#cbd5e1');
        edge.setAttribute('stroke-width', connected ? '3' : '2');
      });
      readout.textContent = `${n.label}: ${n.desc}`;
    });

    svg.appendChild(g);
  });
}
