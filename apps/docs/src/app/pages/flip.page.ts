import { Component, computed, signal } from '@angular/core';
import { injectGsap } from '@angular-gsap/core';
import { Flip } from 'gsap/Flip';
import { CodeSnippet } from '../code-snippet';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Flip · angular-gsap',
};

type Tag = 'all' | 'core' | 'plugin';
interface Card {
  id: number;
  label: string;
  tag: Exclude<Tag, 'all'>;
  color: string;
}

const CARDS: Card[] = [
  { id: 1, label: 'injectGsap', tag: 'core', color: '#e23b80' },
  { id: 2, label: 'ScrollTrigger', tag: 'plugin', color: '#0ae448' },
  { id: 3, label: 'contextSafe', tag: 'core', color: '#5b4be8' },
  { id: 4, label: 'SplitText', tag: 'plugin', color: '#ffb627' },
  { id: 5, label: 'provideGsap', tag: 'core', color: '#5b4be8' },
  { id: 6, label: 'Flip', tag: 'plugin', color: '#e23b80' },
  { id: 7, label: 'reveal', tag: 'core', color: '#0ae448' },
  { id: 8, label: 'MorphSVG', tag: 'plugin', color: '#ffb627' },
];

@Component({
  selector: 'app-flip',
  imports: [CodeSnippet],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">Advanced · plugin: Flip</p>
        <h1>FLIP a signal-driven layout</h1>
        <p>
          Filter the grid and the reflow is FLIP-animated. The whole trick is
          ordering: capture the layout <em>before</em> the signal changes the
          DOM, animate <em>after</em> Angular renders. Those are exactly the
          two moments this library hands you.
        </p>
        <div class="api-chips">
          <span>injectGsap</span><span>Flip</span><span>&#64;for track</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage flip-stage">
            <div class="flip-grid">
              @for (card of cards(); track card.id) {
                <div
                  class="flip-card"
                  [attr.data-flip-id]="card.id"
                  [style.--c]="card.color"
                >
                  <span class="dot-mark"></span>{{ card.label }}
                </div>
              }
            </div>
          </div>
          <div class="stage-controls">
            @for (t of tags; track t) {
              <button
                class="btn"
                [class.btn--quiet]="filter() !== t"
                (click)="setFilter(t)"
              >
                {{ t }}
              </button>
            }
          </div>
        </div>
        <div class="panels">
          <app-code [code]="tplSnippet" lang="html" label="grid.html" />
          <app-code [code]="snippet" label="grid.ts" />
        </div>
      </div>

      <section class="explain">
        <h2>How this works</h2>
        <ul>
          <li>
            Flip needs two snapshots: the layout before the change and after.
            <code>Flip.getState()</code> runs in the click handler, before the
            signal updates. The callback runs after Angular renders, so
            <code>Flip.from()</code> measures the new layout. That ordering is
            the hard part, and it falls out of how <code>injectGsap</code>
            works.
          </li>
          <li>
            <code>track card.id</code> keeps the DOM nodes of surviving cards,
            so Flip matches them by identity. <code>data-flip-id</code> covers
            the ones that enter.
          </li>
          <li>
            Click filters as fast as you want; each re-run reverts the previous
            one first.
          </li>
        </ul>
      </section>
    </div>
  `,
  styles: `
    .flip-stage {
      display: grid;
      align-items: center;
      padding: 2rem;
      min-height: 24rem;
    }

    .flip-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.9rem;
    }

    .flip-card {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: var(--paper);
      border: 1px solid var(--hairline);
      border-radius: 10px;
      padding: 0.85rem 1rem;
      font-family: var(--font-mono);
      font-size: 0.85rem;
    }

    .dot-mark {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--c);
      flex: none;
    }
  `,
})
export default class FlipPage {
  protected readonly tags: Tag[] = ['all', 'core', 'plugin'];
  protected readonly filter = signal<Tag>('all');

  protected readonly cards = computed(() =>
    this.filter() === 'all'
      ? CARDS
      : CARDS.filter((c) => c.tag === this.filter())
  );

  private flipState?: Flip.FlipState;

  protected readonly ref = injectGsap(({ gsap }) => {
    this.filter(); // tracked: re-runs after the @for re-renders
    const state = this.flipState;
    this.flipState = undefined;
    if (!state) {
      return; // first render: nothing to transition from
    }
    Flip.from(state, {
      targets: '.flip-card',
      duration: 0.55,
      ease: 'power3.inOut',
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.85 },
          { opacity: 1, scale: 1, duration: 0.4 }
        ),
    });
  });

  protected setFilter(tag: Tag) {
    if (tag === this.filter()) {
      return;
    }
    // 1) capture the layout BEFORE the DOM changes
    this.flipState = Flip.getState('.flip-card');
    this.filter.set(tag);
  }

  protected readonly tplSnippet = [
    `@for (card of cards(); track card.id) {`,
    `  <div class="flip-card"`,
    `    [attr.data-flip-id]="card.id">`,
    `    {{ card.label }}`,
    `  </div>`,
    `}`,
    ``,
    `@for (t of tags; track t) {`,
    `  <button (click)="setFilter(t)">{{ t }}</button>`,
    `}`,
  ].join('\n');

  protected readonly snippet = [
    `filter = signal<'all' | 'core' | 'plugin'>('all');`,
    `cards = computed(() => /* filter the list */);`,
    `private flipState?: Flip.FlipState;`,
    ``,
    `setFilter(tag) {`,
    `  // 1) capture layout BEFORE the DOM changes`,
    `  this.flipState = Flip.getState('.flip-card');`,
    `  this.filter.set(tag);`,
    `}`,
    ``,
    `ref = injectGsap(({ gsap }) => {`,
    `  this.filter(); // 2) re-runs AFTER @for re-renders`,
    `  const state = this.flipState;`,
    `  this.flipState = undefined;`,
    `  if (!state) return;`,
    ``,
    `  Flip.from(state, {`,
    `    targets: '.flip-card',`,
    `    duration: 0.55,`,
    `    ease: 'power3.inOut',`,
    `    onEnter: (els) =>`,
    `      gsap.fromTo(els,`,
    `        { opacity: 0, scale: 0.85 },`,
    `        { opacity: 1, scale: 1, duration: 0.4 }),`,
    `  });`,
    `});`,
  ].join('\n');
}
