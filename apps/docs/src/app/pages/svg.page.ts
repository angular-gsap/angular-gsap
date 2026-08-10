import { Component, ElementRef, viewChild } from '@angular/core';
import { DrawSvg, injectGsap, target } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'SVG · angular-gsap',
};

const BLOB =
  'M200 170 C 225 120, 300 125, 305 165 C 310 205, 250 235, 215 210 C 185 190, 175 195, 200 170 Z';
const STAR =
  'M250 110 L262 150 L305 150 L272 176 L284 216 L250 192 L216 216 L228 176 L195 150 L238 150 Z';

const COPY = {
  en: {
    eyebrow: 'Example · SVG',
    title: 'SVG animation',
    intro:
      'SVG is regular DOM to GSAP: strokes draw in with DrawSVG, shapes morph with MorphSVG, and elements ride paths with MotionPath. All three plugins are free now, registered once in <code>provideGsap</code>.',
    morph: 'Morph',
    how: 'How this works',
    explain: [
      'The whole <code>&lt;svg&gt;</code> carries the <code>drawSvg</code> directive, so every stroked shape inside draws in, staggered. On a single <code>&lt;path&gt;</code> it draws just that one.',
      'The morph is one line of vanilla GSAP: <code>gsap.to(shape, { morphSVG: STAR })</code> inside a <code>contextSafe</code> handler. MorphSVG interpolates between any two paths.',
      'The rider circle follows the curve with MotionPath, looping on GSAP&#39;s ticker. Leave the page and the context reverts all of it, ScrollTriggers, splits, and paths alike.',
    ],
  },
  es: {
    eyebrow: 'Ejemplo · SVG',
    title: 'Animación de SVG',
    intro:
      'Para GSAP el SVG es DOM normal: los trazos se dibujan con DrawSVG, las formas se transforman con MorphSVG y los elementos recorren rutas con MotionPath. Los tres plugins ahora son gratis, registrados una vez en <code>provideGsap</code>.',
    morph: 'Transformar',
    how: 'Cómo funciona',
    explain: [
      'Todo el <code>&lt;svg&gt;</code> lleva la directiva <code>drawSvg</code>, así que cada forma con trazo se dibuja, escalonada. En un solo <code>&lt;path&gt;</code> dibuja solo ese.',
      'El morph es una línea de GSAP puro: <code>gsap.to(shape, { morphSVG: STAR })</code> dentro de un handler <code>contextSafe</code>. MorphSVG interpola entre dos paths cualesquiera.',
      'El círculo sigue la curva con MotionPath, en loop sobre el ticker de GSAP. Sal de la página y el contexto lo revierte todo: ScrollTriggers, splits y paths por igual.',
    ],
  },
} as const;

@Component({
  selector: 'app-svg',
  imports: [CodeSnippet, DrawSvg],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>drawSvg</span><span>MorphSVG</span><span>MotionPath</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage svg-stage">
            <svg viewBox="0 0 400 260" drawSvg [each]="0.25">
              <path
                #track
                d="M 30 215 C 120 60, 280 60, 370 215"
                fill="none"
                stroke="var(--ink)"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M 40 70 L 90 25 L 140 70 L 190 25"
                fill="none"
                stroke="var(--arc)"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                #shape
                [attr.d]="blob"
                fill="var(--pulse)"
                stroke="var(--ink)"
                stroke-width="3"
              />
              <circle
                #rider
                r="11"
                fill="var(--kinetic)"
                stroke="var(--ink)"
                stroke-width="3"
              />
            </svg>
          </div>
          <div class="stage-controls">
            <button class="btn" (click)="morph()">{{ c.morph }}</button>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="tplSnippet" lang="html" label="shapes.html" />
          <app-code [code]="snippet" label="shapes.ts" />
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
    .svg-stage {
      display: grid;
      align-items: center;
      padding: 1rem;

      svg {
        width: 100%;
        height: auto;
      }
    }
  `,
})
export default class SvgPage {
  protected readonly c = COPY[injectLocale()];

  protected readonly blob = BLOB;
  private morphed = false;

  private readonly track = viewChild.required<ElementRef<SVGPathElement>>('track');
  private readonly shape = viewChild.required<ElementRef<SVGPathElement>>('shape');
  private readonly rider = viewChild.required<ElementRef<SVGCircleElement>>('rider');

  protected readonly ref = injectGsap(({ gsap }) => {
    const track = target(this.track);
    if (!track) {
      return;
    }
    gsap.to(target(this.rider), {
      motionPath: {
        path: track,
        align: track,
        alignOrigin: [0.5, 0.5],
      },
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  });

  protected morph = this.ref.contextSafe(() => {
    this.morphed = !this.morphed;
    this.ref.gsap.to(target(this.shape), {
      morphSVG: this.morphed ? STAR : BLOB,
      duration: 0.7,
      ease: 'power2.inOut',
    });
  });

  protected readonly tplSnippet = [
    `<!-- every stroke inside draws in, staggered -->`,
    `<svg drawSvg [each]="0.25" viewBox="0 0 400 260">`,
    `  <path #track d="M 30 215 C …" />`,
    `  <path #shape [attr.d]="blob" />`,
    `  <circle #rider r="11" />`,
    `</svg>`,
    ``,
    `<button (click)="morph()">Morph</button>`,
  ].join('\n');

  protected readonly snippet = [
    `ref = injectGsap(({ gsap }) => {`,
    `  // ride the curve, forever`,
    `  gsap.to(target(this.rider), {`,
    `    motionPath: {`,
    `      path: target(this.track),`,
    `      align: target(this.track),`,
    `      alignOrigin: [0.5, 0.5],`,
    `    },`,
    `    duration: 4, repeat: -1, yoyo: true,`,
    `  });`,
    `});`,
    ``,
    `morph = this.ref.contextSafe(() =>`,
    `  this.ref.gsap.to(target(this.shape), {`,
    `    morphSVG: STAR, duration: 0.7,`,
    `  })`,
    `);`,
  ].join('\n');
}
