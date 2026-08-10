import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Stagger, injectGsap, type GsapTimeline } from '@angular-gsap/core';
import { SplitText } from 'gsap/SplitText';
import { CodeSnippet } from '../code-snippet';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'angular-gsap · GSAP for Angular',
};

@Component({
  selector: 'app-home',
  imports: [RouterLink, CodeSnippet, Stagger],
  template: `
    <section class="hero">
      <p class="eyebrow">gsap × angular · every plugin, free</p>
      <h1 class="logotype" aria-label="angular-gsap">angular-gsap</h1>
      <p class="lede">
        Write vanilla GSAP. The library handles the Angular part: host
        scoping, cleanup, signal reactivity, and SSR.
      </p>
      <div class="hero-actions">
        <code class="install">pnpm add &#64;angular-gsap/core gsap</code>
        <button class="btn" (click)="replay()">Replay intro</button>
      </div>
    </section>

    <div class="marquee" aria-hidden="true">
      <div class="tape">
        @for (i of [0, 1]; track i) {
          <span class="tape-run">
            SCROLLTRIGGER ✦ SPLITTEXT ✦ MORPHSVG ✦ DRAWSVG ✦ FLIP ✦
            MOTIONPATH ✦ OBSERVER ✦ TEXTPLUGIN ✦ ALL FREE ✦&nbsp;
          </span>
        }
      </div>
    </div>

    <section class="how">
      <div class="how-inner">
        <div class="how-grid">
          <div class="how-copy">
            <p class="eyebrow">The whole idea</p>
            <h2>One composable. Vanilla GSAP inside.</h2>
            <p>
              <code>injectGsap()</code> runs your GSAP code in a context that
              belongs to the component. Target elements with
              <code>viewChild</code> queries or component-scoped selectors,
              read signals to make it reactive, and the context reverts
              everything when the component is destroyed. On the server it
              never runs.
            </p>
            <a routerLink="/basics">Start with the basics →</a>
          </div>
          <app-code [code]="snippet" />
        </div>
      </div>
    </section>

    <section class="features">
      <p class="eyebrow">What it handles for you</p>
      <ul stagger="0.08" on="scroll" preset="fade-up">
        <li class="feature">
          <h3>Scoped by default</h3>
          <p>Selectors match inside your component's host and nowhere else.</p>
        </li>
        <li class="feature">
          <h3>Signal-reactive</h3>
          <p>
            Read a signal in the callback; the animation reverts and re-runs
            when it changes.
          </p>
        </li>
        <li class="feature">
          <h3>Cleans up after itself</h3>
          <p>
            Tweens, timelines, ScrollTriggers, and SplitText all revert on
            destroy.
          </p>
        </li>
        <li class="feature">
          <h3>SSR-safe</h3>
          <p>
            On the server the context never runs. No platform checks in your
            code.
          </p>
        </li>
        <li class="feature">
          <h3>Nothing wrapped</h3>
          <p>
            It's the real GSAP API, plus five preset directives for the
            common template cases.
          </p>
        </li>
        <li class="feature">
          <h3>Tree-shakeable</h3>
          <p>
            <code>sideEffects: false</code> and a tiny surface: unused exports
            drop out of your bundle, and GSAP plugins are only bundled when
            you import them.
          </p>
        </li>
        <li class="feature">
          <h3>Cheap at runtime</h3>
          <p>
            Tweens run on GSAP's ticker outside change detection. No rxjs, no
            zone.js, zoneless-ready.
          </p>
        </li>
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
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .install {
      font-family: var(--font-mono);
      font-size: 0.88rem;
      background: var(--card);
      border: var(--bw) solid var(--ink);
      border-radius: 10px;
      box-shadow: var(--shadow-sm);
      padding: 0.55rem 1.1rem;
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

      p {
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
  private intro?: GsapTimeline;

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
    if (tick) {
      tl.set(tick, { color: '#0ae448' }, '>-0.2');
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
