(() => {
  'use strict';
  const hero = document.querySelector('.portfolio-page .hero');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  if (hero && !hero.querySelector('.celestial-sky')) {
    const sky = document.createElement('div');
    sky.className = 'celestial-sky';
    sky.setAttribute('aria-hidden', 'true');
    sky.innerHTML = '<div class="celestial-stars"></div><i class="celestial-orb celestial-sun"></i><i class="celestial-orb celestial-moon"></i><i class="celestial-horizon"></i><i class="celestial-shooting-star"></i>';
    hero.append(sky);
  }

  function transition(night, apply) {
    clearTimeout(timer);
    document.querySelector('.celestial-transition-wave')?.remove();
    if (reduced.matches) { apply(); return; }
    const button = document.querySelector('.theme-toggle');
    const rect = button?.getBoundingClientRect();
    apply();
    document.body.classList.add('theme-transforming');
    document.documentElement.dataset.themeDirection = night ? 'night' : 'day';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = night ? '#0b1c35' : '#16384a';
    if (rect) {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const wave = document.createElement('span');
      wave.className = 'celestial-transition-wave';
      wave.setAttribute('aria-hidden', 'true');
      wave.style.cssText = `left:${x - radius}px;top:${y - radius}px;width:${radius * 2}px;height:${radius * 2}px;background:${night ? '#18335c' : '#ffe1a1'}`;
      document.body.append(wave);
      const effect = wave.animate([
        {opacity: 0, transform: 'scale(.01)'},
        {opacity: .24, transform: 'scale(1)', offset: .58},
        {opacity: 0, transform: 'scale(1.08)'}
      ], {duration: 1050, easing: 'cubic-bezier(.2,.74,.2,1)'});
      effect.finished.finally(() => wave.remove());
    }
    timer = setTimeout(() => {
      document.body.classList.remove('theme-transforming');
      delete document.documentElement.dataset.themeDirection;
    }, 1450);
  }
  window.SamudraCelestialTheme = {transition};
})();
