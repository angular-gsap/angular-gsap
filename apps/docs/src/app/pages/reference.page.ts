import { Component } from '@angular/core';
import { CodeSnippet } from '../code-snippet';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'API · angular-gsap',
};

@Component({
  selector: 'app-reference',
  imports: [CodeSnippet],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">Reference</p>
        <h1>The whole API</h1>
        <p>
          Everything <code>&#64;angular-gsap/core</code> exports. The surface
          is small on purpose: the library owns lifecycle, GSAP owns
          animation.
        </p>
      </header>

      <section class="api-section">
        <h2>injectGsap(callback?, options?)</h2>
        <p>
          Runs the callback's GSAP code in a <code>gsap.context()</code> tied
          to the component. It runs after the first render, re-runs when
          signals read inside it change (reverting the previous cycle first),
          reverts everything on destroy, and never runs on the server.
        </p>
        <app-code [code]="injectSig" label="signature" />
        <h3>Options</h3>
        <table>
          <tr>
            <th>Option</th>
            <th>Default</th>
            <th>What it does</th>
          </tr>
          <tr>
            <td><code>scope</code></td>
            <td>host element</td>
            <td>
              Where selector text resolves. Pass an
              <code>Element</code>, <code>ElementRef</code>, or CSS string to
              change it, or <code>false</code> for document-wide.
            </td>
          </tr>
          <tr>
            <td><code>reactive</code></td>
            <td><code>true</code></td>
            <td>
              Set to <code>false</code> to run exactly once and ignore signal
              changes.
            </td>
          </tr>
          <tr>
            <td><code>injector</code></td>
            <td>current</td>
            <td>Needed when calling outside an injection context.</td>
          </tr>
        </table>
        <h3>Returns <code>GsapRef</code></h3>
        <table>
          <tr>
            <th>Member</th>
            <th>What it is</th>
          </tr>
          <tr>
            <td><code>gsap</code></td>
            <td>The GSAP instance.</td>
          </tr>
          <tr>
            <td><code>context</code></td>
            <td>
              The live <code>gsap.Context</code>. <code>undefined</code> on
              the server and before first render.
            </td>
          </tr>
          <tr>
            <td><code>ready</code></td>
            <td>
              <code>Signal&lt;boolean&gt;</code>, flips to <code>true</code>
              once the context exists.
            </td>
          </tr>
          <tr>
            <td><code>contextSafe(fn)</code></td>
            <td>
              Wraps event handlers so anything they create joins the context
              and its cleanup.
            </td>
          </tr>
          <tr>
            <td><code>revert()</code></td>
            <td>Reverts everything; elements go back to their pre-animation state.</td>
          </tr>
          <tr>
            <td><code>kill()</code></td>
            <td>Kills everything without reverting inline styles.</td>
          </tr>
        </table>
      </section>

      <section class="api-section">
        <h2>provideGsap(options?)</h2>
        <p>
          One-time global setup, usually in <code>app.config.ts</code>. All of
          it is optional, and none of it runs on the server.
        </p>
        <app-code [code]="provideSig" label="usage" />
        <table>
          <tr>
            <th>Option</th>
            <th>What it does</th>
          </tr>
          <tr>
            <td><code>plugins</code></td>
            <td>
              Registers GSAP plugins once (<code>ScrollTrigger</code>,
              <code>SplitText</code>, <code>Flip</code>, …). Import them from
              the <code>gsap</code> package; only what you import gets
              bundled.
            </td>
          </tr>
          <tr>
            <td><code>config</code></td>
            <td>Passed to <code>gsap.config()</code>.</td>
          </tr>
          <tr>
            <td><code>defaults</code></td>
            <td>
              Passed to <code>gsap.defaults()</code>: default vars for every
              tween.
            </td>
          </tr>
        </table>
      </section>

      <section class="api-section">
        <h2>target(source) / targets(source)</h2>
        <p>
          Unwrap <code>viewChild</code> / <code>viewChildren</code> queries
          (or plain <code>ElementRef</code>s and elements) into the DOM nodes
          GSAP expects. Pass the query signal itself: read inside a callback
          it stays tracked, so new elements re-run the animation.
        </p>
        <app-code [code]="targetSig" label="usage" />
      </section>

      <section class="api-section">
        <h2>Directives: reveal and stagger</h2>
        <p>
          Preset entrances for templates, built on the
          <code>injectGsap</code> engine. Import <code>Reveal</code> and
          <code>Stagger</code> (or <code>GSAP_DIRECTIVES</code> for both).
          Every input is a signal: change one and the entrance replays. When
          the OS asks for reduced motion, they don't animate at all.
        </p>
        <app-code [code]="directiveSig" lang="html" label="usage" />
        <table>
          <tr>
            <th>Input</th>
            <th>Default</th>
            <th>What it does</th>
          </tr>
          <tr>
            <td><code>reveal</code> / <code>preset</code></td>
            <td><code>fade-up</code></td>
            <td>
              One of <code>fade</code>, <code>fade-up</code>,
              <code>fade-down</code>, <code>fade-left</code>,
              <code>fade-right</code>, <code>scale-in</code>.
            </td>
          </tr>
          <tr>
            <td><code>on</code></td>
            <td><code>init</code></td>
            <td>
              <code>init</code> plays after first render;
              <code>scroll</code> when the element enters the viewport (needs
              ScrollTrigger in <code>provideGsap</code>).
            </td>
          </tr>
          <tr>
            <td><code>delay</code></td>
            <td><code>0</code></td>
            <td>Seconds before the entrance starts.</td>
          </tr>
          <tr>
            <td><code>duration</code></td>
            <td><code>0.7</code></td>
            <td>Entrance length in seconds.</td>
          </tr>
          <tr>
            <td><code>distance</code></td>
            <td><code>28</code></td>
            <td>Travel in px for the directional presets.</td>
          </tr>
          <tr>
            <td><code>ease</code></td>
            <td><code>power3.out</code></td>
            <td>Any GSAP ease string.</td>
          </tr>
          <tr>
            <td><code>start</code></td>
            <td><code>top 85%</code></td>
            <td>ScrollTrigger start, only used with <code>on="scroll"</code>.</td>
          </tr>
          <tr>
            <td><code>stagger</code> / <code>each</code></td>
            <td><code>0.08</code></td>
            <td>Stagger only: seconds between each child.</td>
          </tr>
          <tr>
            <td><code>items</code></td>
            <td>direct children</td>
            <td>
              Stagger only: a CSS selector, resolved inside the host, for the
              staggered items.
            </td>
          </tr>
        </table>
        <p>
          Both emit a <code>completed</code> output when the entrance
          finishes.
        </p>
      </section>

      <section class="api-section">
        <h2>Types</h2>
        <p>
          Re-exports so you rarely import from <code>gsap</code> directly:
          <code>Gsap</code>, <code>GsapTween</code>,
          <code>GsapTimeline</code>, <code>GsapContext</code>,
          <code>GsapTweenVars</code>, <code>GsapTimelineVars</code>,
          <code>GsapConfig</code>. Plus the library's own:
          <code>GsapRef</code>, <code>GsapCallback</code>,
          <code>InjectGsapOptions</code>, <code>GsapOptions</code>,
          <code>RevealPreset</code>, <code>ElementLike</code>, and a
          <code>prefersReducedMotion()</code> helper.
        </p>
      </section>
    </div>
  `,
  styles: `
    .api-section {
      max-width: 52rem;
      margin-top: 3rem;
      border-top: 1px solid var(--hairline);
      padding-top: 2rem;

      h2 {
        font-size: 1.35rem;
        font-weight: 800;
        margin-bottom: 0.75rem;
      }

      h3 {
        font-size: 0.95rem;
        font-weight: 700;
        margin: 1.5rem 0 0.5rem;
      }

      p {
        color: var(--ink-soft);
        margin: 0 0 1.25rem;
      }

      code {
        font-family: var(--font-mono);
        font-size: 0.85em;
        color: var(--ink);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
        margin: 0.5rem 0 1.25rem;
      }

      th {
        text-align: left;
        font-family: var(--font-mono);
        font-size: 0.72rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ink-soft);
        font-weight: 500;
        padding: 0.4rem 1rem 0.4rem 0;
        border-bottom: 1px solid var(--hairline);
      }

      td {
        vertical-align: top;
        color: var(--ink-soft);
        padding: 0.55rem 1rem 0.55rem 0;
        border-bottom: 1px solid var(--hairline);
      }
    }
  `,
})
export default class ReferencePage {
  protected readonly injectSig = [
    `const ref = injectGsap(({ gsap, context }) => {`,
    `  // vanilla GSAP here`,
    `}, {`,
    `  scope: hostElement,  // optional`,
    `  reactive: true,      // optional`,
    `  injector: injector,  // optional`,
    `});`,
  ].join('\n');

  protected readonly provideSig = [
    `provideGsap({`,
    `  plugins: [ScrollTrigger, SplitText, Flip],`,
    `  config: { nullTargetWarn: false },`,
    `  defaults: { ease: 'power3.out' },`,
    `});`,
  ].join('\n');

  protected readonly targetSig = [
    `box = viewChild.required<ElementRef>('box');`,
    `dots = viewChildren<ElementRef>('dot');`,
    ``,
    `ref = injectGsap(({ gsap }) => {`,
    `  gsap.to(target(this.box), { x: 100 });`,
    `  gsap.from(targets(this.dots), { scale: 0 });`,
    `});`,
  ].join('\n');

  protected readonly directiveSig = [
    `<h1 reveal>Fades up</h1>`,
    `<p reveal="fade-right" on="scroll" [delay]="0.2">…</p>`,
    ``,
    `<ul stagger="0.08" preset="scale-in">`,
    `  <li>…</li>`,
    `</ul>`,
  ].join('\n');
}
