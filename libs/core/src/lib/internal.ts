import type { Sequence } from './sequence';
import type { Gsap, GsapTween, GsapTweenVars } from './types';

declare const ngDevMode: boolean | undefined;

export function devMode(): boolean {
  return typeof ngDevMode === 'undefined' || !!ngDevMode;
}

/**
 * ScrollTrigger self-registers into `gsap.core.globals()`, which makes it
 * detectable without the library ever importing it (so it stays out of
 * bundles that don't use it). Other plugins don't do this; see
 * {@link findSplitText}.
 */
export function hasScrollTrigger(gsap: Gsap): boolean {
  const globals = (
    gsap.core as unknown as { globals(): Record<string, unknown> }
  ).globals();
  return !!globals['ScrollTrigger'];
}

export interface SplitTextLike {
  chars: Element[];
  words: Element[];
  lines: Element[];
}

export interface SplitTextCtor {
  new (target: Element, vars: object): SplitTextLike;
  create?(target: Element, vars: object): SplitTextLike;
  prototype: { split(vars: object): unknown };
}

/**
 * Finds SplitText among the plugins the app passed to
 * `provideGsap({ plugins })`. Identified structurally (its prototype has a
 * `split` method) rather than by class name, which minifiers may mangle.
 */
export function findSplitText(
  plugins: readonly object[] | undefined
): SplitTextCtor | undefined {
  return plugins?.find(
    (p): p is SplitTextCtor =>
      typeof p === 'function' &&
      typeof (p as SplitTextCtor).prototype?.split === 'function'
  ) as SplitTextCtor | undefined;
}

export function warnMissingPlugin(feature: string, plugin: string): void {
  if (devMode()) {
    console.warn(
      `[angular-gsap] ${feature} needs ${plugin}. Add provideGsap({ plugins: [${plugin}] }).`
    );
  }
}

/**
 * ScrollTrigger vars for one-shot entrances. 'reset' on leave-back makes
 * them self-correct when the trigger is created already past its start
 * (tall viewports, SPA navigation while scrolled).
 */
export function entranceScrollTrigger(
  trigger: Element,
  start: string
): GsapTweenVars {
  return {
    scrollTrigger: {
      trigger,
      start,
      toggleActions: 'play none none reset',
    },
  };
}

/**
 * Hands an entrance tween to a parent `sequence` when one exists; otherwise
 * the tween just plays on its own.
 */
export function joinSequence(
  sequence: Sequence | null,
  tween: GsapTween,
  at: string | number
): void {
  sequence?.add(tween, at);
}

/**
 * Property plugins (scrollTo, scrambleText, drawSVG, …) are config objects
 * with a literal `name` string, which minifiers never touch. Looked up in
 * the plugins the app passed to `provideGsap`.
 */
export function findPropertyPlugin(
  plugins: readonly object[] | undefined,
  name: string
): object | undefined {
  return plugins?.find((p) => (p as { name?: string }).name === name);
}

export interface DraggableLike {
  kill(): void;
}

export interface DraggableCtor {
  create(target: Element | Element[], vars: object): DraggableLike[];
  hitTest(a: unknown, b: unknown): boolean;
}

/** Draggable, identified structurally (static create + hitTest). */
export function findDraggable(
  plugins: readonly object[] | undefined
): DraggableCtor | undefined {
  return plugins?.find(
    (p): p is DraggableCtor =>
      typeof (p as DraggableCtor).create === 'function' &&
      typeof (p as DraggableCtor).hitTest === 'function'
  ) as DraggableCtor | undefined;
}

export interface ObserverLike {
  kill(): void;
}

export interface ObserverCtor {
  create(vars: object): ObserverLike;
  isTouch: unknown;
}

/** Observer, identified structurally (static isTouch + create). */
export function findObserver(
  plugins: readonly object[] | undefined
): ObserverCtor | undefined {
  return plugins?.find(
    (p): p is ObserverCtor =>
      typeof (p as ObserverCtor).create === 'function' && 'isTouch' in p
  ) as ObserverCtor | undefined;
}
