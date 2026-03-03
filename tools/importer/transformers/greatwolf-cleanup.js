/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Great Wolf Lodge website cleanup
 * Purpose: Remove non-content elements and fix DOM issues
 * Applies to: www.greatwolf.com (all templates)
 * Generated: 2026-03-03
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration of https://www.greatwolf.com/naples
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner
    // Found in captured DOM: <div id="onetrust-consent-sdk">
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.otFlat',
    ]);

    // Remove promo bar
    // Found in captured DOM: <div class="promo-bar aem-GridColumn">
    WebImporter.DOMUtils.remove(element, ['.promo-bar']);

    // Remove header/navigation (handled separately by navigation skill)
    // Found in captured DOM: <div class="header-container">
    WebImporter.DOMUtils.remove(element, [
      '.header-container',
      '.experiencefragment',
    ]);

    // Remove skip-content link
    // Found in captured DOM: <a class="skip-content">
    WebImporter.DOMUtils.remove(element, ['.skip-content']);

    // Remove sign-in/voyagers overlay modals
    // Found in captured DOM: <div class="sign-in-voyagers-container">
    WebImporter.DOMUtils.remove(element, [
      '.sign-in-voyagers-container',
      '.sign-in-container',
    ]);

    // Remove slick carousel cloned slides (duplicates content)
    // Found in captured DOM: <div class="slick-cloned">
    WebImporter.DOMUtils.remove(element, ['.slick-cloned']);

    // Remove scroll buttons from cards-row
    // Found in captured DOM: <button class="cards-row__scroll">
    WebImporter.DOMUtils.remove(element, ['.cards-row__scroll']);

    // Re-enable scrolling if disabled by overlays
    if (element.style && element.style.overflow === 'hidden') {
      element.setAttribute('style', 'overflow: scroll;');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Remove tracking and event attributes
    const allElements = element.querySelectorAll('*');
    allElements.forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-aos');
      el.removeAttribute('data-aos-easing');
      el.removeAttribute('data-aos-duration');
      el.removeAttribute('data-aos-delay');
      el.removeAttribute('data-slick-index');
    });

    // Remove footer (handled by footer skill)
    // Found in captured DOM: <footer> and <div class="footer-container">
    WebImporter.DOMUtils.remove(element, [
      'footer',
      '.footer-container',
      '.footer',
    ]);
  }
}
