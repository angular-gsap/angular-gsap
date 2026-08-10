import { Component, ElementRef, viewChild, viewChildren } from '@angular/core';
import { injectGsap, prefersReducedMotion, target, targets } from '@angular-gsap/core';
import { Observer } from 'gsap/Observer';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Observer · angular-gsap',
};

const COPY = {
  en: {
    eyebrow: 'Example · Observer + Inertia + MotionPath',
    title: 'A momentum loop',
    intro:
      'Wheel, drag, or swipe anywhere on the stage and the chips ride the track; flick and let go, and InertiaPlugin keeps them gliding with your real release velocity. One Observer normalizes every input, and the whole loop is a single number that GSAP tweens.',
    hint: 'wheel · drag · flick · momentum carries it',
    how: 'How this works',
    explain: [
      "Each chip has a paused <code>motionPath</code> tween used as a position setter: the loop's state is one number <code>p</code>, and every chip renders at <code>p</code> plus its offset. Move the number, the whole train moves.",
      'Observer merges wheel, touch, and pointer into one stream. While you drag it adds deltas to <code>p</code>; the moment you release, the gesture velocity is handed to InertiaPlugin.',
      "InertiaPlugin doesn't care that <code>p</code> isn't an element: <code>gsap.to(state, { inertia: { p: { velocity } } })</code> glides any property with physical friction, exactly like the thrown bricks on the Draggable page.",
      'Everything is created inside the callback: leave the page and the Observer, the setters, and the ambient drift are all torn down.',
    ],
  },
  es: {
    eyebrow: 'Ejemplo · Observer + Inertia + MotionPath',
    title: 'Un bucle con impulso',
    intro:
      'Rueda, arrastra o desliza en cualquier parte del escenario y las fichas recorren la pista; da un tirón y suelta, e InertiaPlugin las deja deslizándose con tu velocidad real. Un Observer normaliza cada entrada, y todo el bucle es un solo número que GSAP anima.',
    hint: 'rueda · arrastra · tirón · el impulso lo lleva',
    how: 'Cómo funciona',
    explain: [
      'Cada ficha tiene un tween <code>motionPath</code> pausado usado como setter de posición: el estado del bucle es un número <code>p</code>, y cada ficha se pinta en <code>p</code> más su desfase. Mueves el número, se mueve todo el tren.',
      'Observer fusiona rueda, touch y puntero en un solo stream. Mientras arrastras suma deltas a <code>p</code>; al soltar, la velocidad del gesto pasa a InertiaPlugin.',
      'A InertiaPlugin no le importa que <code>p</code> no sea un elemento: <code>gsap.to(state, { inertia: { p: { velocity } } })</code> desliza cualquier propiedad con fricción física, igual que los ladrillos lanzados en la página de Draggable.',
      'Todo se crea dentro del callback: sal de la página y el Observer, los setters y la deriva ambiental se desmontan.',
    ],
  },
} as const;

const CHIPS = [
  { label: 'SCROLL', color: 'var(--pulse)' },
  { label: 'SPLIT', color: 'var(--kinetic)' },
  { label: 'FLIP', color: 'var(--arc)' },
  { label: 'MORPH', color: 'var(--ember)' },
  { label: 'DRAW', color: 'var(--kinetic)' },
  { label: 'MOTION', color: 'var(--pulse)' },
  { label: 'OBSERVER', color: 'var(--ember)' },
  { label: 'INERTIA', color: 'var(--arc)' },
] as const;

@Component({
  selector: 'app-loop',
  imports: [CodeSnippet],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>Observer</span><span>InertiaPlugin</span><span>MotionPath</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div #stage class="stage loop-stage">
            <svg viewBox="0 0 800 420" aria-hidden="true">
              <path
                #track
                d="M 70 210 C 70 90, 290 50, 400 50 C 510 50, 730 90, 730 210 C 730 330, 510 370, 400 370 C 290 370, 70 330, 70 210 Z"
                fill="none"
                stroke="var(--hairline)"
                stroke-width="3"
                stroke-dasharray="2 10"
                stroke-linecap="round"
              />
            </svg>
            @for (chip of chips; track chip.label) {
              <span class="chip" #chip [style.background]="chip.color">
                {{ chip.label }}
              </span>
            }
            <p class="hint">{{ c.hint }}</p>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="snippet" label="loop.ts" />
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
    .loop-stage {
      position: relative;
      min-height: 26rem;
      cursor: grab;
      touch-action: none;
      user-select: none;

      &:active {
        cursor: grabbing;
      }

      svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
      }
    }

    .chip {
      position: absolute;
      top: 0;
      left: 0;
      font-family: var(--font-display);
      font-stretch: 112%;
      font-weight: 800;
      font-size: 0.82rem;
      letter-spacing: 0.04em;
      color: var(--code-bg);
      border: var(--bw) solid var(--ink);
      border-radius: 999px;
      box-shadow: 3px 3px 0 var(--ink);
      padding: 0.35rem 0.9rem;
      pointer-events: none;
      will-change: transform;
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
export default class LoopPage {
  protected readonly c = COPY[injectLocale()];
  protected readonly chips = CHIPS;

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly track = viewChild.required<ElementRef<SVGPathElement>>('track');
  private readonly chipEls = viewChildren<ElementRef<HTMLElement>>('chip');

  private readonly state = { p: 0 };

  protected readonly ref = injectGsap(({ gsap }) => {
    const stage = target(this.stage);
    const path = target(this.track);
    const chips = targets(this.chipEls);
    if (!stage || !path || chips.length === 0) {
      return;
    }

    // one paused motionPath tween per chip, used as a position setter
    const setters = chips.map((chip, i) => {
      const tween = gsap.to(chip, {
        motionPath: {
          path,
          align: path,
          alignOrigin: [0.5, 0.5],
        },
        ease: 'none',
        duration: 1,
        paused: true,
      });
      const offset = i / chips.length;
      return (p: number) => tween.progress((((p + offset) % 1) + 1) % 1);
    });
    const render = () => setters.forEach((set) => set(this.state.p));
    render();

    const reduce = prefersReducedMotion();
    const drift = reduce
      ? undefined
      : gsap.to(this.state, {
          p: '+=1',
          duration: 40,
          repeat: -1,
          ease: 'none',
          onUpdate: render,
        });

    const SCALE = 0.00045; // px of gesture per unit of loop progress
    let glide: gsap.core.Tween | undefined;
    const observer = Observer.create({
      target: stage,
      type: 'wheel,touch,pointer',
      preventDefault: true,
      onPress: () => {
        drift?.pause();
        glide?.kill();
      },
      onChange: (self) => {
        drift?.pause();
        glide?.kill();
        const delta =
          Math.abs(self.deltaX) > Math.abs(self.deltaY)
            ? self.deltaX
            : -self.deltaY;
        this.state.p += delta * SCALE;
        render();
      },
      onRelease: (self) => {
        if (reduce) {
          drift?.play();
          return;
        }
        const velocity =
          Math.abs(self.velocityX) > Math.abs(self.velocityY)
            ? self.velocityX
            : -self.velocityY;
        // inertia on a plain number: glide p with the gesture's velocity
        glide = gsap.to(this.state, {
          inertia: { p: { velocity: velocity * SCALE } },
          onUpdate: render,
          onComplete: () => drift?.play(),
        });
      },
    });

    return () => observer.kill();
  });

  protected readonly snippet = [
    `state = { p: 0 }; // the whole loop is one number`,
    ``,
    `ref = injectGsap(({ gsap }) => {`,
    `  // paused motionPath tweens as position setters`,
    `  const setters = chips.map((chip, i) => {`,
    `    const t = gsap.to(chip, {`,
    `      motionPath: { path, align: path,`,
    `        alignOrigin: [0.5, 0.5] },`,
    `      ease: 'none', paused: true,`,
    `    });`,
    `    return (p) => t.progress((p + i / n) % 1);`,
    `  });`,
    `  const render = () =>`,
    `    setters.forEach((s) => s(this.state.p));`,
    ``,
    `  const observer = Observer.create({`,
    `    target: stage,`,
    `    type: 'wheel,touch,pointer',`,
    `    onChange: (self) => {`,
    `      this.state.p -= self.deltaY * 0.00045;`,
    `      render();`,
    `    },`,
    `    onRelease: (self) =>`,
    `      // inertia on a plain number`,
    `      gsap.to(this.state, {`,
    `        inertia: {`,
    `          p: { velocity: -self.velocityY * 0.00045 },`,
    `        },`,
    `        onUpdate: render,`,
    `      }),`,
    `  });`,
    ``,
    `  return () => observer.kill();`,
    `});`,
  ].join('\n');
}
