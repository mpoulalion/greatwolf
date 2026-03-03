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
 * - Row 2: Content (heading, subheading, CTA)
 *
 * Source HTML Pattern:
 * <div class="hero-freeform-banner">
 *   <div class="hero-freeform-banner__wrapper">
 *     <div class="hero-freeform-banner__background-image">
 *       <picture>/<video>
 *     </div>
 *     <div class="hero-freeform-banner__text-section">
 *       <h1/h2> heading
 *       <h3> subheading
 *       <a> CTA button
 *     </div>
 *   </div>
 * </div>
 *
 * Generated: 2026-03-03
 */
export default function parse(element, { document }) {
  // Extract background image or video poster
  // Found in captured DOM: <picture class="hero-freeform-banner__video-fallback">
  // and <video class="video-roll hero-freeform-banner__video-element">
  const video = element.querySelector('.hero-freeform-banner__video-element');
  const picture = element.querySelector('.hero-freeform-banner__video-fallback img') ||
                  element.querySelector('.hero-freeform-banner__background-image img') ||
                  element.querySelector('picture img');

  // Extract heading text
  // Found in captured DOM: <h1> or <h2> inside text-section-inner
  const heading = element.querySelector('.hero-freeform-banner__text-section h1') ||
                  element.querySelector('.hero-freeform-banner__text-section h2') ||
                  element.querySelector('h1, h2');

  // Extract subheading
  // Found in captured DOM: <h3> inside text-section-inner
  const subheading = element.querySelector('.hero-freeform-banner__text-section h3') ||
                     element.querySelector('h3');

  // Extract CTA button
  // Found in captured DOM: <a class="button"> inside cta-button wrapper
  const cta = element.querySelector('.hero-freeform-banner__text-section a.button') ||
              element.querySelector('.cta-button a') ||
              element.querySelector('a.button');

  // Build cells array
  const cells = [];

  // Row 1: Background image
  if (picture) {
    const img = document.createElement('img');
    img.src = picture.src || picture.getAttribute('src');
    img.alt = picture.alt || '';
    cells.push([img]);
  } else if (video) {
    const poster = video.getAttribute('poster');
    if (poster) {
      const img = document.createElement('img');
      img.src = poster;
      img.alt = 'Hero background';
      cells.push([img]);
    }
  }

  // Row 2: Content (heading + subheading + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });
  element.replaceWith(block);
}
