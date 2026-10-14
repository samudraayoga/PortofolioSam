(() => {
  'use strict';

  const archive = document.querySelector('.project-archive');
  const nav = archive?.querySelector('.project-archive-nav');
  const stage = archive?.querySelector('.project-archive-stage');
  const buttons = nav ? [...nav.querySelectorAll('[data-archive-project]')] : [];
  const panels = archive ? [...archive.querySelectorAll('.work-card[role="tabpanel"]')] : [];
  if (!archive || !nav || !stage || !buttons.length || !panels.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  const motion = window.CelestialUI?.motion || {focus: 220, transition: 900, feedback: 320, staggerTight: 45};
  const accents = ['#9ed7c1', '#a9bdf3', '#a8d8b4', '#dab5ef'];
  let currentIndex = Math.max(0, buttons.findIndex(button => button.getAttribute('aria-selected') === 'true'));
  let switchTimer = 0;
  let resizeFrame = 0;
  let pointerFrame = 0;

  archive.classList.add('domain-memory-ready');

  const conduit = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  conduit.classList.add('domain-memory-conduit');
  conduit.setAttribute('aria-hidden', 'true');
  conduit.setAttribute('preserveAspectRatio', 'none');
  conduit.innerHTML = `
    <path class="domain-memory-route"/>
    <path class="domain-memory-current"/>
    <circle class="domain-memory-origin" r="2.4"/>
    <circle class="domain-memory-destination" r="2.4"/>`;
  archive.append(conduit);

  const projection = document.createElement('div');
  projection.className = 'domain-memory-projection';
  projection.setAttribute('aria-hidden', 'true');
  projection.innerHTML = `
    <span class="domain-memory-veil"></span>
    <span class="domain-memory-seal"><i></i><i></i><b>✦</b></span>
    <span class="domain-memory-label"><small>Domain memory</small><strong>Archive 01 · synchronizing</strong></span>
    <span class="domain-memory-fragments"></span>`;
  stage.append(projection);

  const fragmentHost = projection.querySelector('.domain-memory-fragments');
  for (let index = 0; index < 7; index += 1) {
    const fragment = document.createElement('i');
    fragment.style.cssText = `--fragment-x:${12 + (index * 31) % 78}%;--fragment-y:${15 + (index * 23) % 66}%;--fragment-size:${index % 3 === 0 ? 6 : 4}px;--fragment-delay:${index * motion.staggerTight}ms;--fragment-drift:${index % 2 ? 13 : -13}px`;
    fragmentHost.append(fragment);
  }

  const route = conduit.querySelector('.domain-memory-route');
  const current = conduit.querySelector('.domain-memory-current');
  const origin = conduit.querySelector('.domain-memory-origin');
  const destination = conduit.querySelector('.domain-memory-destination');
  const label = projection.querySelector('.domain-memory-label strong');

  function selectedButton() {
    return buttons.find(button => button.getAttribute('aria-selected') === 'true') || buttons[currentIndex];
  }

  function drawConduit(button = selectedButton()) {
    resizeFrame = 0;
    if (!button) return;
    const archiveRect = archive.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const width = archive.clientWidth;
    const height = archive.clientHeight;
    if (!width || !height) return;

    const start = {
      x: buttonRect.right - archiveRect.left - 1,
      y: buttonRect.top - archiveRect.top + buttonRect.height / 2
    };
    const end = {
      x: stageRect.left - archiveRect.left + 34,
      y: stageRect.top - archiveRect.top + 74
    };
    const bendX = start.x + Math.max(34, (end.x - start.x) * .58);
    const d = `M ${start.x} ${start.y} C ${bendX} ${start.y}, ${bendX} ${end.y}, ${end.x} ${end.y}`;

    conduit.setAttribute('viewBox', `0 0 ${width} ${height}`);
    route.setAttribute('d', d);
    current.setAttribute('d', d);
    origin.setAttribute('cx', String(start.x));
    origin.setAttribute('cy', String(start.y));
    destination.setAttribute('cx', String(end.x));
    destination.setAttribute('cy', String(end.y));
  }

  function scheduleConduit() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => drawConduit());
  }

  function playMemoryProjection(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    const button = buttons[index];
    const accent = accents[index] || accents[0];
    archive.style.setProperty('--memory-accent', accent);
    label.textContent = `Archive ${String(index + 1).padStart(2, '0')} · synchronizing`;
    buttons.forEach(item => item.classList.toggle('memory-sending', item === button));
    drawConduit(button);

    if (reduced.matches) return;
    clearTimeout(switchTimer);
    archive.classList.remove('memory-switching');
    void archive.offsetWidth;
    archive.classList.add('memory-switching');
    switchTimer = setTimeout(() => {
      archive.classList.remove('memory-switching');
      buttons.forEach(item => item.classList.remove('memory-sending'));
    }, motion.transition + motion.focus);
  }

  const selectionObserver = new MutationObserver(records => {
    records.forEach(record => {
      const button = record.target;
      if (button.getAttribute('aria-selected') !== 'true') return;
      playMemoryProjection(buttons.indexOf(button));
    });
  });
  buttons.forEach(button => selectionObserver.observe(button, {attributes: true, attributeFilter: ['aria-selected']}));

  archive.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches || pointerFrame || archive.classList.contains('memory-switching')) return;
    pointerFrame = requestAnimationFrame(() => {
      const art = archive.querySelector('.work-card.is-active .work-art');
      if (!art) {
        pointerFrame = 0;
        return;
      }
      const rect = art.getBoundingClientRect();
      const localX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const localY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      archive.style.setProperty('--memory-tilt-x', `${((localX - .5) * 1.5).toFixed(2)}deg`);
      archive.style.setProperty('--memory-tilt-y', `${((.5 - localY) * 1.1).toFixed(2)}deg`);
      pointerFrame = 0;
    });
  }, {passive: true});

  archive.addEventListener('pointerleave', () => {
    archive.style.setProperty('--memory-tilt-x', '0deg');
    archive.style.setProperty('--memory-tilt-y', '0deg');
  });

  addEventListener('resize', scheduleConduit, {passive: true});
  if ('ResizeObserver' in window) new ResizeObserver(scheduleConduit).observe(archive);
  requestAnimationFrame(() => {
    archive.style.setProperty('--memory-accent', accents[currentIndex]);
    drawConduit();
  });

  addEventListener('pagehide', () => {
    clearTimeout(switchTimer);
    selectionObserver.disconnect();
  }, {once: true});
})();
