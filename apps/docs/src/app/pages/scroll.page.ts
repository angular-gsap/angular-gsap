import { Component, ElementRef, viewChild } from '@angular/core';
import { CodeTabs, type CodeFile } from '../code-tabs';
import { injectLocale } from '../i18n';
import { injectGsap, target } from '@angular-gsap/core';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'ScrollTrigger · angular-gsap',
};

const COPY = {
  en: {
    eyebrow: 'Example · plugin: ScrollTrigger',
    title: 'Scroll-scrubbed timelines',
    intro:
      "ScrollTrigger is registered once with <code>provideGsap({ plugins: [ScrollTrigger] })</code> and used exactly as the GSAP docs describe. The context reverts the trigger when you leave this page.",
    hint: 'keep scrolling: the tween is bound to the scrollbar',
    outro: 'The square became a circle, turned Angular pink to GSAP green, and did a full rotation, all scrubbed by the scrollbar rather than a clock.',
    how: 'How this works',
    explain: [
      'The <code>scrollTrigger</code> config goes straight to GSAP, unchanged.',
      "The trigger is registered in the component's context, so navigating away reverts it. Without that it would keep measuring and firing on every scroll after the page is gone, which is probably the most common GSAP-in-a-SPA bug.",
      "The scrubbing runs on GSAP's ticker. Angular does no work while you scroll.",
    ],
  },
  es: {
    eyebrow: 'Ejemplo · plugin: ScrollTrigger',
    title: 'Timelines scrubbed por scroll',
    intro:
      'ScrollTrigger se registra una vez con <code>provideGsap({ plugins: [ScrollTrigger] })</code> y se usa exactamente como lo describe la documentación de GSAP. El contexto revierte el trigger al salir de esta página.',
    hint: 'sigue haciendo scroll: el tween está atado a la barra',
    outro: 'El cuadrado se volvió círculo, pasó del rosa Angular al verde GSAP y dio una vuelta completa, todo scrubbed por la barra de scroll y no por un reloj.',
    how: 'Cómo funciona',
    explain: [
      'La configuración de <code>scrollTrigger</code> va directo a GSAP, sin cambios.',
      'El trigger queda registrado en el contexto del componente, así que navegar a otra página lo revierte. Sin eso seguiría midiendo y disparándose en cada scroll con la página ya destruida: probablemente el bug más común de GSAP en una SPA.',
      'El scrubbing corre en el ticker de GSAP. Angular no hace ningún trabajo mientras haces scroll.',
    ],
  },
} as const;

@Component({
  imports: [CodeTabs],
  selector: 'app-scroll',
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>provideGsap</span><span>ScrollTrigger</span
          ><span>injectGsap</span>
        </div>
      </header>
      <div class="panels">
        <app-code-tabs [files]="files" />
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

    <div #track class="track">
      <div class="pin">
        <div class="stage scroll-stage">
          <span #shape class="shape"></span>
          <div class="meter"><span #meterFill class="meter-fill"></span></div>
          <p class="hint">{{ c.hint }}</p>
        </div>
      </div>
    </div>

    <div class="page outro">
      <p>
        {{ c.outro }}
      </p>
    </div>
  `,
  styles: `
    .page {
      padding-bottom: 2rem;
    }

    .track {
      height: 280vh;
    }

    .pin {
      position: sticky;
      top: 5.5rem;
      padding: 0 1.5rem;
      max-width: 72rem;
      margin: 0 auto;
    }

    .scroll-stage {
      display: grid;
      place-items: center;
      align-content: center;
      gap: 2rem;
      min-height: min(70vh, 30rem);
    }

    .shape {
      width: 7rem;
      height: 7rem;
      border-radius: 14px;
      background: #e23b80;
    }

    .meter {
      width: min(60%, 20rem);
      height: 4px;
      border-radius: 999px;
      background: var(--hairline);
      overflow: hidden;
    }

    .meter-fill {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--ink);
      transform: scaleX(0);
      transform-origin: left;
    }

    .hint {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--ink-soft);
      margin: 0;
    }

    .outro {
      max-width: 44rem;
      color: var(--ink-soft);
      padding-top: 3rem;
    }
  `,
})
export default class ScrollPage {
  protected readonly c = COPY[injectLocale()];

  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly shape = viewChild.required<ElementRef<HTMLElement>>('shape');
  private readonly meterFill =
    viewChild.required<ElementRef<HTMLElement>>('meterFill');

  protected readonly ref = injectGsap(({ gsap }) => {
    const track = target(this.track);
    if (!track) {
      return;
    }
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: track,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      })
      .to(target(this.shape), {
        rotation: 360,
        borderRadius: '50%',
        backgroundColor: '#0ae448',
        scale: 1.35,
      })
      .to(target(this.meterFill), { scaleX: 1 }, 0);
  });

  protected readonly tplSnippet = [
    `<div #track class="track">        <!-- tall runway -->`,
    `  <div class="pin">        <!-- position: sticky -->`,
    `    <span #shape class="shape"></span>`,
    `    <div class="meter">`,
    `      <span #meterFill class="meter-fill"></span>`,
    `    </div>`,
    `  </div>`,
    `</div>`,
  ].join('\n');

  protected readonly snippet = [
    `// app.config.ts`,
    `provideGsap({ plugins: [ScrollTrigger] });`,
    ``,
    `// scroll.ts: plain GSAP, Angular refs`,
    `track = viewChild.required<ElementRef>('track');`,
    `shape = viewChild.required<ElementRef>('shape');`,
    ``,
    `ref = injectGsap(({ gsap }) => {`,
    `  gsap`,
    `    .timeline({`,
    `      scrollTrigger: {`,
    `        trigger: target(this.track),`,
    `        start: 'top top',`,
    `        end: 'bottom bottom',`,
    `        scrub: 0.5,`,
    `      },`,
    `    })`,
    `    .to(target(this.shape), {`,
    `      rotation: 360,`,
    `      borderRadius: '50%',`,
    `      backgroundColor: '#0ae448',`,
    `    });`,
    `});`,
  ].join('\n');
}
