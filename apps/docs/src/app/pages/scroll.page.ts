import { Component } from '@angular/core';
import { CodeSnippet } from '../code-snippet';
import { injectGsap } from '@angular-gsap/core';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'ScrollTrigger · angular-gsap',
};

@Component({
  imports: [CodeSnippet],
  selector: 'app-scroll',
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">Example · plugin: ScrollTrigger</p>
        <h1>Scrub a timeline with scroll</h1>
        <p>
          ScrollTrigger is registered once with
          <code>provideGsap({{ '{' }} plugins: [ScrollTrigger] {{ '}' }})</code>
          and used exactly as the GSAP docs describe. The context reverts the
          trigger when you leave this page.
        </p>
        <div class="api-chips">
          <span>provideGsap</span><span>ScrollTrigger</span
          ><span>injectGsap</span>
        </div>
      </header>
      <app-code [code]="snippet" />

      <section class="explain">
        <h2>What the library is doing here</h2>
        <ul>
          <li>
            <strong>ScrollTrigger, exactly as documented.</strong> The
            <code>scrollTrigger</code> config is passed straight to GSAP. The
            library adds nothing and hides nothing.
          </li>
          <li>
            <strong>The usual leak can't happen.</strong> A ScrollTrigger that
            outlives its component keeps measuring and firing on every scroll
            after you leave the page. This one is registered in the context,
            so navigating away reverts it.
          </li>
          <li>
            <strong>Scrubbing never touches Angular.</strong> The tween is
            bound to the scrollbar and runs outside change detection, so a
            scroll event costs the framework nothing.
          </li>
        </ul>
      </section>
    </div>

    <div class="track">
      <div class="pin">
        <div class="stage scroll-stage">
          <span class="shape"></span>
          <div class="meter"><span class="meter-fill"></span></div>
          <p class="hint">keep scrolling: the tween is bound to the scrollbar</p>
        </div>
      </div>
    </div>

    <div class="page outro">
      <p>
        The square became a circle, turned Angular pink to GSAP green, and did
        a full rotation, all scrubbed by the scrollbar rather than a clock.
      </p>
    </div>
  `,
  styles: `
    .page {
      padding-bottom: 2rem;
    }

    .track {
      height: 280vh;
    }

    .pin {
      position: sticky;
      top: 5.5rem;
      padding: 0 1.5rem;
      max-width: 72rem;
      margin: 0 auto;
    }

    .scroll-stage {
      display: grid;
      place-items: center;
      align-content: center;
      gap: 2rem;
      min-height: min(70vh, 30rem);
    }

    .shape {
      width: 7rem;
      height: 7rem;
      border-radius: 14px;
      background: #e23b80;
    }

    .meter {
      width: min(60%, 20rem);
      height: 4px;
      border-radius: 999px;
      background: var(--hairline);
      overflow: hidden;
    }

    .meter-fill {
      display: block;
      height: 100%;
      width: 100%;
      background: var(--ink);
      transform: scaleX(0);
      transform-origin: left;
    }

    .hint {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--ink-soft);
      margin: 0;
    }

    .outro {
      max-width: 44rem;
      color: var(--ink-soft);
      padding-top: 3rem;
    }
  `,
})
export default class ScrollPage {
  protected readonly ref = injectGsap(({ gsap }) => {
    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: '.track',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      })
      .to('.shape', {
        rotation: 360,
        borderRadius: '50%',
        backgroundColor: '#0ae448',
        scale: 1.35,
      })
      .to('.meter-fill', { scaleX: 1 }, 0);
  });

  protected readonly snippet = [
    `// app.config.ts`,
    `provideGsap({ plugins: [ScrollTrigger] });`,
    ``,
    `// scroll.ts: plain GSAP, nothing special`,
    `ref = injectGsap(({ gsap }) => {`,
    `  gsap`,
    `    .timeline({`,
    `      scrollTrigger: {`,
    `        trigger: '.track',`,
    `        start: 'top top',`,
    `        end: 'bottom bottom',`,
    `        scrub: 0.5,`,
    `      },`,
    `    })`,
    `    .to('.shape', {`,
    `      rotation: 360,`,
    `      borderRadius: '50%',`,
    `      backgroundColor: '#0ae448',`,
    `    });`,
    `});`,
  ].join('\n');
}
