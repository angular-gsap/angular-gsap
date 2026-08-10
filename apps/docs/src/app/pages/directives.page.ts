import { Component, signal } from '@angular/core';
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
    pickIntro:
      'One self-contained component per directive: pick one to see it running next to the TypeScript and the template exactly as they would sit in your project, plus a stylesheet when the example needs one. Copy the pair and it runs.',
    replay: 'Replay',
    how: 'How this works',
    refs: {
      reveal: 'Entrances for a single element, on render or on scroll. Presets: <code>fade</code>, <code>fade-up/down/left/right</code>, <code>scale-in</code>. The demo scrolls inside its own frame via <code>[scroller]</code>.',
      stagger: "The same entrances across an element's children. Works naturally with <code>@for</code>: new items replay the entrance.",
      splitReveal: 'Splits text into characters, words, or lines and staggers the pieces. The original markup is restored on destroy.',
      scrambleText: "Scrambles text into place. Without a target text it decodes the element's own content.",
      counter: "Counts the element's text to a number, formatted with the user's locale.",
      parallax: 'Scroll-linked drift as the element crosses the viewport. Negative speeds move against the scroll. Here it follows the frame, not the page: that is <code>[scroller]</code>.',
      drawSvg: 'Draws SVG strokes in. On a container, every stroked descendant draws, staggered.',
      sequence: 'Composes child entrances into one timeline. Nesting is the choreography; <code>[at]</code> takes GSAP position syntax for overlaps.',
      drag: 'Draggable with bounds (the parent by default), a grid snap, and momentum on release.',
      scrollTo: 'Smooth-scrolls to a selector on click, with a native fallback when the plugin is not registered.',
      observe: 'Wheel, touch, and pointer as one stream of Angular outputs.',
      hover: 'Pointer micro-interactions. Enter and leave tweens overwrite each other, so fast passes never pile up.',
    },
    explain: [
      'Every directive here is a preset on top of <code>injectGsap</code>: same scoping, same cleanup, same signal inputs. They cover the common cases; for anything richer, drop to the composable.',
      'The sequence example wraps its children in <code>sequence="0.1"</code>: the title, the tags, and the split line play one after another with no <code>[delay]</code> bookkeeping. Template nesting is the choreography; <code>[at]</code> takes any GSAP position parameter for overlaps.',
      'Inputs are signals: change any of them and the entrance replays. The Replay button just recreates the subtree.',
      'The reveal and parallax demos scroll inside their own frame instead of the page: <code>[scroller]</code> points ScrollTrigger at any scrollable container.',
      "With Reduce Motion turned on in the OS, these directives don't animate and the content simply shows. If this page looks static, check that setting.",
    ],
  },
  es: {
    eyebrow: 'Ejemplo · directivas',
    title: 'Directivas de template',
    intro:
      'Las directivas preset cubren los casos comunes a nivel de template: <code>reveal</code>, <code>stagger</code> y <code>splitReveal</code> para entradas, <code>drawSvg</code> para trazos, <code>counter</code> para números, <code>parallax</code> para deriva ligada al scroll, y <code>sequence</code> para componerlas. Todo corre sobre el motor de <code>injectGsap</code>: scoping, limpieza y reduced motion vienen gratis.',
    pickIntro:
      'Un componente autocontenido por directiva: elige una para verla funcionando junto al TypeScript y el template tal como irían en tu proyecto, más una hoja de estilos cuando el ejemplo la necesita. Copia el par y funciona.',
    replay: 'Repetir',
    how: 'Cómo funciona',
    refs: {
      reveal: 'Entradas para un solo elemento, al pintar o con scroll. Presets: <code>fade</code>, <code>fade-up/down/left/right</code>, <code>scale-in</code>. El demo hace scroll dentro de su propio marco vía <code>[scroller]</code>.',
      stagger: 'Las mismas entradas sobre los hijos de un elemento. Funciona natural con <code>@for</code>: los items nuevos repiten la entrada.',
      splitReveal: 'Divide el texto en caracteres, palabras o líneas y escalona las piezas. El marcado original se restaura al destruir.',
      scrambleText: 'Descodifica el texto en su lugar. Sin texto objetivo, descodifica el contenido propio del elemento.',
      counter: 'Cuenta el texto del elemento hasta un número, con el formato del locale del usuario.',
      parallax: 'Deriva ligada al scroll mientras el elemento cruza el viewport. Velocidades negativas van contra el scroll. Aquí sigue al marco, no a la página: eso es <code>[scroller]</code>.',
      drawSvg: 'Dibuja trazos de SVG. En un contenedor, cada descendiente con trazo se dibuja, escalonado.',
      sequence: 'Compone las entradas hijas en un solo timeline. Anidar es la coreografía; <code>[at]</code> acepta posiciones de GSAP para solapar.',
      drag: 'Draggable con límites (el padre por defecto), snap de cuadrícula e impulso al soltar.',
      scrollTo: 'Scroll suave hasta un selector al hacer click, con fallback nativo si el plugin no está registrado.',
      observe: 'Rueda, touch y puntero como un solo stream de outputs de Angular.',
      hover: 'Microinteracciones de puntero. Los tweens de entrada y salida se sobreescriben: los pases rápidos no se acumulan.',
    },
    explain: [
      'Cada directiva aquí es un preset sobre <code>injectGsap</code>: mismo scoping, misma limpieza, mismos inputs de signal. Cubren los casos comunes; para cualquier cosa más rica, usa el composable.',
      'El ejemplo de sequence envuelve a sus hijos en <code>sequence="0.1"</code>: el título, las etiquetas y la línea partida entran una tras otra sin contabilidad de <code>[delay]</code>. Anidar en el template es la coreografía; <code>[at]</code> acepta cualquier parámetro de posición de GSAP.',
      'Los inputs son signals: cambia cualquiera y la entrada se repite. El botón Repetir solo recrea el subárbol.',
      'Los demos de reveal y parallax hacen scroll dentro de su propio marco en lugar de la página: <code>[scroller]</code> apunta ScrollTrigger a cualquier contenedor con scroll.',
      'Con Reducir Movimiento activado en el sistema, estas directivas no animan y el contenido simplemente aparece. Si esta página se ve estática, revisa ese ajuste.',
    ],
  },
} as const;

@Component({
  selector: 'app-directives',
  imports: [CodeTabs, DirectiveDemo],
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

      <section class="full-refs" id="examples">
        <p class="refs-intro">{{ c.pickIntro }}</p>

        <div class="picker">
          @for (ex of examples; track ex.id) {
            <button
              type="button"
              class="btn"
              [class.btn--quiet]="sel().id !== ex.id"
              [attr.aria-pressed]="sel().id === ex.id"
              (click)="sel.set(ex)"
            >
              {{ ex.name }}
            </button>
          }
        </div>

        <article class="ref-card" [id]="sel().id">
          <h3><code>{{ sel().name }}</code></h3>
          <p [innerHTML]="refText(sel().id)"></p>
          <div class="ref-body">
            <app-directive-demo [id]="sel().id" [label]="c.replay" />
            <app-code-tabs [files]="filesOf(sel())" />
          </div>
        </article>
      </section>

      <section class="explain" id="how">
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
    .full-refs {
      margin-top: 1rem;
    }

    .refs-intro {
      color: var(--ink-soft);
      max-width: 44rem;
      margin: 0 0 1.5rem;
    }

    .picker {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }

    .ref-card {
      border: var(--bw) solid var(--ink);
      border-radius: 14px;
      box-shadow: var(--shadow-sm);
      background: var(--card);
      padding: 1.5rem;

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
  `,
})
export default class DirectivesPage {
  protected readonly c = COPY[injectLocale()];
  protected readonly examples = DIRECTIVE_EXAMPLES;
  protected readonly sel = signal<DirectiveExample>(DIRECTIVE_EXAMPLES[0]);

  protected refText(id: string): string {
    return (this.c.refs as Record<string, string>)[id] ?? '';
  }

  protected filesOf(ex: DirectiveExample): CodeFile[] {
    const base = ex.id.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());
    const files: CodeFile[] = [
      { label: base + '.component.html', code: ex.html, lang: 'html' },
      { label: base + '.component.ts', code: ex.ts, lang: 'ts' },
    ];
    if (ex.css) {
      files.push({ label: base + '.component.css', code: ex.css, lang: 'css' });
    }
    return files;
  }
}
