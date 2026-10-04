(() => {
  'use strict';

  const hero = document.querySelector('.portfolio-page .hero');
  if (!hero || hero.querySelector('.living-landscape')) return;

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const scenery = document.createElement('div');
  scenery.className = 'living-landscape';
  scenery.setAttribute('aria-hidden', 'true');
  scenery.innerHTML = [
    '<div class="living-sunrays"></div>',
    '<div class="living-cloud living-cloud-far"></div>',
    '<div class="living-cloud"></div>',
    '<div class="living-mist"></div>',
    '<div class="living-mist living-mist-near"></div>',
    '<i class="living-leaf"></i>',
    '<i class="living-leaf"></i>',
    '<i class="living-leaf"></i>'
  ].join('');
  hero.append(scenery);

  const connection = navigator.connection;
  const dialogs = [...document.querySelectorAll('dialog')];
  let heroVisible = hero.getBoundingClientRect().bottom > 0;
  let pageActive = true;

  // No animation frame loop: the browser composites transforms only while useful.
  const syncPlayback = () => {
    const calm = reducedMotion.matches || Boolean(connection?.saveData);
    const active = pageActive && heroVisible && !document.hidden && !calm &&
      !document.body.classList.contains('codex-intro-running') &&
      !dialogs.some(dialog => dialog.open);
    scenery.dataset.calm = String(calm);
    scenery.dataset.active = String(active);
  };

  if ('IntersectionObserver' in window) {
    const visibilityObserver = new IntersectionObserver(entries => {
      heroVisible = entries[0].isIntersecting;
      syncPlayback();
    }, { threshold: 0 });
    visibilityObserver.observe(hero);
  }

  const stateObserver = new MutationObserver(syncPlayback);
  stateObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  dialogs.forEach(dialog => stateObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] }));
  document.addEventListener('visibilitychange', syncPlayback);
  reducedMotion.addEventListener('change', syncPlayback);
  connection?.addEventListener?.('change', syncPlayback);
  window.addEventListener('pagehide', () => { pageActive = false; syncPlayback(); });
  window.addEventListener('pageshow', () => { pageActive = true; syncPlayback(); });
  syncPlayback();
})();
