/**
 * Vacancy Hero block - runtime share URL updater.
 * AEM backend strips data-share attributes; identify links by href pattern.
 * @param {Element} block
 */
export default function decorate(block) {
  const pageUrl = encodeURIComponent(window.location.href);

  const facebook = block.querySelector('a[href*="facebook.com/sharer"]');
  const twitter = block.querySelector('a[href*="twitter.com/intent/tweet"]');
  const linkedin = block.querySelector('a[href*="linkedin.com/shareArticle"]');

  if (facebook) facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
  if (twitter) twitter.href = `https://twitter.com/intent/tweet?url=${pageUrl}`;
  if (linkedin) linkedin.href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}`;
}
