import { Directive, ElementRef, inject, input, numberAttribute } from '@angular/core';
import { injectGsap } from './inject-gsap';
import { prefersReducedMotion } from './presets';

export type HoverPreset = 'lift' | 'grow' | 'shrink' | 'tilt';

function presetAttribute(value: HoverPreset | ''): HoverPreset {
  return value === '' ? 'lift' : value;
}

/**
 * Pointer-hover micro-interaction, tweened by GSAP instead of CSS
 * transitions so easing, overwriting, and interruption behave.
 *
 * ```html
 * <a hover>lifts</a>
 * <button hover="grow" [amount]="1.1">grows</button>
 * ```
 *
 * Enter and leave tweens overwrite each other, so fast pointer passes
 * never pile up. Does nothing under `prefers-reduced-motion`.
 */
@Directive({
  selector: '[hover]',
  host: {
    '(pointerenter)': 'enter()',
    '(pointerleave)': 'leave()',
  },
})
export class Hover {
  private readonly host = inject<ElementRef<Element>>(ElementRef);

  /** `lift`, `grow`, `shrink`, or `tilt`; empty attribute means `lift`. */
  readonly preset = input('lift' as HoverPreset, {
    alias: 'hover',
    transform: presetAttribute,
  });
  /** Preset strength: px of lift, scale factor, or degrees of tilt. */
  readonly amount = input(Number.NaN, { transform: numberAttribute });
  readonly duration = input(0.25, { transform: numberAttribute });

  readonly ctx = injectGsap();

  private vars(): Record<string, number> {
    const amount = this.amount();
    switch (this.preset()) {
      case 'grow':
        return { scale: Number.isNaN(amount) ? 1.07 : amount };
      case 'shrink':
        return { scale: Number.isNaN(amount) ? 0.93 : amount };
      case 'tilt':
        return { rotation: Number.isNaN(amount) ? -4 : amount };
      case 'lift':
      default:
        return { y: Number.isNaN(amount) ? -3 : -amount };
    }
  }

  protected enter = this.ctx.contextSafe(() => {
    if (prefersReducedMotion()) {
      return;
    }
    this.ctx.gsap.to(this.host.nativeElement, {
      ...this.vars(),
      duration: this.duration(),
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });

  protected leave = this.ctx.contextSafe(() => {
    if (prefersReducedMotion()) {
      return;
    }
    this.ctx.gsap.to(this.host.nativeElement, {
      y: 0,
      scale: 1,
      rotation: 0,
      duration: this.duration(),
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });
}
