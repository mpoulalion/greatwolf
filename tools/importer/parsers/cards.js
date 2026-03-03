/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://www.greatwolf.com/naples
 * Base Block: cards
 *
 * Handles three source patterns:
 * 1. offerings-gallery: Cards with overlay images, subtitle, title, CTA
 * 2. cards-row: Standard cards with image, title, description, CTA
 * 3. card-carousel: Deal cards with image, title, discount, description, CTA
 *
 * Block Structure (from markdown example):
 * - Each row: [image | text content (title, description, CTA)]
 *
 * Generated: 2026-03-03
 */
export default function parse(element, { document }) {
  const cells = [];

  // Pattern 1: Offerings Gallery
  // Found in captured DOM: <div class="offerings-gallery__gallery--card">
  const offeringCards = element.querySelectorAll('.offerings-gallery__gallery--card');
  if (offeringCards.length > 0) {
    offeringCards.forEach((card) => {
      const img = card.querySelector('.offerings-gallery__gallery--card-image');
      const subtitle = card.querySelector('.offerings-gallery__gallery--card-subtitle');
      const title = card.querySelector('.offerings-gallery__gallery--card-title');
      const ctaLink = card.querySelector('.offerings-gallery__gallery--button a');

      const imageCell = [];
      if (img) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src || img.getAttribute('src');
        imgEl.alt = img.alt || '';
        imageCell.push(imgEl);
      }

      const textCell = [];
      if (subtitle) {
        const strong = document.createElement('strong');
        strong.textContent = subtitle.textContent.trim();
        const p = document.createElement('p');
        p.append(strong);
        textCell.push(p);
      }
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      if (ctaLink) {
        const p = document.createElement('p');
        const em = document.createElement('em');
        const strong = document.createElement('strong');
        const a = document.createElement('a');
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        strong.append(a);
        em.append(strong);
        p.append(em);
        textCell.push(p);
      }

      cells.push([imageCell, textCell]);
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 2: Cards Row (Featured Offerings)
  // Found in captured DOM: <div class="cards-row__card"> inside desktop view
  const cardsRowItems = element.querySelectorAll('.cards-row__columns-desktop .cards-row__card');
  if (cardsRowItems.length > 0) {
    cardsRowItems.forEach((card) => {
      const img = card.querySelector('.cards-row__card--img');
      const title = card.querySelector('.cards-row__card--text');
      const description = card.querySelector('.cards-row__card--subtext');
      const ctaLink = card.querySelector('.cta-button a, .cards-row__cta-section a');

      const imageCell = [];
      if (img) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src || img.getAttribute('src');
        imgEl.alt = img.alt || '';
        imageCell.push(imgEl);
      }

      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        const p = document.createElement('p');
        p.append(strong);
        textCell.push(p);
      }
      if (description) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        textCell.push(p);
      }
      if (ctaLink) {
        const p = document.createElement('p');
        const em = document.createElement('em');
        const strong = document.createElement('strong');
        const a = document.createElement('a');
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        strong.append(a);
        em.append(strong);
        p.append(em);
        textCell.push(p);
      }

      cells.push([imageCell, textCell]);
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
    element.replaceWith(block);
    return;
  }

  // Pattern 3: Card Carousel (Deals)
  // Found in captured DOM: <div class="card-carousel__wrapper card-carousel__deals-wrapper">
  const carouselCards = element.querySelectorAll('.card-carousel__desktop .card-carousel__card');
  if (carouselCards.length > 0) {
    carouselCards.forEach((card) => {
      const img = card.querySelector('.card-carousel__img');
      const title = card.querySelector('.card-carousel__title');
      const subtitle = card.querySelector('.card-carousel__sub-title');
      const description = card.querySelector('.card-carousel__description');
      const ctaLink = card.querySelector('.card-carousel__desktop-link');

      const imageCell = [];
      if (img) {
        const imgEl = document.createElement('img');
        imgEl.src = img.src || img.getAttribute('src');
        imgEl.alt = img.alt || '';
        imageCell.push(imgEl);
      }

      const textCell = [];
      if (title) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        const p = document.createElement('p');
        p.append(strong);
        textCell.push(p);
      }
      if (subtitle) {
        const p = document.createElement('p');
        p.textContent = subtitle.textContent.trim();
        textCell.push(p);
      }
      if (description) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        textCell.push(p);
      }
      if (ctaLink) {
        const p = document.createElement('p');
        const em = document.createElement('em');
        const strong = document.createElement('strong');
        const a = document.createElement('a');
        a.href = ctaLink.href;
        a.textContent = ctaLink.textContent.trim();
        strong.append(a);
        em.append(strong);
        p.append(em);
        textCell.push(p);
      }

      cells.push([imageCell, textCell]);
    });

    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
    element.replaceWith(block);
    return;
  }

  // Fallback: generic card pattern
  const genericCards = element.querySelectorAll('[class*="card"]');
  if (genericCards.length > 0) {
    genericCards.forEach((card) => {
      const img = card.querySelector('img');
      const textContent = card.querySelector('h2, h3, [class*="title"]');
      const imageCell = img ? [img] : [];
      const textCell = textContent ? [textContent] : [];
      if (imageCell.length || textCell.length) {
        cells.push([imageCell, textCell]);
      }
    });
  }

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });
    element.replaceWith(block);
  }
}
