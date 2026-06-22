// /**
//  * DEPT® Vacancy Page – Standalone Draft Script
//  * Handles mobile navigation and smooth-scroll behaviour.
//  */

// (function () {
//   'use strict';

//   // ── Mobile hamburger toggle ─────────────────────────────────────────────
//   function initMobileNav() {
//     const header = document.querySelector('.site-header');
//     if (!header) return;

//     const hamburger = document.createElement('button');
//     hamburger.className = 'site-header__hamburger';
//     hamburger.setAttribute('aria-label', 'Toggle navigation menu');
//     hamburger.setAttribute('aria-expanded', 'false');
//     hamburger.innerHTML = `
//       <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
//            viewBox="0 0 24 24" fill="none" stroke="currentColor"
//            stroke-width="2" stroke-linecap="round" aria-hidden="true">
//         <line x1="3" y1="6" x2="21" y2="6"/>
//         <line x1="3" y1="12" x2="21" y2="12"/>
//         <line x1="3" y1="18" x2="21" y2="18"/>
//       </svg>
//     `;

//     const inner = header.querySelector('.site-header__inner');
//     if (!inner) return;

//     inner.append(hamburger);

//     const nav = header.querySelector('.site-header__nav-list');
//     if (!nav) return;

//     hamburger.addEventListener('click', () => {
//       const expanded = hamburger.getAttribute('aria-expanded') === 'true';
//       hamburger.setAttribute('aria-expanded', String(!expanded));
//       nav.classList.toggle('is-open');
//     });

//     // Close on outside click
//     document.addEventListener('click', (e) => {
//       if (!header.contains(e.target)) {
//         hamburger.setAttribute('aria-expanded', 'false');
//         nav.classList.remove('is-open');
//       }
//     });

//     // Add mobile nav open styles inline so they're self-contained
//     const style = document.createElement('style');
//     style.textContent = `
//       @media (width < 600px) {
//         .site-header__hamburger {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: none;
//           border: none;
//           cursor: pointer;
//           padding: 4px;
//           color: #121212;
//         }
//         .site-header__nav-list.is-open {
//           display: flex;
//           flex-direction: column;
//           position: fixed;
//           top: 64px;
//           left: 0;
//           right: 0;
//           background: #fff;
//           padding: 24px;
//           gap: 16px;
//           border-bottom: 1px solid #f2f2f2;
//           z-index: 199;
//         }
//       }
//       @media (width >= 600px) {
//         .site-header__hamburger { display: none; }
//       }
//     `;
//     document.head.append(style);
//   }

//   // ── Scroll-spy: hide sticky Apply when hero Apply is visible ────────────
//   function initStickyApply() {
//     const stickyApply = document.querySelector('.vacancy-hero__sticky-apply');
//     const inlineApply = document.querySelector('.vacancy-description__apply');
//     if (!stickyApply || !inlineApply) return;

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         stickyApply.style.opacity = entry.isIntersecting ? '0' : '1';
//         stickyApply.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
//       },
//       { threshold: 0.1 },
//     );

//     observer.observe(inlineApply);
//   }

//   // ── Init ────────────────────────────────────────────────────────────────
//   document.addEventListener('DOMContentLoaded', () => {
//     initMobileNav();
//     initStickyApply();
//   });
// }());
