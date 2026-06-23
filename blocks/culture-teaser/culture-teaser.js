/**
 * Culture Teaser block
 *
 * AEM Cloud Service delivers this block as:
 *   Row 1: 4 empty cells  (text-content placeholders – unfilled in UE)
 *   Row 2: 4 cells each containing one <picture>
 *
 * This decorator restructures the DOM to match the expected two-column layout:
 *   Left  column: static text content (overline, h2, description, CTA)
 *   Right column: 2 × 2 image grid
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = block.querySelectorAll(':scope > div');

  // Collect all images from row 2 (or from wherever they appear)
  const imageCells = [];
  rows.forEach((row) => {
    row.querySelectorAll(':scope > div').forEach((cell) => {
      if (cell.querySelector('picture, img')) {
        imageCells.push(cell.querySelector('picture') || cell.querySelector('img').closest('picture') || cell);
      }
    });
  });

  // Build the text content column (static copy that matches the reference)
  const textCol = document.createElement('div');
  textCol.classList.add('culture-teaser-text');
  textCol.innerHTML = `
    <p class="culture-teaser-overline"><strong>DEPT\u00ae/CULTURE</strong></p>
    <h2>Be part of our digital future</h2>
    <p class="culture-teaser-desc">We may be spread across the world, but we all work together as one team. Inspiring each other, collaborating, innovating, and creating together.</p>
    <a class="culture-teaser-cta" href="/culture/">Explore our culture</a>
  `;

  // Build the images column
  const imageCol = document.createElement('div');
  imageCol.classList.add('culture-teaser-images');
  imageCells.forEach((pic) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('culture-teaser-image-cell');
    wrapper.appendChild(pic.cloneNode(true));
    imageCol.appendChild(wrapper);
  });

  // Replace all existing rows with a single restructured row
  block.innerHTML = '';
  const row = document.createElement('div');
  row.classList.add('culture-teaser-row');
  row.appendChild(textCol);
  row.appendChild(imageCol);
  block.appendChild(row);
}
