import { Component, ElementRef, viewChild } from '@angular/core';
import { injectGsap, target, type GsapTween } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'quickTo · angular-gsap',
};

const COPY = {
  en: {
    eyebrow: 'Advanced · gsap.quickTo',
    title: 'Pointer tracking with quickTo',
    intro:
      "<code>quickTo()</code> builds one reusable tween per property, so a pointermove handler can feed it coordinates hundreds of times per second without creating garbage. The handler is wrapped in <code>contextSafe</code>, and the tween itself runs on GSAP's ticker, outside change detection.",
    hint: 'move the pointer around this stage',
    pulse: 'Pulse',
    how: 'How this works',
    explain: [
      '<code>gsap.to()</code> inside a pointermove handler would allocate a new tween on every event. <code>quickTo()</code> builds the tween once; the handler just feeds it coordinates.',
      'The chaser and the stage come from <code>viewChild</code> queries. <code>target()</code> unwraps them for GSAP.',
      "The quickTo tweens live in the context like everything else, so they're cleaned up when you leave the page.",
    ],
  },
  es: {
    eyebrow: 'Avanzado · gsap.quickTo',
    title: 'Seguir el puntero con quickTo',
    intro:
      '<code>quickTo()</code> construye un tween reutilizable por propiedad, así que un handler de pointermove puede alimentarlo con coordenadas cientos de veces por segundo sin generar basura. El handler va envuelto en <code>contextSafe</code>, y el tween corre en el ticker de GSAP, fuera de change detection.',
    hint: 'mueve el puntero por este escenario',
    pulse: 'Pulso',
    how: 'Cómo funciona',
    explain: [
      '<code>gsap.to()</code> dentro de un handler de pointermove crearía un tween nuevo en cada evento. <code>quickTo()</code> construye el tween una vez; el handler solo le pasa coordenadas.',
      'El perseguidor y el escenario vienen de queries <code>viewChild</code>. <code>target()</code> los desenvuelve para GSAP.',
      'Los tweens de quickTo viven en el contexto como todo lo demás, así que se limpian al salir de la página.',
    ],
  },
} as const;

@Component({
  selector: 'app-pointer',
  imports: [CodeSnippet],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>gsap.quickTo</span><span>viewChild</span
          ><span>contextSafe</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div
            #stage
            class="stage pointer-stage"
            (pointermove)="onMove($event)"
            (pointerleave)="onLeave()"
          >
            <span #chaser class="chaser"></span>
            <p class="hint">{{ c.hint }}</p>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="tplSnippet" lang="html" label="chaser.html" />
          <app-code [code]="snippet" label="chaser.ts" />
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
    .pointer-stage {
      min-height: 24rem;
      cursor: crosshair;
      touch-action: none;
      display: grid;
      place-items: end center;
    }

    .chaser {
      position: absolute;
      top: 0;
      left: 0;
      width: 28px;
      height: 28px;
      margin: -14px 0 0 -14px;
      border-radius: 50%;
      background: var(--kinetic);
      border: 2px solid var(--ink);
      pointer-events: none;
    }

    .hint {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--ink-soft);
      padding-bottom: 1.25rem;
      margin: 0;
    }
  `,
})
export default class PointerPage {
  protected readonly c = COPY[injectLocale()];

  private readonly stage =
    viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly chaser =
    viewChild.required<ElementRef<HTMLElement>>('chaser');

  private moveX?: (value: number) => GsapTween;
  private moveY?: (value: number) => GsapTween;

  protected readonly ref = injectGsap(({ gsap }) => {
    const el = target(this.chaser);
    const stage = target(this.stage);
    // park it in the middle so the stage is visibly alive before any input
    if (stage) {
      gsap.set(el, {
        x: stage.clientWidth / 2,
        y: stage.clientHeight / 2,
      });
    }
    gsap.to(el, {
      scale: 1.25,
      repeat: -1,
      yoyo: true,
      duration: 0.9,
      ease: 'sine.inOut',
    });
    this.moveX = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    this.moveY = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
  });

  protected onMove = this.ref.contextSafe((event: PointerEvent) => {
    const rect = this.stage().nativeElement.getBoundingClientRect();
    this.moveX?.(event.clientX - rect.left);
    this.moveY?.(event.clientY - rect.top);
  });

  protected onLeave = this.ref.contextSafe(() => {
    const stage = target(this.stage);
    if (stage) {
      this.moveX?.(stage.clientWidth / 2);
      this.moveY?.(stage.clientHeight / 2);
    }
  });

  protected readonly tplSnippet = [
    `<div`,
    `  #stage`,
    `  class="stage"`,
    `  (pointermove)="onMove($event)"`,
    `>`,
    `  <span #chaser class="chaser"></span>`,
    `</div>`,
  ].join('\n');

  protected readonly snippet = [
    `export class Chaser {`,
    `  stage = viewChild.required<ElementRef>('stage');`,
    `  chaser = viewChild.required<ElementRef>('chaser');`,
    `  private moveX?: (v: number) => GsapTween;`,
    `  private moveY?: (v: number) => GsapTween;`,
    ``,
    `  ref = injectGsap(({ gsap }) => {`,
    `    const el = target(this.chaser);`,
    `    this.moveX = gsap.quickTo(el, 'x',`,
    `      { duration: 0.35, ease: 'power3' });`,
    `    this.moveY = gsap.quickTo(el, 'y',`,
    `      { duration: 0.35, ease: 'power3' });`,
    `  });`,
    ``,
    `  onMove = this.ref.contextSafe((e: PointerEvent) => {`,
    `    const r = target(this.stage)!.getBoundingClientRect();`,
    `    this.moveX?.(e.clientX - r.left);`,
    `    this.moveY?.(e.clientY - r.top);`,
    `  });`,
    `}`,
  ].join('\n');
}
