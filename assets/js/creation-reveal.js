(() => {
  'use strict';
  const chapters = [...document.querySelectorAll('#karya .work-card')];
  if (!chapters.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width:800px)');
  const running = new Map();
  let observer;

  function stop(chapter) {
    running.get(chapter)?.forEach(effect => effect.cancel());
    running.delete(chapter);
    chapter.classList.remove('quest-drawing');
  }
  function show(chapter, immediate = false) {
    const seen = chapter.classList.contains('quest-revealed');
    if (immediate) {
      stop(chapter);
      chapter.classList.add('quest-revealed');
      observer?.unobserve(chapter);
      return;
    }
    if (seen) return;
    chapter.classList.add('quest-revealed');
    observer?.unobserve(chapter);
    if (reduced.matches || !chapter.animate) return;
    const effects = new Set();
    running.set(chapter, effects);
    function play(element, frames, options) {
      if (!element) return;
      const effect = element.animate(frames, {easing: 'cubic-bezier(.2,.7,.25,1)', fill: 'backwards', ...options});
      effects.add(effect);
      effect.finished.then(() => {
        effects.delete(effect);
        effect.cancel();
        if (!effects.size) { running.delete(chapter); chapter.classList.remove('quest-drawing'); }
      }).catch(() => {});
    }
    const art = chapter.querySelector('.work-art');
    const copy = [...chapter.querySelector('.work-body').children];
    if (mobile.matches) {
      play(art, [{opacity: 0}, {opacity: 1}], {duration: 280});
      copy.forEach(element => play(element, [{opacity: 0}, {opacity: 1}], {duration: 260, delay: 100}));
    } else {
      chapter.classList.add('quest-drawing');
      play(art, [{opacity: 0, clipPath: 'inset(0 100% 0 0)'}, {opacity: 1, clipPath: 'inset(0 0 0 0)'}], {duration: 600, delay: 160});
      const sweep = art.querySelector('.quest-light-sweep');
      play(sweep, [{opacity: 0, left: '-20%'}, {opacity: .6, left: '35%', offset: .5}, {opacity: 0, left: '100%'}], {duration: 600, delay: 160});
      copy.forEach((element, index) => play(element, [{opacity: 0, transform: 'translateY(10px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 350, delay: 330 + index * 55}));
    }
  }

  const directProject = /^#project-(erp|chat|mlbb|ai)$/.test(location.hash);
  if ('IntersectionObserver' in window && !reduced.matches && !directProject) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) show(entry.target); });
    }, {threshold: .12, rootMargin: '0px 0px -6%'});
  }
  chapters.forEach(chapter => {
    const sweep = document.createElement('span');
    sweep.className = 'quest-light-sweep';
    sweep.setAttribute('aria-hidden', 'true');
    chapter.querySelector('.work-art').append(sweep);
    if (observer) { chapter.classList.add('quest-ready'); observer.observe(chapter); }
    else show(chapter, true);
    // Keyboard users never have to wait for the reveal to read/follow a link.
    chapter.addEventListener('focusin', () => show(chapter, true));
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) { observer?.disconnect(); chapters.forEach(chapter => show(chapter, true)); }
  });
  mobile.addEventListener('change', () => {
    chapters.filter(chapter => running.has(chapter)).forEach(chapter => show(chapter, true));
  });
  addEventListener('hashchange', () => {
    const chapter = chapters.find(item => '#' + item.id === location.hash);
    if (chapter) show(chapter, true);
  });
})();
