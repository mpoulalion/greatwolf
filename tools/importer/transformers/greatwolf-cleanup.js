/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Great Wolf Lodge website cleanup
 * Purpose: Remove non-content elements and fix HTML issues
 * Applies to: www.greatwolf.com (all templates)
 * Tested: /naples
 * Generated: 2026-02-27
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page migration
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner
    // EXTRACTED: Found <div class="cookie-policy-container"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.cookie-policy-container',
      '.cookie-policy',
    ]);

    // Remove booking engine (interactive widget, not authorable content)
    // EXTRACTED: Found <div class="booking-engine"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.booking-engine',
      '.booking-widget',
    ]);

    // Remove countdown timer (dynamic, not authorable)
    // EXTRACTED: Found <div class="countdown-clock"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.countdown-clock',
      '.countdown-timer',
    ]);

    // Remove slick carousel cloned slides (duplicates)
    // EXTRACTED: Found <div class="slick-cloned"> in captured DOM card carousels
    WebImporter.DOMUtils.remove(element, [
      '.slick-cloned',
      '.slick-arrow',
      'button.slick-prev',
      'button.slick-next',
    ]);

    // Remove mobile-only show/hide spans that duplicate content
    // EXTRACTED: Found <span class="show-for-small-only"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.show-for-small-only',
    ]);

    // Remove block separators (decorative, not content)
    // EXTRACTED: Found <div class="block-separator"> with <hr> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.block-separator',
    ]);

    // Re-enable scrolling if body has overflow hidden
    // EXTRACTED: Captured DOM showed potential overflow:hidden on body
    if (element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining unwanted HTML elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Clean up tracking attributes
    // EXTRACTED: Found data-cmp-* attributes throughout captured DOM
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      // Remove AEM component tracking attributes
      const attrs = Array.from(el.attributes || []);
      attrs.forEach((attr) => {
        if (attr.name.startsWith('data-cmp-')
          || attr.name.startsWith('data-sly-')
          || attr.name === 'data-asset-id') {
          el.removeAttribute(attr.name);
        }
      });
    });
  }
}
