import { Component, signal } from '@angular/core';
import { injectGsap } from '@angular-gsap/core';
import { SplitText } from 'gsap/SplitText';

type SplitMode = 'chars' | 'words' | 'lines';

const STAGGER: Record<SplitMode, number> = {
  chars: 0.012,
  words: 0.04,
  lines: 0.14,
};

@Component({
  selector: 'app-text',
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">Example · plugin: SplitText</p>
        <h1>Split, animate, stitch back</h1>
        <p>
          <code>mode()</code> and <code>run()</code> are both read in the
          callback, so switching the split granularity — or hitting replay —
          reverts the previous split and starts over. On destroy the paragraph
          is restored exactly as it was.
        </p>
        <div class="api-chips">
          <span>SplitText</span><span>injectGsap</span><span>signal</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage text-stage">
            <p class="passage">
              Great interfaces move with intent. Split this paragraph into
              characters, words, or lines — then choreograph the pieces with
              the full GSAP toolbox. Leave the page, and every piece is
              stitched back together exactly as it was.
            </p>
          </div>
          <div class="stage-controls">
            @for (m of modes; track m) {
              <button
                class="btn"
                [class.btn--quiet]="mode() !== m"
                (click)="mode.set(m)"
              >
                {{ m }}
              </button>
            }
            <button class="btn" (click)="replay()">Replay</button>
          </div>
        </div>
        <pre class="code"><code>{{ snippet }}</code></pre>
      </div>
    </div>
  `,
  styles: `
    .text-stage {
      display: grid;
      align-content: center;
      padding: 2.5rem;
      min-height: 20rem;
    }

    .passage {
      font-family: var(--font-display);
      font-stretch: 108%;
      font-weight: 600;
      font-size: clamp(1.2rem, 2.4vw, 1.7rem);
      line-height: 1.45;
      margin: 0;
    }
  `,
})
export class Text {
  protected readonly modes: SplitMode[] = ['chars', 'words', 'lines'];
  protected readonly mode = signal<SplitMode>('words');
  protected readonly run = signal(0);

  protected readonly ref = injectGsap(({ gsap }) => {
    this.run(); // tracked: replay() bumps it to re-run the context
    const mode = this.mode();
    const split = SplitText.create('.passage', { type: mode });
    gsap.from(split[mode], {
      y: 26,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: STAGGER[mode],
    });
  });

  protected replay = () => this.run.update((n) => n + 1);

  protected readonly snippet = [
    `export class Text {`,
    `  mode = signal<'chars' | 'words' | 'lines'>('words');`,
    `  run = signal(0);`,
    ``,
    `  ref = injectGsap(({ gsap }) => {`,
    `    this.run(); // replay = just bump a signal`,
    `    const mode = this.mode();`,
    `    const split = SplitText.create('.passage', {`,
    `      type: mode,`,
    `    });`,
    `    gsap.from(split[mode], {`,
    `      y: 26, opacity: 0,`,
    `      stagger: 0.04,`,
    `    });`,
    `  });`,
    ``,
    `  replay = () => this.run.update((n) => n + 1);`,
    `}`,
  ].join('\n');
}
