import { Component, signal } from '@angular/core';
import {
  Counter,
  Parallax,
  Reveal,
  SplitReveal,
  Stagger,
  type RevealPreset,
} from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Directives · angular-gsap',
};

@Component({
  selector: 'app-directives',
  imports: [CodeSnippet, Counter, Parallax, Reveal, SplitReveal, Stagger],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">Example · sugar directives</p>
        <h1>Template directives</h1>
        <p>
          Five preset directives cover the common template-level cases:
          <code>reveal</code> and <code>stagger</code> for entrances,
          <code>splitReveal</code> for text, <code>counter</code> for
          numbers, and <code>parallax</code> for scroll-linked drift. All of
          them run on the <code>injectGsap</code> engine, so scoping, cleanup,
          and reduced motion come along for free. For anything richer, drop to
          the composable.
        </p>
        <div class="api-chips">
          <span>reveal</span><span>stagger</span><span>splitReveal</span
          ><span>counter</span><span>parallax</span>
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
                <p class="board-line" splitReveal [delay]="0.2">
                  and this line staggers in word by word
                </p>
                <div class="counters">
                  <span class="count" [counter]="12500" [delay]="0.4"></span>
                  <span class="count" [counter]="98.6" [decimals]="1" [delay]="0.4"></span>
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
        <div class="parallax-row" aria-hidden="true">
          <span class="p-block" parallax="0.35" style="background:#e23b80"></span>
          <span class="p-block" parallax="-0.2" style="background:#0ae448"></span>
          <span class="p-block" parallax="0.15" style="background:#5b4be8"></span>
        </div>
        <p
          class="tail-note"
          reveal="fade-up"
          on="scroll"
          [distance]="40"
        >
          This paragraph used
          <code>reveal="fade-up" on="scroll"</code>, and the blocks above
          drift at different <code>parallax</code> speeds. Under the hood both
          are ScrollTrigger, registered once in <code>provideGsap</code>.
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

    .board-line {
      font-family: var(--font-body);
      font-size: 1rem;
      color: var(--ink-soft);
      margin: 0;
    }

    .counters {
      display: flex;
      gap: 2rem;
      justify-content: center;
    }

    .count {
      font-family: var(--font-mono);
      font-size: 1.4rem;
      font-weight: 500;
    }

    .parallax-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }

    .p-block {
      width: 54px;
      height: 74px;
      border-radius: 10px;
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
    `import { GSAP_DIRECTIVES } from '@angular-gsap/core';`,
    ``,
    `@Component({`,
    `  imports: [GSAP_DIRECTIVES],`,
    `  templateUrl: './hero.html',`,
    `})`,
    `export class Hero {}`,
    `// no animation code: it all lives`,
    `// in the template`,
  ].join('\n');

  protected readonly snippet = [
    `<!-- entrances; every input is a signal -->`,
    `<h2 reveal="fade-up" [distance]="36">Hi</h2>`,
    `<ul stagger="0.07" preset="scale-in">`,
    `  <li>…</li>`,
    `</ul>`,
    ``,
    `<!-- text and numbers -->`,
    `<p splitReveal>word by word</p>`,
    `<span [counter]="12500"></span>`,
    ``,
    `<!-- scroll-linked -->`,
    `<p reveal="fade-up" on="scroll">…</p>`,
    `<img parallax="0.3" src="…" />`,
  ].join('\n');
}
