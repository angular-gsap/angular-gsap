import { isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  ElementRef,
  Injector,
  NgZone,
  PLATFORM_ID,
  Signal,
  afterRenderEffect,
  assertInInjectionContext,
  inject,
  runInInjectionContext,
  signal,
  untracked,
} from '@angular/core';
import { gsap } from 'gsap';
import type { Gsap, GsapContext } from './types';

export interface GsapCallbackParams {
  /** The GSAP instance, for convenience so callbacks don't need their own import. */
  gsap: Gsap;
  /** The `gsap.Context` this callback runs inside. */
  context: GsapContext;
}

export type GsapCallback = (params: GsapCallbackParams) => void;

export interface InjectGsapOptions {
  /**
   * Scope for selector text used inside the context (e.g. `gsap.to('.box', …)`
   * only matches descendants of the scope). Defaults to the component's host
   * element. Pass `false` to leave selectors unscoped (document-wide).
   */
  scope?: Element | ElementRef<Element> | string | false;
  /** Required when calling `injectGsap` outside an injection context. */
  injector?: Injector;
  /**
   * When `true` (default), signals read inside the callback are tracked and
   * a change reverts the context and re-runs the callback. Set to `false`
   * to run the callback exactly once after the first render.
   */
  reactive?: boolean;
}

export interface GsapRef {
  /** The (configured) GSAP instance. */
  readonly gsap: Gsap;
  /**
   * The live `gsap.Context`. `undefined` on the server and before the first
   * render in the browser.
   */
  readonly context: GsapContext | undefined;
  /** Becomes `true` after the first render, once the context exists. */
  readonly ready: Signal<boolean>;
  /**
   * Wraps a function (typically an event handler) so any animations it
   * creates are recorded in the context and cleaned up on destroy, and
   * selector text stays scoped. Mirrors `contextSafe` from `@gsap/react`.
   */
  contextSafe<TArgs extends unknown[], TReturn>(
    fn: (...args: TArgs) => TReturn
  ): (...args: TArgs) => TReturn;
  /** Reverts everything created in the context (returns elements to their pre-animation state). */
  revert(): void;
  /** Kills everything created in the context without reverting inline styles. */
  kill(): void;
}

/**
 * The Angular equivalent of `@gsap/react`'s `useGSAP()`.
 *
 * Runs vanilla GSAP code inside a `gsap.context()` that is:
 * - **scoped** to the component's host element (selector text like `'.box'`
 *   only matches elements inside the component),
 * - **created after the first render** (`afterRenderEffect`), so the DOM exists,
 * - **skipped on the server** — SSR-safe with no branching in user code,
 * - **run outside Angular's change detection**,
 * - **signal-reactive** — signals read in the callback re-run it (with a
 *   `revert()` of the previous cycle) when they change,
 * - **auto-cleaned** — the context is reverted when the component is destroyed.
 *
 * ```ts
 * ⁣@Component({ template: `<div class="box"></div>` })
 * export class Hero {
 *   x = signal(0);
 *   gsap = injectGsap(({ gsap }) => {
 *     gsap.to('.box', { x: this.x(), duration: 1 });
 *   });
 *   spin = this.gsap.contextSafe(() => gsap.to('.box', { rotation: 360 }));
 * }
 * ```
 */
export function injectGsap(
  callback?: GsapCallback,
  options: InjectGsapOptions = {}
): GsapRef {
  if (!options.injector) {
    assertInInjectionContext(injectGsap);
  }
  const injector = options.injector ?? inject(Injector);

  return runInInjectionContext(injector, () => {
    const ready = signal(false);

    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      // Server: never touch the DOM. Handlers wrapped with contextSafe still
      // work as plain functions.
      return {
        gsap,
        context: undefined,
        ready: ready.asReadonly(),
        contextSafe: (fn) => fn,
        revert: () => void 0,
        kill: () => void 0,
      } satisfies GsapRef;
    }

    const zone = inject(NgZone, { optional: true });
    const hostRef = inject(ElementRef, { optional: true });
    const reactive = options.reactive ?? true;

    const scope =
      options.scope === false
        ? undefined
        : options.scope instanceof ElementRef
          ? options.scope.nativeElement
          : (options.scope ?? hostRef?.nativeElement);

    let ctx: GsapContext | undefined;

    // afterRenderEffect tracks signal reads like effect(), but always runs
    // AFTER the render that applied the change — so when a signal alters the
    // template (e.g. @for adds elements), the callback sees the updated DOM.
    // gsap.context() invokes its function synchronously, so reads inside the
    // callback are tracked; runOutsideAngular only changes the zone, not the
    // reactive context.
    afterRenderEffect((onCleanup) => {
      const create = () =>
        gsap.context((self) => {
          if (!callback) {
            return;
          }
          if (reactive) {
            callback({ gsap, context: self });
          } else {
            untracked(() => callback({ gsap, context: self }));
          }
        }, scope);
      ctx = zone ? zone.runOutsideAngular(create) : create();
      ready.set(true);
      onCleanup(() => {
        ctx?.revert();
        ctx = undefined;
      });
    });

    // Safety net for the case where the effect never ran its cleanup (e.g.
    // destroyed before first render finished flipping `ready`).
    inject(DestroyRef).onDestroy(() => ctx?.revert());

    return {
      gsap,
      get context() {
        return ctx;
      },
      ready: ready.asReadonly(),
      contextSafe<TArgs extends unknown[], TReturn>(
        fn: (...args: TArgs) => TReturn
      ): (...args: TArgs) => TReturn {
        return (...args: TArgs): TReturn => {
          const current = ctx;
          if (!current) {
            return fn(...args);
          }
          let result!: TReturn;
          const run = () =>
            current.add(() => {
              result = fn(...args);
            });
          if (zone) {
            zone.runOutsideAngular(run);
          } else {
            run();
          }
          return result;
        };
      },
      revert: () => ctx?.revert(),
      kill: () => ctx?.kill(),
    } satisfies GsapRef;
  });
}
