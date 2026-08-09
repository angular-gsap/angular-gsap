import { Component } from '@angular/core';
import { CodeSnippet } from '../code-snippet';
import { injectGsap, type GsapTimeline } from '@angular-gsap/core';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Timeline · angular-gsap',
};

@Component({
  imports: [CodeSnippet],
  selector: 'app-timeline',
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">Example · core</p>
        <h1>Timelines stay in your hands</h1>
        <p>
          Build the timeline in the callback, keep the reference on the
          component, and drive it from event handlers wrapped with
          <code>contextSafe</code>. When you navigate away, the context reverts
          the whole thing.
        </p>
        <div class="api-chips">
          <span>injectGsap</span><span>gsap.timeline</span
          ><span>contextSafe</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage bars-stage">
            <div class="bars">
              @for (bar of bars; track bar.i) {
                <span class="bar" [style.background]="bar.color"></span>
              }
            </div>
          </div>
          <div class="stage-controls">
            <button class="btn" (click)="play()">Play</button>
            <button class="btn btn--quiet" (click)="pause()">Pause</button>
            <button class="btn btn--quiet" (click)="reverse()">Reverse</button>
            <button class="btn btn--quiet" (click)="restart()">Restart</button>
            <label class="range">
              speed
              <input
                type="range"
                min="0.25"
                max="2.5"
                step="0.25"
                value="1"
                (input)="speed(+$any($event.target).value)"
              />
            </label>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="tplSnippet" lang="html" label="equalizer.html" />
          <app-code [code]="snippet" label="equalizer.ts" />
        </div>
      </div>

      <section class="explain">
        <h2>How this works</h2>
        <ul>
          <li>
            The timeline is straight from the GSAP docs: position parameters,
            staggers, <code>repeat: -1</code>. Nothing here is wrapped.
          </li>
          <li>
            Play, pause, and the speed slider go through
            <code>contextSafe</code>, so driving a 60fps loop never touches
            change detection.
          </li>
          <li>
            Navigate away and the context reverts the loop. No timeline keeps
            ticking against a DOM node that no longer exists.
          </li>
        </ul>
      </section>
    </div>
  `,
  styles: `
    .bars-stage {
      display: grid;
      place-items: center;
    }

    .bars {
      display: flex;
      align-items: flex-end;
      gap: 14px;
      height: 12rem;
    }

    .bar {
      width: 26px;
      height: 34px;
      border-radius: 6px;
      transform-origin: bottom;
    }
  `,
})
export default class TimelinePage {
  protected readonly bars = [
    '#e23b80',
    '#5b4be8',
    '#ffb627',
    '#0ae448',
    '#e23b80',
  ].map((color, i) => ({ i, color }));

  private tl?: GsapTimeline;

  protected readonly ref = injectGsap(({ gsap }) => {
    this.tl = gsap
      .timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } })
      .to('.bar', {
        scaleY: 4.4,
        duration: 0.45,
        stagger: { each: 0.12, yoyo: true, repeat: 1 },
      })
      .to('.bar', { rotation: 8, duration: 0.3, stagger: 0.06 }, '<0.2')
      .to('.bar', { rotation: 0, duration: 0.3 });
  });

  protected play = this.ref.contextSafe(() => this.tl?.play());
  protected pause = this.ref.contextSafe(() => this.tl?.pause());
  protected reverse = this.ref.contextSafe(() => this.tl?.reverse());
  protected restart = this.ref.contextSafe(() => this.tl?.restart());
  protected speed = this.ref.contextSafe((v: number) => this.tl?.timeScale(v));

  protected readonly tplSnippet = [
    `@for (bar of bars; track bar.i) {`,
    `  <span class="bar"></span>`,
    `}`,
    ``,
    `<button (click)="play()">Play</button>`,
    `<button (click)="pause()">Pause</button>`,
    `<button (click)="restart()">Restart</button>`,
    `<input type="range" min="0.25" max="2.5"`,
    `  (input)="speed(+$event.target.value)" />`,
  ].join('\n');

  protected readonly snippet = [
    `export default class TimelinePage {`,
    `  private tl?: GsapTimeline;`,
    ``,
    `  ref = injectGsap(({ gsap }) => {`,
    `    this.tl = gsap`,
    `      .timeline({ repeat: -1 })`,
    `      .to('.bar', {`,
    `        scaleY: 4.4,`,
    `        stagger: { each: 0.12, yoyo: true, repeat: 1 },`,
    `      });`,
    `  });`,
    ``,
    `  play = this.ref.contextSafe(() => this.tl?.play());`,
    `  pause = this.ref.contextSafe(() => this.tl?.pause());`,
    `  speed = this.ref.contextSafe((v: number) =>`,
    `    this.tl?.timeScale(v)`,
    `  );`,
    `}`,
  ].join('\n');
}
