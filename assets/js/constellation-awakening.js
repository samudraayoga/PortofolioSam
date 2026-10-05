(() => {
  'use strict';
  const section = document.querySelector('.skills-section');
  const panel = document.querySelector('#skill-items');
  if (!section || !panel) return;

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('skill-constellation');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML = '<defs><linearGradient id="constellation-light" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f3dda1"/><stop offset=".55" stop-color="#9ed7c1"/><stop offset="1" stop-color="#f8e9b9"/></linearGradient></defs>';
  section.prepend(svg);

  let frame = 0;
  let visible = true;
  function point(element, bounds, anchor = 'center') {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left - bounds.left + rect.width / 2,
      y: rect.top - bounds.top + (anchor === 'bottom' ? rect.height : rect.height / 2)
    };
  }
  function element(name, attributes) {
    const node = document.createElementNS(ns, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  }
  function draw() {
    frame = 0;
    const selected = section.querySelector('[data-skill][aria-selected="true"]');
    const targets = [...panel.children];
    if (!selected || !targets.length) return;
    const bounds = svg.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    svg.querySelectorAll('[data-constellation-dynamic]').forEach(node => node.remove());
    const compact = innerWidth <= 600;
    const source = point(selected, bounds, 'bottom');
    const sourceStar = element('circle', {cx: source.x, cy: source.y, r: 4.5, class: 'constellation-star', 'data-constellation-dynamic': '', style: '--star-delay:80ms'});
    svg.append(sourceStar);
    targets.forEach((target, index) => {
      target.style.setProperty('--skill-delay', `${300 + index * 70}ms`);
      const end = point(target, bounds);
      const start = compact && index > 0 ? point(targets[index - 1], bounds) : source;
      if (!compact || index > 0) {
        const bend = compact ? 10 : Math.max(34, Math.abs(end.y - start.y) * .42);
        const path = element('path', {
          d: compact
            ? `M ${start.x} ${start.y} Q ${(start.x + end.x) / 2} ${Math.min(start.y, end.y) - bend}, ${end.x} ${end.y}`
            : `M ${start.x} ${start.y} C ${start.x} ${start.y + bend}, ${end.x} ${end.y - bend}, ${end.x} ${end.y}`,
          'data-constellation-dynamic': '',
          style: `--path-delay:${index * 70}ms`
        });
        svg.append(path);
        const length = Math.ceil(path.getTotalLength());
        path.style.setProperty('--path-length', String(length));
      }
      svg.append(element('rect', {
        x: end.x - 3.1, y: end.y - 3.1, width: 6.2, height: 6.2, rx: 1,
        class: 'constellation-star', 'data-constellation-dynamic': '',
        style: `--star-delay:${280 + index * 70}ms`, transform: `rotate(45 ${end.x} ${end.y})`
      }));
    });
    section.classList.remove('constellation-awake');
    if (visible) requestAnimationFrame(() => section.classList.add('constellation-awake'));
  }
  function schedule() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  }

  new MutationObserver(schedule).observe(panel, {childList: true});
  new ResizeObserver(schedule).observe(section);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      svg.style.animationPlayState = visible ? 'running' : 'paused';
      if (visible) schedule();
    }, {threshold: .12}).observe(section);
  }
  addEventListener('pageshow', schedule);
  schedule();
})();
