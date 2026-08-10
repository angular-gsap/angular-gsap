import { Directive, ElementRef, inject, input, numberAttribute, output } from '@angular/core';
import { injectGsap } from './inject-gsap';
import {
  entranceScrollTrigger,
  findPropertyPlugin,
  hasScrollTrigger,
  joinSequence,
  warnMissingPlugin,
} from './internal';
import { prefersReducedMotion } from './presets';
import { GSAP_OPTIONS } from './provide-gsap';
import { Sequence } from './sequence';
import type { GsapTweenVars } from './types';

/**
 * Scrambles the element's text into place.
 *
 * ```html
 * <h1 scrambleText>decodes on init</h1>
 * <p scrambleText="loaded." on="scroll">scrambles to 'loaded.' when visible</p>
 * ```
 *
 * Needs ScrambleTextPlugin via `provideGsap({ plugins:
 * [ScrambleTextPlugin] })`. Without it (or under reduced motion) the text
 * simply shows.
 */
@Directive({ selector: '[scrambleText]' })
export class ScrambleText {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly options = inject(GSAP_OPTIONS, { optional: true });
  private readonly sequence = inject(Sequence, { optional: true });

  /** Target text; empty attribute scrambles to the element's own text. */
  readonly text = input('', { alias: 'scrambleText' });
  /** Character pool: `upperCase`, `lowerCase`, `upperAndLowerCase`, or a literal set. */
  readonly chars = input('upperCase');
  readonly duration = input(1.2, { transform: numberAttribute });
  readonly delay = input(0, { transform: numberAttribute });
  /** `init` plays after first render; `scroll` when the element enters the viewport. */
  readonly on = input<'init' | 'scroll'>('init');
  /** ScrollTrigger `start` (only used with `on="scroll"`). */
  readonly start = input('top 85%');
  /** Position in a parent `sequence` (GSAP position parameter). */
  readonly at = input<string | number>('');
  readonly completed = output<void>();

  readonly ctx = injectGsap(({ gsap }) => {
    if (prefersReducedMotion()) {
      return;
    }
    if (!findPropertyPlugin(this.options?.plugins, 'scrambleText')) {
      warnMissingPlugin('scrambleText', 'ScrambleTextPlugin');
      return;
    }
    const el = this.host.nativeElement;
    const vars: GsapTweenVars = {
      scrambleText: {
        text: this.text() || el.textContent || '',
        chars: this.chars(),
        speed: 0.4,
      },
      delay: this.delay(),
      duration: this.duration(),
      ease: 'none',
      onComplete: () => this.completed.emit(),
    };
    if (this.on() === 'scroll') {
      if (hasScrollTrigger(gsap)) {
        Object.assign(vars, entranceScrollTrigger(el, this.start()));
      } else {
        warnMissingPlugin('on="scroll"', 'ScrollTrigger');
      }
      gsap.to(el, vars);
      return;
    }
    joinSequence(this.sequence, gsap.to(el, vars), this.at());
  });
}
