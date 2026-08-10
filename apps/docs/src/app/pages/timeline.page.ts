import { Component, ElementRef, viewChildren } from '@angular/core';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { injectGsap, targets, type GsapTimeline } from '@angular-gsap/core';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Timeline · angular-gsap',
};

const COPY = {
  en: {
    eyebrow: 'Example · core',
    title: 'Timelines',
    intro:
      'Build the timeline in the callback, keep the reference on the component, and drive it from event handlers wrapped with <code>contextSafe</code>. When you navigate away, the context reverts the whole thing.',
    play: 'Play', pause: 'Pause', reverse: 'Reverse', restart: 'Restart', speed: 'speed',
    how: 'How this works',
    explain: [
      'The timeline is straight from the GSAP docs: position parameters, staggers, <code>repeat: -1</code>. Nothing here is wrapped.',
      'Play, pause, and the speed slider go through <code>contextSafe</code>, so driving a 60fps loop never touches change detection.',
      'Navigate away and the context reverts the loop. No timeline keeps ticking against a DOM node that no longer exists.',
    ],
  },
  es: {
    eyebrow: 'Ejemplo · core',
    title: 'Timelines',
    intro:
      'Construye el timeline en el callback, guarda la referencia en el componente y contrólalo desde handlers envueltos en <code>contextSafe</code>. Al navegar a otra página, el contexto revierte todo.',
    play: 'Play', pause: 'Pausa', reverse: 'Reversa', restart: 'Reiniciar', speed: 'velocidad',
    how: 'Cómo funciona',
    explain: [
      'El timeline sale directo de la documentación de GSAP: parámetros de posición, staggers, <code>repeat: -1</code>. Nada está envuelto.',
      'Play, pausa y el slider de velocidad pasan por <code>contextSafe</code>, así que manejar un loop a 60fps nunca toca change detection.',
      'Navega a otra página y el contexto revierte el loop. Ningún timeline sigue corriendo contra un nodo del DOM que ya no existe.',
    ],
  },
} as const;

@Component({
  imports: [CodeSnippet],
  selector: 'app-timeline',
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>injectGsap</span><span>gsap.timeline</span
          ><span>contextSafe</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage bars-stage">
            <div class="bars">
              @for (bar of bars; track bar.i) {
                <span #barEl class="bar" [style.background]="bar.color"></span>
              }
            </div>
          </div>
          <div class="stage-controls">
            <button class="btn" (click)="play()">{{ c.play }}</button>
            <button class="btn btn--quiet" (click)="pause()">{{ c.pause }}</button>
            <button class="btn btn--quiet" (click)="reverse()">{{ c.reverse }}</button>
            <button class="btn btn--quiet" (click)="restart()">{{ c.restart }}</button>
            <label class="range">
              {{ c.speed }}
              <input
                type="range"
                min="0.25"
                max="2.5"
                step="0.25"
                value="1"
                (input)="speed(+$any($event.target).value)"
              />
            </label>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="tplSnippet" lang="html" label="equalizer.html" />
          <app-code [code]="snippet" label="equalizer.ts" />
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
    .bars-stage {
      display: grid;
      place-items: center;
    }

    .bars {
      display: flex;
      align-items: flex-end;
      gap: 14px;
      height: 12rem;
    }

    .bar {
      width: 26px;
      height: 34px;
      border-radius: 6px;
      transform-origin: bottom;
    }
  `,
})
export default class TimelinePage {
  protected readonly c = COPY[injectLocale()];

  protected readonly bars = [
    '#e23b80',
    '#5b4be8',
    '#ffb627',
    '#0ae448',
    '#e23b80',
  ].map((color, i) => ({ i, color }));

  private tl?: GsapTimeline;

  private readonly barEls = viewChildren<ElementRef<HTMLElement>>('barEl');

  protected readonly ref = injectGsap(({ gsap }) => {
    const bars = targets(this.barEls);
    this.tl = gsap
      .timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
      .to(bars, {
        scaleY: 4.4,
        duration: 0.45,
        stagger: { each: 0.12, yoyo: true, repeat: 1 },
      })
      .to(bars, { rotation: 8, duration: 0.3, stagger: 0.06 }, '<0.2')
      .to(bars, { rotation: 0, duration: 0.3 });
  });

  protected play = this.ref.contextSafe(() => this.tl?.play());
  protected pause = this.ref.contextSafe(() => this.tl?.pause());
  protected reverse = this.ref.contextSafe(() => this.tl?.reverse());
  protected restart = this.ref.contextSafe(() => this.tl?.restart());
  protected speed = this.ref.contextSafe((v: number) => this.tl?.timeScale(v));

  protected readonly tplSnippet = [
    `@for (bar of bars; track bar.i) {`,
    `  <span class="bar"></span>`,
    `}`,
    ``,
    `<button (click)="play()">Play</button>`,
    `<button (click)="pause()">Pause</button>`,
    `<button (click)="restart()">Restart</button>`,
    `<input type="range" min="0.25" max="2.5"`,
    `  (input)="speed(+$event.target.value)" />`,
  ].join('\n');

  protected readonly snippet = [
    `export default class TimelinePage {
  protected readonly c = COPY[injectLocale()];
`,
    `  private tl?: GsapTimeline;`,
    `  bars = viewChildren<ElementRef>('bar');`,
    ``,
    `  ref = injectGsap(({ gsap }) => {`,
    `    this.tl = gsap`,
    `      .timeline({ repeat: -1 })`,
    `      .to(targets(this.bars), {`,
    `        scaleY: 4.4,`,
    `        stagger: { each: 0.12, yoyo: true, repeat: 1 },`,
    `      });`,
    `  });`,
    ``,
    `  play = this.ref.contextSafe(() => this.tl?.play());`,
    `  pause = this.ref.contextSafe(() => this.tl?.pause());`,
    `  speed = this.ref.contextSafe((v: number) =>`,
    `    this.tl?.timeScale(v)`,
    `  );`,
    `}`,
  ].join('\n');
}
