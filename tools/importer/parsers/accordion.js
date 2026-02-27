/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block (FAQ)
 *
 * Source: https://www.greatwolf.com/naples
 * Base Block: accordion
 *
 * Block Structure (from markdown example):
 * - Each row: [question cell] | [answer cell]
 *
 * Source HTML Pattern:
 * <div class="faq-one-page-new-design">
 *   <div class="faq-one-page-new-design__section">
 *     <div class="faq-one-page-new-design__title">
 *       <span class="faq-question">Question text?</span>
 *     </div>
 *     <div class="faq_answer_inactive">
 *       <div class="faq-one-page-new-design__answer">Answer text</div>
 *     </div>
 *   </div>
 *   ...
 * </div>
 *
 * Generated: 2026-02-27
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract FAQ items
  // VALIDATED: Found .faq-one-page-new-design__section in captured DOM line ~2620+
  const faqItems = element.querySelectorAll('.faq-one-page-new-design__section');

  faqItems.forEach((item) => {
    // Extract question
    // VALIDATED: Found .faq-question span in captured DOM
    const questionEl = item.querySelector('.faq-question')
      || item.querySelector('.faq-one-page-new-design__title')
      || item.querySelector('[class*="question"]');

    // Extract answer
    // VALIDATED: Found .faq-one-page-new-design__answer in captured DOM
    const answerEl = item.querySelector('.faq-one-page-new-design__answer')
      || item.querySelector('[class*="answer"]');

    if (questionEl && answerEl) {
      // Build question cell - preserve as text
      const questionText = questionEl.textContent.trim();

      // Build answer cell - preserve links and formatting
      const answerDiv = document.createElement('div');

      // Clone answer content to preserve links
      const answerChildren = answerEl.querySelectorAll('p, a, span, div');
      if (answerChildren.length > 0) {
        answerChildren.forEach((child) => {
          if (child.tagName === 'A') {
            const p = document.createElement('p');
            const link = document.createElement('a');
            link.href = child.href;
            link.textContent = child.textContent.trim();
            p.appendChild(link);
            answerDiv.appendChild(p);
          } else if (child.textContent.trim()) {
            const p = document.createElement('p');
            // Check for links inside the element
            const links = child.querySelectorAll('a');
            if (links.length > 0) {
              p.innerHTML = child.innerHTML;
            } else {
              p.textContent = child.textContent.trim();
            }
            answerDiv.appendChild(p);
          }
        });
      } else {
        const p = document.createElement('p');
        p.textContent = answerEl.textContent.trim();
        answerDiv.appendChild(p);
      }

      cells.push([[questionText], [answerDiv]]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });
    element.replaceWith(block);
  }
}
