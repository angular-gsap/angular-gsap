# @angular-gsap/core

**Write vanilla GSAP inside Angular.** An Angular-managed `gsap.context()` (host-scoped, signal-reactive, SSR-safe, auto-cleaned) without wrapping a single GSAP API. The Angular equivalent of `@gsap/react`'s `useGSAP()`.

```ts
import { Component, signal } from '@angular/core';
import { injectGsap } from '@angular-gsap/core';
import { gsap } from 'gsap';

@Component({
  template: `
    <div class="box"></div>
    <button (click)="spin()">Spin</button>
  `,
})
export class Hero {
  x = signal(0);

  // Vanilla GSAP, scoped to this component. Reading x() makes it
  // reactive. Cleaned up on destroy. Never runs on the server.
  ctx = injectGsap(({ gsap }) => {
    gsap.to('.box', { x: this.x(), duration: 1 });
  });

  spin = this.ctx.contextSafe(() => gsap.to('.box', { rotation: 360 }));
}
```

## Install

```sh
pnpm add @angular-gsap/core gsap
```

## Plugins and global defaults

```ts
import { provideGsap } from '@angular-gsap/core';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

bootstrapApplication(App, {
  providers: [provideGsap({ plugins: [ScrollTrigger] })],
});
```

Every GSAP plugin is free and ships in the `gsap` npm package: ScrollTrigger, SplitText, MorphSVG, and the rest.

## Documentation

Full docs, patterns, and a live example app: [github.com/angular-gsap/angular-gsap](https://github.com/angular-gsap/angular-gsap)

MIT licensed.
