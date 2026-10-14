(() => {
  'use strict';

  const allowedStates = new Set(['dormant', 'focused', 'activated', 'transitioning']);
  const motion = Object.freeze({
    instant: 120,
    exit: 180,
    focus: 220,
    feedback: 320,
    panel: 430,
    reveal: 620,
    sequence: 760,
    transition: 900,
    cinematic: 1400,
    staggerTight: 45,
    stagger: 70,
    staggerWide: 120,
    idleShort: 4800,
    idle: 9600,
    idleLong: 32000,
    easing: Object.freeze({
      focus: 'cubic-bezier(.2,.72,.2,1)',
      reveal: 'cubic-bezier(.16,.8,.2,1)',
      transition: 'cubic-bezier(.22,.7,.18,1)',
      exit: 'cubic-bezier(.4,0,1,1)'
    })
  });

  function setState(element, state, detail = {}) {
    if (!element || !allowedStates.has(state)) return false;
    const previous = element.dataset.celestialState || '';
    if (previous === state) return true;

    element.dataset.celestialState = state;
    element.dispatchEvent(new CustomEvent('celestialstatechange', {
      bubbles: true,
      detail: {previous, state, ...detail}
    }));
    return true;
  }

  function setInteractive(element, component) {
    if (!element) return;
    element.dataset.celestialInteractive = 'true';
    if (component) element.dataset.celestialComponent = component;
    if (!element.dataset.celestialState) setState(element, 'dormant', {initial: true});
  }

  window.CelestialUI = Object.freeze({
    states: Object.freeze([...allowedStates]),
    motion,
    setState,
    setInteractive
  });

  document.documentElement.classList.add('celestial-ui-ready');
  document.dispatchEvent(new CustomEvent('celestialsystemready'));
})();
