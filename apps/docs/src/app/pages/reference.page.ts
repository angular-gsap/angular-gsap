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
          <thead>
<tr>
            <th>Option</th>
            <th>Default</th>
            <th>What it does</th>
          </tr>
          </thead>
          <tbody>
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
          </tbody>
        </table>
        <h3>Returns <code>GsapRef</code></h3>
        <table>
          <thead>
<tr>
            <th>Member</th>
            <th>What it is</th>
          </tr>
          </thead>
          <tbody>
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
          </tbody>
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
          <thead>
<tr>
            <th>Option</th>
            <th>What it does</th>
          </tr>
          </thead>
          <tbody>
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
          </tbody>
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
        <h2>Directives</h2>
        <p>
          Preset directives, all built on the <code>injectGsap</code>
          engine: <code>reveal</code>, <code>stagger</code>,
          <code>splitReveal</code>, <code>scrambleText</code>,
          <code>drawSvg</code>, <code>counter</code>, <code>parallax</code>,
          <code>drag</code>, <code>scrollTo</code>, <code>observe</code>,
          <code>hover</code>, and
          <code>sequence</code>, which composes child entrances into one
          timeline (<code>[at]</code> accepts GSAP position syntax). Import
          the classes you use or <code>GSAP_DIRECTIVES</code> for all of
          them. Every input is a signal: change one and the animation
          replays. Under reduced motion they don't animate
          (<code>counter</code> shows the final value).
        </p>
        <app-code [code]="directiveSig" lang="html" label="usage" />
        <table>
          <thead>
<tr>
            <th>Input</th>
            <th>Default</th>
            <th>What it does</th>
          </tr>
          </thead>
          <tbody>
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
<tr>
            <td><code>splitReveal</code> / <code>kind</code></td>
            <td><code>words</code></td>
            <td>
              SplitReveal only: <code>chars</code>, <code>words</code>, or
              <code>lines</code>. Needs SplitText in
              <code>provideGsap</code>; the stagger defaults per kind and
              <code>each</code> overrides it.
            </td>
          </tr>
<tr>
            <td><code>counter</code> / <code>from</code> / <code>decimals</code></td>
            <td><code>0</code></td>
            <td>
              Counter only: the target number, the starting number, and the
              fraction digits. Formatted with the user's locale.
            </td>
          </tr>
<tr>
            <td><code>drawSvg</code> / <code>each</code></td>
            <td><code>0.15</code></td>
            <td>
              DrawSvg only: seconds between strokes when the host contains
              several. Needs DrawSVGPlugin in <code>provideGsap</code>.
            </td>
          </tr>
<tr>
            <td><code>sequence</code> / <code>at</code></td>
            <td>in order</td>
            <td>
              The container's attribute value is the gap between steps; each
              child's <code>at</code> is a GSAP position parameter.
            </td>
          </tr>
<tr>
            <td><code>parallax</code></td>
            <td><code>0.15</code></td>
            <td>
              Parallax only: fraction of the viewport height the element
              drifts while crossing it; negative moves against the scroll.
              Needs ScrollTrigger.
            </td>
          </tr>
          </tbody>
        </table>
        <p>
          The entrance directives and <code>counter</code> emit a
          <code>completed</code> output when they finish.
        </p>
      </section>

      <section class="api-section">
        <h2>Plugin coverage</h2>
        <p>
          The whole GSAP catalog works here, because nothing is wrapped.
          Where this table says "vars" or "callback", use the plugin inside
          <code>injectGsap</code> exactly as the GSAP docs show.
        </p>
        <table>
          <thead>
            <tr>
              <th>Plugin</th>
              <th>How you use it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ScrollTrigger, SplitText, DrawSVG, ScrambleText, ScrollTo, Draggable, Inertia, Observer</td>
              <td>
                Directives (<code>reveal</code>/<code>stagger</code>
                <code>on="scroll"</code>, <code>parallax</code>,
                <code>splitReveal</code>, <code>drawSvg</code>,
                <code>scrambleText</code>, <code>scrollTo</code>,
                <code>drag</code>, <code>observe</code>) or raw in the
                callback. Examples throughout.
              </td>
            </tr>
            <tr>
              <td>Flip, MorphSVG, MotionPath</td>
              <td>
                Raw in the callback; see the Flip, SVG, and Observer &amp;
                Inertia example pages.
              </td>
            </tr>
            <tr>
              <td>Text, Physics2D, PhysicsProps</td>
              <td>
                Property plugins: register them, then use
                <code>text</code>/<code>physics2D</code>/<code>physicsProps</code>
                vars in any tween.
              </td>
            </tr>
            <tr>
              <td>EasePack (rough, slow, expoScale), CustomEase, CustomBounce, CustomWiggle</td>
              <td>
                Register through <code>provideGsap</code>, then use them as
                ease strings (<code>ease: 'rough(…)'</code>) or create curves
                in the callback (<code>CustomEase.create()</code>).
              </td>
            </tr>
            <tr>
              <td>ScrollSmoother</td>
              <td>
                Deliberately un-wrapped: it's a page-level singleton that owns
                the body scroll. Create it once in your app shell's
                <code>injectGsap</code> callback.
              </td>
            </tr>
            <tr>
              <td>GSDevTools, MotionPathHelper</td>
              <td>
                Dev tools: create them in the callback during development
                (<code>GSDevTools.create({ animation: tl })</code>); the
                context cleans them up.
              </td>
            </tr>
            <tr>
              <td>Pixi, Easel</td>
              <td>
                Canvas-library bridges; register and tween Pixi/Easel objects
                from the callback like any other target.
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          Anything GSAP doesn't track (a <code>gsap.ticker</code> loop, an
          event listener): return a cleanup function from the callback and it
          runs on destroy.
        </p>
      </section>

      <section class="api-section">
        <h2>Tree-shaking plugins</h2>
        <p>
          The library imports no GSAP plugin, ever, so your bundle contains
          exactly the plugins your app imports and nothing else. Register
          only what a given scope uses; <code>provideGsap</code> also works
          in lazy route <code>providers</code>, which puts a plugin's code in
          that route's chunk instead of the main bundle:
        </p>
        <app-code [code]="routePluginsSig" label="app.routes.ts" />
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

  protected readonly routePluginsSig = [
    `// main bundle: no plugins at all`,
    `{`,
    `  path: 'gallery',`,
    `  loadComponent: () => import('./gallery'),`,
    `  // Flip ships in the gallery chunk only`,
    `  providers: [provideGsap({ plugins: [Flip] })],`,
    `},`,
  ].join('\n');

  protected readonly directiveSig = [
    `<h1 reveal>Fades up</h1>`,
    `<ul stagger="0.08" preset="scale-in"><li>…</li></ul>`,
    `<p splitReveal="chars" on="scroll">…</p>`,
    `<span [counter]="12500" [decimals]="0"></span>`,
    `<img parallax="0.3" src="…" />`,
  ].join('\n');
}
