(() => {
  'use strict';

  const journal = document.querySelector('.quest-journal');
  const index = journal?.querySelector('.quest-journal-index');
  const list = journal?.querySelector('.journey-list');
  const buttons = index ? [...index.querySelectorAll('[data-journey-record]')] : [];
  const panels = list ? [...list.querySelectorAll('.journey-item[role="tabpanel"]')] : [];
  if (!journal || !index || !list || !buttons.length || !panels.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  const motion = window.CelestialUI?.motion || {exit: 180, sequence: 760, transition: 900};
  const accents = ['#f1d58f', '#86d5ee', '#a8dfc7', '#d4b8ef'];
  let currentIndex = Math.max(0, buttons.findIndex(button => button.getAttribute('aria-selected') === 'true'));
  let prepareTimer = 0;
  let settleTimer = 0;
  let travelFrame = 0;
  let resizeFrame = 0;
  let pointerFrame = 0;

  journal.classList.add('ley-playback-ready');

  const field = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  field.classList.add('ley-playback-field');
  field.setAttribute('aria-hidden', 'true');
  field.setAttribute('preserveAspectRatio', 'none');
  field.innerHTML = `
    <defs>
      <linearGradient id="ley-playback-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f6dfa7" stop-opacity="0"/>
        <stop offset=".45" stop-color="#f6dfa7"/>
        <stop offset="1" stop-color="#83ddec" stop-opacity=".2"/>
      </linearGradient>
    </defs>
    <path class="ley-playback-route"/>
    <path class="ley-playback-trail"/>
    <circle class="ley-playback-origin" r="2.4"/>
    <circle class="ley-playback-traveller-halo" r="9"/>
    <circle class="ley-playback-traveller" r="3.2"/>`;
  journal.append(field);

  const memoryLayer = document.createElement('div');
  memoryLayer.className = 'ley-memory-layer';
  memoryLayer.setAttribute('aria-hidden', 'true');
  memoryLayer.innerHTML = `
    <span class="ley-memory-mist"></span>
    <span class="ley-memory-inscription"><small>Ley-line memory</small><strong>Quest record 01 · recalled</strong></span>`;
  list.append(memoryLayer);

  const route = field.querySelector('.ley-playback-route');
  const trail = field.querySelector('.ley-playback-trail');
  const origin = field.querySelector('.ley-playback-origin');
  const traveller = field.querySelector('.ley-playback-traveller');
  const travellerHalo = field.querySelector('.ley-playback-traveller-halo');
  const inscription = memoryLayer.querySelector('.ley-memory-inscription strong');

  function activeButton() {
    return buttons.find(button => button.getAttribute('aria-selected') === 'true') || buttons[currentIndex];
  }

  function activePanel() {
    return panels.find(panel => panel.classList.contains('is-active') && !panel.hidden) || panels[currentIndex];
  }

  function routePoints(button = activeButton(), panel = activePanel()) {
    const journalRect = journal.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const node = panel.querySelector('.journey-node');
    const nodeRect = node?.getBoundingClientRect();
    const nodeVisible = nodeRect && nodeRect.width > 0 && nodeRect.height > 0;
    return {
      start: {
        x: buttonRect.right - journalRect.left - 1,
        y: buttonRect.top - journalRect.top + buttonRect.height / 2
      },
      end: nodeVisible ? {
        x: nodeRect.left - journalRect.left + nodeRect.width / 2,
        y: nodeRect.top - journalRect.top + nodeRect.height / 2
      } : {
        x: panelRect.left - journalRect.left + 28,
        y: panelRect.top - journalRect.top + 52
      }
    };
  }

  function pathBetween(start, end) {
    const bendX = start.x + Math.max(36, (end.x - start.x) * .48);
    return `M ${start.x} ${start.y} C ${bendX} ${start.y}, ${bendX} ${end.y}, ${end.x} ${end.y}`;
  }

  function drawRoute(button = activeButton(), panel = activePanel()) {
    resizeFrame = 0;
    if (!button || !panel) return;
    const width = journal.clientWidth;
    const height = journal.clientHeight;
    if (!width || !height) return;
    const points = routePoints(button, panel);
    const d = pathBetween(points.start, points.end);
    field.setAttribute('viewBox', `0 0 ${width} ${height}`);
    route.setAttribute('d', d);
    trail.setAttribute('d', d);
    origin.setAttribute('cx', String(points.start.x));
    origin.setAttribute('cy', String(points.start.y));
    traveller.setAttribute('cx', String(points.end.x));
    traveller.setAttribute('cy', String(points.end.y));
    travellerHalo.setAttribute('cx', String(points.end.x));
    travellerHalo.setAttribute('cy', String(points.end.y));
    return points;
  }

  function animateTraveller() {
    cancelAnimationFrame(travelFrame);
    const length = route.getTotalLength();
    const duration = motion.sequence;
    let startTime = 0;

    function frame(time) {
      if (!startTime) startTime = time;
      const progress = Math.min(1, (time - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const point = route.getPointAtLength(length * eased);
      traveller.setAttribute('cx', String(point.x));
      traveller.setAttribute('cy', String(point.y));
      travellerHalo.setAttribute('cx', String(point.x));
      travellerHalo.setAttribute('cy', String(point.y));
      if (progress < 1) travelFrame = requestAnimationFrame(frame);
    }
    travelFrame = requestAnimationFrame(frame);
  }

  function playRecord(indexValue) {
    if (indexValue === currentIndex) return;
    currentIndex = indexValue;
    const button = buttons[indexValue];
    const panel = panels[indexValue];
    journal.style.setProperty('--ley-accent', accents[indexValue] || accents[0]);
    inscription.textContent = `Quest record ${String(indexValue + 1).padStart(2, '0')} · recalled`;
    buttons.forEach(item => item.classList.toggle('ley-origin', item === button));

    clearTimeout(prepareTimer);
    clearTimeout(settleTimer);
    cancelAnimationFrame(travelFrame);
    journal.classList.remove('ley-memory-travelling', 'ley-memory-settled');

    if (reduced.matches) {
      requestAnimationFrame(() => drawRoute(button, panel));
      return;
    }

    journal.classList.remove('ley-memory-preparing');
    void journal.offsetWidth;
    journal.classList.add('ley-memory-preparing');

    // archive-interface swaps the readable panel after its short outgoing fade.
    prepareTimer = setTimeout(() => {
      journal.classList.remove('ley-memory-preparing');
      journal.classList.add('ley-memory-travelling');
      drawRoute(button, panel);
      animateTraveller();
    }, motion.exit);

    settleTimer = setTimeout(() => {
      journal.classList.remove('ley-memory-travelling');
      journal.classList.add('ley-memory-settled');
      buttons.forEach(item => item.classList.remove('ley-origin'));
      drawRoute(button, panel);
    }, motion.transition + 100);
  }

  const selectionObserver = new MutationObserver(records => {
    records.forEach(record => {
      const button = record.target;
      if (button.getAttribute('aria-selected') !== 'true') return;
      playRecord(buttons.indexOf(button));
    });
  });
  buttons.forEach(button => selectionObserver.observe(button, {attributes: true, attributeFilter: ['aria-selected']}));

  journal.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const panel = activePanel();
      if (!panel) {
        pointerFrame = 0;
        return;
      }
      const rect = panel.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      journal.style.setProperty('--ley-depth-x', `${((x - .5) * 7).toFixed(2)}%`);
      journal.style.setProperty('--ley-depth-y', `${((y - .5) * 5).toFixed(2)}%`);
      pointerFrame = 0;
    });
  }, {passive: true});

  journal.addEventListener('pointerleave', () => {
    journal.style.setProperty('--ley-depth-x', '0%');
    journal.style.setProperty('--ley-depth-y', '0%');
  });

  function scheduleRoute() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => drawRoute());
  }

  addEventListener('resize', scheduleRoute, {passive: true});
  if ('ResizeObserver' in window) new ResizeObserver(scheduleRoute).observe(journal);
  requestAnimationFrame(() => {
    journal.style.setProperty('--ley-accent', accents[currentIndex]);
    drawRoute();
    journal.classList.add('ley-memory-settled');
  });

  addEventListener('pagehide', () => {
    clearTimeout(prepareTimer);
    clearTimeout(settleTimer);
    cancelAnimationFrame(travelFrame);
    selectionObserver.disconnect();
  }, {once: true});
})();
