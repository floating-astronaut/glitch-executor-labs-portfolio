// Client-only motion bootstrap. Runs after DOMContentLoaded.
// - Lenis smooth scroll on DESKTOP ONLY (mobile hijack causes >30s freezes
//   on iOS Safari refresh — native momentum scrolling is better there).
// - Motion One `inView` drives the `.reveal → .is-in` CSS transition.
// - Adds `.motion-ready` to <body> so global.css can opt into the rise.
// Keep this file small: it ships to every page.

import { inView } from 'motion';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Detect touch / coarse-pointer devices. Lenis on mobile intercepts every
// touchstart/touchmove with a non-passive listener; on iOS Safari that has
// been stalling the main thread for tens of seconds during initial
// hydration — users reported black screen + dead buttons + dead scroll for
// >30s on hard refresh. Skip Lenis on mobile entirely.
const coarsePointer = matchMedia('(pointer: coarse)').matches;
const touchScreen = matchMedia('(hover: none)').matches;
const isMobile = coarsePointer || touchScreen;

// Signal CSS: motion is active → opt into the small translate-then-rise.
// If JS never reaches this line (slow net, ad blocker, broken bundle),
// content stays visible because of the content-first .reveal default.
document.body.classList.add('motion-ready');

if (!reduced && !isMobile) {
  // Desktop only — load Lenis lazily so it doesn't bloat the mobile bundle.
  import('lenis').then(({ default: Lenis }) => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Hash-link smooth scroll via Lenis.
    document.addEventListener('click', (e) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -64 });
      history.pushState(null, '', `#${id}`);
    });
  });
}

// Reveal-on-view. Under reduced motion or mobile, just commit the final
// state synchronously — no IntersectionObserver thrash on small screens.
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if (reduced) {
  reveals.forEach((el) => el.classList.add('is-in'));
} else {
  reveals.forEach((el) => {
    inView(el, () => {
      el.classList.add('is-in'); // CSS transition in global.css handles the tween.
    }, { amount: 0.15 });
  });
}
