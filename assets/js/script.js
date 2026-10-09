(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  const typedElement = $('.typed');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let professionTimer = 0;
  let professionIndex = 0;
  function updateProfessionAnimation() {
    if (!typedElement) return;
    clearTimeout(professionTimer);
    const roles = typedElement.dataset.typedItems.split(',').map(role => role.trim());
    professionIndex = 0;
    typedElement.replaceChildren();

    const first = document.createElement('span');
    first.className = 'role-morph-word';
    first.textContent = roles[0];
    typedElement.append(first);
    requestAnimationFrame(() => typedElement.style.width = `${first.getBoundingClientRect().width}px`);
    if (reducedMotion.matches) return;

    const changeRole = () => {
      if (document.hidden) { professionTimer = setTimeout(changeRole, 1200); return; }
      const current = $('.role-morph-word', typedElement);
      professionIndex = (professionIndex + 1) % roles.length;
      const next = document.createElement('span');
      next.className = 'role-morph-word role-morph-enter';
      next.textContent = roles[professionIndex];
      typedElement.append(next);
      const nextWidth = next.getBoundingClientRect().width;
      typedElement.style.width = `${nextWidth}px`;
      current?.classList.add('role-morph-exit');
      requestAnimationFrame(() => next.classList.add('role-morph-enter-active'));
      setTimeout(() => {
        current?.remove();
        next.classList.remove('role-morph-enter', 'role-morph-enter-active');
      }, 680);
      professionTimer = setTimeout(changeRole, 3200);
    };
    professionTimer = setTimeout(changeRole, 2700);
  }
  updateProfessionAnimation();
  reducedMotion.addEventListener('change', updateProfessionAnimation);
  addEventListener('resize', () => {
    if (!typedElement) return;
    const word = $('.role-morph-word', typedElement);
    if (word) typedElement.style.width = `${word.getBoundingClientRect().width}px`;
  }, {passive: true});

  const themeButton = $('.theme-toggle');
  function setNight(night, animated = false) {
    const apply = () => {
      document.body.classList.toggle('night', night);
      themeButton.setAttribute('aria-pressed', String(night));
      themeButton.setAttribute('aria-label', night ? 'Switch to day mode' : 'Switch to night mode');
      $('use', themeButton).setAttribute('href', night ? '#i-sun' : '#i-moon');
    };
    if (animated && window.SamudraCelestialTheme) window.SamudraCelestialTheme.transition(night, apply);
    else apply();
  }
  try { setNight(localStorage.getItem('samudra-night') === 'true'); } catch (_) { /* Storage may be unavailable in local file mode. */ }
  themeButton.addEventListener('click', () => {
    const night = !document.body.classList.contains('night');
    setNight(night, true);
    try { localStorage.setItem('samudra-night', String(night)); } catch (_) { /* The switch still works without persistence. */ }
  });

  const menuButton = $('.menu-toggle');
  const nav = $('#main-nav');
  function closeMenu() {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation menu');
    $('use', menuButton).setAttribute('href', '#i-menu');
  }
  menuButton.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    $('use', menuButton).setAttribute('href', open ? '#i-close' : '#i-menu');
  });
  $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('click', e => {
    if (!nav.contains(e.target) && !menuButton.contains(e.target)) closeMenu();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menuButton.focus(); }
  });
  matchMedia('(min-width: 601px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

  const skillData = {
    fullstack: ['JavaScript', 'React', 'Next.js', 'Python', 'Django', 'PostgreSQL'],
    ai: ['Python', 'Machine Learning', 'Computer Vision', 'Multi-Agent Systems', 'RAG Architecture'],
    systems: ['Computer Networks', 'Routing', 'Subnetting', 'IT Support', 'System Design', 'Network Troubleshooting'],
    project: ['Project Planning', 'Agile / Scrum', 'Stakeholder Management', 'Risk Management', 'Team Coordination', 'BPMN / Documentation']
  };
  const skillTabs = $$('[data-skill]');
  function selectSkill(tab) {
    skillTabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
    $('#skill-panel').setAttribute('aria-labelledby', tab.id);
    $('#skill-items').replaceChildren(...skillData[tab.dataset.skill].map(value => {
      const span = document.createElement('span'); span.textContent = value; return span;
    }));
  }
  skillTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectSkill(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % skillTabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + skillTabs.length) % skillTabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = skillTabs.length - 1;
      if (next !== undefined) { e.preventDefault(); selectSkill(skillTabs[next]); skillTabs[next].focus(); }
    });
  });

  const journeyButtons = $$('.journey-toggle');
  function setJourneyExpanded(button, expand) {
    const detail = document.getElementById(button.getAttribute('aria-controls'));
    const item = button.closest('.journey-item');
    const startHeight = detail.getBoundingClientRect().height;
    detail.getAnimations().forEach(animation => animation.cancel());
    button.setAttribute('aria-expanded', String(expand));
    item?.classList.toggle('journey-expanded', expand);
    item?.closest('.journey-list')?.classList.toggle('has-expanded', journeyButtons.some(control => control.getAttribute('aria-expanded') === 'true'));
    if (expand && item) {
      item.classList.remove('journey-detail-pulse');
      void item.offsetWidth;
      item.classList.add('journey-detail-pulse');
      setTimeout(() => item.classList.remove('journey-detail-pulse'), 760);
    }
    if (reducedMotion.matches) { detail.hidden = !expand; return; }
    detail.hidden = false;
    const endHeight = expand ? detail.scrollHeight : 0;
    detail.style.overflow = 'hidden';
    const effect = detail.animate([
      {height: `${startHeight}px`, opacity: expand ? 0 : 1, transform: expand ? 'translateY(-8px)' : 'translateY(0)', clipPath: expand ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)'},
      {height: `${endHeight}px`, opacity: expand ? 1 : 0, transform: expand ? 'translateY(0)' : 'translateY(-8px)', clipPath: expand ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'}
    ], {duration: 420, easing: 'cubic-bezier(.16,.8,.2,1)'});
    effect.finished.then(() => {
      detail.hidden = button.getAttribute('aria-expanded') !== 'true';
      detail.style.overflow = '';
    }).catch(() => {});
  }
  journeyButtons.forEach(button => button.addEventListener('click', () => {
    const expand = button.getAttribute('aria-expanded') !== 'true';
    if (expand) journeyButtons.forEach(other => {
      if (other !== button && other.getAttribute('aria-expanded') === 'true') setJourneyExpanded(other, false);
    });
    setJourneyExpanded(button, expand);
  }));

  function closeDialog(dialog) {
    if (window.SamudraCharacterReveal?.close(dialog) || window.SamudraProjectPortal?.closeDialog(dialog)) return;
    dialog.close();
  }
  $$('dialog').forEach(dialog => {
    $('.dialog-close', dialog).addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('click', e => {
      const rect = dialog.getBoundingClientRect();
      if (e.target === dialog && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) closeDialog(dialog);
    });
    dialog.addEventListener('cancel', event => {
      if (dialog.id === 'profile-dialog' || dialog.id === 'project-dialog') { event.preventDefault(); closeDialog(dialog); }
    });
    dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  });
  function openDialog(dialog, trigger) {
    if (window.SamudraCharacterReveal?.open(dialog, trigger) || window.SamudraProjectPortal?.openDialog(dialog, trigger)) return;
    dialog.showModal(); document.body.style.overflow = 'hidden';
  }
  $$('[data-open-profile]').forEach(button => button.addEventListener('click', () => openDialog($('#profile-dialog'), button)));

  const projects = {
    ai: {
      title: 'AI Agent for ERP KPIs', category: 'Case notes / 02 · AI Engineering',
      description: 'I developed an AI agent using OpenClaw to summarize staff performance based on KPI dashboard data. An ERP endpoint connects to the OpenClaw API, with SOUL providing the agent’s instructions.',
      points: ['Built an ERP endpoint to provide KPI data.', 'Connected the ERP endpoint to the OpenClaw API.', 'Defined SOUL instructions for the agent to summarize staff performance based on the dashboard.'],
      tags: ['OpenClaw', 'SOUL', 'KPI Summary', 'ERP Integration']
    }
  };
  $$('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    $('#project-title').textContent = project.title;
    $('#project-category').textContent = project.category;
    $('#project-description').textContent = project.description;
    $('#project-points').replaceChildren(...project.points.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    $('#project-tags').replaceChildren(...project.tags.map(text => { const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = text; return tag; }));
    const dialog = $('#project-dialog');
    openDialog(dialog, button);
  }));

  let toastTimer;
  function toast(message) { const el = $('.toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3000); }
  $('.copy-email').addEventListener('click', async () => {
    const email = 'samudrayoga4477@gmail.com';
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(email);
      else {
        const input = document.createElement('textarea'); input.value = email; input.style.cssText = 'position:fixed;left:-9999px;top:0;'; document.body.append(input); input.select();
        const copied = document.execCommand('copy'); input.remove(); if (!copied) throw new Error('Copy unavailable');
      }
      toast('Email address copied.');
    } catch (_) { toast('Email: ' + email); }
  });

  const links = $$('a', nav);
  function updateActiveNav() {
    const y = window.scrollY + Math.min(window.innerHeight * .35, 230);
    let active = '#profil';
    for (const link of links) { const section = $(link.getAttribute('href')); if (section && section.getBoundingClientRect().top + window.scrollY <= y) active = link.getAttribute('href'); }
    links.forEach(link => { const current = link.getAttribute('href') === active; link.classList.toggle('active', current); if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
  }
  let ticking = false;
  window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(() => { updateActiveNav(); ticking = false; }); ticking = true; } }, { passive: true });
  updateActiveNav();
})();
