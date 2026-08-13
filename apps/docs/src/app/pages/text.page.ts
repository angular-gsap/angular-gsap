import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { CodeTabs, type CodeFile } from '../code-tabs';
import { injectLocale } from '../i18n';
import { injectGsap, target } from '@angular-gsap/core';
import { SplitText } from 'gsap/SplitText';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'SplitText · angular-gsap',
};

type SplitMode = 'chars' | 'words' | 'lines';

const STAGGER: Record<SplitMode, number> = {
  chars: 0.012,
  words: 0.04,
  lines: 0.14,
};

const COPY = {
  en: {
    eyebrow: 'Example · plugin: SplitText',
    title: 'Text splitting',
    intro:
      '<code>mode()</code> and <code>run()</code> are both read in the callback, so switching the split granularity (or hitting replay) reverts the previous split and starts over. On destroy the paragraph is restored exactly as it was.',
    passage:
      'Great interfaces move with intent. Split this paragraph into characters, words, or lines, then choreograph the pieces with the full GSAP toolbox. Leave the page, and every piece is stitched back together exactly as it was.',
    replay: 'Replay',
    how: 'How this works',
    explain: [
      "<code>mode()</code> and <code>run()</code> are both read in the callback. Change either one and it re-runs. That's the entire replay mechanism.",
      'SplitText created inside the context is reverted with it: leave the page and the paragraph is back to its original markup, no leftover spans.',
      "Each re-split works on the restored paragraph, not on the previous run's spans, because the re-run reverts first.",
    ],
  },
  es: {
    eyebrow: 'Ejemplo · plugin: SplitText',
    title: 'División de texto',
    intro:
      '<code>mode()</code> y <code>run()</code> se leen en el callback, así que cambiar la granularidad (o darle a repetir) revierte la división anterior y empieza de nuevo. Al destruir, el párrafo queda restaurado tal cual estaba.',
    passage:
      'Las buenas interfaces se mueven con intención. Divide este párrafo en caracteres, palabras o líneas, y coreografía las piezas con toda la caja de herramientas de GSAP. Sal de la página y cada pieza vuelve a coserse exactamente como estaba.',
    replay: 'Repetir',
    how: 'Cómo funciona',
    explain: [
      '<code>mode()</code> y <code>run()</code> se leen en el callback. Cambia cualquiera y se vuelve a ejecutar. Ese es todo el mecanismo de repetición.',
      'El SplitText creado dentro del contexto se revierte con él: sal de la página y el párrafo vuelve a su marcado original, sin spans sobrantes.',
      'Cada nueva división trabaja sobre el párrafo restaurado, no sobre los spans de la ejecución anterior, porque cada re-ejecución revierte primero.',
    ],
  },
} as const;

@Component({
  imports: [CodeTabs],
  selector: 'app-text',
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>SplitText</span><span>injectGsap</span><span>signal</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage text-stage">
            <p #passage class="passage">{{ c.passage }}</p>
          </div>
          <div class="stage-controls">
            @for (m of modes; track m) {
              <button
                class="btn"
                [class.btn--quiet]="mode() !== m"
                (click)="mode.set(m)"
              >
                {{ m }}
              </button>
            }
            <button class="btn" (click)="replay()">{{ c.replay }}</button>
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
    .text-stage {
      display: grid;
      align-content: center;
      padding: 2.5rem;
      min-height: 20rem;
    }

    .passage {
      font-family: var(--font-display);
      font-stretch: 108%;
      font-weight: 600;
      font-size: clamp(1.2rem, 2.4vw, 1.7rem);
      line-height: 1.45;
      margin: 0;
    }
  `,
})
export default class TextPage {
  protected readonly c = COPY[injectLocale()];

  protected readonly modes: SplitMode[] = ['chars', 'words', 'lines'];
  protected readonly mode = signal<SplitMode>('words');
  protected readonly run = signal(0);

  private readonly passage =
    viewChild.required<ElementRef<HTMLElement>>('passage');

  protected readonly ref = injectGsap(({ gsap }) => {
    this.run(); // tracked: replay() bumps it to re-run the context
    const mode = this.mode();
    const passage = target(this.passage);
    if (!passage) {
      return;
    }
    const split = SplitText.create(passage, { type: mode });
    gsap.from(split[mode], {
      y: 26,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: STAGGER[mode],
    });
  });

  protected replay = () => this.run.update((n) => n + 1);

  protected readonly tplSnippet = [
    `<p #passage class="passage">Great interfaces move…</p>`,
    ``,
    `@for (m of modes; track m) {`,
    `  <button (click)="mode.set(m)">{{ m }}</button>`,
    `}`,
    `<button (click)="replay()">Replay</button>`,
  ].join('\n');

  protected readonly snippet = [
    `export default class TextPage {
  protected readonly c = COPY[injectLocale()];
`,
    `  mode = signal<'chars' | 'words' | 'lines'>('words');`,
    `  run = signal(0);`,
    `  passage = viewChild.required<ElementRef>('passage');`,
    ``,
    `  ref = injectGsap(({ gsap }) => {`,
    `    this.run(); // replay = just bump a signal`,
    `    const mode = this.mode();`,
    `    const split = SplitText.create(`,
    `      target(this.passage),`,
    `      { type: mode },`,
    `    );`,
    `    gsap.from(split[mode], {`,
    `      y: 26, opacity: 0,`,
    `      stagger: 0.04,`,
    `    });`,
    `  });`,
    ``,
    `  replay = () => this.run.update((n) => n + 1);`,
    `}`,
  ].join('\n');

  protected readonly files: CodeFile[] = [
    { label: 'passage.html', code: this.tplSnippet, lang: 'html' },
    { label: 'passage.ts', code: this.snippet, lang: 'ts' },
  ];
}
