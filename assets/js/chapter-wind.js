(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const chapters = ['profil', 'keahlian', 'karya', 'perjalanan', 'kontak']
    .map(id => document.getElementById(id))
    .filter(Boolean);
  if (!chapters.length) return;

  const queue = [];
  let active = null;
  let arrivalTimer = 0;
  let cleanupTimer = 0;

  chapters.forEach(chapter => {
    const anchor = chapter.querySelector('.section-kicker,.section-heading .eyebrow,:scope > .eyebrow');
    if (!anchor || anchor.querySelector('.chapter-arrival-mark')) return;
    const mark = document.createElement('span');
    mark.className = 'chapter-arrival-mark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = '✦';
    anchor.append(mark);
  });

  function arrive(chapter) {
    chapter.classList.remove('wind-arrived');
    void chapter.offsetWidth;
    chapter.classList.add('wind-arrived');
  }
  function clean() {
    clearTimeout(arrivalTimer);
    clearTimeout(cleanupTimer);
    active?.remove();
    active = null;
  }
  function next() {
    if (active || document.hidden || reduced.matches) return;
    const chapter = queue.shift();
    if (!chapter) return;
    const rect = chapter.querySelector('.section-heading,.about > div:first-child,:scope > .eyebrow')?.getBoundingClientRect() || chapter.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) {
      arrive(chapter);
      next();
      return;
    }
    const pass = document.createElement('div');
    pass.className = 'chapter-wind-pass';
    pass.dataset.chapter = chapter.id;
    pass.setAttribute('aria-hidden', 'true');
    pass.style.setProperty('--wind-top', `${Math.max(28, Math.min(innerHeight - 110, rect.top + Math.min(rect.height * .52, 68)))}px`);
    pass.innerHTML = '<svg viewBox="0 0 900 96" preserveAspectRatio="none"><defs><linearGradient id="chapter-wind-light" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#9ed7c100"/><stop offset=".24" stop-color="#bde5d7"/><stop offset=".68" stop-color="#f3dda1"/><stop offset="1" stop-color="#fff0b700"/></linearGradient></defs><path d="M0 59 C180 7 345 84 900 30"/><path d="M18 70 C230 34 410 94 870 48"/><path d="M80 36 C260 12 530 68 890 19"/></svg><i style="--mote-x:24%;--mote-y:34%;--mote-size:6px;--mote-delay:70ms"></i><i style="--mote-x:42%;--mote-y:61%;--mote-size:5px;--mote-delay:190ms;--mote-rotate:75deg"></i><i style="--mote-x:59%;--mote-y:24%;--mote-size:7px;--mote-delay:280ms;--mote-rotate:-20deg"></i><i style="--mote-x:72%;--mote-y:57%;--mote-size:4px;--mote-delay:350ms"></i><i style="--mote-x:84%;--mote-y:31%;--mote-size:5px;--mote-delay:430ms;--mote-rotate:110deg"></i>';
    document.body.append(pass);
    active = pass;
    arrivalTimer = setTimeout(() => arrive(chapter), 690);
    cleanupTimer = setTimeout(() => {
      clean();
      next();
    }, 1320);
  }
  function awaken(chapter) {
    if (chapter.dataset.windSeen === 'true') return;
    chapter.dataset.windSeen = 'true';
    if (reduced.matches) { arrive(chapter); return; }
    queue.push(chapter);
    next();
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        awaken(entry.target);
        observer.unobserve(entry.target);
      });
    }, {threshold: 0, rootMargin: '-40% 0px -40%'});
    chapters.forEach(chapter => observer.observe(chapter));
  } else chapters.forEach(awaken);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clean();
    else next();
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    clean();
    queue.splice(0).forEach(arrive);
  });
  addEventListener('pagehide', clean);
})();
