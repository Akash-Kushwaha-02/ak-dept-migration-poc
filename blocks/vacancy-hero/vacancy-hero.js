/**
 * Vacancy Hero block
 *
 * The HTML structure is authored in templates/vacancy.html (with Mustache vars).
 * This script only handles the one thing impossible at server-render time:
 * building share URLs from the live page URL via window.location.
 */

const SHARE_BASES = {
  facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
  twitter: 'https://twitter.com/intent/tweet?url=',
  linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url=',
};

/**
 * Sets the share-link hrefs using the live page URL.
 * All HTML is authored in templates/vacancy.html – no DOM construction here.
 * @param {Element} block
 */
export default function decorate(block) {
  const pageUrl = encodeURIComponent(window.location.href);
  block.querySelectorAll('[data-share]').forEach((link) => {
    const base = SHARE_BASES[link.dataset.share];
    if (base) link.href = base + pageUrl;
  });
}
