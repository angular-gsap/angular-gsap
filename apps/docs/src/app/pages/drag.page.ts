import { Component, ElementRef, viewChild, viewChildren } from '@angular/core';
import { injectGsap, target, targets } from '@angular-gsap/core';
import { Draggable } from 'gsap/Draggable';
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
      'Grab a brick and throw it. InertiaPlugin glides it with real momentum and snaps it to the grid. The Draggable instances are created inside the callback, so the context kills them with the component.',
    hint: 'drag the bricks, throw them, they snap to the grid',
    scatter: 'Scatter',
    how: 'How this works',
    explain: [
      "<code>Draggable.create()</code> runs inside the callback like any other GSAP call, so <code>gsap.context()</code> tracks the instances and reverts them on destroy. No stray pointer listeners after navigation.",
      '<code>inertia: true</code> hands the release velocity to InertiaPlugin, and <code>snap</code> rounds the landing position to the grid. Momentum, friction, and settling are all GSAP.',
      'Scatter is a <code>contextSafe</code> handler tweening the same <code>x</code>/<code>y</code> transforms Draggable uses, so dragging and tweening never fight over state.',
    ],
  },
  es: {
    eyebrow: 'Avanzado · plugin: Draggable + Inertia',
    title: 'Arrastra, lanza, encaja',
    intro:
      'Agarra un ladrillo y lánzalo. InertiaPlugin lo desliza con impulso real y lo encaja en la cuadrícula. Los Draggable se crean dentro del callback, así que el contexto los mata con el componente.',
    hint: 'arrastra los ladrillos, lánzalos, encajan en la cuadrícula',
    scatter: 'Dispersar',
    how: 'Cómo funciona',
    explain: [
      '<code>Draggable.create()</code> corre dentro del callback como cualquier llamada de GSAP, así que <code>gsap.context()</code> registra las instancias y las revierte al destruir. No quedan listeners de puntero sueltos tras navegar.',
      '<code>inertia: true</code> entrega la velocidad de soltado a InertiaPlugin, y <code>snap</code> redondea el aterrizaje a la cuadrícula. Impulso, fricción y asentamiento son puro GSAP.',
      'Dispersar es un handler <code>contextSafe</code> que anima los mismos transforms <code>x</code>/<code>y</code> que usa Draggable, así que arrastrar y animar nunca pelean por el estado.',
    ],
  },
} as const;

const GRID = 96;

@Component({
  selector: 'app-drag',
  imports: [CodeSnippet],
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
              <div class="brick" #brick [style.background]="brick.color">
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
          <app-code [code]="snippet" label="bricks.ts" />
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

    const snap = (value: number) => Math.round(value / GRID) * GRID - 24;
    Draggable.create(bricks, {
      type: 'x,y',
      bounds: stage,
      inertia: true,
      snap: { x: snap, y: snap },
      edgeResistance: 0.7,
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
    `ref = injectGsap(({ gsap }) => {`,
    `  const bricks = targets(this.brickEls);`,
    ``,
    `  // tracked by the context, killed on destroy`,
    `  Draggable.create(bricks, {`,
    `    type: 'x,y',`,
    `    bounds: target(this.stage),`,
    `    inertia: true,   // momentum on release`,
    `    snap: {          // land on the grid`,
    `      x: (v) => Math.round(v / 96) * 96,`,
    `      y: (v) => Math.round(v / 96) * 96,`,
    `    },`,
    `    edgeResistance: 0.7,`,
    `  });`,
    `});`,
    ``,
    `scatter = this.ref.contextSafe(() =>`,
    `  this.ref.gsap.to(targets(this.brickEls), {`,
    `    x: () => gsap.utils.random(0, w),`,
    `    y: () => gsap.utils.random(0, h),`,
    `  })`,
    `);`,
  ].join('\n');
}
