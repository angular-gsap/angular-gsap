import { Directive, ElementRef, inject, input, numberAttribute, output } from '@angular/core';
import { injectGsap } from './inject-gsap';
import {
  entranceScrollTrigger,
  hasScrollTrigger,
  warnMissingPlugin,
} from './internal';
import { prefersReducedMotion } from './presets';
import type { GsapTweenVars } from './types';

/**
 * Counts the element's text up (or down) to a number.
 *
 * ```html
 * <span [counter]="12500"></span>
 * <span [counter]="98.6" [decimals]="1" on="scroll"></span>
 * ```
 *
 * Values are formatted with `Intl.NumberFormat` in the user's locale.
 * Under `prefers-reduced-motion` the final value is shown immediately.
 */
@Directive({ selector: '[counter]' })
export class Counter {
  private readonly host = inject<ElementRef<Element>>(ElementRef);

  /** The number to count to. */
  readonly to = input.required({ alias: 'counter', transform: numberAttribute });
  /** Where the count starts. */
  readonly from = input(0, { transform: numberAttribute });
  readonly duration = input(1.2, { transform: numberAttribute });
  readonly delay = input(0, { transform: numberAttribute });
  readonly ease = input('power1.out');
  /** Fraction digits to show. */
  readonly decimals = input(0, { transform: numberAttribute });
  /** `init` counts after first render; `scroll` when the element enters the viewport. */
  readonly on = input<'init' | 'scroll'>('init');
  /** ScrollTrigger `start` (only used with `on="scroll"`). */
  readonly start = input('top 85%');
  readonly completed = output<void>();

  readonly ctx = injectGsap(({ gsap }) => {
    const el = this.host.nativeElement;
    const format = new Intl.NumberFormat(undefined, {
      minimumFractionDigits: this.decimals(),
      maximumFractionDigits: this.decimals(),
    });
    const state = { value: this.from() };
    const render = () => {
      el.textContent = format.format(state.value);
    };

    if (prefersReducedMotion()) {
      state.value = this.to();
      render();
      return;
    }

    render();
    const vars: GsapTweenVars = {
      value: this.to(),
      duration: this.duration(),
      delay: this.delay(),
      ease: this.ease(),
      onUpdate: render,
      onComplete: () => this.completed.emit(),
    };
    if (this.on() === 'scroll') {
      if (hasScrollTrigger(gsap)) {
        Object.assign(vars, entranceScrollTrigger(el, this.start()));
      } else {
        warnMissingPlugin('on="scroll"', 'ScrollTrigger');
      }
    }
    gsap.to(state, vars);
  });
}
