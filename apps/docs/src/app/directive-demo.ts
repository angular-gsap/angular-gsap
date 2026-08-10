import { Component, computed, input, signal } from '@angular/core';
import { GSAP_DIRECTIVES } from '@angular-gsap/core';

const REPLAYABLE = new Set([
  'reveal',
  'stagger',
  'splitReveal',
  'scrambleText',
  'counter',
  'drawSvg',
  'sequence',
]);

/** The live half of each complete example: the directive, actually running. */
@Component({
  selector: 'app-directive-demo',
  imports: [GSAP_DIRECTIVES],
  template: `
    <div class="demo">
      <div class="ds">
        @for (r of [run()]; track r) {
          @switch (id()) {
            @case ('reveal') {
              <div class="mini-frame" #revealFrame>
                <div class="mini-inner">
                  <strong class="line" reveal>Fades up when the page renders</strong>
                  <div class="demo-card" reveal="fade-right" [delay]="0.2" [distance]="40">
                    from the left
                  </div>
                  <p class="small-hint">scroll inside ↓</p>
                  <p class="line soft far" reveal="fade-up" on="scroll" [scroller]="revealFrame" [start]="'top 90%'">
                    and this one waits for the frame scroll
                  </p>
                </div>
              </div>
            }
            @case ('stagger') {
              <div class="center">
                <ul class="tags" stagger="0.08" preset="scale-in">
                  <li>Fast</li>
                  <li>Small</li>
                  <li>Typed</li>
                </ul>
              </div>
            }
            @case ('splitReveal') {
              <div class="center col">
                <blockquote class="quote" splitReveal="lines" [distance]="30">
                  Great interfaces move with intent, and text is no exception.
                </blockquote>
                <strong class="line" splitReveal="chars" on="scroll" [each]="0.02">
                  Character by character
                </strong>
              </div>
            }
            @case ('scrambleText') {
              <div class="center col">
                <p class="line mono" scrambleText>decodes into this sentence</p>
                <strong class="line mono" scrambleText="ONLINE" chars="01" on="scroll">
                  offline
                </strong>
              </div>
            }
            @case ('counter') {
              <div class="center row-gap">
                <span class="big" [counter]="12500"></span>
                <span class="big" [counter]="98.6" [decimals]="1"></span>
                <span class="big" [counter]="404" on="scroll" [duration]="2"></span>
              </div>
            }
            @case ('parallax') {
              <div class="mini-frame" #pFrame>
                <div class="mini-inner runway">
                  <p class="small-hint">scroll inside ↕ · the second moves against it</p>
                  <div class="row">
                    <span class="pblock" parallax="0.25" [scroller]="pFrame"></span>
                    <span class="pblock two" parallax="-0.15" [scroller]="pFrame"></span>
                    <span class="pblock three" parallax="0.15" [scroller]="pFrame"></span>
                  </div>
                </div>
              </div>
            }
            @case ('drawSvg') {
              <div class="center">
                <svg drawSvg on="scroll" [each]="0.2" viewBox="0 0 100 40" class="draw">
                  <path d="M 5 35 L 25 5 L 45 35" />
                  <path class="alt" d="M 55 35 L 75 5 L 95 35" />
                </svg>
              </div>
            }
            @case ('sequence') {
              <div class="center">
                <div class="col" sequence="0.1">
                  <strong class="line" reveal>First the title</strong>
                  <ul class="tags" stagger preset="scale-in">
                    <li>signals</li>
                    <li>zoneless</li>
                    <li>ssr</li>
                  </ul>
                  <p class="line soft" splitReveal [at]="'<0.3'">
                    Then this, overlapping the list.
                  </p>
                </div>
              </div>
            }
            @case ('drag') {
              <div class="demo-card grab" drag [snap]="80">Throw me</div>
              <div class="demo-card grab lower" drag="x" [inertia]="false">
                Horizontal only
              </div>
            }
            @case ('scrollTo') {
              <div class="center col">
                <button type="button" class="jump" scrollTo="#main" [offsetY]="84">
                  ↑ top
                </button>
                <button type="button" class="jump" scrollTo="#how" [duration]="1.2" [offsetY]="84">
                  ↓ how it works
                </button>
              </div>
            }
            @case ('observe') {
              <div
                class="center col obs"
                observe
                [preventDefault]="true"
                (up)="next()"
                (down)="previous()"
              >
                <span class="big">Slide {{ slide() + 1 }} of 5</span>
                <p class="small-hint">wheel · swipe</p>
              </div>
            }
            @case ('hover') {
              <div class="center row-gap">
                <button type="button" class="jump" hover>Docs</button>
                <button type="button" class="jump" hover="grow">Examples</button>
                <button type="button" class="jump" hover="tilt" [amount]="6">
                  Wiggle
                </button>
              </div>
            }
          }
        }
      </div>
      @if (replayable()) {
        <button type="button" class="jump replay" (click)="replay()">
          ↻ {{ label() }}
        </button>
      }
    </div>
  `,
  styles: `
    .demo {
      display: grid;
      gap: 0.8rem;
      align-content: start;
    }

    .ds {
      position: relative;
      min-height: 15rem;
      border: 2px solid var(--ink);
      border-radius: 12px;
      background: var(--paper);
      background-image: radial-gradient(var(--hairline) 1.5px, transparent 1.5px);
      background-size: 20px 20px;
      overflow: hidden;
      display: grid;
    }

    .center {
      display: grid;
      place-items: center;
      align-content: center;
      gap: 1rem;
      padding: 1rem;
    }

    .col {
      display: grid;
      justify-items: center;
      gap: 0.9rem;
    }

    .row {
      display: flex;
      gap: 0.7rem;
    }

    .row-gap {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .demo-card {
      font-family: var(--font-display);
      font-stretch: 112%;
      font-weight: 800;
      color: var(--code-bg);
      background: var(--kinetic);
      border: var(--bw) solid var(--ink);
      border-radius: 10px;
      box-shadow: 3px 3px 0 var(--ink);
      padding: 0.6rem 1.2rem;
    }

    .grab {
      position: absolute;
      top: 20px;
      left: 20px;
      cursor: grab;
      user-select: none;
      touch-action: none;

      &:active {
        cursor: grabbing;
      }
    }

    .lower {
      top: auto;
      bottom: 20px;
      background: var(--pulse);
      touch-action: pan-y;
    }

    .tags {
      list-style: none;
      display: flex;
      gap: 0.6rem;
      margin: 0;
      padding: 0;

      li {
        font-family: var(--font-mono);
        font-size: 0.8rem;
        color: var(--ink);
        background: var(--card);
        border: 2px solid var(--ink);
        border-radius: 999px;
        box-shadow: 2px 2px 0 var(--ink);
        padding: 0.25rem 0.75rem;

        &:nth-child(1) { background: var(--pulse); color: var(--code-bg); }
        &:nth-child(2) { background: var(--kinetic); color: var(--code-bg); }
        &:nth-child(3) { background: var(--ember); color: var(--code-bg); }
      }
    }

    .quote {
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 1.05rem;
      color: var(--ink);
      max-width: 15rem;
      margin: 0;
      text-align: center;
      border-left: 4px solid var(--kinetic);
      padding-left: 0.8rem;
    }

    .line {
      font-family: var(--font-body);
      font-weight: 600;
      font-size: 1.05rem;
      color: var(--ink);
      margin: 0;
      text-align: center;
    }

    .soft {
      color: var(--ink-soft);
      font-weight: 500;
    }

    .mono {
      font-family: var(--font-mono);
      letter-spacing: 0.05em;
    }

    .big {
      font-family: var(--font-mono);
      font-size: 1.7rem;
      font-weight: 500;
      color: var(--ink);
    }

    .pblock {
      width: 52px;
      height: 40px;
      border-radius: 8px;
      border: 2px solid var(--ink);
      background: var(--pulse);
    }

    .two {
      background: var(--kinetic);
    }

    .three {
      background: var(--arc);
    }

    /* a demo that scrolls inside its own frame, not the page */
    .mini-frame {
      height: 15rem;
      overflow-y: auto;
      overscroll-behavior: contain;
    }

    .mini-inner {
      display: grid;
      justify-items: center;
      align-content: start;
      gap: 1.1rem;
      padding: 1.5rem 1rem;
    }

    .far {
      margin-top: 15rem;
      padding-bottom: 2rem;
    }

    .runway {
      padding-top: 6rem;
      padding-bottom: 22rem;
    }

    .draw {
      width: min(200px, 70%);

      path {
        fill: none;
        stroke: var(--ink);
        stroke-width: 6;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .alt {
        stroke: var(--kinetic);
      }
    }

    .small-hint {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--ink-soft);
      margin: 0;
    }

    .obs {
      cursor: ns-resize;
      touch-action: none;
      width: 100%;
      height: 100%;
    }

    .jump {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--ink);
      background: var(--card);
      border: 2px solid var(--ink);
      border-radius: 10px;
      box-shadow: 2px 2px 0 var(--ink);
      padding: 0.35rem 0.9rem;
      cursor: pointer;
    }

    .replay {
      justify-self: start;
    }
  `,
})
export class DirectiveDemo {
  readonly id = input.required<string>();
  readonly label = input('Replay');

  protected readonly run = signal(0);
  protected readonly slide = signal(0);

  protected readonly replayable = computed(() => REPLAYABLE.has(this.id()));

  protected replay(): void {
    this.run.update((n) => n + 1);
  }

  protected next(): void {
    this.slide.update((s) => Math.min(s + 1, 4));
  }

  protected previous(): void {
    this.slide.update((s) => Math.max(s - 1, 0));
  }
}
