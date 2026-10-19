(() => {
  'use strict';
  const portrait = document.querySelector('#portrait');
  const stage = portrait?.closest('.character-stage');
  const card = portrait?.closest('.portrait-card');
  const control = card?.querySelector('.portrait-playback');
  if (!portrait || !stage || !card || !control) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = window.CelestialUI?.motion || {reveal: 620};
  const portraits = {
    formal: {src: 'assets/samudra-formal-blue-studio-v2.webp', alt: 'Studio portrait of Yoga Samudra Heriyanto in a grey suit with blue edge lighting and a softly lit face'},
    urban: {src: 'assets/samudra-urban-cutout-v1.webp', alt: 'Urban casual portrait of Yoga Samudra Heriyanto in a black jacket and glasses holding a phone with cyan and gold rim lighting'},
    casual: {src: 'assets/samudra-casual-studio-v3.webp', alt: 'Seated portrait of Yoga Samudra Heriyanto wearing glasses and a brown shirt with warm and blue studio lighting on the shoulders'},
    sweater: {src: 'assets/samudra-sweater-studio-v2.webp', alt: 'Portrait of Yoga Samudra Heriyanto wearing round glasses and a camouflage-sleeve sweatshirt with arms crossed and blue-silver studio lighting on the clothing'}
  };
  const sequence = Object.keys(portraits);
  const decoded = new Map();
  let outfit = sequence.find(key => portrait.classList.contains(`${key}-cutout`)) || sequence[0];
  let timer = 0;
  let request = 0;
  let fade;
  let overlay;
  let manuallyPaused = false;
  let visible = !('IntersectionObserver' in window);

  function preload(key) {
    if (!decoded.has(key)) {
      const image = new Image();
      image.src = portraits[key].src;
      decoded.set(key, image.decode().then(() => true).catch(() => {
        decoded.delete(key);
        return false;
      }));
    }
    return decoded.get(key);
  }
  Object.keys(portraits).forEach(preload);

  function canPlay() {
    return visible && !document.hidden && !reduced.matches && !manuallyPaused
      && !document.querySelector('dialog[open]');
  }

  function clearFade() {
    fade?.cancel();
    fade = undefined;
    overlay?.remove();
    overlay = undefined;
  }

  async function changePortrait() {
    const token = ++request;
    const nextOutfit = sequence[(sequence.indexOf(outfit) + 1) % sequence.length];
    const ready = await preload(nextOutfit);
    if (token !== request || !canPlay()) return;
    if (!ready) { schedule(); return; } // Keep the last good portrait on errors.

    clearFade();
    const old = portrait.cloneNode(false);
    old.removeAttribute('id');
    old.alt = '';
    old.setAttribute('aria-hidden', 'true');
    old.classList.add('portrait-crossfade');
    const current = getComputedStyle(portrait);
    old.style.transform = current.transform;
    old.style.translate = current.translate;
    old.style.filter = current.filter;
    old.style.background = getComputedStyle(portrait.parentElement).background;
    portrait.parentElement.append(old);
    overlay = old;

    outfit = nextOutfit;
    portrait.src = portraits[outfit].src;
    portrait.alt = portraits[outfit].alt;
    portrait.classList.toggle('casual', outfit === 'casual');
    sequence.forEach(key => portrait.classList.toggle(`${key}-cutout`, outfit === key));
    stage.dataset.outfit = outfit;
    stage.dispatchEvent(new CustomEvent('portraitchange', {detail: {outfit, automatic: true}}));

    if (typeof old.animate === 'function') {
      const animation = old.animate([{opacity: 1}, {opacity: 0}], {duration: motion.reveal, easing: 'ease-in-out'});
      fade = animation;
      const cleanup = () => {
        old.remove();
        if (overlay === old) overlay = undefined;
        if (fade === animation) fade = undefined;
      };
      animation.finished.then(cleanup, cleanup);
    } else old.remove();
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    timer = 0;
    request += 1; // Invalidate any decode that finishes after a pause/navigation.
    if (canPlay()) timer = setTimeout(changePortrait, 5000);
  }

  function syncControl() {
    control.hidden = reduced.matches;
    control.dataset.paused = String(manuallyPaused);
    const label = manuallyPaused ? 'Resume automatic portrait changes' : 'Pause automatic portrait changes';
    control.setAttribute('aria-label', label);
    control.title = label;
  }
  control.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    syncControl();
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  document.querySelectorAll('dialog').forEach(dialog => {
    new MutationObserver(schedule).observe(dialog, {attributes: true, attributeFilter: ['open']});
  });
  reduced.addEventListener('change', () => {
    clearFade();
    syncControl();
    schedule();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const nextVisible = entries[0].isIntersecting;
      if (visible === nextVisible) return;
      visible = nextVisible;
      schedule();
    }, {threshold: 0}).observe(card);
  }
  stage.dataset.outfit = outfit;
  syncControl();
  schedule();
})();
