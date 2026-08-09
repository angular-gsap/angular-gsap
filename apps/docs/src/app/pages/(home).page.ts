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

    <section class="how">
      <div class="how-inner">
        <p class="eyebrow">Why not just GSAP?</p>
        <h2>The animation is GSAP's. The lifecycle is the hard part.</h2>
        <p class="how-lede">
          GSAP doesn't know when Angular has rendered, what your component
          owns, or when it's destroyed. Hand-rolling that glue looks like the
          left column, and you get to repeat it in every animated component.
        </p>
        <div class="compare">
          <figure>
            <figcaption>gsap alone in a component</figcaption>
            <app-code [code]="vanillaSnippet" />
          </figure>
          <figure>
            <figcaption>with &#64;angular-gsap/core</figcaption>
            <app-code [code]="snippet" />
          </figure>
        </div>
        <ul class="wins">
          <li>
            <strong>Nothing to forget.</strong> Cleanup, host scoping, and SSR
            guards are the library's job instead of a code-review checklist. A
            forgotten <code>revert()</code> is the bug most Angular + GSAP
            threads end in: ScrollTriggers that keep firing after you navigate
            away.
          </li>
          <li>
            <strong>Reactivity you can't easily hand-roll.</strong> Signals
            read in the callback re-run it <em>after</em> the DOM has updated
            (<code>afterRenderEffect</code>). A plain <code>effect()</code>
            fires before the template applies the change, so it animates stale
            elements.
          </li>
          <li>
            <strong>Still 100% GSAP.</strong> No wrapper API to learn or to go
            stale. Timelines, staggers, position parameters, and every plugin
            work exactly as the GSAP docs describe.
          </li>
        </ul>
        <a routerLink="/basics">Start with the basics →</a>
      </div>
    </section>

    <section class="features">
      <p class="eyebrow">Why it exists</p>
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
            It's the real GSAP API, plus optional sugar directives for the
            common entrances.
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
      border: 1px solid var(--hairline);
      border-radius: 999px;
      padding: 0.55rem 1.1rem;
    }

    .how {
      border-top: 1px solid var(--hairline);
      background: var(--card);
    }

    .how-inner {
      max-width: 72rem;
      margin: 0 auto;
      padding: 4rem 1.5rem;

      h2 {
        font-size: 1.9rem;
        font-weight: 800;
        margin-bottom: 1rem;
        max-width: 38rem;
      }

      code {
        font-family: var(--font-mono);
        font-size: 0.85em;
      }
    }

    .how-lede {
      color: var(--ink-soft);
      max-width: 38rem;
      margin: 0 0 2rem;
    }

    .compare {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
      gap: 1.25rem;
      align-items: start;

      figure {
        margin: 0;
      }

      figcaption {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ink-soft);
        margin-bottom: 0.6rem;
      }
    }

    .wins {
      list-style: none;
      padding: 0;
      margin: 2rem 0 1.5rem;
      display: grid;
      gap: 0.9rem;
      max-width: 44rem;

      li {
        color: var(--ink-soft);
        font-size: 0.95rem;
      }

      strong {
        color: var(--ink);
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
        border: 1px solid var(--hairline);
        border-radius: 12px;
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
  private intro?: GsapTimeline;

  protected readonly vanillaSnippet = [
    `@Component({ template: '<div class="box"></div>' })`,
    `export class Hero implements AfterViewInit, OnDestroy {`,
    `  private ctx?: gsap.Context;`,
    `  private platformId = inject(PLATFORM_ID);`,
    `  private host = inject(ElementRef);`,
    ``,
    `  ngAfterViewInit() {`,
    `    // SSR guard, or the server build crashes`,
    `    if (!isPlatformBrowser(this.platformId)) return;`,
    `    // scope it yourself, or '.box' matches`,
    `    // every .box on the page`,
    `    this.ctx = gsap.context(() => {`,
    `      gsap.to('.box', { x: 100, duration: 1 });`,
    `    }, this.host.nativeElement);`,
    `  }`,
    ``,
    `  ngOnDestroy() {`,
    `    // forget this and ScrollTriggers keep`,
    `    // firing after the route changes`,
    `    this.ctx?.revert();`,
    `  }`,
    `}`,
  ].join('\n');

  protected readonly snippet = [
      `@Component({ template: '<div class="box"></div>' })`,
      `export class Hero {`,
      `  x = signal(0);`,
      ``,
      `  gsap = injectGsap(({ gsap }) => {`,
      `    // plain GSAP: scoped, cleaned up, reactive`,
      `    gsap.to('.box', { x: this.x(), duration: 1 });`,
      `  });`,
      ``,
      `  spin = this.gsap.contextSafe(() =>`,
      `    gsap.to('.box', { rotation: 360 })`,
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
