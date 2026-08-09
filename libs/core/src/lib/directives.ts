import { Directive, ElementRef, inject, input, numberAttribute, output } from '@angular/core';
import { injectGsap } from './inject-gsap';
import { GsapRevealPreset, prefersReducedMotion, presetFromVars } from './presets';
import type { Gsap, GsapTweenVars } from './types';

function staggerAttribute(value: number | string): number {
  return value === '' || value == null ? 0.08 : Number(value);
}

interface EntranceConfig {
  gsap: Gsap;
  trigger: Element;
  preset: GsapRevealPreset | '';
  on: 'init' | 'scroll';
  delay: number;
  duration: number;
  distance: number;
  ease: string;
  start: string;
  onComplete: () => void;
}

function entranceVars(config: EntranceConfig): GsapTweenVars {
  const vars: GsapTweenVars = {
    ...presetFromVars(config.preset || 'fade-up', config.distance),
    delay: config.delay,
    duration: config.duration,
    ease: config.ease,
    onComplete: config.onComplete,
  };
  if (config.on === 'scroll') {
    const globals = (
      config.gsap.core as unknown as { globals(): Record<string, unknown> }
    ).globals();
    if (globals['ScrollTrigger']) {
      vars['scrollTrigger'] = { trigger: config.trigger, start: config.start };
    } else if (typeof ngDevMode === 'undefined' || ngDevMode) {
      console.warn(
        '[angular-gsap] on="scroll" needs ScrollTrigger — add provideGsap({ plugins: [ScrollTrigger] }). Falling back to reveal on init.'
      );
    }
  }
  return vars;
}

/**
 * Entrance animation for a single element. Sugar over {@link injectGsap} for
 * the common case — anything beyond a preset entrance belongs in `injectGsap`.
 *
 * ```html
 * <h1 gsapReveal>Fades up on init</h1>
 * <section gsapReveal="fade-right" on="scroll" [delay]="0.2">…</section>
 * ```
 *
 * Inputs are signals: changing any of them reverts and replays the entrance.
 * Respects `prefers-reduced-motion` (no animation). `on="scroll"` requires
 * ScrollTrigger via `provideGsap({ plugins: [ScrollTrigger] })`.
 */
@Directive({ selector: '[gsapReveal]' })
export class GsapReveal {
  private readonly host = inject<ElementRef<Element>>(ElementRef);

  /** Entrance preset; empty attribute means `fade-up`. */
  readonly preset = input<GsapRevealPreset | ''>('', { alias: 'gsapReveal' });
  /** `init` plays after first render; `scroll` when the element enters the viewport. */
  readonly on = input<'init' | 'scroll'>('init');
  readonly delay = input(0, { transform: numberAttribute });
  readonly duration = input(0.7, { transform: numberAttribute });
  /** Travel distance in px for the directional presets. */
  readonly distance = input(28, { transform: numberAttribute });
  readonly ease = input('power3.out');
  /** ScrollTrigger `start` (only used with `on="scroll"`). */
  readonly start = input('top 85%');
  readonly completed = output<void>();

  readonly ctx = injectGsap(({ gsap }) => {
    if (prefersReducedMotion()) {
      return;
    }
    gsap.from(
      this.host.nativeElement,
      entranceVars({
        gsap,
        trigger: this.host.nativeElement,
        preset: this.preset(),
        on: this.on(),
        delay: this.delay(),
        duration: this.duration(),
        distance: this.distance(),
        ease: this.ease(),
        start: this.start(),
        onComplete: () => this.completed.emit(),
      })
    );
  });
}

/**
 * Staggered entrance for an element's children.
 *
 * ```html
 * <ul gsapStagger="0.08" preset="scale-in" on="scroll">
 *   <li>…</li>
 *   <li>…</li>
 * </ul>
 * ```
 *
 * Targets direct children by default; pass `items` (a CSS selector, resolved
 * within the host) to target something deeper. Same reduced-motion and
 * ScrollTrigger behavior as {@link GsapReveal}.
 */
@Directive({ selector: '[gsapStagger]' })
export class GsapStagger {
  private readonly host = inject<ElementRef<Element>>(ElementRef);

  /** Seconds between each child; empty attribute means `0.08`. */
  readonly each = input(0.08, { alias: 'gsapStagger', transform: staggerAttribute });
  readonly preset = input<GsapRevealPreset | ''>('');
  readonly on = input<'init' | 'scroll'>('init');
  readonly delay = input(0, { transform: numberAttribute });
  readonly duration = input(0.7, { transform: numberAttribute });
  readonly distance = input(28, { transform: numberAttribute });
  readonly ease = input('power3.out');
  readonly start = input('top 85%');
  /** Optional CSS selector for the staggered items, resolved within the host. */
  readonly items = input('');
  readonly completed = output<void>();

  readonly ctx = injectGsap(({ gsap }) => {
    if (prefersReducedMotion()) {
      return;
    }
    const host = this.host.nativeElement;
    const targets = this.items()
      ? Array.from(host.querySelectorAll(this.items()))
      : Array.from(host.children);
    if (targets.length === 0) {
      return;
    }
    gsap.from(targets, {
      ...entranceVars({
        gsap,
        trigger: host,
        preset: this.preset(),
        on: this.on(),
        delay: this.delay(),
        duration: this.duration(),
        distance: this.distance(),
        ease: this.ease(),
        start: this.start(),
        onComplete: () => this.completed.emit(),
      }),
      stagger: this.each(),
    });
  });
}

/** Everything template-facing, for one-line imports. */
export const GSAP_DIRECTIVES = [GsapReveal, GsapStagger] as const;

declare const ngDevMode: boolean | undefined;
