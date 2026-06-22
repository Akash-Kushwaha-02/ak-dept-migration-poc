/**
 * Vacancy Description block
 *
 * The HTML structure is authored in templates/vacancy.html.
 * This script only sets the Apply button href, which requires the numeric
 * job ID from the live page pathname (unavailable at Mustache render time).
 */
export default function decorate(block) {
  const match = window.location.pathname.match(/\/vacancy\/(\d+)/);
  if (!match) return;

  const jobId = match[1];
  const source = encodeURIComponent(`${window.location.origin}/careers/roles/`);
  const applyUrl = `https://boards.greenhouse.io/dept/jobs/${jobId}?gh_source=${source}#app`;

  // Inline Apply button inside this block
  block.querySelectorAll('.vacancy-description__apply').forEach((link) => {
    link.href = applyUrl;
  });

  // Floating sticky Apply button (lives outside this block in the template)
  const stickyApply = document.querySelector('.vacancy-hero__sticky-apply');
  if (stickyApply) stickyApply.href = applyUrl;
}
