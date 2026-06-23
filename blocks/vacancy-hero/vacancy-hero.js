/**
 * Vacancy Hero block
 * Decorates the hero section to match DEPT® reference design.
 * Adds H1 from page title, SVG share icons, and scroll-down footer row.
 * @param {Element} block
 */

/* eslint-disable max-len */
const SVG = {
  facebook: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M5.688 15.667 5.667 9H3V6.333h2.667V4.667C5.667 2.192 7.199 1 9.407 1c1.056 0 1.965.079 2.23.114V3.7h-1.531c-1.2 0-1.433.57-1.433 1.408v1.225h3.494L10.833 9h-2.16v6.667H5.688z" fill="currentColor"/></svg>',
  twitter: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 3.533c-.6.267-1.2.467-1.867.534a3.55 3.55 0 0 0 1.467-1.8c-.667.4-1.333.666-2.067.8A3.227 3.227 0 0 0 11.133 2a3.272 3.272 0 0 0-3.266 3.267c0 .266 0 .533.066.733a9.205 9.205 0 0 1-6.8-3.467A3.01 3.01 0 0 0 .667 4.2c0 1.133.6 2.133 1.466 2.733-.533 0-1.066-.133-1.466-.4V6.6c0 1.6 1.133 2.933 2.6 3.2-.267.067-.534.133-.867.133-.2 0-.4 0-.6-.066a3.16 3.16 0 0 0 3.067 2.266c-1.134.867-2.534 1.4-4.067 1.4-.267 0-.533 0-.8-.066a9.332 9.332 0 0 0 5 1.466c6.067 0 9.333-5 9.333-9.333v-.4C15 4.733 15.533 4.133 16 3.533z" fill="currentColor"/></svg>',
  linkedin: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M13.633 13.634H11.26V9.92c0-.883-.016-2.018-1.23-2.018-1.232 0-1.42.962-1.42 1.955v3.777H6.238V6H8.52v1.04h.031c.316-.6 1.089-1.23 2.242-1.23 2.398 0 2.84 1.578 2.84 3.63v4.194zM3.559 4.957a1.374 1.374 0 1 1 0-2.748 1.374 1.374 0 0 1 0 2.748zM4.749 13.634H2.367V6h2.382v7.634zM14.82 0H1.176C.527 0 0 .515 0 1.15v13.7C0 15.485.527 16 1.176 16h13.643C15.47 16 16 15.485 16 14.85V1.15C16 .515 15.47 0 14.82 0z" fill="currentColor"/></svg>',
  scrollDown: '<svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="20.5" cy="20.5" r="20" stroke="currentColor" stroke-width="1"/><path d="m11.172 19.652 9.326 10.174 9.326-10.174M20.498 11.174v18.652" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
/* eslint-enable max-len */

export default function decorate(block) {
  const pageUrl = encodeURIComponent(window.location.href);

  // Extract clean job title from document.title: strip trailing " - DEPT®" suffix
  const pageTitle = document.title
    .replace(/\s*[-–—]\s*DEPT[®]?\s*$/i, '')
    .replace(/\s*[-–—]\s*$/, '')
    .trim();

  const rows = block.querySelectorAll(':scope > div');
  const mainRow = rows[0];
  if (!mainRow) return;

  const leftCell = mainRow.querySelector(':scope > div:first-child');
  const rightCell = mainRow.querySelector(':scope > div:last-child');

  // ── Mark cells ────────────────────────────────────────────────
  mainRow.classList.add('vacancy-hero-main-row');
  if (leftCell) leftCell.classList.add('vacancy-hero-content');
  if (rightCell) {
    rightCell.classList.add('vacancy-hero-images');
    // EDS wraps blank lines between images in empty <p> tags — remove them
    rightCell.querySelectorAll(':scope > p').forEach((p) => {
      if (!p.querySelector('picture, img')) p.remove();
    });
  }

  // ── 1. Insert H1 job title ───────────────────────────────────
  if (leftCell && pageTitle && !leftCell.querySelector('h1')) {
    const h1 = document.createElement('h1');
    h1.textContent = pageTitle;
    // Insert after the first <p> (overline), before share links
    const firstP = leftCell.querySelector('p');
    if (firstP && firstP.nextSibling) {
      leftCell.insertBefore(h1, firstP.nextSibling);
    } else if (firstP) {
      firstP.after(h1);
    } else {
      leftCell.prepend(h1);
    }
  }

  // ── 2. Inject SVG icons into share links ─────────────────────
  if (leftCell) {
    const allLinks = leftCell.querySelectorAll('p a');
    const icons = [SVG.facebook, SVG.twitter, SVG.linkedin];
    const labels = ['Share on Facebook', 'Share on X', 'Share on LinkedIn'];
    const buildHref = [
      () => `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`,
      () => `https://twitter.com/intent/tweet?url=${pageUrl}`,
      () => `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}`,
    ];

    allLinks.forEach((link, i) => {
      if (i < 3) {
        link.innerHTML = icons[i];
        link.href = buildHref[i]();
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('aria-label', labels[i]);
      }
    });

    // Also update pre-built share links if they have correct href patterns
    const fbLink = leftCell.querySelector('a[href*="facebook.com/sharer"]');
    const twLink = leftCell.querySelector('a[href*="twitter.com/intent/tweet"]');
    const liLink = leftCell.querySelector('a[href*="linkedin.com/shareArticle"]');
    if (fbLink) fbLink.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
    if (twLink) twLink.href = `https://twitter.com/intent/tweet?url=${pageUrl}`;
    if (liLink) liLink.href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}`;
  }

  // ── 3. Decorate footer row (scroll down + roles open in) ───────
  const scrollAnchor = document.getElementById('vacancy-description-container')
    ? 'vacancy-description-container'
    : 'vacancy-description-section';

  if (rows.length < 2) {
    // No footer row authored — create one with just the scroll link
    const footer = document.createElement('div');
    footer.classList.add('vacancy-hero-footer');
    footer.innerHTML = `
      <div class="vacancy-hero-footer-scroll">
        <a class="vacancy-hero-scroll-link" href="#${scrollAnchor}">
          <span class="vacancy-hero-scroll-label">Scroll down</span>
          ${SVG.scrollDown}
        </a>
      </div>
    `;
    block.appendChild(footer);
  } else {
    // Footer row exists in template — decorate its cells
    const footer = rows[1];
    footer.classList.add('vacancy-hero-footer');

    const scrollCell = footer.querySelector(':scope > div:first-child');
    if (scrollCell) {
      scrollCell.classList.add('vacancy-hero-footer-scroll');
      const link = scrollCell.querySelector('a');
      if (link) {
        link.classList.add('vacancy-hero-scroll-link');
        link.setAttribute('href', `#${scrollAnchor}`);
        link.innerHTML = `<span class="vacancy-hero-scroll-label">Scroll down</span>${SVG.scrollDown}`;
      }
    }

    const rolesCell = footer.querySelector(':scope > div:last-child');
    if (rolesCell) rolesCell.classList.add('vacancy-hero-footer-roles');
  }
}
