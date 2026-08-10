import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Hover, Stagger, injectGsap, type GsapTimeline } from '@angular-gsap/core';
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
    frame:
      "GSAP itself is framework-agnostic: it runs in any Angular app today, no wrapper required. What it can't know is Angular — when a template has rendered, what a component owns, when it's destroyed, whether the code is on a server. This library handles exactly those friction points and nothing else.",
    howEyebrow: 'The whole idea',
    howTitle: 'One composable. Vanilla GSAP inside.',
    howBody:
      '<code>injectGsap()</code> runs your GSAP code in a context that belongs to the component. Target elements with <code>viewChild</code> queries or component-scoped selectors, read signals to make it reactive, and the context reverts everything when the component is destroyed. On the server it never runs.',
    howCta: 'Start with the basics →',
    basicsLink: '/start',
    featEyebrow: 'What it handles for you',
    featNote:
      "None of this needs a library — it's the glue you'd otherwise write and maintain yourself, in every component that animates.",
    features: [
      {
        title: 'Scoped like your styles',
        body: "Fifty instances of a component, each animating <code>'.icon'</code>? Each one only ever touches its own. Selectors stop at the host, exactly like component styles do.",
      },
      {
        title: 'Signals drive motion too',
        body: 'Your signals already drive the template. Read one in the callback and it drives the animation the same way: change it, and the animation replays against the freshly rendered DOM.',
      },
      {
        title: 'Nothing to write in ngOnDestroy',
        body: 'Leave the route and every tween, ScrollTrigger, and text split is reverted, the same way Angular tears down the view itself. Forgetting cleanup stops being a bug you can write.',
      },
      {
        title: 'ng add @angular/ssr just works',
        body: "No 'window is not defined' at build time, no isPlatformBrowser guards scattered through components. Animation code simply waits until there's a browser.",
      },
      {
        title: 'Every GSAP tutorial applies',
        body: "You're writing GSAP, not a translation of it. Docs, forum answers, and CodePens work verbatim; the directives are shortcuts, not a dialect.",
      },
      {
        title: 'Bundle budgets stay green',
        body: 'Use two directives and the other nine leave your bundle. Plugins cost bytes only when you import them.',
      },
      {
        title: 'Change detection stays idle',
        body: "A tween at 60fps never schedules a change detection pass: GSAP's ticker does the work while Angular does nothing. No zone.js, no rxjs anywhere in the library.",
      },
    ],
  },
  es: {
    eyebrow: 'gsap × angular',
    lede: 'Escribe GSAP puro. La librería se encarga de la parte de Angular: scoping al host, limpieza, reactividad con signals y SSR.',
    replay: 'Repetir intro',
    copy: 'Copiar comando de instalación',
    frame:
      'GSAP es agnóstico al framework: corre en cualquier app Angular hoy, sin wrapper. Lo que no puede saber es Angular — cuándo se pintó un template, qué posee un componente, cuándo se destruye, si el código corre en un servidor. Esta librería resuelve exactamente esas fricciones y nada más.',
    howEyebrow: 'La idea completa',
    howTitle: 'Un composable. GSAP puro adentro.',
    howBody:
      '<code>injectGsap()</code> ejecuta tu código GSAP en un contexto que pertenece al componente. Apunta a elementos con queries <code>viewChild</code> o selectores limitados al componente, lee signals para hacerlo reactivo, y el contexto revierte todo cuando el componente se destruye. En el servidor nunca se ejecuta.',
    howCta: 'Empieza con los básicos →',
    basicsLink: '/es/start',
    featEyebrow: 'Lo que resuelve por ti',
    featNote:
      'Nada de esto necesita una librería: es el pegamento que de otro modo escribes y mantienes tú, en cada componente que anima.',
    features: [
      {
        title: 'Scoped como tus estilos',
        body: "¿Cincuenta instancias de un componente, cada una animando <code>'.icon'</code>? Cada una toca solo el suyo. Los selectores se detienen en el host, exactamente como los estilos del componente.",
      },
      {
        title: 'Los signals también mueven',
        body: 'Tus signals ya dirigen el template. Lee uno en el callback y dirige la animación igual: cámbialo y la animación se repite contra el DOM recién pintado.',
      },
      {
        title: 'Nada que escribir en ngOnDestroy',
        body: 'Sal de la ruta y cada tween, ScrollTrigger y división de texto se revierte, igual que Angular desmonta la vista. Olvidar la limpieza deja de ser un bug posible.',
      },
      {
        title: 'ng add @angular/ssr sin sustos',
        body: "Sin 'window is not defined' al compilar, sin isPlatformBrowser regado por los componentes. El código de animación simplemente espera a que haya navegador.",
      },
      {
        title: 'Todo tutorial de GSAP aplica',
        body: 'Escribes GSAP, no una traducción. Docs, respuestas de foros y CodePens funcionan tal cual; las directivas son atajos, no un dialecto.',
      },
      {
        title: 'El bundle no engorda',
        body: 'Usa dos directivas y las otras nueve salen del bundle. Los plugins cuestan bytes solo cuando los importas.',
      },
      {
        title: 'Change detection en reposo',
        body: 'Un tween a 60fps nunca agenda un pase de change detection: el ticker de GSAP hace el trabajo mientras Angular no hace nada. Sin zone.js, sin rxjs en la librería.',
      },
    ],
  },
} as const;

@Component({
  selector: 'app-home',
  imports: [RouterLink, CodeSnippet, Hover, Stagger],
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
            <p class="frame">{{ c.frame }}</p>
            <p [innerHTML]="c.howBody"></p>
            <a [routerLink]="c.basicsLink">{{ c.howCta }}</a>
          </div>
          <app-code [code]="snippet" />
        </div>
      </div>
    </section>

    <section class="features">
      <p class="eyebrow">{{ c.featEyebrow }}</p>
      <p class="feat-note">{{ c.featNote }}</p>
      <ul stagger="0.08" on="scroll" preset="fade-up" [distance]="40">
        @for (f of c.features; track f.title) {
          <li class="feature" hover>
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

      .frame {
        color: var(--ink);
        font-weight: 500;
      }

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

      .feat-note {
        color: var(--ink-soft);
        max-width: 40rem;
        margin: 0.9rem 0 0;
      }

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
