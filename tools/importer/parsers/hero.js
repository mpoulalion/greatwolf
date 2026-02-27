/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://www.greatwolf.com/naples
 * Base Block: hero
 *
 * Block Structure (from markdown example):
 * - Row 1: Background image
 * - Row 2: Heading, subheading, CTA
 *
 * Source HTML Pattern:
 * <div class="hero-freeform-banner">
 *   <div class="hero-freeform-banner__image-wrapper">
 *     <img class="hero-freeform-banner__image" src="..." />
 *   </div>
 *   <div class="hero-freeform-banner__content">
 *     <span class="h1">SUITES STARTING AT $31/Person</span>
 *     <span class="h7-2024">3/1 Sale</span>
 *     <a class="button" href="...">Apply Offer</a>
 *   </div>
 * </div>
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  // Extract background image
  // VALIDATED: Found img.hero-freeform-banner__image in captured DOM line ~571
  const bgImage = element.querySelector('.hero-freeform-banner__image')
    || element.querySelector('img[class*="hero"]')
    || element.querySelector('img');

  // Extract heading
  // VALIDATED: Found span.h1 containing heading text in captured DOM line ~572
  const heading = element.querySelector('.h1')
    || element.querySelector('h1')
    || element.querySelector('[class*="title"]');

  // Extract subheading
  // VALIDATED: Found span.h7-2024 containing "3/1 Sale" in captured DOM line ~572
  const subheading = element.querySelector('.h7-2024')
    || element.querySelector('.h3')
    || element.querySelector('[class*="subtitle"]');

  // Extract CTA link
  // VALIDATED: Found a.button with "Apply Offer" text in captured DOM
  const cta = element.querySelector('a.button')
    || element.querySelector('a[class*="cta"]')
    || element.querySelector('.cta-button a');

  // Build cells matching Hero block structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content (heading, subheading, CTA combined)
  const contentCell = [];
  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    contentCell.push(h1);
  }
  if (subheading) {
    const h3 = document.createElement('h3');
    h3.textContent = subheading.textContent.trim();
    contentCell.push(h3);
  }
  if (cta) {
    const p = document.createElement('p');
    const link = document.createElement('a');
    link.href = cta.href;
    link.textContent = cta.textContent.trim();
    p.appendChild(link);
    contentCell.push(p);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
