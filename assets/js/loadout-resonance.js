(() => {
  'use strict';

  const arsenal = document.querySelector('.tech-arsenal');
  const grid = arsenal?.querySelector('.tech-sigil-grid');
  const sigils = grid ? [...grid.querySelectorAll('.tech-sigil')] : [];
  if (!arsenal || !grid || sigils.length < 2) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let awakeTimer = 0;
  let ringTimers = [];
  let resizeFrame = 0;

  arsenal.classList.add('loadout-resonance');
  document.documentElement.classList.add('loadout-resonance-ready');

  const field = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  field.classList.add('loadout-energy-field');
  field.setAttribute('aria-hidden', 'true');
  field.setAttribute('preserveAspectRatio', 'none');
  field.innerHTML = `
    <defs>
      <linearGradient id="loadout-energy-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#f4dda0" stop-opacity="0"/>
        <stop offset=".42" stop-color="#f4dda0"/>
        <stop offset="1" stop-color="#72d8ed" stop-opacity=".12"/>
      </linearGradient>
    </defs>`;
  grid.prepend(field);

  // A serpentine route keeps the energy legible on both the 4x2 desktop grid
  // and the 2x4 mobile grid without crossing through the technology labels.
  function routeOrder() {
    const rows = [];
    const tolerance = 8;
    sigils.forEach((sigil, index) => {
      const top = sigil.offsetTop;
      let row = rows.find(item => Math.abs(item.top - top) <= tolerance);
      if (!row) {
        row = {top, indexes: []};
        rows.push(row);
      }
      row.indexes.push(index);
    });
    rows.sort((a, b) => a.top - b.top);
    return rows.flatMap((row, rowIndex) => rowIndex % 2 ? [...row.indexes].reverse() : row.indexes);
  }

  function centerOf(sigil) {
    const frame = sigil.querySelector('.tech-sigil-frame');
    return {
      x: sigil.offsetLeft + frame.offsetLeft + frame.offsetWidth / 2,
      y: sigil.offsetTop + frame.offsetTop + frame.offsetHeight / 2
    };
  }

  function makePath(start, end) {
    const horizontal = Math.abs(start.y - end.y) < 12;
    if (horizontal) return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    const middleY = start.y + (end.y - start.y) * .5;
    return `M ${start.x} ${start.y} C ${start.x} ${middleY}, ${end.x} ${middleY}, ${end.x} ${end.y}`;
  }

  function drawEnergyRoute() {
    resizeFrame = 0;
    const width = grid.clientWidth;
    const height = grid.clientHeight;
    if (!width || !height) return;
    field.setAttribute('viewBox', `0 0 ${width} ${height}`);
    field.querySelectorAll('[data-energy-segment]').forEach(path => path.remove());

    const order = routeOrder();
    order.slice(0, -1).forEach((sigilIndex, routeIndex) => {
      const nextIndex = order[routeIndex + 1];
      const d = makePath(centerOf(sigils[sigilIndex]), centerOf(sigils[nextIndex]));
      ['base', 'pulse'].forEach(layer => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.classList.add(`loadout-energy-${layer}`);
        path.dataset.energySegment = String(routeIndex);
        path.dataset.from = String(sigilIndex);
        path.dataset.to = String(nextIndex);
        path.setAttribute('d', d);
        if (layer === 'pulse') {
          path.style.setProperty('--path-delay', `${390 + routeIndex * 125}ms`);
          path.style.setProperty('--idle-delay', `${routeIndex * .18}s`);
        }
        field.append(path);
      });
    });
  }

  function scheduleRouteDraw() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(drawEnergyRoute);
  }

  function clearTimers() {
    clearTimeout(awakeTimer);
    ringTimers.forEach(clearTimeout);
    ringTimers = [];
  }

  function awaken() {
    if (arsenal.classList.contains('is-awake') || arsenal.classList.contains('is-awakening')) return;
    drawEnergyRoute();
    if (reduced.matches) {
      arsenal.classList.add('is-awake', 'is-visible');
      sigils.forEach(sigil => sigil.classList.add('is-awakened'));
      return;
    }

    arsenal.classList.add('is-awakening', 'is-visible');
    const order = routeOrder();
    sigils.forEach((sigil, index) => {
      const routeIndex = order.indexOf(index);
      const delay = routeIndex === 0 ? 90 : 520 + routeIndex * 125;
      sigil.style.setProperty('--resonance-delay', `${delay}ms`);
      ringTimers.push(setTimeout(() => {
        sigil.classList.add('is-awakened');
        setTimeout(() => sigil.classList.remove('is-awakened'), 760);
      }, delay + 110));
    });

    awakeTimer = setTimeout(() => {
      arsenal.classList.remove('is-awakening');
      arsenal.classList.add('is-awake');
    }, 1850);
  }

  function highlightRoute(index) {
    arsenal.classList.toggle('is-inspecting', index >= 0);
    sigils.forEach((sigil, sigilIndex) => sigil.classList.toggle('is-inspected', sigilIndex === index));
    field.querySelectorAll('.loadout-energy-pulse').forEach(path => {
      const from = Number(path.dataset.from);
      const to = Number(path.dataset.to);
      path.classList.toggle('is-linked', index >= 0 && (from === index || to === index));
    });
  }

  sigils.forEach((sigil, index) => {
    sigil.addEventListener('pointerenter', () => highlightRoute(index));
    sigil.addEventListener('pointerleave', () => highlightRoute(-1));
  });

  if (reduced.matches || !('IntersectionObserver' in window)) awaken();
  else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        arsenal.classList.toggle('is-visible', entry.isIntersecting);
        if (!entry.isIntersecting) return;
        awaken();
      });
    }, {threshold: .26, rootMargin: '0px 0px -8%'});
    observer.observe(arsenal);
  }

  addEventListener('resize', scheduleRouteDraw, {passive: true});
  if ('ResizeObserver' in window) new ResizeObserver(scheduleRouteDraw).observe(grid);

  reduced.addEventListener('change', event => {
    if (!event.matches) return;
    clearTimers();
    arsenal.classList.remove('is-awakening');
    arsenal.classList.add('is-awake');
    sigils.forEach(sigil => sigil.classList.remove('is-awakened'));
  });

  addEventListener('pagehide', clearTimers, {once: true});
})();
