import {
  Directive,
  ElementRef,
  booleanAttribute,
  inject,
  input,
  numberAttribute,
  output,
} from '@angular/core';
import { injectGsap } from './inject-gsap';
import { findObserver, warnMissingPlugin } from './internal';
import { GSAP_OPTIONS } from './provide-gsap';

function typeAttribute(value: string): string {
  return value === '' ? 'wheel,touch,pointer' : value;
}

/**
 * Turns GSAP's Observer into Angular outputs: one normalized stream of
 * wheel, touch, and pointer gestures.
 *
 * ```html
 * <section observe (up)="next()" (down)="previous()">…</section>
 * ```
 *
 * Needs Observer via `provideGsap({ plugins: [Observer] })`. The instance
 * is killed with the component.
 */
@Directive({ selector: '[observe]' })
export class Observe {
  private readonly host = inject<ElementRef<Element>>(ElementRef);
  private readonly options = inject(GSAP_OPTIONS, { optional: true });

  /** Observer `type`; empty attribute means `wheel,touch,pointer`. */
  readonly type = input('wheel,touch,pointer', {
    alias: 'observe',
    transform: typeAttribute,
  });
  /** Minimum px of movement before a direction fires. */
  readonly tolerance = input(10, { transform: numberAttribute });
  /** Prevent the captured events' default action (page scroll, drag select). */
  readonly preventDefault = input(false, { transform: booleanAttribute });
  readonly up = output<void>();
  readonly down = output<void>();
  readonly left = output<void>();
  readonly right = output<void>();
  readonly press = output<void>();
  readonly release = output<void>();

  readonly ctx = injectGsap(() => {
    const Observer = findObserver(this.options?.plugins);
    if (!Observer) {
      warnMissingPlugin('observe', 'Observer');
      return;
    }
    const instance = Observer.create({
      target: this.host.nativeElement,
      type: this.type(),
      tolerance: this.tolerance(),
      preventDefault: this.preventDefault(),
      onUp: () => this.up.emit(),
      onDown: () => this.down.emit(),
      onLeft: () => this.left.emit(),
      onRight: () => this.right.emit(),
      onPress: () => this.press.emit(),
      onRelease: () => this.release.emit(),
    });
    return () => instance.kill();
  });
}
