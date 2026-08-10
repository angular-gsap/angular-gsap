import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stagger, injectGsap, type GsapTimeline } from '@angular-gsap/core';
import { SplitText } from 'gsap/SplitText';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'angular-gsap · GSAP for Angular',
};

const COPY = {
  en: {
    eyebrow: 'gsap × angular',
    lede: 'Write vanilla GSAP. The library handles the Angular part: host scoping, cleanup, signal reactivity, and SSR.',
    replay: 'Replay intro',
    copy: 'Copy install command',
    howEyebrow: 'The whole idea',
    howTitle: 'One composable. Vanilla GSAP inside.',
    howBody:
      '<code>injectGsap()</code> runs your GSAP code in a context that belongs to the component. Target elements with <code>viewChild</code> queries or component-scoped selectors, read signals to make it reactive, and the context reverts everything when the component is destroyed. On the server it never runs.',
    howCta: 'Start with the basics →',
    basicsLink: '/start',
    featEyebrow: 'What it handles for you',
    features: [
      { title: 'Scoped by default', body: "Selectors match inside your component's host and nowhere else." },
      { title: 'Signal-reactive', body: 'Read a signal in the callback; the animation reverts and re-runs when it changes.' },
      { title: 'Cleans up after itself', body: 'Tweens, timelines, ScrollTriggers, and SplitText all revert on destroy.' },
      { title: 'SSR-safe', body: 'On the server the context never runs. No platform checks in your code.' },
      { title: 'Nothing wrapped', body: "It's the real GSAP API, plus preset directives for the common template cases." },
      { title: 'Tree-shakeable', body: '<code>sideEffects: false</code> and a tiny surface: unused exports drop out of your bundle, and GSAP plugins are only bundled when you import them.' },
      { title: 'Cheap at runtime', body: "Tweens run on GSAP's ticker outside change detection. No rxjs, no zone.js, zoneless-ready." },
    ],
  },
  es: {
    eyebrow: 'gsap × angular',
    lede: 'Escribe GSAP puro. La librería se encarga de la parte de Angular: scoping al host, limpieza, reactividad con signals y SSR.',
    replay: 'Repetir intro',
    copy: 'Copiar comando de instalación',
    howEyebrow: 'La idea completa',
    howTitle: 'Un composable. GSAP puro adentro.',
    howBody:
      '<code>injectGsap()</code> ejecuta tu código GSAP en un contexto que pertenece al componente. Apunta a elementos con queries <code>viewChild</code> o selectores limitados al componente, lee signals para hacerlo reactivo, y el contexto revierte todo cuando el componente se destruye. En el servidor nunca se ejecuta.',
    howCta: 'Empieza con los básicos →',
    basicsLink: '/es/start',
    featEyebrow: 'Lo que resuelve por ti',
    features: [
      { title: 'Scoped por defecto', body: 'Los selectores solo aplican dentro del host de tu componente, en ningún otro lado.' },
      { title: 'Reactivo con signals', body: 'Lee un signal en el callback; la animación se revierte y se vuelve a ejecutar cuando cambia.' },
      { title: 'Limpia solo', body: 'Tweens, timelines, ScrollTriggers y SplitText se revierten al destruir el componente.' },
      { title: 'Seguro en SSR', body: 'En el servidor el contexto nunca corre. Sin checks de plataforma en tu código.' },
      { title: 'Nada envuelto', body: 'Es la API real de GSAP, más directivas preset para los casos comunes en templates.' },
      { title: 'Tree-shakeable', body: '<code>sideEffects: false</code> y una superficie mínima: lo que no usas sale del bundle, y los plugins de GSAP solo se incluyen cuando los importas.' },
      { title: 'Barato en runtime', body: 'Los tweens corren en el ticker de GSAP fuera de change detection. Sin rxjs, sin zone.js, listo para zoneless.' },
    ],
  },
} as const;

@Component({
  selector: 'app-home',
  imports: [RouterLink, CodeSnippet, Stagger],
  template: `
    <section class="hero">
      <p class="eyebrow">{{ c.eyebrow }}</p>
      <h1 class="logotype" aria-label="angular-gsap">angular-gsap</h1>
      <p class="lede">{{ c.lede }}</p>
      <div class="hero-actions">
        <div class="install-box">
          <div class="pm-tabs">
            @for (p of pms; track p) {
              <button
                type="button"
                [class.on]="p === pm()"
                (click)="pm.set(p)"
              >
                {{ p }}
              </button>
            }
          </div>
          <button
            type="button"
            class="install"
            (click)="copyInstall()"
            [attr.aria-label]="c.copy"
          >
            <code>{{ installCmd() }}</code>
            <span class="copy-mark">{{ copied() ? '✓' : '⧉' }}</span>
          </button>
        </div>
        <button class="btn" (click)="replay()">{{ c.replay }}</button>
      </div>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="tape">
        @for (i of [0, 1]; track i) {
          <span class="tape-run">
            SCROLLTRIGGER ✦ SPLITTEXT ✦ MORPHSVG ✦ DRAWSVG ✦ FLIP ✦
            MOTIONPATH ✦ DRAGGABLE ✦ INERTIA ✦ OBSERVER ✦&nbsp;
          </span>
        }
      </div>
    </div>

    <section class="how">
      <div class="how-inner">
        <div class="how-grid">
          <div class="how-copy">
            <p class="eyebrow">{{ c.howEyebrow }}</p>
            <h2>{{ c.howTitle }}</h2>
            <p [innerHTML]="c.howBody"></p>
            <a [routerLink]="c.basicsLink">{{ c.howCta }}</a>
          </div>
          <app-code [code]="snippet" />
        </div>
      </div>
    </section>

    <section class="features">
      <p class="eyebrow">{{ c.featEyebrow }}</p>
      <ul stagger="0.08" on="scroll" preset="fade-up">
        @for (f of c.features; track f.title) {
          <li class="feature">
            <h3>{{ f.title }}</h3>
            <p [innerHTML]="f.body"></p>
          </li>
        }
      </ul>
    </section>
  `,
  styles: `
    .hero {
      max-width: 72rem;
      margin: 0 auto;
      padding: 5.5rem 1.5rem 4rem;
    }

    .logotype {
      font-size: clamp(2.6rem, 11vw, 7.5rem);
      font-weight: 900;
      font-stretch: 122%;
      letter-spacing: -0.02em;
      opacity: 0;
      margin: 0.25rem 0 0;
      white-space: nowrap;
    }

    .lede {
      max-width: 34rem;
      font-size: 1.15rem;
      color: var(--ink-soft);
      margin: 1.5rem 0 0;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .install-box {
      display: inline-block;
    }

    .pm-tabs {
      display: flex;
      gap: 0.35rem;
      margin-bottom: -2px;

      button {
        font-family: var(--font-mono);
        font-size: 0.72rem;
        letter-spacing: 0.06em;
        border: 2px solid var(--ink);
        border-bottom: none;
        border-radius: 8px 8px 0 0;
        background: var(--paper);
        color: var(--ink-soft);
        padding: 0.2rem 0.7rem;
        cursor: pointer;

        &.on {
          background: var(--ink);
          color: var(--paper);
        }
      }
    }

    .install {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      font-family: var(--font-mono);
      font-size: 0.88rem;
      color: var(--ink);
      background: var(--card);
      border: var(--bw) solid var(--ink);
      border-radius: 0 10px 10px 10px;
      box-shadow: var(--shadow-sm);
      padding: 0.55rem 1.1rem;
      cursor: pointer;

      code {
        font-family: inherit;
      }

      .copy-mark {
        font-size: 0.95rem;
        color: var(--ink-soft);
      }

      &:hover .copy-mark {
        color: var(--ink);
      }
    }

    .marquee {
      border-top: var(--bw) solid var(--ink);
      border-bottom: var(--bw) solid var(--ink);
      background: var(--ember);
      overflow: hidden;
      white-space: nowrap;
    }

    .tape {
      display: inline-flex;
      width: max-content;
      will-change: transform;
    }

    .tape-run {
      font-family: var(--font-display);
      font-stretch: 118%;
      font-weight: 900;
      font-size: 1.05rem;
      letter-spacing: 0.04em;
      padding: 0.55rem 0;
    }

    .how {
      background: var(--card);
      border-bottom: var(--bw) solid var(--ink);
    }

    .how-inner {
      max-width: 72rem;
      margin: 0 auto;
      padding: 4rem 1.5rem;
    }

    .how-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
      gap: 2.5rem;
      align-items: center;
    }

    .how-copy {
      max-width: 30rem;

      h2 {
        font-size: 1.9rem;
        font-weight: 800;
        margin-bottom: 1rem;
      }

      p:not(.eyebrow) {
        color: var(--ink-soft);
      }

      code {
        font-family: var(--font-mono);
        font-size: 0.85em;
      }
    }

    .features {
      max-width: 72rem;
      margin: 0 auto;
      padding: 4rem 1.5rem 5rem;

      ul {
        list-style: none;
        margin: 1.5rem 0 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
        gap: 1.25rem;
      }

      .feature {
        background: var(--card);
        border: var(--bw) solid var(--ink);
        border-radius: 12px;
        box-shadow: var(--shadow-sm);
        padding: 1.4rem;
        transition: transform 90ms ease, box-shadow 90ms ease;

        &:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 var(--ink);
        }

        h3 {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        p {
          margin: 0;
          font-size: 0.92rem;
          color: var(--ink-soft);
        }
      }
    }
  `,
})

export default class HomePage {
  protected readonly c = COPY[injectLocale()];
  private intro?: GsapTimeline;

  protected readonly pms = ['pnpm', 'npm', 'yarn'] as const;
  protected readonly pm = signal<'pnpm' | 'npm' | 'yarn'>('pnpm');
  protected readonly installCmd = () => {
    const verb = { pnpm: 'pnpm add', npm: 'npm install', yarn: 'yarn add' }[
      this.pm()
    ];
    return verb + ' @angular-gsap/core gsap';
  };

  protected readonly copied = signal(false);

  protected copyInstall(): void {
    navigator.clipboard?.writeText(this.installCmd()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1400);
    });
  }

  protected readonly snippet = [
    `@Component({`,
    `  template: '<div #box class="box"></div>',`,
    `})`,
    `export class Hero {`,
    `  box = viewChild.required<ElementRef>('box');`,
    `  x = signal(0);`,
    ``,
    `  ctx = injectGsap(({ gsap }) => {`,
    `    // vanilla GSAP; box and x() are tracked`,
    `    gsap.to(target(this.box), { x: this.x() });`,
    `  });`,
    ``,
    `  spin = this.ctx.contextSafe(() =>`,
    `    gsap.to(target(this.box), { rotation: 360 })`,
    `  );`,
    `}`,
  ].join('\n');

  protected readonly ref = injectGsap(({ gsap }) => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const split = SplitText.create('.logotype', { type: 'chars' });
    const flightColors = ['#e23b80', '#5b4be8', '#ffb627', '#0ae448'];
    const tick = split.chars.find((c) => c.textContent === '-');

    const tl = gsap.timeline();
    tl.set('.logotype', { opacity: 1 }).from(split.chars, {
      y: 90,
      opacity: 0,
      rotation: () => gsap.utils.random(-28, 28),
      color: (i: number) => flightColors[i % flightColors.length],
      duration: 0.9,
      stagger: 0.05,
      ease: 'back.out(1.6)',
    });
    // hand color back to the CSS token so theme switches stay visible
    tl.set(split.chars, { clearProps: 'color' });
    if (tick) {
      tl.set(tick, { color: '#0ae448' }, '>');
    }
    this.intro = tl;

    if (reduce) {
      tl.progress(1);
      return;
    }

    gsap.to('.tape', {
      xPercent: -50,
      duration: 22,
      ease: 'none',
      repeat: -1,
    });

    if (tick) {
      // the hyphen is the bridge between the two worlds; it never fully rests
      gsap.to(tick, {
        scaleY: 1.35,
        transformOrigin: '50% 60%',
        repeat: -1,
        yoyo: true,
        duration: 0.7,
        ease: 'sine.inOut',
        delay: 1.4,
      });
    }
  });

  protected replay = this.ref.contextSafe(() => this.intro?.restart());
}
