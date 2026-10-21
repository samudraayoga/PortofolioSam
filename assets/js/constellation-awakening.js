(() => {
  'use strict';

  const section = document.querySelector('.skills-section');
  const grid = section?.querySelector('.talent-grid');
  const panel = section?.querySelector('#skill-items');
  const tabs = [...(section?.querySelectorAll('[data-skill]') || [])];
  if (!section || !grid || !panel || tabs.length < 4) return;

  const ns = 'http://www.w3.org/2000/svg';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const motion = window.CelestialUI?.motion || {instant: 120, sequence: 760, cinematic: 1400, stagger: 70};
  const names = {
    fullstack: 'Full-Stack Development',
    ai: 'AI & Automation',
    systems: 'Systems & Networks',
    project: 'Project Management'
  };

  // Each region is one open spine, in the artwork's 1080 x 1080 coordinates.
  // Node order is spatial, not a prerequisite/proficiency ranking. Derive the
  // curve and short horizontal label leaders from these same coordinates so
  // a moved star cannot drift away from its route.
  const atlas = {
    fullstack: {
      anchor: [360, 108],
      labelSide: 'left',
      points: [[300, 190], [278, 237], [267, 284], [280, 331], [310, 378], [355, 425], [410, 472]]
    },
    ai: {
      anchor: [599, 176],
      labelSide: 'right',
      // Follow the inner cyan arc from the crown into the lower curl.
      guides: [[619, 200], [637, 225], [661, 280], [667, 300], [672, 350], [664, 410], [656, 430], [630, 475], [617, 490], [600, 505]],
      points: [[650, 250], [670, 320], [669, 385], [647, 450], [578, 515]]
    },
    systems: {
      anchor: [904, 550],
      labelSide: 'right',
      frameBranch: true,
      // Trace the tail junction and outer belly in the reference artwork.
      // Extra contour knots preserve the bend without crowding skill labels.
      guides: [[871, 560], [851, 580], [831, 637], [791, 710], [747, 760], [678, 810]],
      points: [[841, 610], [825, 650], [804, 690], [774, 730], [723, 780], [642, 830]]
    },
    project: {
      anchor: [466, 777],
      labelSide: 'right',
      labelWidth: 270,
      frameBranch: true,
      points: [[402, 825], [352, 873], [304, 921], [256, 969], [208, 1017], [160, 1065]]
    }
  };

  function spinePath({anchor, points, guides = []}) {
    const knots = [anchor, ...points, ...guides].sort((a, b) => a[1] - b[1]);
    return knots.reduce((path, [x, y], index) => {
      if (index === 0) return `M${x} ${y}`;
      const [previousX, previousY] = knots[index - 1];
      const before = knots[Math.max(0, index - 2)];
      const after = knots[Math.min(knots.length - 1, index + 1)];
      // Positive, clamped Y handles keep the spine moving down: no folds,
      // closed loops, or reversal back into another category's gateway.
      const firstY = Math.min(y, previousY + (y - before[1]) / 6);
      const secondY = Math.max(previousY, y - (after[1] - previousY) / 6);
      return `${path} C${previousX + (x - before[0]) / 6} ${firstY} ${x - (after[0] - previousX) / 6} ${secondY} ${x} ${y}`;
    }, '');
  }
  Object.values(atlas).forEach(config => { config.route = spinePath(config); });

  const stage = document.createElement('div');
  stage.className = 'celestial-constellation';
  stage.dataset.activeSkill = '';
  stage.innerHTML = `
    <div class="celestial-nebula" aria-hidden="true"></div>
    <div class="celestial-dust" aria-hidden="true"></div>
    <div class="constellation-zoom-layer">
      <div class="narwhal-atlas">
        <div class="galaxy-resonance" aria-hidden="true"></div>
        <img class="monoceros-reference" src="assets/monoceros-caeli-alpha-clean-v4.webp" alt="" aria-hidden="true" decoding="async">
        <svg class="celestial-map" viewBox="0 0 1080 1080" aria-hidden="true">
          <defs>
            <linearGradient id="narwhal-line" x1="0" y1="0" x2="1" y2="1">
              <stop stop-color="#fff0ae"/><stop offset=".34" stop-color="#9cecff"/><stop offset="1" stop-color="#758cff"/>
            </linearGradient>
            <linearGradient id="narwhal-transit" x1="0" y1="0" x2="1" y2="0">
              <stop stop-color="#fff4bd"/><stop offset=".45" stop-color="#a9efff"/><stop offset="1" stop-color="#728cff"/>
            </linearGradient>
            <filter id="narwhal-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="narwhal-art-glow" x="-8%" y="-8%" width="116%" height="116%" color-interpolation-filters="sRGB">
              <feMorphology in="SourceGraphic" operator="dilate" radius=".55" result="contour"/>
              <feGaussianBlur in="contour" stdDeviation="2.4" result="bloom"/>
              <feComponentTransfer in="bloom" result="soft-bloom"><feFuncA type="linear" slope=".48"/></feComponentTransfer>
              <feMerge><feMergeNode in="soft-bloom"/><feMergeNode in="contour"/></feMerge>
            </filter>
          </defs>
          <g class="gateway-links">
            <path pathLength="1" d="M360 108 C448 118 535 146 ${atlas.ai.anchor.join(' ')}"/>
            <path pathLength="1" d="M${atlas.ai.anchor.join(' ')} C694 276 786 410 ${atlas.systems.anchor.join(' ')}"/>
            <path pathLength="1" d="M${atlas.systems.anchor.join(' ')} C744 616 598 709 466 777"/>
            <path pathLength="1" d="M466 777 C438 562 401 315 360 108"/>
            <path class="convergence-link" pathLength="1" d="M${atlas.ai.anchor.join(' ')} C584 350 526 610 466 777"/>
            <path class="tusk-link" pathLength="1" d="M466 777 C394 843 323 914 258 974"/>
          </g>
          <g class="gateway-energy">
            <path pathLength="1" d="M360 108 C448 118 535 146 ${atlas.ai.anchor.join(' ')}"/>
            <path pathLength="1" d="M${atlas.ai.anchor.join(' ')} C694 276 786 410 ${atlas.systems.anchor.join(' ')}"/>
            <path pathLength="1" d="M${atlas.systems.anchor.join(' ')} C744 616 598 709 466 777"/>
            <path pathLength="1" d="M466 777 C438 562 401 315 360 108"/>
            <path pathLength="1" d="M${atlas.ai.anchor.join(' ')} C584 350 526 610 466 777"/>
            <path pathLength="1" d="M466 777 C394 843 323 914 258 974"/>
          </g>
          <g class="region-previews">
            <path class="region-preview region-fullstack" pathLength="1" d="${atlas.fullstack.route}"/>
            <path class="region-preview region-ai" pathLength="1" d="${atlas.ai.route}"/>
            <path class="region-preview region-systems" pathLength="1" d="${atlas.systems.route}"/>
            <path class="region-preview region-project" pathLength="1" d="${atlas.project.route}"/>
          </g>
          <g class="skill-network">
            <path class="skill-route" pathLength="1"></path>
            <path class="skill-route-pulse" pathLength="1"></path>
            <g class="skill-points"></g>
          </g>
          <g class="energy-transit">
            <path class="energy-transit-line" pathLength="1"></path>
            <circle class="energy-mote" r="7"></circle>
          </g>
        </svg>
        <div class="constellation-focus-vignette" aria-hidden="true"></div>
        <div class="constellation-nodes">
          <button class="constellation-node node-fullstack" type="button" data-constellation-skill="fullstack" aria-label="Open Full-Stack Development constellation" aria-pressed="false">
            <span class="node-star" aria-hidden="true"><i></i></span><span class="node-copy"><small>I</small>Full-Stack</span>
          </button>
          <button class="constellation-node node-ai" type="button" data-constellation-skill="ai" aria-label="Open AI and Automation constellation" aria-pressed="false">
            <span class="node-star" aria-hidden="true"><i></i></span><span class="node-copy"><small>II</small>AI &amp; Automation</span>
          </button>
          <button class="constellation-node node-systems" type="button" data-constellation-skill="systems" aria-label="Open Systems and Networks constellation" aria-pressed="false">
            <span class="node-star" aria-hidden="true"><i></i></span><span class="node-copy"><small>III</small>Systems</span>
          </button>
          <button class="constellation-node node-project" type="button" data-constellation-skill="project" aria-label="Open Project Management constellation" aria-pressed="false">
            <span class="node-star" aria-hidden="true"><i></i></span><span class="node-copy"><small>IV</small>Project Management</span>
          </button>
        </div>
      </div>
    </div>
    <div class="constellation-screen-copy">
      <p>Hydro Element <span>/ Celestial Narwhale</span></p>
      <h3>Skills Constellation</h3>
      <span>Choose a star to explore a skill path.</span>
    </div>
    <section class="constellation-insight" aria-label="Skill path overview">
      <p class="insight-kicker">Connected disciplines</p>
      <h4>One system. Four perspectives.</h4>
      <p class="insight-description">Select a glowing star to discover the tools and skills behind each path.</p>
      <ul class="insight-skills" aria-label="Skills in this path"></ul>
      <small>Tab to a star · Enter to explore</small>
    </section>
    <button class="constellation-reset" type="button" hidden><span aria-hidden="true">⌁</span> Overview</button>
    <div class="constellation-current" aria-live="polite"><small>Constellation state</small><span>Select a gateway star</span></div>
    <div class="mobile-skill-ledger" aria-hidden="true"></div>`;
  grid.before(stage);

  const route = stage.querySelector('.skill-route');
  const routePulse = stage.querySelector('.skill-route-pulse');
  const skillPoints = stage.querySelector('.skill-points');
  const transitLine = stage.querySelector('.energy-transit-line');
  const energyMote = stage.querySelector('.energy-mote');
  const currentLabel = stage.querySelector('.constellation-current span');
  const currentKicker = stage.querySelector('.constellation-current small');
  const resetButton = stage.querySelector('.constellation-reset');
  const mobileLedger = stage.querySelector('.mobile-skill-ledger');
  const insight = stage.querySelector('.constellation-insight');
  const insightTitle = insight.querySelector('h4');
  const insightDescription = insight.querySelector('.insight-description');
  const insightSkills = insight.querySelector('.insight-skills');
  const nodeButtons = [...stage.querySelectorAll('[data-constellation-skill]')];
  nodeButtons.forEach(button => {
    const [x, y] = atlas[button.dataset.constellationSkill].anchor;
    button.style.left = `${x / 10.8}%`;
    button.style.top = `${y / 10.8}%`;
  });
  const atlasElement = stage.querySelector('.narwhal-atlas');
  const screenCopy = stage.querySelector('.constellation-screen-copy');
  const currentStatus = stage.querySelector('.constellation-current');
  let activeSkill = '';
  let activationTimer = 0;
  let invitationTimer = 0;
  let invitationIndex = 0;

  function scheduleInvitation() {
    clearTimeout(invitationTimer);
    if (reducedMotion.matches) return;
    invitationTimer = setTimeout(() => {
      const node = nodeButtons[invitationIndex % nodeButtons.length];
      invitationIndex += 1;
      if (stage.dataset.active === 'true' && !stage.classList.contains('talent-focused')) {
        node.classList.remove('is-inviting');
        void node.offsetWidth;
        node.classList.add('is-inviting');
        setTimeout(() => node.classList.remove('is-inviting'), motion.cinematic);
      }
      scheduleInvitation();
    }, 4200);
  }

  function svgElement(tag, attributes = {}) {
    const element = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    return element;
  }

  function selectedSkill() {
    return section.querySelector('[data-skill][aria-selected="true"]')?.dataset.skill || 'fullstack';
  }

  function transitPath(from, to) {
    if (!from || from === to) return '';
    const [fromX, fromY] = atlas[from].anchor;
    const [toX, toY] = atlas[to].anchor;
    if ((from === 'fullstack' && to === 'systems') || (from === 'systems' && to === 'fullstack')) {
      const [aiX, aiY] = atlas.ai.anchor;
      return `M${fromX} ${fromY} C${(fromX + aiX) / 2} ${fromY}, ${(fromX + aiX) / 2} ${aiY}, ${aiX} ${aiY} C${(aiX + toX) / 2} ${aiY}, ${(aiX + toX) / 2} ${toY}, ${toX} ${toY}`;
    }
    return `M${fromX} ${fromY} C${(fromX + toX) / 2} ${fromY}, ${(fromX + toX) / 2} ${toY}, ${toX} ${toY}`;
  }

  function playTransit(from, to) {
    energyMote.replaceChildren();
    const path = transitPath(from, to);
    transitLine.setAttribute('d', path);
    stage.classList.remove('has-transit');
    void stage.offsetWidth;
    stage.classList.toggle('has-transit', Boolean(path) && !reducedMotion.matches);
    if (!path || reducedMotion.matches) return;
    energyMote.append(svgElement('animateMotion', {
      path,
      dur: '.58s',
      begin: '0s',
      fill: 'freeze',
      calcMode: 'spline',
      keyTimes: '0;1',
      keySplines: '.2 .72 .2 1'
    }));
  }

  function drawSkillPoint(skill, point, index, labelSide) {
    const [x, y] = point;
    const direction = labelSide === 'left' ? -1 : 1;
    const labelX = x + direction * 36;
    const align = direction < 0 ? 'end' : 'start';
    const group = svgElement('g', {
      class: 'skill-point',
      style: `--point-delay:${(motion.sequence + index * motion.stagger) / 1000}s`
    });
    group.append(
      svgElement('line', {class: 'skill-leader', x1: x + direction * 17, y1: y, x2: x + direction * 27, y2: y}),
      svgElement('circle', {class: 'skill-point-halo', cx: x, cy: y, r: 14}),
      svgElement('circle', {class: 'skill-point-core', cx: x, cy: y, r: 5}),
      svgElement('text', {class: 'skill-index', x, y, 'text-anchor': 'middle', 'dominant-baseline': 'central'}),
      svgElement('text', {class: 'skill-label', x: labelX, y: y + 6, 'text-anchor': align})
    );
    group.querySelector('.skill-index').textContent = String(index + 1).padStart(2, '0');
    group.querySelector('.skill-label').textContent = skill;
    return group;
  }

  function fitSkillLabels() {
    // Measure the actual loaded font rather than assuming a character width.
    // Long names wrap at words, centered on their own star, never truncate.
    const compactSystems = activeSkill === 'systems' && matchMedia('(max-width: 1050px)').matches;
    const maxWidth = compactSystems ? 185 : atlas[activeSkill]?.labelWidth || 270;
    skillPoints.querySelectorAll('.skill-label').forEach(label => {
      const text = label.dataset.label || label.textContent;
      label.dataset.label = text;
      label.textContent = text;
      if (label.getComputedTextLength() <= maxWidth) return;
      const words = text.split(/\s+/);
      const lines = [];
      let line = '';
      words.forEach(word => {
        const candidate = line ? `${line} ${word}` : word;
        label.textContent = candidate;
        if (line && label.getComputedTextLength() > maxWidth) {
          lines.push(line);
          line = word;
        } else line = candidate;
      });
      lines.push(line);
      const x = label.getAttribute('x');
      const firstY = Number(label.getAttribute('y')) - (lines.length - 1) * 10;
      label.replaceChildren(...lines.map((textLine, index) => {
        const span = svgElement('tspan', {x, y: firstY + index * 20});
        span.textContent = textLine;
        return span;
      }));
    });
    frameSelectedBranch();
  }

  // Frame the actual information bounds, not the entire illustration. Work in
  // untransformed atlas coordinates so an in-flight camera/point animation
  // cannot change the measurement. This runs on selection/layout changes only.
  function frameSelectedBranch() {
    const config = atlas[activeSkill];
    if (!config?.frameBranch) {
      delete stage.dataset.branchFramed;
      return;
    }
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const atlasWidth = atlasElement.offsetWidth;
    if (!width || !height || !atlasWidth) return;
    const compact = matchMedia('(max-width: 700px)').matches;
    const unit = atlasWidth / 1080;
    const [anchorX, anchorY] = config.anchor;
    const halo = 44 / unit;
    let left = anchorX - halo;
    let right = anchorX + halo;
    let top = anchorY - halo;
    let bottom = anchorY + halo;
    const include = (x, y, w, h) => {
      left = Math.min(left, x);
      right = Math.max(right, x + w);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y + h);
    };
    config.points.forEach(([x, y]) => include(x - 28, y - 28, 56, 56));
    if (!compact) {
      skillPoints.querySelectorAll('.skill-label').forEach(label => {
        const box = label.getBBox();
        include(box.x - 6, box.y - 6, box.width + 12, box.height + 12);
      });
      const badge = nodeButtons.find(button => button.dataset.constellationSkill === activeSkill).querySelector('.node-copy');
      include(anchorX - badge.offsetWidth / unit / 2, anchorY - 64 / unit,
        badge.offsetWidth / unit, badge.offsetHeight / unit);
    }
    const safeLeft = compact ? 28 : insight.offsetLeft + insight.offsetWidth + 32;
    const safeRight = width - (compact ? 28 : 48);
    const safeTop = compact
      ? Math.max(screenCopy.offsetTop + screenCopy.offsetHeight, resetButton.offsetTop + resetButton.offsetHeight) + 24
      : Math.max(96, resetButton.offsetTop + resetButton.offsetHeight + 24);
    const safeBottom = compact
      ? insight.offsetTop - 24
      : Math.min(height - 48, currentStatus.offsetTop - 28);
    if (safeRight <= safeLeft || safeBottom <= safeTop) return;
    const scale = Math.min(compact ? 1.12 : 1.2,
      (safeRight - safeLeft) / ((right - left) * unit),
      (safeBottom - safeTop) / ((bottom - top) * unit));
    const panX = (safeLeft + safeRight) / 2 - atlasElement.offsetLeft
      - ((left + right) * unit / 2 - atlasWidth / 2) * scale;
    const panY = (safeTop + safeBottom) / 2 - atlasElement.offsetTop
      - ((top + bottom) * unit / 2 - atlasWidth / 2) * scale;
    stage.style.setProperty('--branch-pan-x', `${panX.toFixed(2)}px`);
    stage.style.setProperty('--branch-pan-y', `${panY.toFixed(2)}px`);
    stage.style.setProperty('--branch-scale', scale.toFixed(4));
    stage.dataset.branchFramed = 'true';
  }
  document.fonts?.ready.then(fitSkillLabels);
  addEventListener('resize', fitSkillLabels);
  if ('ResizeObserver' in window) {
    const framingObserver = new ResizeObserver(frameSelectedBranch);
    [stage, insight, screenCopy, currentStatus].forEach(element => framingObserver.observe(element));
  }

  function updateLedger(skills) {
    mobileLedger.replaceChildren(...skills.map((skill, index) => {
      const item = document.createElement('span');
      const number = document.createElement('i');
      const label = document.createElement('b');
      number.textContent = String(index + 1).padStart(2, '0');
      label.textContent = skill;
      item.append(number, label);
      return item;
    }));
  }

  function renderSkill(skill, previousSkill = '') {
    const config = atlas[skill];
    if (!config) return;
    const skills = [...panel.children].map(item => item.textContent.trim());

    activeSkill = skill;
    stage.dataset.activeSkill = skill;
    stage.style.setProperty('--galaxy-node-x', `${config.anchor[0] / 10.8}%`);
    stage.style.setProperty('--galaxy-node-y', `${config.anchor[1] / 10.8}%`);
    stage.dataset.previewSkill = '';
    currentKicker.textContent = 'Awakened region';
    currentLabel.textContent = names[skill];
    nodeButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.constellationSkill === skill)));

    route.setAttribute('d', config.route);
    routePulse.setAttribute('d', config.route);
    skillPoints.replaceChildren(...skills.map((item, index) => drawSkillPoint(
      item,
      config.points[index] || config.points[config.points.length - 1],
      index,
      config.labelSide
    )));
    fitSkillLabels();
    updateLedger(skills);
    insight.querySelector('.insight-kicker').textContent = 'Selected skill path';
    insightTitle.textContent = names[skill];
    insightDescription.textContent = tabs.find(tab => tab.dataset.skill === skill)?.querySelector('p')?.textContent || '';
    insightSkills.replaceChildren(...skills.map((item, index) => {
      const entry = document.createElement('li');
      entry.dataset.skillIndex = String(index + 1).padStart(2, '0');
      entry.textContent = item;
      return entry;
    }));
    insight.querySelector('small').textContent = 'Choose another star · Esc for overview';
    playTransit(previousSkill, skill);

    stage.classList.remove('talent-collapsing', 'talent-unlocking', 'network-awake');
    void stage.offsetWidth;
    stage.classList.add('talent-focused', 'talent-unlocking', 'network-awake');
    resetButton.hidden = false;
    frameSelectedBranch();
    setTimeout(() => stage.classList.remove('talent-unlocking'), reducedMotion.matches ? 0 : motion.cinematic);
  }

  function requestActivation(skill) {
    if (skill === activeSkill && stage.classList.contains('network-awake')) return;
    const previousSkill = activeSkill;
    clearTimeout(activationTimer);
    nodeButtons.forEach(button => button.classList.remove('is-inviting'));
    stage.classList.add('talent-focused', 'talent-collapsing');
    resetButton.hidden = false;
    activationTimer = setTimeout(() => renderSkill(skill, previousSkill), reducedMotion.matches ? 0 : motion.instant);
  }

  nodeButtons.forEach(button => {
    const skill = button.dataset.constellationSkill;
    button.addEventListener('click', event => {
      event.stopPropagation();
      tabs.find(tab => tab.dataset.skill === skill)?.click();
    });
    button.addEventListener('pointerenter', () => {
      if (!stage.classList.contains('talent-focused')) stage.dataset.previewSkill = skill;
    });
    button.addEventListener('pointerleave', () => {
      if (!stage.classList.contains('talent-focused')) stage.dataset.previewSkill = '';
    });
    button.addEventListener('focus', () => {
      if (!stage.classList.contains('talent-focused')) stage.dataset.previewSkill = skill;
    });
    button.addEventListener('blur', () => {
      if (!stage.classList.contains('talent-focused')) stage.dataset.previewSkill = '';
    });
    button.addEventListener('keydown', event => {
      const index = nodeButtons.indexOf(button);
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % nodeButtons.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + nodeButtons.length - 1) % nodeButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = nodeButtons.length - 1;
      if (next !== undefined) { event.preventDefault(); nodeButtons[next].focus(); }
    });
  });

  tabs.forEach(tab => tab.addEventListener('click', () => requestActivation(tab.dataset.skill)));

  function resetFocus() {
    clearTimeout(activationTimer);
    activeSkill = '';
    stage.dataset.activeSkill = '';
    stage.dataset.previewSkill = '';
    delete stage.dataset.branchFramed;
    stage.classList.remove('talent-focused', 'talent-collapsing', 'talent-unlocking', 'network-awake', 'has-transit');
    route.removeAttribute('d');
    routePulse.removeAttribute('d');
    transitLine.removeAttribute('d');
    energyMote.replaceChildren();
    skillPoints.replaceChildren();
    mobileLedger.replaceChildren();
    nodeButtons.forEach(button => button.setAttribute('aria-pressed', 'false'));
    currentKicker.textContent = 'Constellation state';
    currentLabel.textContent = 'Select a gateway star';
    insight.querySelector('.insight-kicker').textContent = 'Connected disciplines';
    insightTitle.textContent = 'One system. Four perspectives.';
    insightDescription.textContent = 'Select a glowing star to discover the tools and skills behind each path.';
    insightSkills.replaceChildren();
    insight.querySelector('small').textContent = 'Tab to a star · Enter to explore';
    resetButton.hidden = true;
    scheduleInvitation();
  }

  resetButton.addEventListener('click', () => {
    const selected = nodeButtons.find(button => button.dataset.constellationSkill === activeSkill);
    resetFocus();
    selected?.focus({preventScroll: true});
  });
  stage.addEventListener('click', event => {
    if (!stage.classList.contains('talent-focused') || event.target.closest('button')) return;
    resetFocus();
  });
  addEventListener('keydown', event => {
    if (event.key === 'Escape' && stage.classList.contains('talent-focused') && !document.querySelector('dialog[open]')) {
      const selected = nodeButtons.find(button => button.dataset.constellationSkill === activeSkill);
      resetFocus();
      if (stage.contains(document.activeElement)) selected?.focus({preventScroll: true});
    }
  });

  // Keyboard selection on the cards changes the panel without dispatching a
  // click, so the panel remains the single source of truth for that path too.
  new MutationObserver(() => {
    const skill = selectedSkill();
    if (skill !== activeSkill || !stage.classList.contains('talent-focused')) requestActivation(skill);
  }).observe(panel, {childList: true});

  let revealTimer = 0;
  function revealWhenSettled() {
    clearTimeout(revealTimer);
    if (stage.dataset.active !== 'true') return;
    if (document.body.dataset.chapterTravelTarget && document.body.dataset.chapterTravelTarget !== 'keahlian') return;
    if (!document.body.classList.contains('is-scrolling')) {
      stage.classList.add('constellation-revealed');
      scheduleInvitation();
      return;
    }
    revealTimer = setTimeout(() => {
      if (stage.dataset.active === 'true' && document.body.dataset.motionChapter === 'keahlian') {
        stage.classList.add('constellation-revealed');
        scheduleInvitation();
      }
    }, 240);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      stage.dataset.active = String(visible);
      if (visible) revealWhenSettled();
      else {
        clearTimeout(revealTimer);
        clearTimeout(invitationTimer);
      }
    }, {threshold: .2}).observe(stage);
    document.addEventListener('celestialscrollsettled', revealWhenSettled);
  } else {
    stage.classList.add('constellation-revealed');
    stage.dataset.active = 'true';
    scheduleInvitation();
  }

  if (reducedMotion.matches) stage.classList.add('constellation-revealed');
  reducedMotion.addEventListener('change', () => {
    nodeButtons.forEach(button => button.classList.remove('is-inviting'));
    if (reducedMotion.matches) clearTimeout(invitationTimer);
    else scheduleInvitation();
  });
})();
