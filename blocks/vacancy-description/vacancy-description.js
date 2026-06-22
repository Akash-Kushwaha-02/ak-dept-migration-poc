/**
 * Vacancy Description block - sets Apply button href from job ID in pathname.
 * EDS DOM: row 1 > single cell > (h2, a[Apply])
 * @param {Element} block
 */
export default function decorate(block) {
  const match = window.location.pathname.match(/\/(\d+)/);
  if (!match) return;

  const jobId = match[1];
  const source = encodeURIComponent(`${window.location.origin}/careers/roles/`);
  const applyUrl = `https://boards.greenhouse.io/dept/jobs/${jobId}?gh_source=${source}#app`;

  const headerCell = block.querySelector(':scope > div:first-child > div');
  if (headerCell) {
    const applyLink = headerCell.querySelector('a');
    if (applyLink) applyLink.href = applyUrl;
  }
}
