(() => {
  'use strict';

  const arsenal = document.querySelector('.tech-arsenal');
  const grid = arsenal?.querySelector('.tech-sigil-grid');
  const sigils = grid ? [...grid.querySelectorAll('.tech-sigil')] : [];
  const controls = sigils.map(sigil => sigil.querySelector('.tech-sigil-control'));
  if (!arsenal || !grid || sigils.length < 2 || controls.some(control => !control)) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const celestial = window.CelestialUI;
  const motion = celestial?.motion || {feedback: 320, reveal: 620, sequence: 760, transition: 900, cinematic: 1400, panel: 430, stagger: 70, staggerWide: 120};
  let awakeTimer = 0;
  let activationTimer = 0;
  let ringTimers = [];
  let resizeFrame = 0;
  let activeIndex = -1;

  arsenal.classList.add('loadout-resonance');
  arsenal.dataset.celestialComponent = 'loadout-resonance';
  arsenal.dataset.celestialPhase = 'dormant';
  document.documentElement.classList.add('loadout-resonance-ready');

  sigils.forEach((sigil, index) => {
    sigil.dataset.celestialComponent = 'loadout-node';
    sigil.dataset.celestialInteractive = 'true';
    celestial?.setInteractive(sigil, 'loadout-node');
    controls[index].dataset.celestialInteractive = 'true';
    controls[index].setAttribute('aria-pressed', 'false');
  });

  const announcer = document.createElement('span');
  announcer.className = 'sr-only';
  announcer.setAttribute('aria-live', 'polite');
  arsenal.append(announcer);

  function setSigilState(sigil, state, detail = {}) {
    if (celestial?.setState) celestial.setState(sigil, state, detail);
    else sigil.dataset.celestialState = state;
  }

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
          path.style.setProperty('--path-delay', `${motion.feedback + motion.stagger + routeIndex * motion.staggerWide}ms`);
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
    clearTimeout(activationTimer);
    ringTimers.forEach(clearTimeout);
    ringTimers = [];
  }

  function awaken() {
    if (arsenal.classList.contains('is-awake') || arsenal.classList.contains('is-awakening')) return;
    drawEnergyRoute();
    if (reduced.matches) {
      arsenal.classList.add('is-awake', 'is-visible');
      arsenal.dataset.celestialPhase = 'idle';
      sigils.forEach(sigil => sigil.classList.add('is-awakened'));
      return;
    }

    arsenal.classList.add('is-awakening', 'is-visible');
    arsenal.dataset.celestialPhase = 'revealing';
    const order = routeOrder();
    sigils.forEach((sigil, index) => {
      setSigilState(sigil, 'transitioning', {source: 'loadout-awakening'});
      const routeIndex = order.indexOf(index);
      const delay = routeIndex === 0 ? 90 : motion.reveal - 100 + routeIndex * motion.staggerWide;
      sigil.style.setProperty('--resonance-delay', `${delay}ms`);
      ringTimers.push(setTimeout(() => {
        sigil.classList.add('is-awakened');
        setTimeout(() => sigil.classList.remove('is-awakened'), motion.sequence);
      }, delay + 110));
    });

    awakeTimer = setTimeout(() => {
      arsenal.classList.remove('is-awakening');
      arsenal.classList.add('is-awake');
      arsenal.dataset.celestialPhase = 'idle';
      sigils.forEach(sigil => setSigilState(sigil, 'dormant', {source: 'loadout-awakened'}));
    }, motion.cinematic + motion.panel);
  }

  function highlightRoute(index, focused = false) {
    arsenal.classList.toggle('is-inspecting', index >= 0);
    arsenal.classList.toggle('has-activation', activeIndex >= 0);
    sigils.forEach((sigil, sigilIndex) => {
      sigil.classList.toggle('is-inspected', sigilIndex === index);
      if (focused && sigilIndex === index) setSigilState(sigil, 'focused', {source: 'loadout-focus'});
      else if (sigilIndex === activeIndex) setSigilState(sigil, 'activated', {source: 'loadout-activation'});
      else setSigilState(sigil, 'dormant', {source: 'loadout-idle'});
    });
    field.querySelectorAll('.loadout-energy-pulse').forEach(path => {
      const from = Number(path.dataset.from);
      const to = Number(path.dataset.to);
      path.classList.toggle('is-linked', index >= 0 && (from === index || to === index));
    });
  }

  function activate(index) {
    clearTimeout(activationTimer);
    activeIndex = activeIndex === index ? -1 : index;

    sigils.forEach((sigil, sigilIndex) => {
      const active = sigilIndex === activeIndex;
      sigil.classList.toggle('is-activated', active);
      sigil.classList.remove('is-activating');
      controls[sigilIndex].setAttribute('aria-pressed', String(active));
    });

    if (activeIndex < 0) {
      highlightRoute(-1);
      announcer.textContent = document.documentElement.lang === 'id'
        ? 'Pilihan loadout dilepas.'
        : 'Loadout selection cleared.';
      return;
    }

    const activeSigil = sigils[activeIndex];
    const label = activeSigil.querySelector('.tech-sigil-copy strong')?.textContent.trim() || 'Technology';
    activeSigil.classList.add('is-activating');
    highlightRoute(activeIndex);
    setSigilState(activeSigil, 'transitioning', {source: 'loadout-activation'});
    announcer.textContent = document.documentElement.lang === 'id'
      ? `${label} diaktifkan pada loadout.`
      : `${label} activated in the loadout.`;

    activationTimer = setTimeout(() => {
      activeSigil.classList.remove('is-activating');
      setSigilState(activeSigil, 'activated', {source: 'loadout-activation-complete'});
    }, reduced.matches ? 0 : motion.transition);
  }

  sigils.forEach((sigil, index) => {
    const control = controls[index];
    sigil.addEventListener('pointerenter', () => highlightRoute(index, true));
    sigil.addEventListener('pointerleave', () => highlightRoute(activeIndex));
    control.addEventListener('focus', () => highlightRoute(index, true));
    control.addEventListener('blur', () => highlightRoute(activeIndex));
    control.addEventListener('click', () => activate(index));
    control.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      clearTimeout(activationTimer);
      activeIndex = -1;
      sigils.forEach((item, itemIndex) => {
        item.classList.remove('is-activated', 'is-activating');
        controls[itemIndex].setAttribute('aria-pressed', 'false');
      });
      highlightRoute(-1);
    });
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
    arsenal.dataset.celestialPhase = 'idle';
    sigils.forEach(sigil => sigil.classList.remove('is-awakened'));
    highlightRoute(activeIndex);
  });

  addEventListener('pagehide', clearTimers, {once: true});
})();
