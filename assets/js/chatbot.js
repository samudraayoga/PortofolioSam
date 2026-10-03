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
  function selectImage(button) {
    const data = button.dataset;
    const src = `${imageBase}/${data.image}.png`;
    image.alt = data.alt;
    image.width = Number(data.width);
    image.height = Number(data.height);
    image.src = src;
    title.textContent = data.title;
    caption.textContent = data.caption;
    fullSize.href = src;
    buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
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
