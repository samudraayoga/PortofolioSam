(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  const animate = (element, frames, options = {}) => {
    if (!element || reduced.matches) return;
    return element.animate(frames, {duration: 300, easing: 'cubic-bezier(.2,.7,.25,1)', ...options});
  };
  // Elements remain visible without JavaScript; reveal only once on arrival.
  const reveal = element => animate(element, [
    {opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'translateY(0)'}
  ], {duration: 550});
  if (!reduced.matches && scrollY < 80) {
    document.querySelectorAll('.hero-copy > *').forEach((element, index) => {
      animate(element, [{opacity: 0, transform: 'translateY(12px)'}, {opacity: 1, transform: 'translateY(0)'}],
        {duration: 500, delay: Math.min(index * 65, 325), fill: 'backwards'});
    });
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      entry.target.classList.add('motion-seen');
      observer.unobserve(entry.target);
    }), {threshold: 0.08});
    document.querySelectorAll('.about, .section-heading, .talent-grid, .work-card, .journey-item, .education-ribbon, .contact > h2').forEach(el => observer.observe(el));
  }
  const hero = document.querySelector('.hero');
  const landscape = document.querySelector('.landscape');
  let frame = 0, x = 0, y = 0;
  function resetParallax() {
    cancelAnimationFrame(frame); frame = 0;
    if (landscape) landscape.style.transform = '';
  }
  hero?.addEventListener('pointermove', event => {
    if (reduced.matches || !finePointer.matches || !landscape) return;
    const bounds = hero.getBoundingClientRect();
    x = (event.clientX - bounds.left) / bounds.width * 16 - 8;
    y = (event.clientY - bounds.top) / bounds.height * 16 - 8;
    if (!frame) frame = requestAnimationFrame(() => {
      landscape.style.transform = `translate(${x}px, ${y}px) scale(1.025)`;
      frame = 0;
    });
  });
  hero?.addEventListener('pointerleave', resetParallax);
  finePointer.addEventListener('change', resetParallax);
  reduced.addEventListener('change', () => {
    resetParallax();
    if (reduced.matches) document.getAnimations().forEach(animation => animation.finish());
  });
  // Keep the previous image visible until the new image has loaded.
  const portrait = document.querySelector('#portrait');
  let portraitOverlay;
  document.querySelectorAll('[data-portrait]').forEach(button => {
    button.addEventListener('click', () => {
      if (reduced.matches || button.getAttribute('aria-pressed') === 'true') return;
      portraitOverlay?.remove();
      const old = portrait.cloneNode(false);
      old.removeAttribute('id'); old.alt = ''; old.setAttribute('aria-hidden', 'true');
      old.classList.add('portrait-crossfade');
      portrait.parentElement.append(old); portraitOverlay = old;
      const fade = () => {
        if (portraitOverlay !== old) return;
        const effect = animate(old, [{opacity: 1}, {opacity: 0}], {duration: 250});
        if (effect) effect.finished.then(() => old.remove()).catch(() => old.remove());
        else old.remove();
      };
      portrait.addEventListener('load', fade, {once: true});
      portrait.addEventListener('error', () => old.remove(), {once: true});
      setTimeout(() => { if (portrait.complete) fade(); }, 0);
    }, {capture: true});
  });
  // Existing tab handlers update the content first, then animate the new panel.
  const panel = document.querySelector('#skill-items');
  if (panel) new MutationObserver(() => {
    panel.getAnimations().forEach(a => a.cancel());
    animate(panel, [{opacity: 0, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], {duration: 220});
  }).observe(panel, {childList: true});
  document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
    animate(button.querySelector('svg'), [{transform: 'rotate(-35deg)'}, {transform: 'rotate(0)'}], {duration: 350});
  }));
})();
