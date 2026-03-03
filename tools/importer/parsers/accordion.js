/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion block (FAQ section)
 *
 * Source: https://www.greatwolf.com/naples
 * Base Block: accordion
 *
 * Source HTML Pattern:
 * <div class="faq-one-page">
 *   <div class="faq-one-page-new-design__accordion-wrapper accordion-wrapper">
 *     <div class="faq-one-page-new-design__card faq-card" id="FAQ-item-N">
 *       <div class="faq-one-page-new-design__card--question faq_question">
 *         <span class="faq-question">Question text</span>
 *       </div>
 *       <div class="faq-one-page-new-design__card--answer card-answer">
 *         <p>Answer text</p>
 *       </div>
 *     </div>
 *   </div>
 * </div>
 *
 * Block Structure (from markdown example):
 * - Each row: [question | answer]
 *
 * Generated: 2026-03-03
 */
export default function parse(element, { document }) {
  const cells = [];

  // Extract FAQ items
  // Found in captured DOM: <div class="faq-one-page-new-design__card faq-card">
  const faqItems = element.querySelectorAll('.faq-card, .faq-one-page-new-design__card, [id^="FAQ-item"]');

  faqItems.forEach((item) => {
    // Question
    // Found in captured DOM: <span class="faq-question">
    const questionEl = item.querySelector('.faq-question') ||
                       item.querySelector('.faq-one-page-new-design__question_text span') ||
                       item.querySelector('.faq_question');
    const questionText = questionEl ? questionEl.textContent.trim() : '';

    // Answer
    // Found in captured DOM: <div class="faq-one-page-new-design__card--answer card-answer">
    const answerEl = item.querySelector('.card-answer, .faq-answer, .faq_answer');
    
    if (questionText && answerEl) {
      // Build answer content preserving links
      const answerContent = [];
      const answerParagraphs = answerEl.querySelectorAll('p');
      if (answerParagraphs.length > 0) {
        answerParagraphs.forEach((p) => {
          const newP = document.createElement('p');
          newP.innerHTML = p.innerHTML;
          answerContent.push(newP);
        });
      } else {
        const p = document.createElement('p');
        p.textContent = answerEl.textContent.trim();
        answerContent.push(p);
      }

      cells.push([questionText, answerContent]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'Accordion', cells });
    element.replaceWith(block);
  }
}
