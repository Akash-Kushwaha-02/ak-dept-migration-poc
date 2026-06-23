import {
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

/**
 * Moves all the attributes from a given elmenet to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveAttributes(from, to, attributes) {
  if (!attributes) {
    // eslint-disable-next-line no-param-reassign
    attributes = [...from.attributes].map(({ nodeName }) => nodeName);
  }
  attributes.forEach((attr) => {
    const value = from.getAttribute(attr);
    if (value) {
      to?.setAttribute(attr, value);
      from.removeAttribute(attr);
    }
  });
}

/**
 * Move instrumentation attributes from a given element to another given element.
 * @param {Element} from the element to copy attributes from
 * @param {Element} to the element to copy attributes to
 */
export function moveInstrumentation(from, to) {
  moveAttributes(
    from,
    to,
    [...from.attributes]
      .map(({ nodeName }) => nodeName)
      .filter((attr) => attr.startsWith('data-aue-') || attr.startsWith('data-richtext-')),
  );
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks() {
  try {
    // TODO: add auto block, if needed
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
export function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
}

/**
 * On vacancy pages (/vacancy/*), transform the default-content-wrapper sections
 * that were not converted to blocks into proper vacancy-meta and vacancy-description
 * structures matching the expected block DOM.
 * @param {Element} main
 */
function decorateVacancySections(main) {
  if (!window.location.pathname.startsWith('/vacancy/')) return;

  const sections = main.querySelectorAll('.section:not(.vacancy-hero-container):not(.culture-teaser-container)');
  const defaultSections = [...sections].filter((s) => s.querySelector('.default-content-wrapper'));

  defaultSections.forEach((section) => {
    const wrapper = section.querySelector('.default-content-wrapper');
    if (!wrapper) return;

    const paragraphs = wrapper.querySelectorAll('p');
    const firstParagraph = paragraphs[0];

    // ── Description section: has an "Apply" link + HTML content ──────────────
    const hasApplyLink = firstParagraph && firstParagraph.querySelector('a[title="Apply"]');
    if (hasApplyLink) {
      section.classList.add('vacancy-description-section');

      // Build vacancy-description block structure
      const blockWrapper = document.createElement('div');
      blockWrapper.classList.add('vacancy-description-wrapper');

      const block = document.createElement('div');
      block.classList.add('vacancy-description', 'block');
      block.setAttribute('data-block-name', 'vacancy-description');

      // Row 1: title + apply button
      const jobTitle = document.title
        .replace(/\s*[-–—]\s*DEPT[®]?\s*$/i, '')
        .replace(/\s*[-–—]\s*$/, '')
        .trim();

      const applyLink = firstParagraph.querySelector('a');
      const jobId = window.location.pathname.match(/\/(\d+)/)?.[1] || '';
      const source = encodeURIComponent(`${window.location.origin}/careers/roles/`);
      const applyHref = jobId
        ? `https://boards.greenhouse.io/dept/jobs/${jobId}?gh_source=${source}#app`
        : (applyLink?.href || '#');

      const headerRow = document.createElement('div');
      headerRow.innerHTML = `<div><h2>${jobTitle}</h2><a href="${applyHref}" target="_blank" rel="noopener noreferrer">Apply</a></div>`;

      // Row 2: job description content (unescape HTML)
      const contentRow = document.createElement('div');
      const contentCell = document.createElement('div');

      let rawContent = '';
      paragraphs.forEach((p, i) => {
        if (i === 0) return; // skip Apply link paragraph
        rawContent += p.textContent;
      });

      // Unescape HTML entities
      const temp = document.createElement('div');
      temp.innerHTML = rawContent;
      const unescaped = temp.textContent || temp.innerText || '';

      // Try to parse as HTML (the content was double-escaped)
      const contentDiv = document.createElement('div');
      contentDiv.innerHTML = unescaped;
      contentCell.appendChild(contentDiv);
      contentRow.appendChild(contentCell);

      block.appendChild(headerRow);
      block.appendChild(contentRow);
      blockWrapper.appendChild(block);

      // Replace the default-content-wrapper
      wrapper.replaceWith(blockWrapper);
      return;
    }

    // ── Meta section: has only label paragraphs (Department, Employment type) ─
    const hasMeta = [...paragraphs].some((p) => {
      const text = p.textContent.trim();
      return text === 'Department' || text === 'Employment type' || text === 'Roles open in';
    });

    if (hasMeta) {
      section.classList.add('vacancy-meta-section');
      // Style the wrapper as a simple meta strip
      wrapper.classList.add('vacancy-meta-strip');
    }
  });
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));

  const main = doc.querySelector('main');
  await loadSections(main);

  // Enhance vacancy page sections that AEM serves as default content
  decorateVacancySections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
