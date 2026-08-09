import { Component, computed, signal } from '@angular/core';
import { injectGsap } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';

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
          context reverts, the ring re-renders, and the entrance replays — the
          same mental model as any other signal-driven view.
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
