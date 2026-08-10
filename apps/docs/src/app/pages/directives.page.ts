import { Component, signal } from '@angular/core';
import {
  Counter,
  Parallax,
  Reveal,
  ScrambleText,
  Sequence,
  SplitReveal,
  Stagger,
  type RevealPreset,
} from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { CodeTabs, type CodeFile } from '../code-tabs';
import { DIRECTIVE_EXAMPLES, type DirectiveExample } from '../directive-examples';
import { DirectiveDemo } from '../directive-demo';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Directives · angular-gsap',
};

const COPY = {
  en: {
    eyebrow: 'Example · directives',
    title: 'Template directives',
    intro:
      'Preset directives cover the common template-level cases: <code>reveal</code>, <code>stagger</code>, and <code>splitReveal</code> for entrances, <code>drawSvg</code> for strokes, <code>counter</code> for numbers, <code>parallax</code> for scroll-linked drift, and <code>sequence</code> to compose them. Everything runs on the <code>injectGsap</code> engine, so scoping, cleanup, and reduced motion come along for free.',
    boardLine: 'and this line staggers in word by word',
    scramble: 'THIS ONE DECODES ITSELF',
    replay: 'Replay',
    scrollEyebrow: 'And on scroll',
    tailNote:
      'This paragraph used <code>reveal="fade-up" on="scroll"</code>, and the blocks above drift at different <code>parallax</code> speeds. Under the hood both are ScrollTrigger, registered once in <code>provideGsap</code>.',
    fullTitle: 'Complete examples',
    fullIntro:
      'One self-contained component per directive: the TypeScript and the template exactly as they would sit in your project, plus a stylesheet when the example needs one. Copy the pair and it runs.',
    refs: {
      reveal: 'Entrances for a single element, on render or on scroll. Presets: <code>fade</code>, <code>fade-up/down/left/right</code>, <code>scale-in</code>.',
      stagger: "The same entrances across an element's children. Works naturally with <code>@for</code>: new items replay the entrance.",
      splitReveal: 'Splits text into characters, words, or lines and staggers the pieces. The original markup is restored on destroy.',
      scrambleText: "Scrambles text into place. Without a target text it decodes the element's own content.",
      counter: "Counts the element's text to a number, formatted with the user's locale.",
      parallax: 'Scroll-linked drift as the element crosses the viewport. Negative speeds move against the scroll.',
      drawSvg: 'Draws SVG strokes in. On a container, every stroked descendant draws, staggered.',
      sequence: 'Composes child entrances into one timeline. Nesting is the choreography; <code>[at]</code> takes GSAP position syntax for overlaps.',
      drag: 'Draggable with bounds (the parent by default), a grid snap, and momentum on release.',
      scrollTo: 'Smooth-scrolls to a selector on click, with a native fallback when the plugin is not registered.',
      observe: 'Wheel, touch, and pointer as one stream of Angular outputs.',
      hover: 'Pointer micro-interactions. Enter and leave tweens overwrite each other, so fast passes never pile up.',
    },
    how: 'How this works',
    explain: [
      '<code>reveal</code> and <code>stagger</code> are presets on top of <code>injectGsap</code>: same scoping, same cleanup, same signal inputs. They only cover entrances, on purpose. Anything richer goes in the composable.',
      'The board is wrapped in <code>sequence="0.1"</code>, so the heading, the cards, and the split line play one after another with no <code>[delay]</code> bookkeeping. Template nesting is the choreography; <code>[at]</code> takes any GSAP position parameter for overlaps.',
      'Change any input and the entrance replays. The Replay button just recreates the subtree.',
      "With Reduce Motion turned on in the OS, these directives don't animate and the content simply shows. If this page looks static, check that setting.",
    ],
  },
  es: {
    eyebrow: 'Ejemplo · directivas',
    title: 'Directivas de template',
    intro:
      'Las directivas preset cubren los casos comunes a nivel de template: <code>reveal</code>, <code>stagger</code> y <code>splitReveal</code> para entradas, <code>drawSvg</code> para trazos, <code>counter</code> para números, <code>parallax</code> para deriva ligada al scroll, y <code>sequence</code> para componerlas. Todo corre sobre el motor de <code>injectGsap</code>: scoping, limpieza y reduced motion vienen gratis.',
    boardLine: 'y esta línea entra palabra por palabra',
    scramble: 'ESTA SE DECODIFICA SOLA',
    replay: 'Repetir',
    scrollEyebrow: 'Y con scroll',
    tailNote:
      'Este párrafo usó <code>reveal="fade-up" on="scroll"</code>, y los bloques de arriba derivan a distintas velocidades de <code>parallax</code>. Por debajo ambos son ScrollTrigger, registrado una vez en <code>provideGsap</code>.',
    fullTitle: 'Ejemplos completos',
    fullIntro:
      'Un componente autocontenido por directiva: el TypeScript y el template tal como irían en tu proyecto, más una hoja de estilos cuando el ejemplo la necesita. Copia el par y funciona.',
    refs: {
      reveal: 'Entradas para un solo elemento, al pintar o con scroll. Presets: <code>fade</code>, <code>fade-up/down/left/right</code>, <code>scale-in</code>.',
      stagger: 'Las mismas entradas sobre los hijos de un elemento. Funciona natural con <code>@for</code>: los items nuevos repiten la entrada.',
      splitReveal: 'Divide el texto en caracteres, palabras o líneas y escalona las piezas. El marcado original se restaura al destruir.',
      scrambleText: 'Descodifica el texto en su lugar. Sin texto objetivo, descodifica el contenido propio del elemento.',
      counter: 'Cuenta el texto del elemento hasta un número, con el formato del locale del usuario.',
      parallax: 'Deriva ligada al scroll mientras el elemento cruza el viewport. Velocidades negativas van contra el scroll.',
      drawSvg: 'Dibuja trazos de SVG. En un contenedor, cada descendiente con trazo se dibuja, escalonado.',
      sequence: 'Compone las entradas hijas en un solo timeline. Anidar es la coreografía; <code>[at]</code> acepta posiciones de GSAP para solapar.',
      drag: 'Draggable con límites (el padre por defecto), snap de cuadrícula e impulso al soltar.',
      scrollTo: 'Scroll suave hasta un selector al hacer click, con fallback nativo si el plugin no está registrado.',
      observe: 'Rueda, touch y puntero como un solo stream de outputs de Angular.',
      hover: 'Microinteracciones de puntero. Los tweens de entrada y salida se sobreescriben: los pases rápidos no se acumulan.',
    },
    how: 'Cómo funciona',
    explain: [
      '<code>reveal</code> y <code>stagger</code> son presets sobre <code>injectGsap</code>: mismo scoping, misma limpieza, mismos inputs de signal. Solo cubren entradas, a propósito. Cualquier cosa más rica va en el composable.',
      'El tablero está envuelto en <code>sequence="0.1"</code>: el título, las tarjetas y la línea partida entran una tras otra sin contabilidad de <code>[delay]</code>. Anidar en el template es la coreografía; <code>[at]</code> acepta cualquier parámetro de posición de GSAP.',
      'Cambia cualquier input y la entrada se repite. El botón Repetir solo recrea el subárbol.',
      'Con Reducir Movimiento activado en el sistema, estas directivas no animan y el contenido simplemente aparece. Si esta página se ve estática, revisa ese ajuste.',
    ],
  },
} as const;

@Component({
  selector: 'app-directives',
  imports: [
    CodeSnippet,
    CodeTabs,
    DirectiveDemo,
    Counter,
    Parallax,
    Reveal,
    ScrambleText,
    Sequence,
    SplitReveal,
    Stagger,
  ],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>sequence</span><span>reveal</span><span>stagger</span
          ><span>splitReveal</span><span>counter</span><span>parallax</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage directives-stage">
            @for (run of [runId()]; track run) {
              <div class="board" sequence="0.1">
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
                <p class="board-line" splitReveal>
                  {{ c.boardLine }}
                </p>
                <p class="board-scramble" scrambleText [duration]="0.9">
                  {{ c.scramble }}
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
            <button class="btn" (click)="replay()">{{ c.replay }}</button>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="snippet" lang="html" label="hero.html" />
          <app-code [code]="tsSnippet" label="hero.ts" />
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

      <section class="full-refs">
        <h2 class="refs-title">{{ c.fullTitle }}</h2>
        <p class="refs-intro">{{ c.fullIntro }}</p>

        @for (ex of examples; track ex.id) {
          <article class="ref-card" [id]="ex.id">
            <h3><code>{{ ex.name }}</code></h3>
            <p [innerHTML]="refText(ex.id)"></p>
            <div class="ref-body">
              <app-directive-demo [id]="ex.id" [label]="c.replay" />
              <app-code-tabs [files]="filesOf(ex)" />
            </div>
          </article>
        }
      </section>

      <section class="scroll-tail">
        <p class="eyebrow">{{ c.scrollEyebrow }}</p>
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
          <span [innerHTML]="c.tailNote"></span>
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

    .board-scramble {
      font-family: var(--font-mono);
      font-size: 0.9rem;
      color: var(--ink);
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

    .full-refs {
      margin-top: 4rem;
      border-top: var(--bw) solid var(--ink);
      padding-top: 2rem;
    }

    .refs-title {
      font-size: 1.6rem;
      font-weight: 900;
      text-transform: uppercase;
    }

    .refs-intro {
      color: var(--ink-soft);
      max-width: 44rem;
      margin: 0.75rem 0 2rem;
    }

    .ref-card {
      border: var(--bw) solid var(--ink);
      border-radius: 14px;
      box-shadow: var(--shadow-sm);
      background: var(--card);
      padding: 1.5rem;
      margin-bottom: 2rem;

      h3 {
        font-size: 1.15rem;
        margin-bottom: 0.5rem;

        code {
          font-family: var(--font-mono);
        }
      }

      > p {
        color: var(--ink-soft);
        max-width: 44rem;
        margin: 0 0 1.25rem;

        code {
          font-family: var(--font-mono);
          font-size: 0.85em;
          color: var(--ink);
        }
      }
    }

    .ref-body {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
      gap: 1.5rem;
      align-items: start;
    }

    @media (max-width: 56rem) {
      .ref-body {
        grid-template-columns: minmax(0, 1fr);
      }
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
  protected readonly examples = DIRECTIVE_EXAMPLES;

  protected refText(id: string): string {
    return (this.c.refs as Record<string, string>)[id] ?? '';
  }

  protected filesOf(ex: DirectiveExample): CodeFile[] {
    const base = ex.id.toLowerCase();
    const files: CodeFile[] = [
      { label: base + '.component.ts', code: ex.ts, lang: 'ts' },
      { label: base + '.component.html', code: ex.html, lang: 'html' },
    ];
    if (ex.css) {
      files.push({ label: base + '.component.css', code: ex.css, lang: 'css' });
    }
    return files;
  }

  protected readonly c = COPY[injectLocale()];

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
    `<!-- nesting is the choreography -->`,
    `<section sequence="0.1">`,
    `  <h2 reveal="fade-up">Hi</h2>`,
    `  <ul stagger preset="scale-in">…</ul>`,
    `  <p splitReveal [at]="'<0.2'">word by word</p>`,
    `</section>`,
    ``,
    `<!-- numbers, strokes, scroll -->`,
    `<span [counter]="12500"></span>`,
    `<svg drawSvg>…</svg>`,
    `<p reveal="fade-up" on="scroll">…</p>`,
    `<img parallax="0.3" src="…" />`,
  ].join('\n');
}
