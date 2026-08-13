import {
  Component,
  ElementRef,
  computed,
  signal,
  viewChildren,
} from '@angular/core';
import { injectGsap, targets } from '@angular-gsap/core';
import { Flip } from 'gsap/Flip';
import { CodeTabs, type CodeFile } from '../code-tabs';
import { injectLocale } from '../i18n';
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
  { id: 1, label: 'injectGsap', tag: 'core', color: 'var(--pulse)' },
  { id: 2, label: 'ScrollTrigger', tag: 'plugin', color: 'var(--kinetic)' },
  { id: 3, label: 'contextSafe', tag: 'core', color: 'var(--arc)' },
  { id: 4, label: 'SplitText', tag: 'plugin', color: 'var(--ember)' },
  { id: 5, label: 'provideGsap', tag: 'core', color: 'var(--arc)' },
  { id: 6, label: 'Flip', tag: 'plugin', color: 'var(--pulse)' },
  { id: 7, label: 'reveal', tag: 'core', color: 'var(--kinetic)' },
  { id: 8, label: 'MorphSVG', tag: 'plugin', color: 'var(--ember)' },
];

const COPY = {
  en: {
    eyebrow: 'Advanced · plugin: Flip',
    title: 'FLIP layout transitions',
    intro:
      'Filter the grid and the reflow is FLIP-animated. The whole trick is ordering: capture the layout <em>before</em> the signal changes the DOM, animate <em>after</em> Angular renders. Those are exactly the two moments this library hands you.',
    how: 'How this works',
    explain: [
      'Flip needs two snapshots: the layout before the change and after. <code>Flip.getState()</code> runs in the click handler, before the signal updates. The callback runs after Angular renders, so <code>Flip.from()</code> measures the new layout. That ordering is the hard part, and it falls out of how <code>injectGsap</code> works.',
      '<code>track card.id</code> keeps the DOM nodes of surviving cards, so Flip matches them by identity. <code>data-flip-id</code> covers the ones that enter.',
      'Click filters as fast as you want; each re-run reverts the previous one first.',
    ],
  },
  es: {
    eyebrow: 'Avanzado · plugin: Flip',
    title: 'Transiciones de layout con FLIP',
    intro:
      'Filtra la cuadrícula y el reacomodo se anima con FLIP. Todo el truco es el orden: capturar el layout <em>antes</em> de que el signal cambie el DOM, animar <em>después</em> de que Angular pinte. Esos son exactamente los dos momentos que esta librería te entrega.',
    how: 'Cómo funciona',
    explain: [
      'Flip necesita dos instantáneas: el layout antes del cambio y después. <code>Flip.getState()</code> corre en el handler del click, antes de que el signal se actualice. El callback corre después de que Angular pinta, así que <code>Flip.from()</code> mide el layout nuevo. Ese orden es la parte difícil, y sale gratis de cómo funciona <code>injectGsap</code>.',
      '<code>track card.id</code> conserva los nodos del DOM de las tarjetas que sobreviven, así Flip las empareja por identidad. <code>data-flip-id</code> cubre las que entran.',
      'Filtra tan rápido como quieras; cada re-ejecución revierte la anterior primero.',
    ],
  },
} as const;

@Component({
  selector: 'app-flip',
  imports: [CodeTabs],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
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
                  #card
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
          <app-code-tabs [files]="files" />
        </div>
      </div>

      <section class="explain">
        <h2>{{ c.how }}</h2>
        <ul>
          @for (item of c.explain; track $index) {
            <li [innerHTML]="item"></li>
          }
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
  protected readonly c = COPY[injectLocale()];

  protected readonly tags: Tag[] = ['all', 'core', 'plugin'];
  protected readonly filter = signal<Tag>('all');

  protected readonly cards = computed(() =>
    this.filter() === 'all'
      ? CARDS
      : CARDS.filter((c) => c.tag === this.filter())
  );

  private flipState?: Flip.FlipState;

  private readonly cardEls = viewChildren<ElementRef<HTMLElement>>('card');

  protected readonly ref = injectGsap(({ gsap }) => {
    this.filter(); // tracked: re-runs after the @for re-renders
    const state = this.flipState;
    this.flipState = undefined;
    if (!state) {
      return; // first render: nothing to transition from
    }
    Flip.from(state, {
      targets: targets(this.cardEls),
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
    this.flipState = Flip.getState(targets(this.cardEls));
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
    `cards = viewChildren<ElementRef>('card');`,
    ``,
    `setFilter(tag) {`,
    `  // 1) capture layout BEFORE the DOM changes`,
    `  this.flipState = Flip.getState(targets(this.cards));`,
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
    `    targets: targets(this.cards),`,
    `    duration: 0.55,`,
    `    ease: 'power3.inOut',`,
    `    onEnter: (els) =>`,
    `      gsap.fromTo(els,`,
    `        { opacity: 0, scale: 0.85 },`,
    `        { opacity: 1, scale: 1, duration: 0.4 }),`,
    `  });`,
    `});`,
  ].join('\n');

  protected readonly files: CodeFile[] = [
    { label: 'grid.html', code: this.tplSnippet, lang: 'html' },
    { label: 'grid.ts', code: this.snippet, lang: 'ts' },
  ];
}
