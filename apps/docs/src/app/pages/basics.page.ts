import { Component, computed, signal } from '@angular/core';
import { injectGsap } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Basics · angular-gsap',
};

const RING_COLORS = ['#e23b80', '#5b4be8', '#ffb627', '#0ae448'];

@Component({
  selector: 'app-basics',
  imports: [CodeSnippet],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">Example · core</p>
        <h1>Signals drive the choreography</h1>
        <p>
          The callback reads <code>count()</code>. Move the slider and the
          context reverts, the ring re-renders, and the entrance replays. It's
          the same mental model as any other signal-driven view.
        </p>
        <div class="api-chips">
          <span>injectGsap</span><span>contextSafe</span><span>signal</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage ring-stage">
            @for (dot of dots(); track dot.i) {
              <span
                class="dot"
                [style.left.%]="dot.x"
                [style.top.%]="dot.y"
                [style.background]="dot.color"
              ></span>
            }
          </div>
          <div class="stage-controls">
            <label class="range">
              dots · {{ count() }}
              <input
                type="range"
                min="3"
                max="24"
                [value]="count()"
                (input)="count.set(+$any($event.target).value)"
              />
            </label>
            <button class="btn" (click)="burst()">Burst</button>
          </div>
        </div>
        <app-code [code]="snippet" />
      </div>

      <section class="explain">
        <h2>What the library is doing here</h2>
        <ul>
          <li>
            <strong>The callback re-runs after the DOM updates.</strong>
            Moving the slider changes <code>count()</code>; the
            <code>&#64;for</code> renders the new dots first, then the callback
            re-runs, so <code>gsap.from('.dot', …)</code> sees the fresh
            elements. A hand-written <code>effect()</code> would fire before
            the template applies the change.
          </li>
          <li>
            <strong>Each re-run starts clean.</strong> The previous cycle is
            <code>revert()</code>ed before the next one plays, so half-finished
            tweens never stack inline styles on top of each other.
          </li>
          <li>
            <strong><code>contextSafe</code> keeps handlers in the family.</strong>
            The Burst tween is created outside the callback, but it's recorded
            in the same context: it runs outside change detection and dies with
            the component.
          </li>
          <li>
            <strong><code>'.dot'</code> can't leak.</strong> Selector text is
            scoped to this component's host. Another component using the same
            class is untouched.
          </li>
        </ul>
      </section>
    </div>
  `,
  styles: `
    .ring-stage {
      min-height: 24rem;
    }

    .dot {
      position: absolute;
      width: 20px;
      height: 20px;
      margin: -10px 0 0 -10px;
      border-radius: 50%;
    }
  `,
})
export default class BasicsPage {
  protected readonly count = signal(8);

  protected readonly dots = computed(() => {
    const n = this.count();
    return Array.from({ length: n }, (_, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return {
        i,
        x: 50 + Math.cos(angle) * 34,
        y: 50 + Math.sin(angle) * 36,
        color: RING_COLORS[i % RING_COLORS.length],
      };
    });
  });

  protected readonly ref = injectGsap(({ gsap }) => {
    this.count(); // the DOM for the new count exists before this re-runs
    gsap.from('.dot', {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(2)',
      stagger: { each: 0.04, from: 'start' },
    });
  });

  protected burst = this.ref.contextSafe(() =>
    this.ref.gsap.to('.dot', {
      scale: 1.7,
      duration: 0.18,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      stagger: { each: 0.02, from: 'random' },
    })
  );

  protected readonly snippet = [
      `export class Basics {`,
      `  count = signal(8);`,
      ``,
      `  ref = injectGsap(({ gsap }) => {`,
      `    this.count(); // tracked: re-runs on change`,
      `    gsap.from('.dot', {`,
      `      scale: 0, opacity: 0,`,
      `      ease: 'back.out(2)',`,
      `      stagger: 0.04,`,
      `    });`,
      `  });`,
      ``,
      `  burst = this.ref.contextSafe(() =>`,
      `    this.ref.gsap.to('.dot', {`,
      `      scale: 1.7, yoyo: true, repeat: 1,`,
      `      stagger: { each: 0.02, from: 'random' },`,
      `    })`,
      `  );`,
      `}`,
    ].join('\n');
}
