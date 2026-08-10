import { Component, ElementRef, viewChild, viewChildren } from '@angular/core';
import { injectGsap, prefersReducedMotion, target, targets } from '@angular-gsap/core';
import { Observer } from 'gsap/Observer';
import { SplitText } from 'gsap/SplitText';
import { CodeTabs, type CodeFile } from '../code-tabs';
import { injectLocale } from '../i18n';
import { RouteMeta } from '@analogjs/router';

export const routeMeta: RouteMeta = {
  title: 'Sections · angular-gsap',
};

const COPY = {
  en: {
    eyebrow: 'Advanced · ported from the GSAP demo',
    title: 'Continuous sections',
    intro:
      'A port of GreenSock’s <a href="https://codepen.io/GreenSock/pen/XWzRraJ" target="_blank" rel="noreferrer">Animated Continuous Sections</a> demo: every wheel tick, swipe, or drag moves one full section, with layered wrappers sliding against each other, a parallax background, and headings that scatter in character by character. The original is vanilla GSAP; this version is signal view queries and <code>injectGsap</code>, nothing else changed.',
    hint: 'wheel or swipe inside the frame',
    how: 'How this works',
    slides: ['Scoped', 'Reactive', 'Cleaned up', 'Yours'],
    explain: [
      'The layered slide is two nested wrappers tweened in opposite directions (<code>yPercent</code> 100 and −100 meeting at 0), while the background moves 15% against travel. Direction decides the sign, so up and down both feel right.',
      "One Observer turns wheel, touch, and pointer into 'next' and 'previous'. An <code>animating</code> flag ignores input mid-transition; <code>gsap.utils.wrap</code> makes the ends loop.",
      'Headings are split once with SplitText and each transition staggers the characters from a random order. All of it, the splits, the Observer, the tweens, dies with the component.',
    ],
  },
  es: {
    eyebrow: 'Avanzado · portado del demo de GSAP',
    title: 'Secciones continuas',
    intro:
      'Un port del demo <a href="https://codepen.io/GreenSock/pen/XWzRraJ" target="_blank" rel="noreferrer">Animated Continuous Sections</a> de GreenSock: cada tick de rueda, deslizamiento o arrastre mueve una sección completa, con envoltorios en capas que se deslizan en direcciones opuestas, un fondo con parallax y títulos que entran carácter por carácter. El original es GSAP puro; esta versión usa queries de signal e <code>injectGsap</code>, sin cambiar nada más.',
    hint: 'rueda o desliza dentro del marco',
    how: 'Cómo funciona',
    slides: ['Con scope', 'Reactivo', 'Limpio', 'Tuyo'],
    explain: [
      'La capa deslizante son dos envoltorios anidados animados en direcciones opuestas (<code>yPercent</code> 100 y −100 encontrándose en 0), mientras el fondo se mueve 15% en contra. La dirección decide el signo, así que subir y bajar se sienten igual de bien.',
      "Un Observer convierte rueda, touch y puntero en 'siguiente' y 'anterior'. Una bandera <code>animating</code> ignora la entrada a mitad de transición; <code>gsap.utils.wrap</code> hace que los extremos den la vuelta.",
      'Los títulos se dividen una vez con SplitText y cada transición escalona los caracteres en orden aleatorio. Todo, las divisiones, el Observer y los tweens, muere con el componente.',
    ],
  },
} as const;

const BGS = [
  'linear-gradient(135deg, var(--pulse), var(--arc))',
  'linear-gradient(135deg, var(--kinetic), var(--ember))',
  'linear-gradient(135deg, var(--arc), var(--kinetic))',
  'linear-gradient(135deg, var(--ember), var(--pulse))',
];

@Component({
  selector: 'app-sections',
  imports: [CodeTabs],
  template: `
    <div class="page">
      <header class="page-head">
        <p class="eyebrow">{{ c.eyebrow }}</p>
        <h1>{{ c.title }}</h1>
        <p [innerHTML]="c.intro"></p>
        <div class="api-chips">
          <span>Observer</span><span>SplitText</span
          ><span>gsap.utils.wrap</span>
        </div>
      </header>

      <div class="example">
        <div>
          <div #stage class="stage frame">
            @for (slide of c.slides; track $index) {
              <section class="slide" #slideEl>
                <div class="outer" #outerEl>
                  <div class="inner" #innerEl>
                    <div class="bg" #bgEl [style.background]="bgs[$index]">
                      <h2 class="slide-title" #titleEl>{{ slide }}</h2>
                    </div>
                  </div>
                </div>
              </section>
            }
            <p class="hint">{{ c.hint }}</p>
          </div>
        </div>
        <div class="panels">
          <app-code-tabs [files]="files" />
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
    .frame {
      position: relative;
      height: min(68vh, 34rem);
      min-height: 0;
      background-image: none;
      cursor: ns-resize;
      touch-action: none;
    }

    .slide {
      position: absolute;
      inset: 0;
      visibility: hidden;
    }

    .outer,
    .inner {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .bg {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
    }

    .slide-title {
      font-size: clamp(1.6rem, 4.2vw, 3.6rem);
      white-space: nowrap;
      font-weight: 900;
      font-stretch: 120%;
      text-transform: uppercase;
      color: var(--card);
      text-shadow: 3px 3px 0 var(--code-bg);
      overflow: hidden;
    }

    .hint {
      position: absolute;
      bottom: 0.9rem;
      left: 0;
      right: 0;
      z-index: 5;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--card);
      text-shadow: 1px 1px 0 var(--code-bg);
      pointer-events: none;
      margin: 0;
    }
  `,
})
export default class SectionsPage {
  protected readonly c = COPY[injectLocale()];
  protected readonly bgs = BGS;

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly slideEls = viewChildren<ElementRef<HTMLElement>>('slideEl');
  private readonly outerEls = viewChildren<ElementRef<HTMLElement>>('outerEl');
  private readonly innerEls = viewChildren<ElementRef<HTMLElement>>('innerEl');
  private readonly bgEls = viewChildren<ElementRef<HTMLElement>>('bgEl');
  private readonly titleEls = viewChildren<ElementRef<HTMLElement>>('titleEl');

  protected readonly ref = injectGsap(({ gsap }) => {
    const stage = target(this.stage);
    const slides = targets(this.slideEls);
    const outers = targets(this.outerEls);
    const inners = targets(this.innerEls);
    const bgs = targets(this.bgEls);
    const titles = targets(this.titleEls);
    if (!stage || slides.length === 0) {
      return;
    }

    const splits = titles.map(
      (title) => new SplitText(title, { type: 'chars' })
    );
    const wrap = gsap.utils.wrap(0, slides.length);
    let current = -1;
    let animating = false;

    gsap.set(outers, { yPercent: 100 });
    gsap.set(inners, { yPercent: -100 });

    const gotoSection = (index: number, direction: 1 | -1) => {
      index = wrap(index);
      animating = true;
      const dFactor = direction === -1 ? -1 : 1;
      const tl = gsap.timeline({
        defaults: { duration: 1.1, ease: 'power1.inOut' },
        onComplete: () => (animating = false),
      });
      if (current >= 0) {
        gsap.set(slides[current], { zIndex: 0 });
        tl.to(bgs[current], { yPercent: -15 * dFactor }).set(slides[current], {
          autoAlpha: 0,
        });
      }
      gsap.set(slides[index], { autoAlpha: 1, zIndex: 1 });
      tl.fromTo(
        [outers[index], inners[index]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0
      )
        .fromTo(bgs[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .fromTo(
          splits[index].chars,
          { autoAlpha: 0, yPercent: 150 * dFactor },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.9,
            ease: 'power2',
            stagger: { each: 0.02, from: 'random' },
          },
          0.2
        );
      current = index;
    };

    gotoSection(0, 1);

    if (prefersReducedMotion()) {
      return;
    }

    const observer = Observer.create({
      target: stage,
      type: 'wheel,touch,pointer',
      wheelSpeed: -1,
      tolerance: 10,
      preventDefault: true,
      onDown: () => !animating && gotoSection(current - 1, -1),
      onUp: () => !animating && gotoSection(current + 1, 1),
    });
    return () => observer.kill();
  });

  protected readonly tplSnippet = [
    `<div #stage class="stage">`,
    `  @for (slide of slides; track $index) {`,
    `    <section class="slide" #slideEl>`,
    `      <div class="outer" #outerEl>`,
    `        <div class="inner" #innerEl>`,
    `          <div class="bg" #bgEl>`,
    `            <h2 #titleEl>{{ slide }}</h2>`,
    `          </div>`,
    `        </div>`,
    `      </div>`,
    `    </section>`,
    `  }`,
    `</div>`,
  ].join('\n');

  protected readonly snippet = [
    `slides = viewChildren<ElementRef>('slideEl');`,
    `outers = viewChildren<ElementRef>('outerEl');`,
    `inners = viewChildren<ElementRef>('innerEl');`,
    ``,
    `ref = injectGsap(({ gsap }) => {`,
    `  const wrap = gsap.utils.wrap(0, n);`,
    `  let current = -1;`,
    `  let animating = false;`,
    ``,
    `  const gotoSection = (index, direction) => {`,
    `    index = wrap(index);`,
    `    animating = true;`,
    `    const d = direction;`,
    `    const tl = gsap.timeline({`,
    `      onComplete: () => (animating = false),`,
    `    });`,
    ``,
    `    // two wrappers meet in the middle`,
    `    tl.fromTo(`,
    `      [outers[index], inners[index]],`,
    `      { yPercent: (i) => (i ? -100 * d : 100 * d) },`,
    `      { yPercent: 0 },`,
    `      0`,
    `    ).fromTo(`,
    `      split[index].chars,`,
    `      { yPercent: 150 * d, autoAlpha: 0 },`,
    `      { yPercent: 0, autoAlpha: 1,`,
    `        stagger: { each: 0.02, from: 'random' } },`,
    `      0.2`,
    `    );`,
    `    current = index;`,
    `  };`,
    ``,
    `  const observer = Observer.create({`,
    `    target: target(this.stage),`,
    `    type: 'wheel,touch,pointer',`,
    `    onDown: () => !animating && gotoSection(current - 1, -1),`,
    `    onUp: () => !animating && gotoSection(current + 1, 1),`,
    `  });`,
    `  return () => observer.kill();`,
    `});`,
  ].join('\n');

  protected readonly files: CodeFile[] = [
    { label: 'sections.html', code: this.tplSnippet, lang: 'html' },
    { label: 'sections.ts', code: this.snippet, lang: 'ts' },
  ];
}
