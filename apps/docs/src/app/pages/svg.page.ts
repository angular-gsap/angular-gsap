import { Component, ElementRef, viewChild, viewChildren } from '@angular/core';
import { DrawSvg, injectGsap, target, targets } from '@angular-gsap/core';
import { CodeTabs, type CodeFile } from '../code-tabs';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'SVG · angular-gsap',
};

const SHAPES = [
  {
    // the Angular mark (apps/docs/public/angular-icon.svg), rescaled into this viewBox
    d: 'M302.8 130.6l-4 59.8L262.3 111.7l40.5 18.9ZM277.3 208l-27.3 15.8 -27.7 -15.8 5.3 -13.6h44.4l5.3 13.6ZM250 141.6l14.1 35.2H235.5l14.5 -35.2ZM200.7 190.4L196.8 130.6 237.2 111.7 200.7 190.4Z',
    fill: '--pulse',
  },
  {
    d: 'M200 170 C 225 120, 300 125, 305 165 C 310 205, 250 235, 215 210 C 185 190, 175 195, 200 170 Z',
    fill: '--arc',
  },
  {
    d: 'M250 110 L262 150 L305 150 L272 176 L284 216 L250 192 L216 216 L228 176 L195 150 L238 150 Z',
    fill: '--ember',
  },
  {
    d: 'M262 108 L214 170 L244 170 L226 218 L288 152 L254 152 Z',
    fill: '--kinetic',
  },
] as const;

const COPY = {
  en: {
    eyebrow: 'Example · SVG',
    title: 'SVG animation',
    intro:
      'SVG is regular DOM to GSAP: strokes draw in with DrawSVG, shapes morph with MorphSVG, and elements ride paths with MotionPath. All three plugins are registered once in <code>provideGsap</code>. The floating shape starts as the Angular mark; Morph cycles it through the others.',
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
      'Para GSAP el SVG es DOM normal: los trazos se dibujan con DrawSVG, las formas se transforman con MorphSVG y los elementos recorren rutas con MotionPath. Los tres plugins se registran una vez en <code>provideGsap</code>. La forma flotante empieza como el logo de Angular; el botón Transformar la va cambiando por las demás.',
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
  imports: [CodeTabs, DrawSvg],
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
            <svg viewBox="0 0 400 260" drawSvg [each]="0.2">
              <path
                #track
                d="M 60 130 C 60 60, 180 60, 200 130 C 220 200, 340 200, 340 130 C 340 60, 220 60, 200 130 C 180 200, 60 200, 60 130 Z"
                fill="none"
                stroke="var(--ink)"
                stroke-width="3"
                stroke-linecap="round"
              />
              <path
                d="M 40 36 L 84 22 L 128 36"
                fill="none"
                stroke="var(--arc)"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M 272 34 L 316 22 L 360 36"
                fill="none"
                stroke="var(--ember)"
                stroke-width="6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                #shape
                [attr.d]="shapes[0].d"
                [style.fill]="'var(' + shapes[0].fill + ')'"
                stroke="var(--ink)"
                stroke-width="3"
                stroke-linejoin="round"
              />
              @for (i of [0, 1, 2]; track i) {
                <polygon
                  #rider
                  points="-9,-7 11,0 -9,7"
                  fill="var(--kinetic)"
                  stroke="var(--ink)"
                  stroke-width="2"
                  stroke-linejoin="round"
                />
              }
            </svg>
          </div>
          <div class="stage-controls">
            <button class="btn" (click)="morph()">{{ c.morph }}</button>
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

  protected readonly shapes = SHAPES;
  private shapeIndex = 0;

  private readonly track = viewChild.required<ElementRef<SVGPathElement>>('track');
  private readonly shape = viewChild.required<ElementRef<SVGPathElement>>('shape');
  private readonly riderEls = viewChildren<ElementRef<SVGPolygonElement>>('rider');

  protected readonly ref = injectGsap(({ gsap }) => {
    const track = target(this.track);
    const riders = targets(this.riderEls);
    if (!track || riders.length === 0) {
      return;
    }

    // pop the arrows in once the strokes have drawn
    gsap.set(riders, { scale: 0, transformOrigin: 'center' });
    gsap.to(riders, {
      scale: 1,
      delay: 1.3,
      stagger: 0.12,
      ease: 'back.out(2.5)',
      duration: 0.4,
    });

    // three arrows chase each other around the figure eight,
    // rotating with the tangent, offset by a third of the loop
    riders.forEach((rider, i) => {
      gsap.to(rider, {
        motionPath: {
          path: track,
          align: track,
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
          start: i / 3,
          end: 1 + i / 3,
        },
        duration: 7,
        repeat: -1,
        ease: 'none',
      });
    });

    // the morph shape never quite sits still
    gsap.to(target(this.shape), {
      y: -6,
      yoyo: true,
      repeat: -1,
      duration: 1.6,
      ease: 'sine.inOut',
    });
  });

  protected morph = this.ref.contextSafe(() => {
    this.shapeIndex = (this.shapeIndex + 1) % SHAPES.length;
    const next = SHAPES[this.shapeIndex];
    const shape = target(this.shape);
    this.ref.gsap.to(shape, {
      morphSVG: next.d,
      // fill tweens interpolate real colors: resolve the theme token
      fill: shape ? getComputedStyle(shape).getPropertyValue(next.fill).trim() : '',
      duration: 0.8,
      ease: 'power3.inOut',
    });
  });

  protected readonly tplSnippet = [
    `<!-- every stroke inside draws in, staggered -->`,
    `<svg drawSvg [each]="0.2" viewBox="0 0 400 260">`,
    `  <path #track d="M 60 130 C …" />   <!-- ∞ -->`,
    `  <path #shape [attr.d]="shapes[0].d" />`,
    `  @for (i of [0, 1, 2]; track i) {`,
    `    <polygon #rider points="-9,-7 11,0 -9,7" />`,
    `  }`,
    `</svg>`,
  ].join('\n');

  protected readonly snippet = [
    `ref = injectGsap(({ gsap }) => {`,
    `  // three arrows chase around the ∞,`,
    `  // rotating with the tangent`,
    `  targets(this.riders).forEach((r, i) =>`,
    `    gsap.to(r, {`,
    `      motionPath: {`,
    `        path: target(this.track),`,
    `        align: target(this.track),`,
    `        alignOrigin: [0.5, 0.5],`,
    `        autoRotate: true,`,
    `        start: i / 3,`,
    `        end: 1 + i / 3,`,
    `      },`,
    `      duration: 7, repeat: -1, ease: 'none',`,
    `    })`,
    `  );`,
    `});`,
    ``,
    `morph = this.ref.contextSafe(() =>`,
    `  this.ref.gsap.to(target(this.shape), {`,
    `    morphSVG: next.d, fill: next.fill,`,
    `  })`,
    `);`,
  ].join('\n');

  protected readonly files: CodeFile[] = [
    { label: 'shapes.html', code: this.tplSnippet, lang: 'html' },
    { label: 'shapes.ts', code: this.snippet, lang: 'ts' },
  ];
}
