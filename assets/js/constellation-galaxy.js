/* Celestial galaxy: paint textures once, then let the compositor move layers.
   No per-frame canvas drawing, pointer listener, or independent scroll loop. */
(() => {
  'use strict';

  const stage = document.querySelector('.celestial-constellation');
  const nebula = stage?.querySelector('.celestial-nebula');
  const dust = stage?.querySelector('.celestial-dust');
  const worldStars = document.querySelector('.world-stars');
  if (!stage || !nebula || !dust) return;

  const compact = matchMedia('(max-width: 800px)');
  let paintPending = true;
  let paintQueued = false;
  let previousSize = '';
  let worldPending = true;
  let previousWorldSize = '';

  // Stable seeds prevent stars jumping to new positions on resize/re-entry.
  function randomFrom(seed) {
    return () => {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      let value = Math.imul(seed ^ seed >>> 15, 1 | seed);
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function canvasLayer(parent, className) {
    const canvas = document.createElement('canvas');
    canvas.className = className;
    canvas.setAttribute('aria-hidden', 'true');
    parent.append(canvas);
    return canvas;
  }

  const veil = document.createElement('span');
  veil.className = 'galaxy-veil galaxy-motion';
  nebula.append(veil);
  const stars = canvasLayer(dust, 'galaxy-far-stars galaxy-motion');
  const nearField = document.createElement('span');
  nearField.className = 'galaxy-near-field';
  dust.append(nearField);
  const outerStars = worldStars ? canvasLayer(worldStars, 'galaxy-world-stars') : null;
  worldStars?.classList.add('galaxy-starfield');

  function contextFor(canvas, width, height, maxRatio) {
    const ratio = Math.min(devicePixelRatio || 1, maxRatio);
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    const context = canvas.getContext('2d');
    if (!context) return null;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    return context;
  }

  function cloud(context, x, y, radius, stretch, color, alpha) {
    context.save();
    context.translate(x, y);
    context.scale(1, stretch);
    const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, `rgba(${color},${alpha})`);
    gradient.addColorStop(.38, `rgba(${color},${alpha * .44})`);
    gradient.addColorStop(1, `rgba(${color},0)`);
    context.fillStyle = gradient;
    context.fillRect(-radius, -radius, radius * 2, radius * 2);
    context.restore();
  }

  // The sparse star river follows the narwhal's tail to head.
  function spine(t) {
    return [.39 + Math.sin(t * Math.PI * .94) * .34, 1.04 - t * 1.13];
  }

  function paintStars(canvas, width, height, outside = false) {
    const context = contextFor(canvas, width, height, outside || compact.matches ? 1 : 1.5);
    if (!context) return;
    const random = randomFrom(outside ? 4317 : 9817);
    const count = outside ? (compact.matches ? 40 : 100) : (compact.matches ? 100 : 240);
    for (let index = 0; index < count; index += 1) {
      let x = random();
      let y = random();
      if (!outside && index % 3 === 0) {
        const arc = spine(random());
        x = arc[0] + (random() - .5) * .23;
        y = arc[1] + (random() - .5) * .15;
      }
      const bright = random() > .94;
      const radius = outside
        ? bright ? 1.1 + random() * .45 : .45 + random() * .6
        : bright ? .85 + random() * .4 : .25 + random() * .55;
      const quiet = !outside && (x < .34 || y < .13 || y > .85) ? .42 : 1;
      const alpha = (bright ? outside ? .8 : .55 : outside ? .2 + random() * .34 : .12 + random() * .33) * quiet;
      const color = index % 7 === 0 ? '192,192,231' : '192,225,241';
      if (bright) cloud(context, x * width, y * height, 4.5, 1, color, alpha * .2);
      context.fillStyle = `rgba(${color},${alpha})`;
      context.beginPath();
      context.arc(x * width, y * height, radius, 0, Math.PI * 2);
      context.fill();
    }
    if (outside) return;
    // A fine, uneven stellar river gives the cloud a galactic texture without
    // adding hundreds of independently animated DOM elements.
    for (let index = 0; index < (compact.matches ? 180 : 480); index += 1) {
      const [arcX, arcY] = spine(random());
      const offsetX = (random() + random() + random() - 1.5) * .105;
      const offsetY = (random() + random() - 1.5) * .085;
      const x = arcX + offsetX;
      const y = arcY + offsetY;
      if (x < .34 || x > .96 || y < .07 || y > .93) continue;
      context.fillStyle = `rgba(184,227,242,${.16 + random() * .33})`;
      context.beginPath();
      context.arc(x * width, y * height, .18 + random() * .5, 0, Math.PI * 2);
      context.fill();
    }
  }

  function populateNearField() {
    const random = randomFrom(6281);
    const fragment = document.createDocumentFragment();
    const count = compact.matches ? 4 : 8;
    for (let index = 0; index < count; index += 1) {
      const star = document.createElement('span');
      star.className = 'galaxy-twinkle galaxy-motion';
      star.style.cssText = `left:${36 + random() * 53}%;top:${15 + random() * 64}%;--galaxy-period:${4 + random() * 3}s;--galaxy-delay:-${random() * 7}s`;
      fragment.append(star);
    }
    for (let index = 0; index < (compact.matches ? 2 : 5); index += 1) {
      const mote = document.createElement('span');
      mote.className = 'galaxy-mote galaxy-motion';
      mote.style.cssText = `left:${42 + random() * 47}%;top:${19 + random() * 65}%;--galaxy-period:${16 + random() * 9}s;--galaxy-delay:-${random() * 20}s`;
      fragment.append(mote);
    }
    nearField.replaceChildren(fragment);
  }

  function stageCanPaint() {
    const target = document.body.dataset.chapterTravelTarget;
    return stage.dataset.active === 'true' && (!target || target === 'keahlian');
  }

  function paint() {
    paintQueued = false;
    if (document.hidden || document.body.classList.contains('is-scrolling')) return;
    // Contact also uses this sparse sky. Its small texture is independent of
    // visiting Skills, including a direct load at #kontak.
    if (worldPending && outerStars) {
      const size = `${innerWidth}:${innerHeight}:${compact.matches}`;
      if (size !== previousWorldSize) {
        paintStars(outerStars, innerWidth, innerHeight, true);
        previousWorldSize = size;
      }
      worldPending = false;
    }
    if (!paintPending || !stageCanPaint()) return;
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    if (!width || !height) return;
    const size = `${width}:${height}:${compact.matches}`;
    paintPending = false;
    if (size === previousSize) return;
    previousSize = size;
    paintStars(stars, width, height);
    populateNearField();
    stage.classList.add('galaxy-ready');
  }

  function schedulePaint() {
    if (paintQueued || document.hidden || document.body.classList.contains('is-scrolling')) return;
    // No texture work while passing Skills on the way to a different chapter.
    if (!(worldPending && outerStars) && !(paintPending && stageCanPaint())) return;
    paintQueued = true;
    if ('requestIdleCallback' in window) requestIdleCallback(paint, {timeout: 900});
    else setTimeout(paint, 32);
  }

  // Reuse the existing reveal/visibility signal; do not create a second
  // scroll camera or change the atlas transform used for pan and zoom.
  new MutationObserver(schedulePaint).observe(stage, {attributes: true, attributeFilter: ['data-active']});
  document.addEventListener('celestialscrollsettled', schedulePaint);
  document.addEventListener('visibilitychange', schedulePaint);
  const resize = () => { paintPending = true; worldPending = true; schedulePaint(); };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(stage);
  if (window.CelestialMotionBudget?.onResize) window.CelestialMotionBudget.onResize(resize);
  else addEventListener('resize', resize, {passive: true});
  schedulePaint();
})();
