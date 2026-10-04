(() => {
  'use strict';

  const dialog = document.querySelector('#profile-dialog');
  if (!dialog) return;
  const inner = dialog.querySelector('.dialog-inner');
  const profile = dialog.querySelector('.dialog-profile');
  const portrait = profile?.querySelector('img');
  const heading = profile?.querySelector('div');
  if (!inner || !portrait || !heading) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.2,.78,.2,1)';
  const closeButton = dialog.querySelector('.dialog-close');
  const visual = document.createElement('div');
  visual.className = 'character-visual';
  const frame = document.createElement('span');
  frame.className = 'character-portrait-frame';
  frame.setAttribute('aria-hidden', 'true');
  const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  star.classList.add('character-star');
  star.setAttribute('aria-hidden', 'true');
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', '#i-star');
  star.append(use);

  // Reuse the actual profile and hero copy; the reveal adds no biographical claims.
  const visualLabel = document.createElement('div');
  visualLabel.className = 'character-visual-label';
  visualLabel.setAttribute('aria-hidden', 'true');
  const heroCaption = document.querySelector('.portrait-caption');
  const caption = document.createElement('span');
  caption.textContent = heroCaption?.querySelector('span')?.textContent || 'Character profile';
  const name = document.createElement('strong');
  name.textContent = heroCaption?.querySelector('h2')?.textContent || 'Samudra';
  const motto = document.createElement('p');
  motto.textContent = heroCaption?.querySelector('p')?.textContent || '';
  visualLabel.append(caption, name, motto);
  portrait.loading = 'eager';
  visual.append(portrait, frame, star, visualLabel);

  const copy = document.createElement('div');
  copy.className = 'character-copy';
  heading.querySelector('p')?.classList.add('character-role');
  copy.append(...heading.children);
  const rule = document.createElement('div');
  rule.className = 'character-rule';
  rule.setAttribute('aria-hidden', 'true');
  copy.append(rule);
  [...inner.children].filter(element => element !== closeButton && element !== profile).forEach(element => copy.append(element));
  profile.remove();
  const layout = document.createElement('div');
  layout.className = 'character-layout';
  layout.append(visual, copy);
  inner.append(layout);
  dialog.classList.add('character-reveal');
  closeButton?.setAttribute('autofocus', '');

  const running = new Set();
  let generation = 0;
  let returnFocus = null;
  let overflowBefore = '';
  let flight = null;
  let restoreFlight = null;
  let finishClosing = null;

  function animate(element, frames, options) {
    if (!element || reduced.matches || !element.animate) return null;
    const effect = element.animate(frames, {duration: 600, easing: ease, fill: 'both', ...options});
    running.add(effect);
    // Release the fill after finishing so layout changes never leave stale transforms.
    effect.finished.then(() => { running.delete(effect); effect.cancel(); }).catch(() => { running.delete(effect); });
    return effect;
  }

  function clearFlight() {
    flight?.remove();
    flight = null;
    restoreFlight?.();
    restoreFlight = null;
  }

  function stopMotion() {
    generation += 1;
    running.forEach(effect => effect.cancel());
    running.clear();
    clearFlight();
  }

  function isVisible(rect) {
    return rect.width > 0 && rect.height > 0 && rect.bottom > 40 && rect.top < innerHeight - 40 && rect.right > 0 && rect.left < innerWidth;
  }

  function portraitFlight(source, reverse = false) {
    if (!source || reduced.matches || !source.complete) return null;
    const sourceRect = source.getBoundingClientRect();
    const targetRect = portrait.getBoundingClientRect();
    if (!isVisible(sourceRect) || !isVisible(targetRect)) return null;
    const sourceStyle = getComputedStyle(source);
    const sourceRadius = getComputedStyle(source.parentElement).borderRadius;
    const destinationStyle = getComputedStyle(portrait);
    const shell = document.createElement('div');
    shell.className = 'character-flight';
    shell.setAttribute('aria-hidden', 'true');
    const image = source.cloneNode(false);
    image.removeAttribute('id');
    image.removeAttribute('class');
    image.alt = '';
    image.style.objectPosition = reverse ? destinationStyle.objectPosition : sourceStyle.objectPosition;
    shell.append(image);
    dialog.append(shell);
    flight = shell;
    const sourceVisibility = source.style.visibility;
    const portraitVisibility = portrait.style.visibility;
    source.style.visibility = 'hidden';
    portrait.style.visibility = 'hidden';
    restoreFlight = () => { source.style.visibility = sourceVisibility; portrait.style.visibility = portraitVisibility; };
    const from = {left: `${sourceRect.left}px`, top: `${sourceRect.top}px`, width: `${sourceRect.width}px`, height: `${sourceRect.height}px`, borderRadius: sourceRadius, opacity: 1};
    const to = {left: `${targetRect.left}px`, top: `${targetRect.top}px`, width: `${targetRect.width}px`, height: `${targetRect.height}px`, borderRadius: '0px', opacity: 1};
    const effect = animate(shell, reverse ? [to, from] : [from, to], {duration: reverse ? 380 : 760});
    animate(image, [{objectPosition: reverse ? destinationStyle.objectPosition : sourceStyle.objectPosition}, {objectPosition: reverse ? sourceStyle.objectPosition : destinationStyle.objectPosition}], {duration: reverse ? 380 : 760});
    const token = generation;
    effect?.finished.then(() => { if (token === generation) clearFlight(); }).catch(() => {});
    return effect;
  }

  function finishClose() {
    finishClosing = null;
    const target = returnFocus;
    stopMotion();
    dialog.classList.remove('character-closing');
    delete dialog.dataset.closing;
    if (dialog.open) dialog.close();
    document.body.style.overflow = overflowBefore;
    if (target?.isConnected) target.focus({preventScroll: true});
  }

  function open(target, trigger) {
    if (target !== dialog) return false;
    if (dialog.open && !finishClosing) return true;
    finishClosing = null;
    stopMotion();
    dialog.classList.remove('character-closing');
    delete dialog.dataset.closing;
    returnFocus = trigger || document.activeElement;
    const source = document.querySelector('#portrait');
    if (source) {
      portrait.src = source.currentSrc || source.src;
      portrait.alt = source.alt;
      portrait.style.objectPosition = getComputedStyle(source).objectPosition;
    }
    if (!dialog.open) {
      overflowBefore = document.body.style.overflow;
      dialog.showModal();
    }
    document.body.style.overflow = 'hidden';
    copy.scrollTop = 0;
    layout.scrollTop = 0;
    closeButton?.focus({preventScroll: true});
    if (reduced.matches) return true;

    const morph = portraitFlight(source);
    animate(inner, [{opacity: 0}, {opacity: 1}], {duration: 430});
    if (!morph) animate(portrait, [{opacity: 0, transform: 'scale(1.06)'}, {opacity: 1, transform: 'scale(1)'}], {duration: 850});
    animate(frame, [{opacity: 0, clipPath: 'inset(0 100% 100% 0)'}, {opacity: 1, clipPath: 'inset(0 0 0 0)'}], {delay: 270, duration: 720});
    animate(star, [{opacity: 0, transform: 'scale(.65) rotate(-30deg)'}, {opacity: 1, transform: 'scale(1) rotate(0deg)'}], {delay: 520, duration: 600});
    animate(visualLabel, [{opacity: 0, transform: 'translateY(18px)'}, {opacity: 1, transform: 'translateY(0)'}], {delay: 490, duration: 650});
    [...copy.children].forEach((element, index) => {
      if (element === rule) {
        animate(element, [{opacity: 0, transform: 'scaleX(0)'}, {opacity: 1, transform: 'scaleX(1)'}], {delay: 400, duration: 700});
      } else {
        animate(element, [{opacity: 0, transform: 'translateY(17px)'}, {opacity: 1, transform: 'translateY(0)'}], {delay: 150 + Math.min(index, 7) * 65, duration: 640});
      }
    });
    return true;
  }

  function close(target) {
    if (target !== dialog) return false;
    if (!dialog.open || finishClosing) return true;
    stopMotion();
    if (reduced.matches) { finishClose(); return true; }
    dialog.dataset.closing = 'true';
    dialog.classList.add('character-closing');
    const token = generation;
    finishClosing = finishClose;
    const morph = portraitFlight(document.querySelector('#portrait'), true);
    const fade = animate(inner, [{opacity: 1}, {opacity: 0}], {duration: morph ? 330 : 230, easing: 'ease-in'});
    const effect = morph || fade;
    if (!effect) { finishClose(); return true; }
    effect.finished.then(() => { if (token === generation) finishClose(); }).catch(() => {});
    return true;
  }

  // Native/programmatic closure and preference changes must also clear in-flight clones.
  dialog.addEventListener('close', () => {
    stopMotion();
    finishClosing = null;
    dialog.classList.remove('character-closing');
    delete dialog.dataset.closing;
  });
  reduced.addEventListener('change', () => {
    if (!reduced.matches) return;
    if (finishClosing) finishClose();
    else stopMotion();
  });
  window.addEventListener('resize', () => {
    if (finishClosing) finishClose();
    else stopMotion();
  }, {passive: true});

  window.SamudraCharacterReveal = {open, close};
})();
