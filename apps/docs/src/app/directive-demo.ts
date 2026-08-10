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
              <div class="center">
                <div class="demo-card" reveal="scale-in">reveal</div>
              </div>
            }
            @case ('stagger') {
              <div class="center">
                <div class="row" stagger="0.09" preset="fade-up">
                  <span class="dot c1"></span>
                  <span class="dot c2"></span>
                  <span class="dot c3"></span>
                  <span class="dot c4"></span>
                </div>
              </div>
            }
            @case ('splitReveal') {
              <div class="center">
                <p class="line" splitReveal>words arrive one by one</p>
              </div>
            }
            @case ('scrambleText') {
              <div class="center">
                <p class="line mono" scrambleText [duration]="1.4">
                  DECODED MESSAGE
                </p>
              </div>
            }
            @case ('counter') {
              <div class="center row-gap">
                <span class="big" [counter]="4200"></span>
                <span class="big" [counter]="99.9" [decimals]="1"></span>
              </div>
            }
            @case ('parallax') {
              <div class="center col">
                <span class="pblock" parallax="0.3"></span>
                <span class="pblock two" parallax="-0.2"></span>
                <p class="small-hint">scroll the page ↕</p>
              </div>
            }
            @case ('drawSvg') {
              <div class="center">
                <svg drawSvg [each]="0.3" viewBox="0 0 130 50" class="draw">
                  <path d="M 8 42 L 33 8 L 58 42" />
                  <path class="alt" d="M 72 42 L 97 8 L 122 42" />
                </svg>
              </div>
            }
            @case ('sequence') {
              <div class="center">
                <div class="col" sequence="0.12">
                  <strong class="line" reveal>first the title</strong>
                  <div class="row" stagger preset="scale-in">
                    <span class="dot c1"></span>
                    <span class="dot c2"></span>
                    <span class="dot c3"></span>
                  </div>
                  <p class="line soft" splitReveal [at]="'<0.3'">
                    then the words
                  </p>
                </div>
              </div>
            }
            @case ('drag') {
              <div class="demo-card grab" drag [snap]="60">drag</div>
            }
            @case ('scrollTo') {
              <div class="center col">
                <button type="button" class="jump" scrollTo="#reveal" [offsetY]="84">
                  ↑ reveal
                </button>
                <button type="button" class="jump" scrollTo="#hover" [offsetY]="84">
                  ↓ hover
                </button>
              </div>
            }
            @case ('observe') {
              <div class="center col obs" observe (up)="count.set(count() + 1)" (down)="count.set(count() - 1)">
                <span class="big">{{ count() }}</span>
                <p class="small-hint">wheel · swipe</p>
              </div>
            }
            @case ('hover') {
              <div class="center row-gap">
                <button type="button" class="jump" hover>lift</button>
                <button type="button" class="jump" hover="grow">grow</button>
                <button type="button" class="jump" hover="tilt" [amount]="6">
                  tilt
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

    .dot {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid var(--ink);
    }

    .c1 { background: var(--pulse); }
    .c2 { background: var(--kinetic); }
    .c3 { background: var(--arc); }
    .c4 { background: var(--ember); }

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
  protected readonly count = signal(0);

  protected readonly replayable = computed(() => REPLAYABLE.has(this.id()));

  protected replay(): void {
    this.run.update((n) => n + 1);
  }
}
