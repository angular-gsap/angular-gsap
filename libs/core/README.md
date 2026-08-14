# @angular-gsap/core

**Write vanilla GSAP inside Angular.** An Angular-managed `gsap.context()` (host-scoped, signal-reactive, SSR-safe, auto-cleaned) without wrapping a single GSAP API. The Angular equivalent of `@gsap/react`'s `useGSAP()`.

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

  // Vanilla GSAP. Reading x() makes it reactive. Cleaned up on
  // destroy. Never runs on the server.
  ctx = injectGsap(({ gsap }) => {
    gsap.to(target(this.box), { x: this.x(), duration: 1 });
  });

  spin = this.ctx.contextSafe(() =>
    gsap.to(target(this.box), { rotation: 360 })
  );
}
```

## Install

```sh
pnpm add @angular-gsap/core gsap
# npm install @angular-gsap/core gsap
# yarn add @angular-gsap/core gsap
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

Live docs and examples: [angular-gsap.netlify.app](https://angular-gsap.netlify.app) · source: [github.com/angular-gsap/core](https://github.com/angular-gsap/core)

MIT licensed.
