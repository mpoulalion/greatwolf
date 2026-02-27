/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (amenities grid)
 *
 * Source: https://www.greatwolf.com/naples
 * Base Block: columns
 *
 * Block Structure (from markdown example):
 * - Row per group of 3: [icon+name+desc] | [icon+name+desc] | [icon+name+desc]
 *
 * Source HTML Pattern:
 * <div class="amenities__container">
 *   <div class="amenities__blocks">
 *     <a class="amenities__block" href="...">
 *       <div class="amenities__img"><img src="..." /></div>
 *       <div class="amenities__content">
 *         <p class="amenities__content--name">Water Park</p>
 *         <p class="amenities__content--title">Access to water park...</p>
 *       </div>
 *     </a>
 *     ...
 *   </div>
 * </div>
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  // Extract all amenity blocks
  // VALIDATED: Found a.amenities__block in captured DOM lines ~1150-1203
  const amenityBlocks = Array.from(
    element.querySelectorAll('.amenities__block')
      || element.querySelectorAll('[class*="amenity"]'),
  );

  const cells = [];
  const columnsPerRow = 3;

  // Group amenities into rows of 3
  for (let i = 0; i < amenityBlocks.length; i += columnsPerRow) {
    const row = [];
    for (let j = i; j < Math.min(i + columnsPerRow, amenityBlocks.length); j += 1) {
      const amenity = amenityBlocks[j];

      // Extract icon image
      // VALIDATED: Found img inside .amenities__img in captured DOM
      const img = amenity.querySelector('.amenities__img img')
        || amenity.querySelector('img');

      // Extract name
      // VALIDATED: Found .amenities__content--name in captured DOM
      const name = amenity.querySelector('.amenities__content--name')
        || amenity.querySelector('[class*="name"]');

      // Extract description
      // VALIDATED: Found .amenities__content--title in captured DOM
      const desc = amenity.querySelector('.amenities__content--title')
        || amenity.querySelector('[class*="title"]');

      // Build column cell
      const cell = [];
      if (img) {
        const p = document.createElement('p');
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt || '';
        p.appendChild(newImg);
        cell.push(p);
      }
      if (name) {
        const p = document.createElement('p');
        if (amenity.href) {
          const strong = document.createElement('strong');
          const link = document.createElement('a');
          link.href = amenity.href;
          link.textContent = name.textContent.trim();
          strong.appendChild(link);
          p.appendChild(strong);
        } else {
          const strong = document.createElement('strong');
          strong.textContent = name.textContent.trim();
          p.appendChild(strong);
        }
        cell.push(p);
      }
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        cell.push(p);
      }

      row.push(cell);
    }

    cells.push(row);
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
    element.replaceWith(block);
  }
}
