import { Directive, ElementRef, inject, input, numberAttribute } from '@angular/core';
import { injectGsap } from './inject-gsap';
import { findPropertyPlugin } from './internal';
import { prefersReducedMotion } from './presets';
import { GSAP_OPTIONS } from './provide-gsap';

/**
 * Smooth-scrolls to a target on click.
 *
 * ```html
 * <a scrollTo="#pricing">Pricing</a>
 * <button scrollTo=".footer" [offsetY]="80">Down</button>
 * ```
 *
 * With ScrollToPlugin registered the scroll is a GSAP tween; without it
 * (or under reduced motion) it falls back to the browser's own
 * `scrollIntoView`.
 */
@Directive({
  selector: '[scrollTo]',
  host: { '(click)': 'scroll($event)' },
})
export class ScrollTo {
  private readonly host = inject<ElementRef<Element>>(ElementRef);
  private readonly options = inject(GSAP_OPTIONS, { optional: true });

  /** CSS selector of the scroll target. */
  readonly target = input.required<string>({ alias: 'scrollTo' });
  /** Extra offset in px above the target (a sticky header, say). */
  readonly offsetY = input(0, { transform: numberAttribute });
  readonly duration = input(0.8, { transform: numberAttribute });
  readonly ease = input('power2.inOut');

  readonly ctx = injectGsap();

  protected scroll = this.ctx.contextSafe((event: Event) => {
    event.preventDefault();
    const selector = this.target();
    const reduce = prefersReducedMotion();
    const plugin = findPropertyPlugin(this.options?.plugins, 'scrollTo');
    if (plugin && !reduce) {
      this.ctx.gsap.to(window, {
        scrollTo: { y: selector, offsetY: this.offsetY() },
        duration: this.duration(),
        ease: this.ease(),
      });
      return;
    }
    this.host.nativeElement.ownerDocument
      .querySelector(selector)
      ?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  });
}
