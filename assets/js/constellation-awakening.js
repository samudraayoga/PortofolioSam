(() => {
  'use strict';

  const section = document.querySelector('.skills-section');
  const grid = section?.querySelector('.talent-grid');
  const panel = section?.querySelector('#skill-items');
  const tabs = [...(section?.querySelectorAll('[data-skill]') || [])];
  if (!section || !grid || !panel || tabs.length < 3) return;

  const ns = 'http://www.w3.org/2000/svg';
  const names = {
    fullstack: 'Full-Stack Development',
    ai: 'AI & Automation',
    systems: 'Systems & Networks'
  };
  const desktopLayouts = {
    fullstack: [[15, 54], [19, 36], [25, 44], [32, 52], [39, 60], [25, 63]],
    ai: [[45, 35], [52, 44], [60, 38], [63, 28], [69, 35]],
    systems: [[61, 65], [69, 72], [78, 77], [88, 69], [85, 56], [75, 61]]
  };
  const mobileLayouts = {
    fullstack: [[25, 28], [40, 29], [62, 28], [75, 30], [31, 36], [68, 37]],
    ai: [[25, 55], [40, 56], [60, 55], [75, 57], [50, 63]],
    systems: [[25, 81], [40, 83], [60, 81], [75, 83], [31, 90], [68, 90]]
  };
  const anchors = {
    desktop: {fullstack: [42.4, 10.2], ai: [56.2, 16.5], systems: [69.2, 49.3]},
    mobile: {fullstack: [50, 20], ai: [50, 47], systems: [50, 74]}
  };

  const stage = document.createElement('div');
  stage.className = 'celestial-constellation';
  stage.dataset.activeSkill = 'fullstack';
  stage.innerHTML = `
    <div class="celestial-nebula" aria-hidden="true"></div>
    <div class="celestial-dust" aria-hidden="true"></div>
    <div class="constellation-zoom-layer">
    <img class="monoceros-reference" src="assets/monoceros-caeli.webp" alt="" aria-hidden="true" decoding="async">
    <svg class="celestial-map" viewBox="0 0 1000 600" aria-hidden="true">
      <defs>
        <linearGradient id="weaver-line" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#72d9ff"/><stop offset=".48" stop-color="#a4efff"/><stop offset="1" stop-color="#7587ff"/>
        </linearGradient>
        <linearGradient id="weaver-ray" x1="0" y1="0" x2="1" y2="0">
          <stop stop-color="#fff1b6"/><stop offset=".4" stop-color="#9cecff"/><stop offset="1" stop-color="#7b9bff" stop-opacity=".16"/>
        </linearGradient>
        <filter id="weaver-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g class="weaver-orbits">
        <ellipse cx="526" cy="299" rx="406" ry="214"/>
        <ellipse cx="526" cy="299" rx="345" ry="172" transform="rotate(-8 526 299)"/>
        <ellipse cx="526" cy="299" rx="282" ry="132" transform="rotate(14 526 299)"/>
      </g>
      <g class="celestial-creature">
        <path class="creature-line line-01" pathLength="1" d="M108 476 C215 424 256 333 334 269 C420 199 481 162 557 174 C649 188 688 259 775 279 C849 296 903 254 947 204"/>
        <path class="creature-line line-02" pathLength="1" d="M333 270 C273 171 171 128 73 219 C158 210 225 242 284 307"/>
        <path class="creature-line line-03" pathLength="1" d="M334 270 C273 320 251 393 293 457 C326 404 379 370 415 302"/>
        <path class="creature-line line-04" pathLength="1" d="M557 174 C662 98 779 126 843 218 C756 193 688 216 625 253"/>
        <path class="creature-line line-05" pathLength="1" d="M625 253 C713 273 791 333 844 421 C753 386 678 359 602 304"/>
        <path class="creature-line line-06" pathLength="1" d="M284 307 C365 250 456 220 557 224 C643 227 696 273 775 279 C695 309 612 331 523 325 C427 319 356 299 293 457"/>
        <path class="creature-line line-07" pathLength="1" d="M775 279 C845 246 920 250 958 202 C940 274 903 318 831 332 C878 348 915 375 934 414 C880 390 824 360 775 279"/>
        <path class="creature-line line-08" pathLength="1" d="M418 268 C442 234 481 218 520 230 C490 239 475 261 479 287 C509 273 541 278 563 300"/>
        <path class="creature-line line-09" pathLength="1" d="M350 238 C322 207 276 196 244 216 C277 218 297 236 304 265"/>
        <path class="creature-line line-10" pathLength="1" d="M650 224 C690 194 741 190 780 213 C741 216 716 234 704 260"/>
        <path class="creature-line line-11" pathLength="1" d="M109 476 C153 475 187 490 210 520 C164 510 129 494 90 520"/>
      </g>
      <path class="mobile-weaver" pathLength="1" d="M500 84 C419 160 568 239 500 320 C439 393 553 478 500 565"/>
      <g class="major-links">
        <path pathLength="1" d="M318 276 L540 238 L805 300"/>
        <path pathLength="1" d="M318 276 L805 300"/>
      </g>
      <g class="skill-rays"></g>
      <g class="map-stars">
        <circle cx="108" cy="476" r="3"/><circle cx="244" cy="216" r="2.5"/><circle cx="334" cy="269" r="3"/>
        <circle cx="557" cy="174" r="3.5"/><circle cx="775" cy="279" r="3"/><circle cx="947" cy="204" r="2.5"/>
        <circle cx="844" cy="421" r="2.5"/><circle cx="293" cy="457" r="2.5"/>
      </g>
    </svg>
    <div class="constellation-focus-vignette" aria-hidden="true"></div>
    <div class="constellation-nodes">
      <button class="constellation-node node-fullstack" type="button" data-constellation-skill="fullstack" aria-label="Buka Full-Stack Development" aria-pressed="true">
        <span class="node-star" aria-hidden="true"><i></i></span><span class="node-copy"><small>I</small>Full-Stack</span>
      </button>
      <button class="constellation-node node-ai" type="button" data-constellation-skill="ai" aria-label="Buka AI dan Automation" aria-pressed="false">
        <span class="node-star" aria-hidden="true"><i></i></span><span class="node-copy"><small>II</small>AI &amp; Automation</span>
      </button>
      <button class="constellation-node node-systems" type="button" data-constellation-skill="systems" aria-label="Buka Systems dan Networks" aria-pressed="false">
        <span class="node-star" aria-hidden="true"><i></i></span><span class="node-copy"><small>III</small>Systems</span>
      </button>
    </div>
    <div class="constellation-satellites" aria-hidden="true"></div>
    </div>
    <div class="constellation-screen-copy">
      <p>Celestial Archive <span>/ Skill Map</span></p>
      <h3>Monoceros Caeli</h3>
      <span>Constellation of code and intelligence.</span>
    </div>
    <button class="constellation-reset" type="button" hidden><span aria-hidden="true">⌁</span> View Full Constellation</button>
    <div class="constellation-current" aria-live="polite"><small>Awakened Talent</small><span>Full-Stack Development</span></div>`;
  grid.before(stage);

  const dust = stage.querySelector('.celestial-dust');
  for (let index = 0; index < 92; index += 1) {
    const star = document.createElement('i');
    const x = (index * 47 + (index % 7) * 13) % 100;
    const y = (index * 31 + (index % 5) * 17) % 100;
    const size = index % 11 === 0 ? 2.4 : index % 4 === 0 ? 1.5 : .8;
    star.style.cssText = `--x:${x}%;--y:${y}%;--s:${size}px;--d:${(index % 9) * .28}s`;
    dust.append(star);
  }

  const rays = stage.querySelector('.skill-rays');
  const satellites = stage.querySelector('.constellation-satellites');
  const current = stage.querySelector('.constellation-current span');
  const resetButton = stage.querySelector('.constellation-reset');
  const nodeButtons = [...stage.querySelectorAll('[data-constellation-skill]')];
  const mobileQuery = matchMedia('(max-width: 700px)');
  let activeSkill = 'fullstack';
  let resizeFrame = 0;

  function svgPath(attributes) {
    const path = document.createElementNS(ns, 'path');
    Object.entries(attributes).forEach(([key, value]) => path.setAttribute(key, value));
    return path;
  }

  function updateSatellites() {
    activeSkill = section.querySelector('[data-skill][aria-selected="true"]')?.dataset.skill || activeSkill;
    const isMobile = mobileQuery.matches;
    const layout = (isMobile ? mobileLayouts : desktopLayouts)[activeSkill];
    const start = (isMobile ? anchors.mobile : anchors.desktop)[activeSkill];
    const skills = [...panel.children].map(item => item.textContent.trim());

    stage.dataset.activeSkill = activeSkill;
    current.textContent = names[activeSkill];
    nodeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.constellationSkill === activeSkill)));
    rays.replaceChildren();
    satellites.replaceChildren();

    skills.forEach((skill, index) => {
      const point = layout[index] || layout[layout.length - 1];
      const startX = start[0] * 10;
      const startY = start[1] * 6;
      const endX = point[0] * 10;
      const endY = point[1] * 6;
      const curve = isMobile ? 28 : 44 + index * 5;
      const path = svgPath({
        class: 'skill-ray',
        pathLength: '1',
        d: `M${startX} ${startY} C${startX + (endX > startX ? curve : -curve)} ${startY}, ${endX} ${endY - 22}, ${endX} ${endY}`,
        style: `--ray-delay:${.95 + index * .08}s`
      });
      rays.append(path);

      const item = document.createElement('span');
      item.className = 'constellation-satellite';
      item.style.cssText = `--left:${point[0]}%;--top:${point[1]}%;--satellite-delay:${1.12 + index * .08}s`;
      const marker = document.createElement('i');
      const label = document.createElement('b');
      label.textContent = skill;
      item.append(marker, label);
      satellites.append(item);
    });

    stage.classList.remove('satellites-awake');
    requestAnimationFrame(() => stage.classList.add('satellites-awake'));
  }

  nodeButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      const target = tabs.find(tab => tab.dataset.skill === button.dataset.constellationSkill);
      target?.click();
      stage.classList.add('talent-focused');
      resetButton.hidden = false;
      stage.classList.remove('focus-flare');
      requestAnimationFrame(() => stage.classList.add('focus-flare'));
      setTimeout(() => stage.classList.remove('focus-flare'), 760);
    });
  });

  // The regular talent cards and the constellation nodes share one awakening.
  // This keeps keyboard, touch, and pointer paths equally cinematic.
  tabs.forEach(tab => tab.addEventListener('click', () => {
    stage.classList.add('talent-focused');
    resetButton.hidden = false;
    stage.classList.remove('talent-unlocking');
    void stage.offsetWidth;
    stage.classList.add('talent-unlocking');
    setTimeout(() => stage.classList.remove('talent-unlocking'), 1150);
  }));

  function resetFocus() {
    stage.classList.remove('talent-focused', 'focus-flare');
    resetButton.hidden = true;
  }

  resetButton.addEventListener('click', resetFocus);
  stage.addEventListener('click', event => {
    if (!stage.classList.contains('talent-focused') || event.target.closest('button')) return;
    resetFocus();
  });
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && stage.classList.contains('talent-focused')) resetFocus();
  });

  new MutationObserver(updateSatellites).observe(panel, {childList: true});
  mobileQuery.addEventListener?.('change', updateSatellites);
  addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(updateSatellites);
  }, {passive: true});

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      stage.dataset.active = String(visible);
      if (visible) stage.classList.add('constellation-revealed');
    }, {threshold: .2}).observe(stage);
  } else {
    stage.classList.add('constellation-revealed');
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) stage.classList.add('constellation-revealed');
  updateSatellites();
})();
