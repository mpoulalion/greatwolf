/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://www.greatwolf.com/naples
 * Base Block: cards
 *
 * Block Structure (from markdown example):
 * - Each row: [image cell] | [title + description + CTA cell]
 *
 * Handles three source patterns:
 * 1. offerings-gallery__gallery--card (Water Park, Play, Events, Dining, Suites)
 * 2. cards-row__card (Featured Offerings)
 * 3. card-carousel__slide (Year-Round Deals)
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Offerings Gallery cards
  // VALIDATED: Found .offerings-gallery__gallery--card in captured DOM line ~985
  let cardElements = element.querySelectorAll('.offerings-gallery__gallery--card');

  // Pattern 2: Cards Row (Featured Offerings)
  // VALIDATED: Found .cards-row__card in captured DOM line ~1280
  if (cardElements.length === 0) {
    cardElements = element.querySelectorAll('.cards-row__card');
  }

  // Pattern 3: Card Carousel (Deals)
  // VALIDATED: Found .card-carousel__slide in captured DOM line ~1720
  if (cardElements.length === 0) {
    cardElements = element.querySelectorAll('.card-carousel__slide:not(.slick-cloned)');
  }

  // Fallback: direct children
  if (cardElements.length === 0) {
    cardElements = element.querySelectorAll(':scope > div');
  }

  cardElements.forEach((card) => {
    // Extract image
    const img = card.querySelector('img[class*="card-image"], img[class*="card--img"], img[class*="main-image"]')
      || card.querySelector('img');

    // Extract title
    const title = card.querySelector('.offerings-gallery__gallery--card-title')
      || card.querySelector('.cards-row__card--text-title')
      || card.querySelector('.card-carousel__title')
      || card.querySelector('h2, h3, [class*="title"]');

    // Extract subtitle/description
    const subtitle = card.querySelector('.offerings-gallery__gallery--card-subtitle')
      || card.querySelector('.cards-row__card--text-body')
      || card.querySelector('.card-carousel__sub-title')
      || card.querySelector('[class*="subtitle"], [class*="description"]');

    // Extract body/description for deals cards
    const body = card.querySelector('.card-carousel__box-description p')
      || card.querySelector('[class*="body"] p');

    // Extract CTA
    const cta = card.querySelector('.hide-for-small-only')
      ? card.querySelector('a.button')
      : (card.querySelector('a.button') || card.querySelector('a[class*="cta"]'));

    // Build image cell
    const imageCell = [];
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt || '';
      imageCell.push(newImg);
    }

    // Build content cell
    const contentCell = [];
    if (subtitle) {
      const strong = document.createElement('strong');
      strong.textContent = subtitle.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(strong);
      contentCell.push(p);
    }
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      contentCell.push(h3);
    }
    if (body) {
      const p = document.createElement('p');
      p.textContent = body.textContent.trim();
      contentCell.push(p);
    }
    if (cta) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.href = cta.href;
      // Use the visible desktop text
      const visibleText = cta.querySelector('.hide-for-small-only');
      link.textContent = visibleText ? visibleText.textContent.trim() : cta.textContent.trim();
      p.appendChild(link);
      contentCell.push(p);
    }

    if (imageCell.length > 0 || contentCell.length > 0) {
      cells.push([imageCell, contentCell]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
    element.replaceWith(block);
  }
}
