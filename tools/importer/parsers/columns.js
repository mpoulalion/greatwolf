/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block (amenities grid)
 *
 * Source: https://www.greatwolf.com/naples
 * Base Block: columns
 *
 * Source HTML Pattern:
 * <div class="amenities">
 *   <div class="amenities__container">
 *     <div class="amenities__blocks">
 *       <a class="amenities__block" href="...">
 *         <div class="amenities__img"><img/></div>
 *         <div class="amenities__content">
 *           <p class="amenities__content--name">Name</p>
 *           <p class="amenities__content--title">Description</p>
 *         </div>
 *       </a>
 *       ... (6 blocks total)
 *     </div>
 *   </div>
 * </div>
 *
 * Block Structure (from markdown example):
 * - Row N: [col1 | col2 | col3] each with icon, linked name, description
 *
 * Generated: 2026-03-03
 */
export default function parse(element, { document }) {
  // Extract amenity blocks
  // Found in captured DOM: <a class="amenities__block">
  const amenityBlocks = Array.from(element.querySelectorAll('.amenities__block, a[class*="amenities__block"]'));

  if (amenityBlocks.length === 0) {
    return;
  }

  // Group into rows of 3 columns
  const cells = [];
  const colsPerRow = 3;

  for (let i = 0; i < amenityBlocks.length; i += colsPerRow) {
    const rowItems = amenityBlocks.slice(i, i + colsPerRow);
    const row = rowItems.map((block) => {
      const cell = [];

      // Icon image
      // Found in captured DOM: <div class="amenities__img"><img>
      const img = block.querySelector('.amenities__img img, img');
      if (img) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src || img.getAttribute('src');
        imgEl.alt = img.alt || '';
        const p = document.createElement('p');
        p.append(imgEl);
        cell.push(p);
      }

      // Linked name
      // Found in captured DOM: <p class="amenities__content--name">
      const name = block.querySelector('.amenities__content--name');
      if (name) {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        const a = document.createElement('a');
        a.href = block.href || '#';
        a.textContent = name.textContent.trim();
        strong.append(a);
        p.append(strong);
        cell.push(p);
      }

      // Description
      // Found in captured DOM: <p class="amenities__content--title">
      const desc = block.querySelector('.amenities__content--title');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        cell.push(p);
      }

      return cell;
    });

    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });
  element.replaceWith(block);
}
