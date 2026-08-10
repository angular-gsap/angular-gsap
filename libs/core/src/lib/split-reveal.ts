import { Directive, ElementRef, inject, input, numberAttribute, output } from '@angular/core';
import { injectGsap } from './inject-gsap';
import {
  entranceScrollTrigger,
  findSplitText,
  hasScrollTrigger,
  joinSequence,
  warnMissingPlugin,
} from './internal';
import { Sequence } from './sequence';
import { prefersReducedMotion } from './presets';
import { GSAP_OPTIONS } from './provide-gsap';
import type { GsapTweenVars } from './types';

export type SplitRevealKind = 'chars' | 'words' | 'lines';

const DEFAULT_STAGGER: Record<SplitRevealKind, number> = {
  chars: 0.012,
  words: 0.04,
  lines: 0.12,
};

function kindAttribute(value: SplitRevealKind | ''): SplitRevealKind {
  return value === '' ? 'words' : value;
}

/**
 * Splits the element's text and staggers the pieces in. The split is
 * reverted with the context, so the original markup comes back on destroy.
 *
 * ```html
 * <h1 splitReveal>staggers in by word</h1>
 * <h1 splitReveal="chars" on="scroll">by character, when visible</h1>
 * ```
 *
 * Needs SplitText via `provideGsap({ plugins: [SplitText] })`; falls back
 * to revealing the whole element when it isn't there. Does nothing under
 * `prefers-reduced-motion`.
 */
@Directive({ selector: '[splitReveal]' })
export class SplitReveal {
  private readonly host = inject<ElementRef<Element>>(ElementRef);
  private readonly options = inject(GSAP_OPTIONS, { optional: true });
  private readonly sequence = inject(Sequence, { optional: true });

  /** What to split into; empty attribute means `words`. */
  readonly kind = input('words' as SplitRevealKind, {
    alias: 'splitReveal',
    transform: kindAttribute,
  });
  /** `init` plays after first render; `scroll` when the element enters the viewport. */
  readonly on = input<'init' | 'scroll'>('init');
  readonly delay = input(0, { transform: numberAttribute });
  readonly duration = input(0.7, { transform: numberAttribute });
  /** Travel distance in px. */
  readonly distance = input(24, { transform: numberAttribute });
  readonly ease = input('power3.out');
  /** Seconds between pieces; defaults per kind (chars 0.012, words 0.04, lines 0.12). */
  readonly each = input(Number.NaN, { transform: numberAttribute });
  /** ScrollTrigger `start` (only used with `on="scroll"`). */
  readonly start = input('top 85%');
  /** Position in a parent `sequence` (GSAP position parameter). */
  readonly at = input<string | number>('');
  readonly completed = output<void>();

  readonly ctx = injectGsap(({ gsap }) => {
    if (prefersReducedMotion()) {
      return;
    }
    const el = this.host.nativeElement;
    const kind = this.kind();
    const SplitText = findSplitText(this.options?.plugins);

    let pieces: Element[] | Element = el;
    let stagger = 0;
    if (SplitText) {
      const split = SplitText.create
        ? SplitText.create(el, { type: kind })
        : new SplitText(el, { type: kind });
      pieces = split[kind];
      stagger = Number.isNaN(this.each()) ? DEFAULT_STAGGER[kind] : this.each();
    } else {
      warnMissingPlugin('splitReveal', 'SplitText');
    }

    const vars: GsapTweenVars = {
      y: this.distance(),
      opacity: 0,
      delay: this.delay(),
      duration: this.duration(),
      ease: this.ease(),
      stagger,
      onComplete: () => this.completed.emit(),
    };
    if (this.on() === 'scroll') {
      if (hasScrollTrigger(gsap)) {
        Object.assign(vars, entranceScrollTrigger(el, this.start()));
      } else {
        warnMissingPlugin('on="scroll"', 'ScrollTrigger');
      }
    }
    const tween = gsap.from(pieces, vars);
    if (this.on() === 'init') {
      joinSequence(this.sequence, tween, this.at());
    }
  });
}
