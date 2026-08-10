import {
  Component,
  ElementRef,
  computed,
  signal,
  viewChildren,
} from '@angular/core';
import { injectGsap, targets } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Start · angular-gsap',
};

const RING_COLORS = ['#e23b80', '#5b4be8', '#ffb627', '#0ae448'];

const COPY = {
  en: {
    eyebrow: 'Example · core',
    title: 'Signal-driven animations',
    intro:
      "The dots come from a <code>viewChildren()</code> query, read inside the callback. Move the slider and the query updates, the context reverts, and the entrance replays. It's the same mental model as any other signal-driven view.",
    dots: 'dots',
    burst: 'Burst',
    how: 'How this works',
    explain: [
      "<code>viewChildren('dot')</code> is a signal. Move the slider, <code>count()</code> changes, the <code>@for</code> renders new dots, the query updates, and the callback runs again with the new elements already in the DOM.",
      'Every re-run starts from a <code>revert()</code>, so there are no leftover inline styles from the previous entrance.',
      'Burst is a normal event handler wrapped in <code>contextSafe</code>: its tween joins the same context and dies with the component.',
      "Selector strings work too. <code>gsap.from('.dot', …)</code> is scoped to this component, so the same class elsewhere on the page isn't touched.",
    ],
  },
  es: {
    eyebrow: 'Ejemplo · core',
    title: 'Animaciones dirigidas por signals',
    intro:
      'Los puntos vienen de una query <code>viewChildren()</code> leída dentro del callback. Mueve el slider y la query se actualiza, el contexto se revierte y la entrada se repite. Es el mismo modelo mental que cualquier vista dirigida por signals.',
    dots: 'puntos',
    burst: 'Explotar',
    how: 'Cómo funciona',
    explain: [
      "<code>viewChildren('dot')</code> es un signal. Mueves el slider, <code>count()</code> cambia, el <code>@for</code> pinta puntos nuevos, la query se actualiza y el callback vuelve a correr con los elementos ya en el DOM.",
      'Cada re-ejecución parte de un <code>revert()</code>, así que no quedan estilos inline de la entrada anterior.',
      'Explotar es un handler normal envuelto en <code>contextSafe</code>: su tween se une al mismo contexto y muere con el componente.',
      "Los selectores también funcionan. <code>gsap.from('.dot', …)</code> está limitado a este componente; la misma clase en otra parte de la página no se toca.",
    ],
  },
} as const;

@Component({
  selector: 'app-basics',
  imports: [CodeSnippet],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>injectGsap</span><span>viewChildren</span><span>targets</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage ring-stage">
            @for (dot of dots(); track dot.i) {
              <span
                #dot
                class="dot"
                [style.left.%]="dot.x"
                [style.top.%]="dot.y"
                [style.background]="dot.color"
              ></span>
            }
          </div>
          <div class="stage-controls">
            <label class="range">
              {{ c.dots }} · {{ count() }}
              <input
                type="range"
                min="3"
                max="24"
                [value]="count()"
                (input)="count.set(+$any($event.target).value)"
              />
            </label>
            <button class="btn" (click)="burst()">{{ c.burst }}</button>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="tplSnippet" lang="html" label="basics.html" />
          <app-code [code]="snippet" label="basics.ts" />
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
  protected readonly c = COPY[injectLocale()];

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

  protected readonly dotEls = viewChildren<ElementRef<HTMLElement>>('dot');

  protected readonly ref = injectGsap(({ gsap }) => {
    // the query is a signal: new dots re-run this, after they exist in the DOM
    gsap.from(targets(this.dotEls), {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(2)',
      stagger: { each: 0.04, from: 'start' },
    });
  });

  protected burst = this.ref.contextSafe(() =>
    this.ref.gsap.to(targets(this.dotEls), {
      scale: 1.7,
      duration: 0.18,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
      stagger: { each: 0.02, from: 'random' },
    })
  );

  protected readonly tplSnippet = [
    `<div class="stage">`,
    `  @for (dot of dots(); track dot.i) {`,
    `    <span #dot class="dot"></span>`,
    `  }`,
    `</div>`,
    ``,
    `<input type="range" min="3" max="24"`,
    `  [value]="count()"`,
    `  (input)="count.set(+$event.target.value)" />`,
    `<button (click)="burst()">Burst</button>`,
  ].join('\n');

  protected readonly snippet = [
    `export class Basics {`,
    `  count = signal(8);`,
    `  dots = viewChildren<ElementRef>('dot');`,
    ``,
    `  ref = injectGsap(({ gsap }) => {`,
    `    // the query is tracked: new dots re-run this`,
    `    gsap.from(targets(this.dots), {`,
    `      scale: 0, opacity: 0,`,
    `      ease: 'back.out(2)',`,
    `      stagger: 0.04,`,
    `    });`,
    `  });`,
    ``,
    `  burst = this.ref.contextSafe(() =>`,
    `    this.ref.gsap.to(targets(this.dots), {`,
    `      scale: 1.7, yoyo: true, repeat: 1,`,
    `      stagger: { each: 0.02, from: 'random' },`,
    `    })`,
    `  );`,
    `}`,
  ].join('\n');
}
