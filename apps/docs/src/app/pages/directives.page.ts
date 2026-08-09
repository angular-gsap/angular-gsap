import { Component, signal } from '@angular/core';
import { Reveal, Stagger, type RevealPreset } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Directives · angular-gsap',
};

@Component({
  selector: 'app-directives',
  imports: [CodeSnippet, Reveal, Stagger],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">Example · sugar directives</p>
        <h1>Template-level entrances</h1>
        <p>
          For the common 90% (an element or a list entering the view),
          <code>reveal</code> and <code>stagger</code> keep the animation in
          the template. They're presets built on the
          <code>injectGsap</code> engine, not general-purpose wrappers: for
          anything richer, drop to the composable.
        </p>
        <div class="api-chips">
          <span>reveal</span><span>stagger</span
          ><span>prefers-reduced-motion</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage directives-stage">
            @for (run of [runId()]; track run) {
              <div class="board">
                <h2 [reveal]="preset()" [distance]="36">
                  {{ preset() || 'fade-up' }}
                </h2>
                <div
                  class="cards"
                  stagger="0.07"
                  [preset]="preset()"
                  [distance]="36"
                >
                  @for (card of cards; track card) {
                    <span class="card" [style.background]="card"></span>
                  }
                </div>
              </div>
            }
          </div>
          <div class="stage-controls">
            @for (p of presets; track p) {
              <button
                class="btn"
                [class.btn--quiet]="preset() !== p"
                (click)="preset.set(p)"
              >
                {{ p }}
              </button>
            }
            <button class="btn" (click)="replay()">Replay</button>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="snippet" lang="html" label="hero.html" />
          <app-code [code]="tsSnippet" label="hero.ts" />
        </div>
      </div>

      <section class="explain">
        <h2>How this works</h2>
        <ul>
          <li>
            <code>reveal</code> and <code>stagger</code> are presets on top of
            <code>injectGsap</code>: same scoping, same cleanup, same signal
            inputs. They only cover entrances, on purpose. Anything richer
            goes in the composable.
          </li>
          <li>
            Change any input and the entrance replays. The Replay button just
            recreates the subtree.
          </li>
          <li>
            With Reduce Motion turned on in the OS, these directives don't
            animate and the content simply shows. If this page looks static,
            check that setting.
          </li>
        </ul>
      </section>

      <section class="scroll-tail">
        <p class="eyebrow">And on scroll</p>
        <p
          class="tail-note"
          reveal="fade-up"
          on="scroll"
          [distance]="40"
        >
          This paragraph used
          <code>reveal="fade-up" on="scroll"</code>. Under the hood that's
          ScrollTrigger, registered once in <code>provideGsap</code>.
        </p>
      </section>
    </div>
  `,
  styles: `
    .directives-stage {
      display: grid;
      place-items: center;
      min-height: 24rem;
    }

    .board {
      display: grid;
      gap: 1.5rem;
      justify-items: center;

      h2 {
        font-size: 1.6rem;
        font-weight: 800;
        font-family: var(--font-mono);
        font-stretch: 100%;
      }
    }

    .cards {
      display: flex;
      gap: 12px;
    }

    .card {
      width: 42px;
      height: 58px;
      border-radius: 8px;
    }

    .scroll-tail {
      /* a full viewport of runway so the reveal is below the fold on any screen */
      margin-top: 100vh;
      padding-bottom: 40vh;
      max-width: 34rem;
    }

    .tail-note {
      font-size: 1.2rem;
      color: var(--ink-soft);

      code {
        font-family: var(--font-mono);
        font-size: 0.85em;
        color: var(--ink);
      }
    }
  `,
})
export default class DirectivesPage {
  protected readonly presets: RevealPreset[] = [
    'fade-up',
    'fade-right',
    'scale-in',
  ];
  protected readonly preset = signal<RevealPreset>('fade-up');
  protected readonly runId = signal(0);
  protected readonly cards = ['#e23b80', '#5b4be8', '#ffb627', '#0ae448'];

  protected replay = () => this.runId.update((n) => n + 1);

  protected readonly tsSnippet = [
    `import { Reveal, Stagger } from '@angular-gsap/core';`,
    ``,
    `@Component({`,
    `  imports: [Reveal, Stagger],`,
    `  templateUrl: './hero.html',`,
    `})`,
    `export class Hero {}`,
    `// no animation code: the entrances`,
    `// live entirely in the template`,
  ].join('\n');

  protected readonly snippet = [
      `<!-- entrance on init; inputs are signals -->`,
      `<h2 reveal="fade-up" [distance]="36">Hi</h2>`,
      ``,
      `<!-- staggered children -->`,
      `<div stagger="0.07" preset="scale-in">`,
      `  <span class="card"></span>`,
      `  <span class="card"></span>`,
      `  <span class="card"></span>`,
      `</div>`,
      ``,
      `<!-- when scrolled into view -->`,
      `<p reveal="fade-up" on="scroll">…</p>`,
    ].join('\n');
}
