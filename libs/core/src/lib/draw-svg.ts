import { Directive, ElementRef, inject, input, numberAttribute, output } from '@angular/core';
import { injectGsap } from './inject-gsap';
import {
  entranceScrollTrigger,
  hasScrollTrigger,
  joinSequence,
  warnMissingPlugin,
} from './internal';
import { prefersReducedMotion } from './presets';
import { Sequence } from './sequence';
import type { GsapTweenVars } from './types';

/**
 * Draws an SVG stroke in, from nothing to fully drawn. Put it on a
 * `<path>`, `<circle>`, `<line>`, or a group/svg (then every stroked
 * descendant draws, staggered).
 *
 * ```html
 * <path drawSvg d="…" />
 * <svg drawSvg on="scroll">…</svg>
 * ```
 *
 * Needs DrawSVGPlugin via `provideGsap({ plugins: [DrawSVGPlugin] })`.
 * Does nothing under `prefers-reduced-motion`.
 */
@Directive({ selector: '[drawSvg]' })
export class DrawSvg {
  private readonly host = inject<ElementRef<Element>>(ElementRef);
  private readonly sequence = inject(Sequence, { optional: true });

  /** `init` draws after first render; `scroll` when the element enters the viewport. */
  readonly on = input<'init' | 'scroll'>('init');
  readonly delay = input(0, { transform: numberAttribute });
  readonly duration = input(1.2, { transform: numberAttribute });
  readonly ease = input('power2.inOut');
  /** Seconds between strokes when the host contains several. */
  readonly each = input(0.15, { transform: numberAttribute });
  /** ScrollTrigger `start` (only used with `on="scroll"`). */
  readonly start = input('top 85%');
  /** Position in a parent `sequence` (GSAP position parameter). */
  readonly at = input<string | number>('');
  readonly completed = output<void>();

  readonly ctx = injectGsap(({ gsap }) => {
    if (prefersReducedMotion()) {
      return;
    }
    const host = this.host.nativeElement;
    const strokes =
      host instanceof SVGGeometryElement
        ? [host]
        : Array.from(
            host.querySelectorAll('path, circle, line, rect, ellipse, polyline')
          );
    if (strokes.length === 0) {
      return;
    }
    const vars: GsapTweenVars = {
      drawSVG: 0,
      delay: this.delay(),
      duration: this.duration(),
      ease: this.ease(),
      stagger: this.each(),
      onComplete: () => this.completed.emit(),
    };
    if (this.on() === 'scroll') {
      if (hasScrollTrigger(gsap)) {
        Object.assign(vars, entranceScrollTrigger(host, this.start()));
      } else {
        warnMissingPlugin('on="scroll"', 'ScrollTrigger');
      }
      gsap.from(strokes, vars);
      return;
    }
    joinSequence(this.sequence, gsap.from(strokes, vars), this.at());
  });
}
