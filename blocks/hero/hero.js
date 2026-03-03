function buildCountdown(targetDate) {
  const container = document.createElement('div');
  container.className = 'hero-countdown';

  const units = ['Days', 'Hours', 'Min', 'Sec'];

  units.forEach((unit, i) => {
    if (i > 0) {
      const sep = document.createElement('span');
      sep.className = 'countdown-separator';
      sep.textContent = ':';
      container.append(sep);
    }

    const unitEl = document.createElement('div');
    unitEl.className = 'countdown-unit';

    const number = document.createElement('span');
    number.className = 'countdown-number';
    number.dataset.unit = unit.toLowerCase();
    number.textContent = '00';

    const label = document.createElement('span');
    label.className = 'countdown-label';
    label.textContent = unit;

    unitEl.append(number, label);
    container.append(unitEl);
  });

  function update() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      container.remove();
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    container.querySelector('[data-unit="days"]').textContent = String(days).padStart(2, '0');
    container.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2, '0');
    container.querySelector('[data-unit="min"]').textContent = String(mins).padStart(2, '0');
    container.querySelector('[data-unit="sec"]').textContent = String(secs).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);

  return container;
}

export default function decorate(block) {
  const rows = [...block.children];
  const hasImage = rows[0]?.querySelector('picture');

  if (!hasImage) {
    block.classList.add('no-image');
    return;
  }

  // First row is the image, second row is content
  const imageRow = rows[0];
  const contentRow = rows[1];

  // Create image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'hero-image';
  const picture = imageRow.querySelector('picture');
  if (picture) imageContainer.append(picture);

  // Create content container
  const contentContainer = document.createElement('div');
  contentContainer.className = 'hero-content';
  if (contentRow) {
    const inner = contentRow.querySelector(':scope > div');
    if (inner) contentContainer.append(...inner.childNodes);
  }

  // Extract countdown target date from block variant class (e.g. "countdown-20260305")
  let countdownDate = null;
  [...block.classList].forEach((cls) => {
    const match = cls.match(/^countdown-(\d{4})(\d{2})(\d{2})$/);
    if (match) {
      countdownDate = new Date(`${match[1]}-${match[2]}-${match[3]}T23:59:59`);
    }
  });

  // Replace block content
  block.textContent = '';
  block.append(imageContainer, contentContainer);

  // Build countdown if a valid future date was found
  if (countdownDate && countdownDate > new Date()) {
    contentContainer.append(buildCountdown(countdownDate));
  }
}
