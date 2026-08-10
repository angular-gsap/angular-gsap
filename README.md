# angular-gsap

**Write vanilla GSAP inside Angular.** `@angular-gsap/core` gives your GSAP code an Angular-managed context (host-scoped, signal-reactive, SSR-safe, cleaned up automatically) without wrapping a single GSAP API.

[![npm](https://img.shields.io/npm/v/%40angular-gsap%2Fcore)](https://www.npmjs.com/package/@angular-gsap/core)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)

```ts
import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { injectGsap, target } from '@angular-gsap/core';
import { gsap } from 'gsap';

@Component({
  template: `
    <div #box class="box"></div>
    <button (click)="spin()">Spin</button>
  `,
})
export class Hero {
  box = viewChild.required<ElementRef>('box');
  x = signal(0);

  // Vanilla GSAP. Reading x() makes it reactive: change the
  // signal and the animation reverts and re-runs. Cleaned up
  // on destroy. Never runs on the server.
  ctx = injectGsap(({ gsap }) => {
    gsap.to(target(this.box), { x: this.x(), duration: 1 });
  });

  // Event handlers stay in the context (and its cleanup) too.
  spin = this.ctx.contextSafe(() =>
    gsap.to(target(this.box), { rotation: 360 })
  );
}
```

## Why not wrap GSAP?

GSAP's surface is enormous: tweens, timelines, position parameters, staggers, ScrollTrigger, SplitText, getters, utilities. Wrappers that re-expose it as directives or per-tween helpers cover a fraction of it awkwardly and go stale as GSAP evolves. What Angular actually makes hard is **lifecycle**: create animations after the DOM exists, scope selectors to your component, react to state, and clean everything up.

That is the approach GSAP itself endorses with [`@gsap/react`'s `useGSAP()`](https://gsap.com/resources/React/). `injectGsap()` is its Angular equivalent, with signals replacing React's dependency arrays. It also adds something hard to hand-roll: signals read in the callback re-run it *after* the DOM has updated (`afterRenderEffect`), so animations always see fresh `@if`/`@for` output. The [Flip example](https://github.com/angular-gsap/angular-gsap/blob/main/apps/docs/src/app/pages/flip.page.ts) leans on this hard: capture layout before a signal changes the DOM, FLIP-animate after Angular renders.

## Install

```sh
pnpm add @angular-gsap/core gsap
# or: npm i @angular-gsap/core gsap
```

Since GSAP 3.13 the entire toolset is [100% free](https://gsap.com/pricing/), including formerly paid plugins like ScrollTrigger, SplitText, and MorphSVG. Everything ships in the `gsap` npm package.

## Usage

### `injectGsap(callback?, options?)`

Runs your callback inside a [`gsap.context()`](https://gsap.com/docs/v3/GSAP/gsap.context()) that is:

| Guarantee       | Meaning                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------- |
| Scoped          | Selector text (`'.box'`) only matches elements inside the component's host                   |
| DOM-ready       | Runs after the first render (`afterRenderEffect`), so `@if`/`@for` output exists             |
| Signal-reactive | Signals read in the callback re-run it; the previous cycle is `revert()`ed first             |
| SSR-safe        | On the server the callback never runs; no platform checks in your code                       |
| Zone-free       | Animations are created outside Angular's change detection; works in zoneless apps            |
| Auto-cleaned    | Tweens, timelines, ScrollTriggers, and SplitText instances revert when the component dies    |

Returns a `GsapRef`:

```ts
const ref = injectGsap(({ gsap, context }) => {
  /* vanilla GSAP */
  // optionally return a cleanup, like gsap.context():
  // return () => gsap.ticker.remove(render);
});

ref.gsap;               // the GSAP instance
ref.context;            // the live gsap.Context (undefined on the server)
ref.ready;              // Signal<boolean>, true once the context exists
ref.contextSafe(fn);    // wrap event handlers; their animations join the cleanup
ref.revert();           // manually revert everything
ref.kill();             // kill without reverting inline styles
```

Options:

```ts
injectGsap(cb, {
  scope: someElement,   // override the selector scope (default: host element; false = unscoped)
  reactive: false,      // run exactly once, ignore signal changes
  injector: myInjector, // use outside an injection context
});
```

### Targeting elements

Two styles, freely mixed. `viewChild`/`viewChildren` signal queries with the `target()`/`targets()` unwrap helpers are the most Angular way; query signals are tracked, so when `viewChildren` picks up new elements the animation re-runs on its own:

```ts
dots = viewChildren<ElementRef>('dot');
ref = injectGsap(({ gsap }) => {
  gsap.from(targets(this.dots), { scale: 0, stagger: 0.04 });
});
```

Selector strings also work and are scoped to the component's host, so `'.dot'` can't reach another component:

```ts
ref = injectGsap(({ gsap }) => {
  gsap.from('.dot', { scale: 0, stagger: 0.04 });
});
```

### `provideGsap(options?)`

Optional global setup. Register plugins once, set defaults:

```ts
import { provideGsap } from '@angular-gsap/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

bootstrapApplication(App, {
  providers: [
    provideGsap({
      plugins: [ScrollTrigger, SplitText],
      defaults: { ease: 'power3.out' },
    }),
  ],
});
```

Plugin registration is skipped on the server automatically.

### Sugar directives: `reveal` and `stagger`

For the common 90% (an element or list entering the view), two preset-based
directives keep the animation in the template. They're built on the
`injectGsap` engine, with the same scoping, cleanup, and reduced-motion
handling:

```html
<!-- entrance on init; inputs are signals -->
<h1 reveal>Fades up</h1>
<section reveal="fade-right" [delay]="0.2">…</section>

<!-- when scrolled into view (needs ScrollTrigger in provideGsap) -->
<p reveal="fade-up" on="scroll">…</p>

<!-- staggered children -->
<ul stagger="0.08" preset="scale-in">
  <li>…</li>
  <li>…</li>
</ul>
```

```ts
import { Reveal, Stagger } from '@angular-gsap/core';
```

Presets: `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `scale-in`.
Inputs (`preset`, `on`, `delay`, `duration`, `distance`, `ease`, `start`) are
signals; change one and the entrance replays. When the OS asks for reduced
motion they don't animate at all. They are deliberately **not** general-purpose
tween wrappers: anything beyond a preset entrance belongs in `injectGsap`.

### Patterns

**State-driven choreography.** A `viewChildren` query is a signal: when state adds or removes elements, the query updates and the animation replays, with the DOM already rendered:

```ts
dots = viewChildren<ElementRef>('dot');
ref = injectGsap(({ gsap }) => {
  gsap.from(targets(this.dots), { scale: 0, stagger: 0.04, ease: 'back.out(2)' });
});
```

**Timeline transport.** Build in the callback, drive from `contextSafe` handlers:

```ts
private tl?: GsapTimeline;
ref = injectGsap(({ gsap }) => {
  this.tl = gsap.timeline({ repeat: -1 }).to('.bar', { scaleY: 4, stagger: 0.1 });
});
play = this.ref.contextSafe(() => this.tl?.play());
```

**Replay.** Bump a signal:

```ts
run = signal(0);
ref = injectGsap(({ gsap }) => {
  this.run();
  gsap.from('.item', { y: 24, opacity: 0, stagger: 0.05 });
});
replay = () => this.run.update((n) => n + 1);
```

## Docs & examples

The [`apps/docs`](./apps/docs) app is a live tour built with [Analog](https://analogjs.org), with the source of every example alongside it: SplitText hero, signal-driven staggers, the directives, timeline controls, ScrollTrigger scrubbing, a FLIP-animated filter, a quickTo cursor follower, SVG drawing/morphing/motion paths, and GSAP-driven WebGL uniforms.

```sh
pnpm install
pnpm nx serve docs
```

## Small and fast

- The package is about 6 kB (FESM + types) with no dependencies beyond Angular, GSAP, and tslib. No rxjs, no zone.js.
- `sideEffects: false`: exports you don't use (the directives, the helpers) tree-shake away, and GSAP plugins are bundled only when you import them.
- Animations are created outside Angular's change detection and run on GSAP's ticker. A 60 fps tween schedules no Angular work, and the whole library is zoneless-ready.

## Compatibility

- Angular `>= 21` (built and tested against Angular 22, zoneless by default)
- GSAP `>= 3.12`
- SSR / prerendering supported out of the box

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Issues and PRs welcome.

## License

[MIT](./LICENSE). GSAP itself is licensed under its own [Standard License](https://gsap.com/community/standard-license/), free including for commercial use.
