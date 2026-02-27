/**
 * Metadata Block
 * Reads metadata from the block and applies it to the document head.
 * The block is hidden after processing.
 */
export default function decorate(block) {
  const meta = {};
  [...block.children].forEach((row) => {
    if (row.children.length >= 2) {
      const key = row.children[0].textContent.trim().toLowerCase();
      const value = row.children[1].textContent.trim();
      if (key && value) {
        meta[key] = value;
      }
    }
  });

  // Apply metadata to document head
  Object.entries(meta).forEach(([key, value]) => {
    if (key === 'title') {
      document.title = value;
    } else if (key === 'description') {
      let metaTag = document.querySelector('meta[name="description"]');
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'description');
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', value);
    } else if (key.startsWith('og:')) {
      let metaTag = document.querySelector(`meta[property="${key}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', key);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', value);
    } else {
      let metaTag = document.querySelector(`meta[name="${key}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', key);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', value);
    }
  });

  // Hide the metadata block
  block.closest('.metadata-container')?.classList.add('hidden');
}
