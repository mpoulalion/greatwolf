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

  // Replace block content
  block.textContent = '';
  block.append(imageContainer, contentContainer);
}
