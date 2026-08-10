import { Component, ElementRef, viewChild, viewChildren } from '@angular/core';
import { Drag, injectGsap, target, targets } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Draggable · angular-gsap',
};

const COPY = {
  en: {
    eyebrow: 'Advanced · plugin: Draggable + Inertia',
    title: 'Drag, throw, snap',
    intro:
      'Grab a brick and throw it. InertiaPlugin glides it with real momentum and snaps it to the grid. The whole setup is the <code>drag</code> directive on each brick; the instances die with the component.',
    hint: 'drag the bricks, throw them, they snap to the grid',
    scatter: 'Scatter',
    how: 'How this works',
    explain: [
      "The <code>drag</code> directive is <code>Draggable.create()</code> with signal inputs: type, bounds (the parent by default), inertia, and a grid <code>snap</code>. Instances are killed on destroy, so no stray pointer listeners after navigation. The raw API works too, straight from the callback.",
      '<code>inertia: true</code> hands the release velocity to InertiaPlugin, and <code>snap</code> rounds the landing position to the grid. Momentum, friction, and settling are all GSAP.',
      'Scatter is a <code>contextSafe</code> handler tweening the same <code>x</code>/<code>y</code> transforms Draggable uses, so dragging and tweening never fight over state.',
    ],
  },
  es: {
    eyebrow: 'Avanzado · plugin: Draggable + Inertia',
    title: 'Arrastra, lanza, encaja',
    intro:
      'Agarra un ladrillo y lánzalo. InertiaPlugin lo desliza con impulso real y lo encaja en la cuadrícula. Todo el montaje es la directiva <code>drag</code> en cada ladrillo; las instancias mueren con el componente.',
    hint: 'arrastra los ladrillos, lánzalos, encajan en la cuadrícula',
    scatter: 'Dispersar',
    how: 'Cómo funciona',
    explain: [
      'La directiva <code>drag</code> es <code>Draggable.create()</code> con inputs de signal: tipo, límites (el padre por defecto), inercia y un <code>snap</code> de cuadrícula. Las instancias se matan al destruir: no quedan listeners de puntero sueltos tras navegar. La API cruda también funciona, directo en el callback.',
      '<code>inertia: true</code> entrega la velocidad de soltado a InertiaPlugin, y <code>snap</code> redondea el aterrizaje a la cuadrícula. Impulso, fricción y asentamiento son puro GSAP.',
      'Dispersar es un handler <code>contextSafe</code> que anima los mismos transforms <code>x</code>/<code>y</code> que usa Draggable, así que arrastrar y animar nunca pelean por el estado.',
    ],
  },
} as const;

const GRID = 96;

@Component({
  selector: 'app-drag',
  imports: [CodeSnippet, Drag],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>Draggable</span><span>InertiaPlugin</span><span>snap</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div #stage class="stage drag-stage">
            @for (brick of bricks; track brick.label) {
              <div
                class="brick"
                #brick
                drag
                [snap]="96"
                [style.background]="brick.color"
              >
                {{ brick.label }}
              </div>
            }
            <p class="hint">{{ c.hint }}</p>
          </div>
          <div class="stage-controls">
            <button class="btn" (click)="scatter()">{{ c.scatter }}</button>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="snippet" lang="html" label="bricks.html" />
          <app-code [code]="tsSnippet" label="bricks.ts" />
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
    .drag-stage {
      min-height: 26rem;
      background-size: 96px 96px;
      background-image: radial-gradient(var(--hairline) 1.5px, transparent 1.5px);
      touch-action: none;
    }

    .brick {
      position: absolute;
      top: 24px;
      left: 24px;
      width: 84px;
      height: 84px;
      display: grid;
      place-items: center;
      font-family: var(--font-display);
      font-stretch: 115%;
      font-weight: 900;
      font-size: 1.4rem;
      color: var(--code-bg);
      border: var(--bw) solid var(--ink);
      border-radius: 12px;
      box-shadow: var(--shadow-sm);
      cursor: grab;
      user-select: none;

      &:active {
        cursor: grabbing;
      }
    }

    .hint {
      position: absolute;
      bottom: 0.9rem;
      left: 0;
      right: 0;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--ink-soft);
      pointer-events: none;
      margin: 0;
    }
  `,
})
export default class DragPage {
  protected readonly c = COPY[injectLocale()];

  protected readonly bricks = [
    { label: 'G', color: '#0ae448' },
    { label: 'S', color: '#e23b80' },
    { label: 'A', color: '#ffb627' },
    { label: 'P', color: '#5b4be8' },
  ];

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly brickEls = viewChildren<ElementRef<HTMLElement>>('brick');

  protected readonly ref = injectGsap(({ gsap }) => {
    const stage = target(this.stage);
    const bricks = targets(this.brickEls);
    if (!stage || bricks.length === 0) {
      return;
    }

    void stage;
    // deal the bricks onto the grid
    gsap.set(bricks, {
      x: (i) => GRID * (i + 1) - 24,
      y: (i) => GRID * (i % 2) + 48,
    });
    gsap.from(bricks, {
      scale: 0,
      rotation: () => gsap.utils.random(-30, 30),
      stagger: 0.08,
      ease: 'back.out(2)',
      duration: 0.5,
    });

  });

  protected scatter = this.ref.contextSafe(() => {
    const stage = target(this.stage);
    if (!stage) {
      return;
    }
    const w = stage.clientWidth - 110;
    const h = stage.clientHeight - 110;
    this.ref.gsap.to(targets(this.brickEls), {
      x: () => this.ref.gsap.utils.random(0, w),
      y: () => this.ref.gsap.utils.random(0, h),
      rotation: () => this.ref.gsap.utils.random(-20, 20),
      duration: 0.6,
      ease: 'back.out(1.4)',
      stagger: 0.05,
    });
  });

  protected readonly snippet = [
    `<!-- the whole drag setup is one attribute -->`,
    `<div class="arena">`,
    `  <div class="brick" drag [snap]="96"></div>`,
    `</div>`,
    ``,
    `<!-- inputs when you need them -->`,
    `<div drag="x" [inertia]="false"`,
    `  [bounds]="'.arena'"`,
    `  (dragEnd)="save()">`,
    `</div>`,
  ].join('\n');

  protected readonly tsSnippet = [
    `// or the raw API inside the callback:`,
    `ref = injectGsap(() => {`,
    `  Draggable.create(targets(this.bricks), {`,
    `    type: 'x,y', inertia: true,`,
    `    bounds: target(this.stage),`,
    `    snap: { x: grid, y: grid },`,
    `  });`,
    `});`,
  ].join('\n');
}
