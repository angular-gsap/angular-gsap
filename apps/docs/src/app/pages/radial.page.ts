import {
  Component,
  ElementRef,
  computed,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { injectGsap, targets, target, type GsapTimeline } from '@angular-gsap/core';
import { CodeSnippet } from '../code-snippet';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Radial menu · angular-gsap',
};

const COPY = {
  en: {
    eyebrow: 'Advanced · easeReverse',
    title: 'Radial menu',
    intro:
      'A floating action button whose items spring out along an arc with <code>elastic.out(1, 0.5)</code>. Closing uses <code>easeReverse</code>, added in GSAP 3.15, so the reverse animation can have its own ease instead of playing the elastic wobble backwards. The controls are signals, and the timeline rebuilds itself when they change.',
    toggle: 'easeReverse',
    easeLabel: 'Reverse ease',
    speed: 'speed',
    menuLabel: 'Toggle actions menu',
    actions: ['Search', 'Edit', 'Upload', 'Share'],
    easeOptions: [
      { value: 'true', label: 'true (mirror entrance)' },
      { value: 'power3.out', label: 'power3.out' },
      { value: 'power3.in', label: 'power3.in' },
      { value: 'expo.in', label: 'expo.in' },
      { value: 'expo.out', label: 'expo.out' },
      { value: 'back.in(1.7)', label: 'back.in' },
      { value: 'back.out(1.7)', label: 'back.out' },
      { value: 'none', label: 'none (linear)' },
    ],
    how: 'How this works',
    explain: [
      'Each item tweens to a point on an arc: cosine and sine of its angle times the radius, staggered 0.05s apart. The plus icon rotates 135 degrees into a close icon on the same timeline, so open and close always stay in sync.',
      '<code>easeReverse: true</code> mirrors the entrance ease when the timeline reverses; a string like <code>power3.in</code> gives the close its own ease. Without it, reversing an elastic entrance replays the wobble backwards, which reads as broken.',
      'The toggle and the dropdown are signals read inside the <code>injectGsap</code> callback. Change one and the callback runs again: the context reverts, the old timeline dies, and a new one is built with the new value. That is the whole rebuild logic.',
      'Speed is a signal too, but it is only read inside the click handler, never in the callback. Dragging the slider rebuilds nothing; it just sets <code>timeScale</code> on the next close.',
    ],
  },
  es: {
    eyebrow: 'Avanzado · easeReverse',
    title: 'Menú radial',
    intro:
      'Un botón de acción flotante cuyos elementos saltan a lo largo de un arco con <code>elastic.out(1, 0.5)</code>. El cierre usa <code>easeReverse</code>, añadido en GSAP 3.15, para que la animación inversa tenga su propio ease en lugar de reproducir el rebote elástico al revés. Los controles son signals, y el timeline se reconstruye solo cuando cambian.',
    toggle: 'easeReverse',
    easeLabel: 'Ease de reversa',
    speed: 'velocidad',
    menuLabel: 'Abrir o cerrar el menú de acciones',
    actions: ['Buscar', 'Editar', 'Subir', 'Compartir'],
    easeOptions: [
      { value: 'true', label: 'true (refleja la entrada)' },
      { value: 'power3.out', label: 'power3.out' },
      { value: 'power3.in', label: 'power3.in' },
      { value: 'expo.in', label: 'expo.in' },
      { value: 'expo.out', label: 'expo.out' },
      { value: 'back.in(1.7)', label: 'back.in' },
      { value: 'back.out(1.7)', label: 'back.out' },
      { value: 'none', label: 'none (lineal)' },
    ],
    how: 'Cómo funciona',
    explain: [
      'Cada elemento se anima hacia un punto del arco: coseno y seno de su ángulo por el radio, escalonados 0.05s. El icono de más rota 135 grados hasta convertirse en un icono de cerrar en el mismo timeline, así que abrir y cerrar siempre van sincronizados.',
      '<code>easeReverse: true</code> refleja el ease de entrada cuando el timeline se invierte; un string como <code>power3.in</code> le da al cierre su propio ease. Sin él, invertir una entrada elástica reproduce el rebote al revés, y se ve roto.',
      'El interruptor y el desplegable son signals leídos dentro del callback de <code>injectGsap</code>. Cambia uno y el callback vuelve a ejecutarse: el contexto se revierte, el timeline viejo muere y se construye uno nuevo con el valor nuevo. Esa es toda la lógica de reconstrucción.',
      'La velocidad también es un signal, pero solo se lee dentro del handler de click, nunca en el callback. Mover el slider no reconstruye nada; solo fija el <code>timeScale</code> del próximo cierre.',
    ],
  },
} as const;

const RADIUS = 110;
const START_ANGLE = 180;
const END_ANGLE = 270;

@Component({
  selector: 'app-radial',
  imports: [CodeSnippet],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>injectGsap</span><span>easeReverse</span><span>contextSafe</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div class="stage radial-stage">
            <div class="fab-wrap" (keydown.escape)="close()" role="group" tabindex="-1">
              <button type="button" class="fab-item" #itemEl [attr.aria-label]="c.actions[0]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
              <button type="button" class="fab-item" #itemEl [attr.aria-label]="c.actions[1]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </button>
              <button type="button" class="fab-item" #itemEl [attr.aria-label]="c.actions[2]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </button>
              <button type="button" class="fab-item" #itemEl [attr.aria-label]="c.actions[3]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
              <button
                type="button"
                class="fab"
                (click)="toggle()"
                [attr.aria-expanded]="open()"
                [attr.aria-label]="c.menuLabel"
              >
                <svg #plusIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
            <p class="status" #statusEl aria-hidden="true">{{ status() }}</p>
          </div>
          <div class="stage-controls">
            <label class="check">
              <input
                type="checkbox"
                role="switch"
                [checked]="easeOn()"
                (change)="easeOn.set($any($event.target).checked)"
              />
              {{ c.toggle }}
            </label>
            <select
              [attr.aria-label]="c.easeLabel"
              [disabled]="!easeOn()"
              (change)="easeSel.set($any($event.target).value)"
            >
              @for (o of c.easeOptions; track o.value) {
                <option [value]="o.value" [selected]="o.value === easeSel()">
                  {{ o.label }}
                </option>
              }
            </select>
            <label class="range">
              {{ c.speed }}
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value="1"
                (input)="speed.set(+$any($event.target).value)"
              />
              <span class="speed-val">{{ speed().toFixed(1) }}x</span>
            </label>
          </div>
        </div>
        <div class="panels">
          <app-code [code]="tplSnippet" lang="html" label="radial.html" />
          <app-code [code]="snippet" label="radial.ts" />
        </div>
      </div>

      <section class="explain">
        <h2>{{ c.how }}</h2>
        <ul>
          @for (item of c.explain; track $index) {
            <li [innerHTML]="item"></li>
          }
        </ul>
      </section>
    </div>
  `,
  styles: `
    .radial-stage {
      position: relative;
      min-height: 22rem;
    }

    .fab-wrap {
      position: absolute;
      bottom: 2.2rem;
      right: 2.2rem;
    }

    .fab {
      position: relative;
      z-index: 2;
      width: 72px;
      height: 72px;
      border-radius: 999px;
      border: var(--bw) solid var(--ink);
      background: var(--kinetic);
      color: var(--code-bg);
      box-shadow: 4px 4px 0 var(--ink);
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;

      svg {
        width: 26px;
        height: 26px;
      }
    }

    .fab:focus-visible,
    .fab-item:focus-visible {
      outline: var(--bw) solid var(--arc);
      outline-offset: 3px;
    }

    .fab-item {
      position: absolute;
      bottom: 13px;
      right: 13px;
      z-index: 1;
      width: 46px;
      height: 46px;
      border-radius: 999px;
      border: 2px solid var(--ink);
      background: var(--card);
      color: var(--ink);
      box-shadow: 3px 3px 0 var(--ink);
      display: grid;
      place-items: center;
      cursor: pointer;
      padding: 0;
      opacity: 0;
      transform: scale(0);

      svg {
        width: 18px;
        height: 18px;
        pointer-events: none;
      }
    }

    .status {
      position: absolute;
      bottom: 0.9rem;
      left: 1.2rem;
      margin: 0;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--ink-soft);
      opacity: 0;
      pointer-events: none;
    }

    .check {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--ink);
      cursor: pointer;

      input {
        accent-color: var(--kinetic);
        width: 1.05rem;
        height: 1.05rem;
        cursor: pointer;
      }
    }

    select {
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--ink);
      background: var(--card);
      border: 2px solid var(--ink);
      border-radius: 8px;
      padding: 0.3rem 0.5rem;
      cursor: pointer;

      &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
    }

    .speed-val {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      min-width: 2.6em;
    }
  `,
})
export default class RadialPage {
  protected readonly c = COPY[injectLocale()];

  private readonly itemEls = viewChildren<ElementRef<HTMLElement>>('itemEl');
  private readonly plusIcon = viewChild.required<ElementRef<SVGElement>>('plusIcon');
  private readonly statusEl = viewChild.required<ElementRef<HTMLElement>>('statusEl');

  protected readonly easeOn = signal(false);
  protected readonly easeSel = signal<string>('true');
  protected readonly speed = signal(1);
  protected readonly open = signal(false);

  private readonly easeReverse = computed<boolean | string>(() => {
    if (!this.easeOn()) {
      return false;
    }
    return this.easeSel() === 'true' ? true : this.easeSel();
  });

  protected readonly status = computed(
    () => `easeReverse: ${this.easeOn() ? this.easeSel() : 'false'}`
  );

  private tl?: GsapTimeline;

  protected readonly ref = injectGsap(({ gsap }) => {
    const items = targets(this.itemEls);
    const plus = target(this.plusIcon);
    const status = target(this.statusEl);
    if (items.length === 0 || !plus) {
      return;
    }

    // tracked: flipping the toggle or picking an ease re-runs this callback,
    // the context reverts, and the timeline is rebuilt with the new value
    const easeReverse = this.easeReverse();
    this.open.set(false);

    const step = (END_ANGLE - START_ANGLE) / (items.length - 1);
    gsap.set(items, { x: 0, y: 0, scale: 0, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    items.forEach((item, i) => {
      const angle = ((START_ANGLE + step * i) * Math.PI) / 180;
      tl.to(
        item,
        {
          x: Math.cos(angle) * RADIUS,
          y: Math.sin(angle) * RADIUS,
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
          easeReverse,
        },
        i * 0.05
      );
    });
    tl.to(
      plus,
      { rotation: 135, duration: 0.35, ease: 'back.out(1.7)', easeReverse },
      0
    );
    if (status) {
      tl.to(status, { opacity: 1, duration: 0.2 }, 0);
    }
    this.tl = tl;
  });

  protected toggle = this.ref.contextSafe(() => {
    const tl = this.tl;
    if (!tl) {
      return;
    }
    if (this.open()) {
      tl.timeScale(this.speed()).reverse();
      this.open.set(false);
    } else {
      tl.timeScale(1).play();
      this.open.set(true);
    }
  });

  protected close(): void {
    if (this.open()) {
      this.toggle();
    }
  }

  protected readonly tplSnippet = [
    `<button #itemEl class="fab-item" aria-label="Search">…</button>`,
    `<!-- three more items -->`,
    `<button class="fab" (click)="toggle()"`,
    `  [attr.aria-expanded]="open()">`,
    `  <svg #plusIcon viewBox="0 0 24 24">…</svg>`,
    `</button>`,
    ``,
    `<input type="checkbox" role="switch"`,
    `  (change)="easeOn.set($event.target.checked)" />`,
    `<select (change)="easeSel.set($event.target.value)">…</select>`,
    `<input type="range" min="1" max="3" step="0.1"`,
    `  (input)="speed.set(+$event.target.value)" />`,
  ].join('\n');

  protected readonly snippet = [
    `items = viewChildren<ElementRef>('itemEl');`,
    `easeOn = signal(false);`,
    `easeSel = signal('true');`,
    `speed = signal(1);`,
    `open = signal(false);`,
    ``,
    `easeReverse = computed(() => {`,
    `  if (!this.easeOn()) return false;`,
    `  return this.easeSel() === 'true' ? true : this.easeSel();`,
    `});`,
    ``,
    `ref = injectGsap(({ gsap }) => {`,
    `  // tracked: changing the signals rebuilds the timeline`,
    `  const easeReverse = this.easeReverse();`,
    `  this.open.set(false);`,
    ``,
    `  const tl = gsap.timeline({ paused: true });`,
    `  targets(this.items).forEach((item, i) => {`,
    `    const angle = ((180 + step * i) * Math.PI) / 180;`,
    `    tl.to(item, {`,
    `      x: Math.cos(angle) * radius,`,
    `      y: Math.sin(angle) * radius,`,
    `      scale: 1, opacity: 1, duration: 0.6,`,
    `      ease: 'elastic.out(1, 0.5)',`,
    `      easeReverse,`,
    `    }, i * 0.05);`,
    `  });`,
    `  this.tl = tl;`,
    `});`,
    ``,
    `toggle = this.ref.contextSafe(() => {`,
    `  if (this.open()) {`,
    `    this.tl?.timeScale(this.speed()).reverse();`,
    `    this.open.set(false);`,
    `  } else {`,
    `    this.tl?.timeScale(1).play();`,
    `    this.open.set(true);`,
    `  }`,
    `});`,
  ].join('\n');
}
