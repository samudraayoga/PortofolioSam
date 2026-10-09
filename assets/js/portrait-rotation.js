(() => {
  'use strict';
  const portrait = document.querySelector('#portrait');
  const stage = portrait?.closest('.character-stage');
  const card = portrait?.closest('.portrait-card');
  const control = card?.querySelector('.portrait-playback');
  if (!portrait || !stage || !card || !control) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const portraits = {
    formal: {src: 'assets/samudra-formal-cutout.webp', alt: 'Formal portrait of Yoga Samudra Heriyanto in a grey suit with subtle cyan rim lighting'},
    casual: {src: 'assets/samudra-casual-cutout.webp', alt: 'Casual seated portrait of Yoga Samudra Heriyanto in a brown shirt and glasses with warm lighting and a subtle cyan rim'},
    sweater: {src: 'assets/samudra-sweater-cutout-v1.webp', alt: 'Casual portrait of Yoga Samudra Heriyanto wearing round glasses and a light camouflage-sleeve sweatshirt with arms crossed'}
  };
  const sequence = Object.keys(portraits);
  const decoded = new Map();
  let outfit = sequence.find(key => portrait.classList.contains(`${key}-cutout`)) || sequence[0];
  let timer = 0;
  let request = 0;
  let fade;
  let overlay;
  let manuallyPaused = false;
  let hovered = false;
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
    return visible && !document.hidden && !reduced.matches && !manuallyPaused && !hovered
      && !stage.contains(document.activeElement) && !document.querySelector('dialog[open]');
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
      const animation = old.animate([{opacity: 1}, {opacity: 0}], {duration: 650, easing: 'ease-in-out'});
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
    if (canPlay()) timer = setTimeout(changePortrait, 6000);
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
  card.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch') return;
    hovered = true;
    schedule();
  });
  card.addEventListener('pointerleave', () => { hovered = false; schedule(); });
  stage.addEventListener('focusin', schedule);
  stage.addEventListener('focusout', event => {
    if (!stage.contains(event.relatedTarget)) {
      // Focus has not moved yet during focusout; schedule after the new target.
      queueMicrotask(schedule);
    }
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
