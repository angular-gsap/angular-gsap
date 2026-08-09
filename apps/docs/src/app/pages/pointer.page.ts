import { Component, ElementRef, viewChild } from '@angular/core';
import { injectGsap, target, type GsapTween } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'quickTo · angular-gsap',
};

@Component({
  selector: 'app-pointer',
  imports: [CodeSnippet],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">Advanced · gsap.quickTo</p>
        <h1>A cursor follower at input rate</h1>
        <p>
          <code>quickTo()</code> builds one reusable tween per property, so a
          pointermove handler can feed it coordinates hundreds of times per
          second without creating garbage. The handler is wrapped in
          <code>contextSafe</code>, and the tween itself runs on GSAP's
          ticker, outside change detection.
        </p>
        <div class="api-chips">
          <span>gsap.quickTo</span><span>viewChild</span
          ><span>contextSafe</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div
            #stage
            class="stage pointer-stage"
            (pointermove)="onMove($event)"
            (pointerleave)="onLeave()"
          >
            <span #chaser class="chaser"></span>
            <p class="hint">move the pointer around this stage</p>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="tplSnippet" lang="html" label="chaser.html" />
          <app-code [code]="snippet" label="chaser.ts" />
        </div>
      </div>

      <section class="explain">
        <h2>What the library is doing here</h2>
        <ul>
          <li>
            <strong>One tween, thousands of updates.</strong> A naive handler
            calls <code>gsap.to()</code> per event and allocates a tween each
            time. <code>quickTo()</code> is built once in the callback and
            reused for every pointer event.
          </li>
          <li>
            <strong><code>viewChild</code> + <code>target()</code>.</strong>
            The chaser element comes from a typed signal query; no selector
            strings involved.
          </li>
          <li>
            <strong>Cleanup still applies.</strong> The quickTo tweens were
            created inside the context, so leaving the page reverts them like
            everything else.
          </li>
        </ul>
      </section>
    </div>
  `,
  styles: `
    .pointer-stage {
      min-height: 24rem;
      cursor: crosshair;
      touch-action: none;
      display: grid;
      place-items: end center;
    }

    .chaser {
      position: absolute;
      top: 0;
      left: 0;
      width: 28px;
      height: 28px;
      margin: -14px 0 0 -14px;
      border-radius: 50%;
      background: var(--kinetic);
      mix-blend-mode: multiply;
      pointer-events: none;
    }

    .hint {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--ink-soft);
      padding-bottom: 1.25rem;
      margin: 0;
    }
  `,
})
export default class PointerPage {
  private readonly stage =
    viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly chaser =
    viewChild.required<ElementRef<HTMLElement>>('chaser');

  private moveX?: (value: number) => GsapTween;
  private moveY?: (value: number) => GsapTween;

  protected readonly ref = injectGsap(({ gsap }) => {
    const el = target(this.chaser);
    this.moveX = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    this.moveY = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
  });

  protected onMove = this.ref.contextSafe((event: PointerEvent) => {
    const rect = this.stage().nativeElement.getBoundingClientRect();
    this.moveX?.(event.clientX - rect.left);
    this.moveY?.(event.clientY - rect.top);
  });

  protected onLeave = this.ref.contextSafe(() => {
    this.moveX?.(0);
    this.moveY?.(0);
  });

  protected readonly tplSnippet = [
    `<div`,
    `  #stage`,
    `  class="stage"`,
    `  (pointermove)="onMove($event)"`,
    `>`,
    `  <span #chaser class="chaser"></span>`,
    `</div>`,
  ].join('\n');

  protected readonly snippet = [
    `export class Chaser {`,
    `  stage = viewChild.required<ElementRef>('stage');`,
    `  chaser = viewChild.required<ElementRef>('chaser');`,
    `  private moveX?: (v: number) => GsapTween;`,
    `  private moveY?: (v: number) => GsapTween;`,
    ``,
    `  ref = injectGsap(({ gsap }) => {`,
    `    const el = target(this.chaser);`,
    `    this.moveX = gsap.quickTo(el, 'x',`,
    `      { duration: 0.35, ease: 'power3' });`,
    `    this.moveY = gsap.quickTo(el, 'y',`,
    `      { duration: 0.35, ease: 'power3' });`,
    `  });`,
    ``,
    `  onMove = this.ref.contextSafe((e: PointerEvent) => {`,
    `    const r = target(this.stage)!.getBoundingClientRect();`,
    `    this.moveX?.(e.clientX - r.left);`,
    `    this.moveY?.(e.clientY - r.top);`,
    `  });`,
    `}`,
  ].join('\n');
}
