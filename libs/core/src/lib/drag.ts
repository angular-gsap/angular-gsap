import { Directive, ElementRef, booleanAttribute, inject, input, numberAttribute, output } from '@angular/core';
import { injectGsap } from './inject-gsap';
import { findDraggable, warnMissingPlugin } from './internal';
import { GSAP_OPTIONS } from './provide-gsap';

function typeAttribute(value: string): string {
  return value === '' ? 'x,y' : value;
}

/**
 * Declarative Draggable. The instance is created inside the context and
 * killed with the component.
 *
 * ```html
 * <div drag>free within the parent</div>
 * <div drag="x" [snap]="96">horizontal, snapping to a grid</div>
 * <div drag [inertia]="false" [bounds]="'.arena'">…</div>
 * ```
 *
 * Needs Draggable via `provideGsap({ plugins: [Draggable] })`; add
 * InertiaPlugin for momentum on release.
 */
@Directive({ selector: '[drag]' })
export class Drag {
  private readonly host = inject<ElementRef<Element>>(ElementRef);
  private readonly options = inject(GSAP_OPTIONS, { optional: true });

  /** Draggable `type`; empty attribute means `x,y`. */
  readonly type = input('x,y', { alias: 'drag', transform: typeAttribute });
  /** `'parent'` (default), a CSS selector, an element, or `false` for unbounded. */
  readonly bounds = input<'parent' | string | Element | false>('parent');
  /** Momentum on release (needs InertiaPlugin). */
  readonly inertia = input(true, { transform: booleanAttribute });
  /** Grid size in px to snap the landing position to; `0` disables snapping. */
  readonly snap = input(0, { transform: numberAttribute });
  readonly dragStart = output<void>();
  readonly dragEnd = output<void>();

  readonly ctx = injectGsap(() => {
    const Draggable = findDraggable(this.options?.plugins);
    if (!Draggable) {
      warnMissingPlugin('drag', 'Draggable');
      return;
    }
    const el = this.host.nativeElement;
    const bounds = this.bounds();
    const grid = this.snap();
    const round = (value: number) => Math.round(value / grid) * grid;
    const instances = Draggable.create(el, {
      type: this.type(),
      bounds: bounds === 'parent' ? el.parentElement : bounds || undefined,
      inertia: this.inertia(),
      edgeResistance: 0.7,
      ...(grid > 0 ? { snap: { x: round, y: round, rotation: round } } : {}),
      onDragStart: () => this.dragStart.emit(),
      onDragEnd: () => this.dragEnd.emit(),
    });
    return () => instances.forEach((instance) => instance.kill());
  });
}
