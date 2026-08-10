import { Directive, ElementRef, inject, input, numberAttribute, output } from '@angular/core';
import { Counter } from './counter';
import { Drag } from './drag';
import { DrawSvg } from './draw-svg';
import { Observe } from './observe';
import { ScrambleText } from './scramble-text';
import { ScrollTo } from './scroll-to';
import { injectGsap } from './inject-gsap';
import { Parallax } from './parallax';
import { SplitReveal } from './split-reveal';
import {
  entranceScrollTrigger,
  hasScrollTrigger,
  joinSequence,
  warnMissingPlugin,
} from './internal';
import { Sequence } from './sequence';
import { RevealPreset, prefersReducedMotion, presetFromVars } from './presets';
import type { Gsap, GsapTweenVars } from './types';

function staggerAttribute(value: number | string): number {
  return value === '' || value == null ? 0.08 : Number(value);
}

interface EntranceConfig {
  gsap: Gsap;
  trigger: Element;
  preset: RevealPreset | '';
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
    if (hasScrollTrigger(config.gsap)) {
      Object.assign(vars, entranceScrollTrigger(config.trigger, config.start));
    } else {
      warnMissingPlugin('on="scroll"', 'ScrollTrigger');
    }
  }
  return vars;
}

/**
 * Entrance animation for a single element. Sugar over {@link injectGsap} for
 * the common case; anything beyond a preset entrance belongs in `injectGsap`.
 *
 * ```html
 * <h1 reveal>Fades up on init</h1>
 * <section reveal="fade-right" on="scroll" [delay]="0.2">…</section>
 * ```
 *
 * Inputs are signals: changing any of them reverts and replays the entrance.
 * Respects `prefers-reduced-motion` (no animation). `on="scroll"` requires
 * ScrollTrigger via `provideGsap({ plugins: [ScrollTrigger] })`.
 */
@Directive({ selector: '[reveal]' })
export class Reveal {
  private readonly host = inject<ElementRef<Element>>(ElementRef);
  private readonly sequence = inject(Sequence, { optional: true });

  /** Entrance preset; empty attribute means `fade-up`. */
  readonly preset = input<RevealPreset | ''>('', { alias: 'reveal' });
  /** `init` plays after first render; `scroll` when the element enters the viewport. */
  readonly on = input<'init' | 'scroll'>('init');
  readonly delay = input(0, { transform: numberAttribute });
  readonly duration = input(0.7, { transform: numberAttribute });
  /** Travel distance in px for the directional presets. */
  readonly distance = input(28, { transform: numberAttribute });
  readonly ease = input('power3.out');
  /** ScrollTrigger `start` (only used with `on="scroll"`). */
  readonly start = input('top 85%');
  /** Position in a parent `sequence` (GSAP position parameter). */
  readonly at = input<string | number>('');
  readonly completed = output<void>();

  readonly ctx = injectGsap(({ gsap }) => {
    if (prefersReducedMotion()) {
      return;
    }
    const tween = gsap.from(
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
    if (this.on() === 'init') {
      joinSequence(this.sequence, tween, this.at());
    }
  });
}

/**
 * Staggered entrance for an element's children.
 *
 * ```html
 * <ul stagger="0.08" preset="scale-in" on="scroll">
 *   <li>…</li>
 *   <li>…</li>
 * </ul>
 * ```
 *
 * Targets direct children by default; pass `items` (a CSS selector, resolved
 * within the host) to target something deeper. Same reduced-motion and
 * ScrollTrigger behavior as {@link Reveal}.
 */
@Directive({ selector: '[stagger]' })
export class Stagger {
  private readonly host = inject<ElementRef<Element>>(ElementRef);
  private readonly sequence = inject(Sequence, { optional: true });

  /** Seconds between each child; empty attribute means `0.08`. */
  readonly each = input(0.08, { alias: 'stagger', transform: staggerAttribute });
  readonly preset = input<RevealPreset | ''>('');
  readonly on = input<'init' | 'scroll'>('init');
  readonly delay = input(0, { transform: numberAttribute });
  readonly duration = input(0.7, { transform: numberAttribute });
  readonly distance = input(28, { transform: numberAttribute });
  readonly ease = input('power3.out');
  readonly start = input('top 85%');
  /** Optional CSS selector for the staggered items, resolved within the host. */
  readonly items = input('');
  /** Position in a parent `sequence` (GSAP position parameter). */
  readonly at = input<string | number>('');
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
    const tween = gsap.from(targets, {
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
    if (this.on() === 'init') {
      joinSequence(this.sequence, tween, this.at());
    }
  });
}


/** Everything template-facing, for one-line imports. */
export const GSAP_DIRECTIVES = [
  Counter,
  Drag,
  DrawSvg,
  Observe,
  Parallax,
  Reveal,
  ScrambleText,
  ScrollTo,
  Sequence,
  SplitReveal,
  Stagger,
] as const;
