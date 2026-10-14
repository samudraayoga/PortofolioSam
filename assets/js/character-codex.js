(() => {
  'use strict';

  const codex = document.querySelector('.character-archive');
  const tabList = codex?.querySelector('.archive-tabs');
  const panelHost = codex?.querySelector('.archive-panels');
  const tabs = tabList ? [...tabList.querySelectorAll('[role="tab"]')] : [];
  const panels = panelHost ? [...panelHost.querySelectorAll('.archive-panel[role="tabpanel"]')] : [];
  if (!codex || !tabList || !panelHost || !tabs.length || !panels.length) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  const motion = window.CelestialUI?.motion || {sequence: 760, transition: 900};
  const entries = [
    {number: '01', label: 'Character Overview', accent: '#f1d38e'},
    {number: '02', label: 'Origin Record', accent: '#89d9eb'},
    {number: '03', label: 'Quest History', accent: '#a8dfc7'},
    {number: '04', label: 'Auxiliary Notes', accent: '#d6b9ef'}
  ];
  let current = Math.max(0, tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true'));
  let settleTimer = 0;
  let revealTimer = 0;
  let pointerFrame = 0;

  codex.classList.add('character-codex-ready');
  tabs.forEach((tab, index) => {
    tab.style.setProperty('--codex-tab-index', String(index));
    if (tab.querySelector('.codex-tab-sigil')) return;
    const sigil = document.createElement('span');
    sigil.className = 'codex-tab-sigil';
    sigil.setAttribute('aria-hidden', 'true');
    tab.append(sigil);
  });

  const stage = document.createElement('div');
  stage.className = 'codex-stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = '<span class="codex-orbit"></span><span class="codex-star"></span><span class="codex-scan"></span>';

  const meta = document.createElement('div');
  meta.className = 'codex-entry-meta';
  meta.setAttribute('aria-hidden', 'true');
  meta.innerHTML = '<small>Character Codex</small><strong></strong>';
  codex.append(stage);
  panelHost.append(meta);
  const metaEntry = meta.querySelector('strong');

  function activePanel(index = current) {
    const id = tabs[index]?.getAttribute('aria-controls');
    return id ? document.getElementById(id) : panels[index];
  }

  function updateEntry(index, animate = true) {
    if (index < 0 || index >= tabs.length) return;
    current = index;
    const entry = entries[index] || entries[0];
    const panel = activePanel(index);
    codex.style.setProperty('--codex-accent', entry.accent);
    metaEntry.textContent = `${entry.number} / ${entry.label}`;

    clearTimeout(settleTimer);
    clearTimeout(revealTimer);
    panels.forEach(item => item.classList.remove('codex-entry-revealing'));
    codex.classList.remove('codex-opening', 'codex-resting');

    if (!animate || reduced.matches) {
      codex.classList.add('codex-resting');
      return;
    }

    void codex.offsetWidth;
    codex.classList.add('codex-opening');
    if (panel && !panel.hidden) {
      panel.classList.add('codex-entry-revealing');
    } else {
      requestAnimationFrame(() => activePanel(index)?.classList.add('codex-entry-revealing'));
    }

    revealTimer = setTimeout(() => panel?.classList.remove('codex-entry-revealing'), motion.transition);
    settleTimer = setTimeout(() => {
      codex.classList.remove('codex-opening');
      codex.classList.add('codex-resting');
    }, motion.sequence);
  }

  const selectionObserver = new MutationObserver(records => {
    records.forEach(record => {
      const tab = record.target;
      if (tab.getAttribute('aria-selected') !== 'true') return;
      const index = tabs.indexOf(tab);
      if (index !== current) updateEntry(index);
    });
  });
  tabs.forEach(tab => selectionObserver.observe(tab, {attributes: true, attributeFilter: ['aria-selected']}));

  codex.addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const rect = codex.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
      codex.style.setProperty('--codex-depth-x', `${((x - .5) * 7).toFixed(2)}%`);
      codex.style.setProperty('--codex-depth-y', `${((y - .5) * 5).toFixed(2)}%`);
      pointerFrame = 0;
    });
  }, {passive: true});

  codex.addEventListener('pointerleave', () => {
    codex.style.setProperty('--codex-depth-x', '0%');
    codex.style.setProperty('--codex-depth-y', '0%');
  });

  updateEntry(current, false);

  addEventListener('pagehide', () => {
    clearTimeout(settleTimer);
    clearTimeout(revealTimer);
    cancelAnimationFrame(pointerFrame);
    selectionObserver.disconnect();
  }, {once: true});
})();
