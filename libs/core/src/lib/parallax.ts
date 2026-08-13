import { Directive, ElementRef, inject, input } from '@angular/core';
import { injectGsap } from './inject-gsap';
import {
  hasScrollTrigger,
  resolveScroller,
  warnMissingPlugin,
  type ScrollerLike,
} from './internal';
import { prefersReducedMotion } from './presets';

function speedAttribute(value: number | string): number {
  return value === '' || value == null ? 0.15 : Number(value);
}

/**
 * Scroll-linked parallax. The element drifts vertically as it crosses the
 * viewport, scrubbed by the scrollbar.
 *
 * ```html
 * <img parallax src="…" />
 * <div parallax="0.3">moves further</div>
 * <div parallax="-0.2">moves against the scroll</div>
 * ```
 *
 * `speed` is the fraction of the viewport height the element travels while
 * crossing it. Needs ScrollTrigger via `provideGsap({ plugins:
 * [ScrollTrigger] })`. Does nothing under `prefers-reduced-motion`.
 */
@Directive({ selector: '[parallax]' })
export class Parallax {
  private readonly host = inject<ElementRef<Element>>(ElementRef);

  /** Fraction of the viewport height to travel; empty attribute means `0.15`. */
  readonly speed = input(0.15, { alias: 'parallax', transform: speedAttribute });
  /** Scrollable container to scrub against; defaults to the window. */
  readonly scroller = input<ScrollerLike>(null);

  readonly ctx = injectGsap(({ gsap }) => {
    if (prefersReducedMotion()) {
      return;
    }
    if (!hasScrollTrigger(gsap)) {
      warnMissingPlugin('parallax', 'ScrollTrigger');
      return;
    }
    const el = this.host.nativeElement;
    const scroller = resolveScroller(this.scroller());
    const shift = () => (this.speed() * window.innerHeight) / 2;
    gsap.fromTo(
      el,
      { y: () => shift() },
      {
        y: () => -shift(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          ...(scroller ? { scroller } : {}),
        },
      }
    );
  });
}
