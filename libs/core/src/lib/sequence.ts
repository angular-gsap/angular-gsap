import { Directive, input } from '@angular/core';
import { injectGsap } from './inject-gsap';
import type { GsapTimeline, GsapTween } from './types';

function gapAttribute(value: number | string): number {
  return value === '' || value == null ? 0 : Number(value);
}

/**
 * Composes child entrance directives into one timeline. `reveal`,
 * `stagger`, `splitReveal`, and `drawSvg` inside a `sequence` play one
 * after another instead of all at once; nesting in the template is the
 * choreography, no `[delay]` bookkeeping.
 *
 * ```html
 * <section sequence="0.1">          <!-- 0.1s gap between steps -->
 *   <h1 reveal>First</h1>
 *   <ul stagger>…</ul>              <!-- then this -->
 *   <p splitReveal [at]="'<0.2'">…</p>  <!-- overlap: GSAP position syntax -->
 * </section>
 * ```
 *
 * Children with `on="scroll"` keep their own ScrollTrigger and stay out of
 * the sequence.
 */
@Directive({ selector: '[sequence]' })
export class Sequence {
  /** Seconds between steps; empty attribute means `0`. */
  readonly gap = input(0, { alias: 'sequence', transform: gapAttribute });

  private tl?: GsapTimeline;

  /** The composed timeline (undefined on the server / before first render). */
  get timeline(): GsapTimeline | undefined {
    return this.tl;
  }

  readonly ctx = injectGsap(({ gsap }) => {
    this.tl = gsap.timeline();
    return () => {
      this.tl = undefined;
    };
  });

  /**
   * Called by child directives. `at` is any GSAP position parameter;
   * without one, steps run back to back separated by `gap`.
   */
  add(tween: GsapTween, at?: string | number): boolean {
    if (!this.tl) {
      return false;
    }
    const position =
      at !== undefined && at !== ''
        ? at
        : this.gap() > 0 && this.tl.getChildren().length > 0
          ? `+=${this.gap()}`
          : '>';
    this.tl.add(tween, position);
    return true;
  }
}
