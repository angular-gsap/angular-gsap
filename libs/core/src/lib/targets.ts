import { ElementRef, Signal, isSignal } from '@angular/core';

export type ElementLike<T extends Element = Element> =
  | T
  | ElementRef<T>
  | null
  | undefined;

/**
 * Unwraps a `viewChild()` query (or a plain `ElementRef`) into the DOM
 * element GSAP expects. Passing the signal itself keeps it tracked when
 * called inside an `injectGsap` callback.
 *
 * ```ts
 * box = viewChild.required<ElementRef<HTMLElement>>('box');
 * ctx = injectGsap(({ gsap }) => {
 *   gsap.to(target(this.box), { x: this.x() });
 * });
 * ```
 */
export function target<T extends Element>(
  source: ElementLike<T> | Signal<ElementLike<T>>
): T | null {
  const value = isSignal(source) ? source() : source;
  if (!value) {
    return null;
  }
  return value instanceof ElementRef ? value.nativeElement : value;
}

/**
 * Unwraps a `viewChildren()` query (or any list of elements/`ElementRef`s)
 * into a DOM element array. Inside an `injectGsap` callback the query signal
 * is tracked, so the animation re-runs when the queried elements change.
 *
 * ```ts
 * dots = viewChildren<ElementRef<HTMLElement>>('dot');
 * ctx = injectGsap(({ gsap }) => {
 *   gsap.from(targets(this.dots), { scale: 0, stagger: 0.04 });
 * });
 * ```
 */
export function targets<T extends Element>(
  source:
    | Iterable<ElementLike<T>>
    | Signal<readonly (T | ElementRef<T>)[]>
): T[] {
  const list = isSignal(source) ? source() : source;
  const result: T[] = [];
  for (const item of list ?? []) {
    const element = target(item);
    if (element) {
      result.push(element);
    }
  }
  return result;
}
