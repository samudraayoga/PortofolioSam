(() => {
  'use strict';

  const section = document.querySelector('.skills-section');
  const grid = section?.querySelector('.talent-grid');
  const panel = section?.querySelector('#skill-items');
  const tabs = [...(section?.querySelectorAll('[data-skill]') || [])];
  if (!section || !grid || !panel || tabs.length < 4) return;

  const ns = 'http://www.w3.org/2000/svg';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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
      points: [[300, 195], [275, 245], [265, 295], [295, 345], [350, 395], [415, 445]]
    },
    ai: {
      anchor: [620, 176],
      labelSide: 'right',
      points: [[602, 280], [590, 335], [570, 410], [550, 485], [530, 560]]
    },
    systems: {
      anchor: [868, 530],
      labelSide: 'right',
      points: [[826, 622], [805, 664], [779, 706], [748, 748], [713, 790], [675, 832]]
    },
    project: {
      anchor: [466, 777],
      labelSide: 'right',
      labelWidth: 330,
      points: [[385, 837], [339, 867], [293, 897], [247, 927], [201, 957], [155, 987]]
    }
  };

  function spinePath({anchor, points}) {
    const knots = [anchor, ...points];
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
            <path pathLength="1" d="M360 108 C448 118 535 146 620 176"/>
            <path pathLength="1" d="M620 176 C694 276 786 410 868 530"/>
            <path pathLength="1" d="M868 530 C744 616 598 709 466 777"/>
            <path pathLength="1" d="M466 777 C438 562 401 315 360 108"/>
            <path class="convergence-link" pathLength="1" d="M620 176 C584 350 526 610 466 777"/>
            <path class="tusk-link" pathLength="1" d="M466 777 C394 843 323 914 258 974"/>
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
      <p>Celestial Archive <span>/ Living Skill Atlas</span></p>
      <h3>Monoceros Caeli</h3>
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

  const dust = stage.querySelector('.celestial-dust');
  for (let index = 0; index < 88; index += 1) {
    const star = document.createElement('i');
    const x = (index * 47 + (index % 7) * 13) % 100;
    const y = (index * 31 + (index % 5) * 17) % 100;
    const size = index % 11 === 0 ? 2.4 : index % 4 === 0 ? 1.5 : .8;
    star.style.cssText = `--x:${x}%;--y:${y}%;--s:${size}px;--d:${(index % 9) * .28}s`;
    dust.append(star);
  }

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
  let activeSkill = '';
  let activationTimer = 0;

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
      style: `--point-delay:${.72 + index * .1}s`
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
  }
  document.fonts?.ready.then(fitSkillLabels);
  addEventListener('resize', fitSkillLabels);

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
    setTimeout(() => stage.classList.remove('talent-unlocking'), reducedMotion.matches ? 0 : 1500);
  }

  function requestActivation(skill) {
    if (skill === activeSkill && stage.classList.contains('network-awake')) return;
    const previousSkill = activeSkill;
    clearTimeout(activationTimer);
    stage.classList.add('talent-focused', 'talent-collapsing');
    resetButton.hidden = false;
    activationTimer = setTimeout(() => renderSkill(skill, previousSkill), reducedMotion.matches ? 0 : 150);
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

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const visible = entries[0].isIntersecting;
      stage.dataset.active = String(visible);
      if (visible) stage.classList.add('constellation-revealed');
    }, {threshold: .2}).observe(stage);
  } else {
    stage.classList.add('constellation-revealed');
  }

  if (reducedMotion.matches) stage.classList.add('constellation-revealed');
})();
