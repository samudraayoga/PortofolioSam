(() => {
  'use strict';
  const controls = document.querySelector('.case-gallery-controls');
  const image = document.querySelector('#gallery-image');
  const title = document.querySelector('#gallery-title');
  const caption = document.querySelector('#gallery-caption');
  const fullSize = document.querySelector('#gallery-full');
  if (!controls || !image || !title || !caption || !fullSize) return;
  const imageBase = controls.dataset.galleryBase || 'assets/chatbot';
  const buttons = [...controls.querySelectorAll('[data-image]')];
  let activeIndex = 0;
  let request = 0;
  function selectImage(button) {
    const data = button.dataset;
    const src = `${imageBase}/${data.image}.png`;
    const nextIndex = buttons.indexOf(button);
    if (nextIndex === activeIndex && image.src.endsWith(src)) return;
    const direction = nextIndex >= activeIndex ? 1 : -1;
    const currentRequest = ++request;
    const preload = new Image();
    preload.onload = () => {
      if (currentRequest !== request) return;
      image.style.setProperty('--gallery-exit', `${direction * -16}px`);
      image.classList.add('gallery-exit');
      const change = () => {
        if (currentRequest !== request) return;
        image.alt = data.alt;
        image.width = Number(data.width);
        image.height = Number(data.height);
        image.src = src;
        image.style.setProperty('--gallery-enter', `${direction * 16}px`);
        image.classList.remove('gallery-exit', 'gallery-enter');
        void image.offsetWidth;
        image.classList.add('gallery-enter');
        title.textContent = data.title;
        caption.textContent = data.caption;
        fullSize.href = src;
        activeIndex = nextIndex;
        buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      };
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) change();
      else setTimeout(change, 160);
    };
    preload.src = src;
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => selectImage(button));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        selectImage(buttons[next]);
        buttons[next].focus();
      }
    });
  });
  controls.hidden = false;
})();
