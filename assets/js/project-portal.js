(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const nativeNavigation = 'onpageswap' in window && 'onpagereveal' in window && /^https?:$/.test(location.protocol);
  const key = 'samudra-project-portal';
  let navigating = false;
  let dialogTransition;
  let dialogTrigger;
  let overlay;
  const returningToCard = /^#project-(erp|chat|mlbb|ai)$/.test(location.hash);
  if (returningToCard) document.documentElement.classList.add('portal-restoring');
  // Set names in the head, before the incoming document's first snapshot.
  let activeId = returningToCard ? location.hash.slice(1) : null;
  try { activeId ||= sessionStorage.getItem('samudra-active-project'); } catch (_) { /* Optional return state. */ }
  if (/^project-(erp|chat|mlbb|ai)$/.test(activeId || '')) document.documentElement.dataset.portalProject = activeId.slice(8);

  function activateCard(card) {
    if (!card) return;
    document.documentElement.dataset.portalProject = card.id.slice(8);
    try { sessionStorage.setItem('samudra-active-project', card.id); } catch (_) { /* Optional return state. */ }
  }

  function clearNavigation() {
    navigating = false;
    overlay?.remove();
    overlay = null;
    document.documentElement.classList.remove('page-leaving');
  }
  addEventListener('pageshow', clearNavigation);
  // Avoid competing intro/reveal animations while the browser takes its snapshots.
  addEventListener('pagereveal', event => {
    if (!event.viewTransition) return;
    document.documentElement.classList.add('portal-transitioning');
    for (const animation of document.getAnimations()) {
      const target = animation.effect?.target;
      if (target?.matches?.('.case-hero,.case-hero *,.work-card,.work-art')) {
        if (Number.isFinite(animation.effect.getComputedTiming().endTime)) animation.finish();
      }
    }
    event.viewTransition.finished.finally(() => document.documentElement.classList.remove('portal-transitioning', 'portal-restoring'));
  });

  function openDialog(dialog, trigger) {
    if (dialog?.id !== 'project-dialog') return false;
    dialogTrigger = trigger;
    activateCard(trigger?.closest('.work-card'));
    const reveal = () => {
      if (!dialog.open) dialog.showModal();
      document.body.style.overflow = 'hidden';
    };
    if (reduced.matches || !document.startViewTransition) { reveal(); return true; }
    dialogTransition?.skipTransition();
    dialog.classList.add('portal-dialog');
    dialogTransition = document.startViewTransition(reveal);
    dialogTransition.finished.catch(() => {});
    return true;
  }
  function closeDialog(dialog) {
    if (dialog?.id !== 'project-dialog') return false;
    if (!dialog.open) return true;
    const close = () => {
      dialog.close();
      document.body.style.overflow = '';
      dialogTrigger?.focus({preventScroll: true});
    };
    dialogTransition?.skipTransition();
    if (reduced.matches || !document.startViewTransition) close();
    else {
      dialogTransition = document.startViewTransition(close);
      dialogTransition.finished.catch(() => {});
    }
    return true;
  }
  window.SamudraProjectPortal = {openDialog, closeDialog};

  document.addEventListener('DOMContentLoaded', () => {
    if (activeId) activateCard(document.getElementById(activeId));
    setTimeout(() => document.documentElement.classList.remove('portal-restoring'), 1000);
    try {
      const arrival = JSON.parse(sessionStorage.getItem(key) || 'null');
      sessionStorage.removeItem(key);
      if (arrival?.path === location.pathname && Date.now() - arrival.time < 15000 && !reduced.matches) {
        document.documentElement.classList.add('portal-arriving');
        setTimeout(() => document.documentElement.classList.remove('portal-arriving'), 800);
      }
    } catch (_) { /* Navigation also works without session storage. */ }

    document.querySelectorAll('.work-card a.work-link,.case-back').forEach(link => {
      link.dataset.projectPortal = 'true';
      link.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
        const destination = new URL(link.href, location.href);
        if (destination.origin !== location.origin || destination.pathname === location.pathname) return;
        activateCard(link.closest('.work-card'));
        if (reduced.matches || nativeNavigation) return;
        const source = link.closest('.work-card')?.querySelector('.work-art img') || document.querySelector('.case-cover img');
        if (!source || !source.complete || !source.naturalWidth) return;
        event.preventDefault();
        if (navigating) return;
        navigating = true;
        const rect = source.getBoundingClientRect();
        const width = Math.min(innerWidth - 40, 820);
        const height = Math.min(innerHeight * .62, width * .62);
        overlay = document.createElement('div');
        overlay.className = 'project-portal-overlay';
        overlay.setAttribute('aria-hidden', 'true');
        const flight = source.cloneNode(false);
        flight.removeAttribute('id');
        flight.className = 'project-portal-flight';
        flight.alt = '';
        flight.style.cssText = `left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px`;
        overlay.append(flight);
        document.body.append(overlay);
        overlay.animate([{backgroundColor: '#0b263500'}, {backgroundColor: '#0b2635ee'}], {duration: 380, fill: 'forwards'});
        const effect = flight.animate([
          {left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`},
          {left: `${(innerWidth - width) / 2}px`, top: `${(innerHeight - height) / 2}px`, width: `${width}px`, height: `${height}px`}
        ], {duration: 420, easing: 'cubic-bezier(.22,.8,.22,1)', fill: 'forwards'});
        effect.finished.catch(() => {}).then(() => {
          try { sessionStorage.setItem(key, JSON.stringify({path: destination.pathname, time: Date.now()})); } catch (_) { /* Optional arrival animation. */ }
          location.assign(destination.href);
          // A cancelled navigation must never leave the current page covered.
          setTimeout(clearNavigation, 1500);
        });
      });
    });
  });
})();
