import { Component } from '@angular/core';
import { CodeSnippet } from '../code-snippet';
import { injectGsap } from '@angular-gsap/core';

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
    </div>

    <div class="track">
      <div class="pin">
        <div class="stage scroll-stage">
          <span class="shape"></span>
          <div class="meter"><span class="meter-fill"></span></div>
          <p class="hint">keep scrolling — the tween is bound to the scrollbar</p>
        </div>
      </div>
    </div>

    <div class="page outro">
      <p>
        The square became a circle, turned Angular pink to GSAP green, and did a
        full rotation — all scrubbed, nothing on a clock.
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
    `// scroll.ts — plain GSAP, nothing special`,
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
