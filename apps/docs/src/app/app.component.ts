import { Component, DOCUMENT, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs';
import { Hover } from '@angular-gsap/core';
import type { DocsLocale } from './i18n';

const NAV = {
  en: {
    home: 'Home',
    start: 'Start',
    directives: 'Directives',
    timeline: 'Timeline',
    scroll: 'ScrollTrigger',
    text: 'SplitText',
    flip: 'Flip',
    pointer: 'quickTo',
    drag: 'Draggable',
    svg: 'SVG',
    webgl: 'WebGL',
    api: 'API',
    mit: 'MIT licensed',
    animatedBy: 'animated by @angular-gsap/core',
    theme: 'Toggle theme',
    lang: 'ES',
    langLabel: 'Leer en español',
  },
  es: {
    home: 'Inicio',
    start: 'Empezar',
    directives: 'Directivas',
    timeline: 'Timeline',
    scroll: 'ScrollTrigger',
    text: 'SplitText',
    flip: 'Flip',
    pointer: 'quickTo',
    drag: 'Draggable',
    svg: 'SVG',
    webgl: 'WebGL',
    api: 'API',
    mit: 'Licencia MIT',
    animatedBy: 'animado por @angular-gsap/core',
    theme: 'Cambiar tema',
    lang: 'EN',
    langLabel: 'Read in English',
  },
} as const;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Hover],
  template: `
    <header class="top">
      <a [routerLink]="p('/')" class="brand-wrap" hover="tilt">
        <img
          class="brand-logo"
          src="/favicon-192.png"
          alt=""
          width="42"
          height="42"
        />
        <span class="brand">angular<span class="brand-tick">-</span>gsap</span>
      </a>
      <nav aria-label="Examples">
        <a
          [routerLink]="p('/')"
          routerLinkActive="on"
          [routerLinkActiveOptions]="{ exact: true }"
          hover
          >{{ t().home }}</a
        >
        <a [routerLink]="p('/start')" routerLinkActive="on" hover>{{
          t().start
        }}</a>
        <a [routerLink]="p('/directives')" routerLinkActive="on" hover>{{
          t().directives
        }}</a>
        <a [routerLink]="p('/timeline')" routerLinkActive="on" hover>{{
          t().timeline
        }}</a>
        <a [routerLink]="p('/scroll')" routerLinkActive="on" hover>{{
          t().scroll
        }}</a>
        <a [routerLink]="p('/text')" routerLinkActive="on" hover>{{ t().text }}</a>
        <a [routerLink]="p('/flip')" routerLinkActive="on" hover>{{ t().flip }}</a>
        <a [routerLink]="p('/pointer')" routerLinkActive="on" hover>{{
          t().pointer
        }}</a>
        <a [routerLink]="p('/drag')" routerLinkActive="on" hover>{{ t().drag }}</a>
        <a [routerLink]="p('/svg')" routerLinkActive="on" hover>{{ t().svg }}</a>
        <a [routerLink]="p('/webgl')" routerLinkActive="on" hover>{{
          t().webgl
        }}</a>
        <a [routerLink]="p('/reference')" routerLinkActive="on" hover>{{
          t().api
        }}</a>
        <a
          class="pill"
          hover="grow"
          [routerLink]="otherLocaleUrl()"
          [attr.aria-label]="t().langLabel"
          >{{ t().lang }}</a
        >
        <button
          type="button"
          class="pill theme"
          hover="grow"
          (click)="toggleTheme($event)"
          [attr.aria-label]="t().theme"
        >
          ◐
        </button>
        <a
          class="gh"
          hover="grow"
          href="https://github.com/angular-gsap/angular-gsap"
          target="_blank"
          rel="noreferrer"
          ><svg
            viewBox="0 0 16 16"
            width="15"
            height="15"
            aria-hidden="true"
            fill="currentColor"
          >
            <path
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"
            /></svg>
          GitHub</a
        >
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="bottom">
      <span>{{ t().mit }}</span>
      <span>{{ t().animatedBy }}</span>
    </footer>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
    }

    .top {
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.8rem 1.5rem;
      background: var(--paper);
      border-bottom: var(--bw) solid var(--ink);
    }

    .brand-wrap {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      text-decoration: none;

      &:hover {
        text-decoration: none;
      }
    }

    .brand-logo {
      display: block;
      border: 2px solid var(--ink);
      border-radius: 8px;
      box-shadow: 2px 2px 0 var(--ink);
    }

    .brand {
      font-family: var(--font-display);
      font-stretch: 120%;
      font-weight: 900;
      font-size: 1.02rem;
      color: var(--paper);
      background: var(--ink);
      border: var(--bw) solid var(--ink);
      border-radius: 10px;
      box-shadow: 3px 3px 0 var(--arc);
      padding: 0.25rem 0.7rem;
      text-decoration: none;
    }

    .brand-tick {
      color: var(--kinetic);
    }

    nav {
      display: flex;
      align-items: center;
      gap: 1.1rem;
      flex-wrap: wrap;

      a {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--ink-soft);
        text-decoration: none;

        &:hover {
          color: var(--ink);
        }

        &.on {
          color: var(--ink);
          font-weight: 600;
        }
      }

      .pill {
        font-family: var(--font-mono);
        font-size: 0.78rem;
        border: 2px solid var(--ink);
        border-radius: 10px;
        box-shadow: 2px 2px 0 var(--ink);
        background: var(--card);
        color: var(--ink);
        padding: 0.22rem 0.6rem;
        cursor: pointer;
      }

      .theme {
        font-size: 0.95rem;
        line-height: 1;
      }

      .gh {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        border: 2px solid var(--ink);
        border-radius: 10px;
        box-shadow: 3px 3px 0 var(--ink);
        background: var(--ember);
        padding: 0.25rem 0.85rem;
        color: var(--ink);
        font-weight: 600;
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-top: var(--bw) solid var(--ink);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--ink-soft);
    }
  `,
})
export class AppComponent {
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected readonly locale = computed<DocsLocale>(() =>
    this.url() === '/es' || this.url().startsWith('/es/') ? 'es' : 'en'
  );

  protected readonly t = computed(() => NAV[this.locale()]);

  protected p(path: string): string {
    return this.locale() === 'es' ? `/es${path === '/' ? '' : path}` : path;
  }

  protected readonly otherLocaleUrl = computed(() => {
    const u = this.url();
    return this.locale() === 'es'
      ? u.replace(/^\/es/, '') || '/'
      : `/es${u === '/' ? '' : u}`;
  });

  protected toggleTheme(event: MouseEvent): void {
    const root = this.document.documentElement;
    const view = this.document.defaultView;
    const current =
      root.dataset['theme'] ??
      (view?.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset['theme'] = next;
      try {
        view?.localStorage.setItem('theme', next);
      } catch {
        /* private mode */
      }
    };

    const reduce = view?.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const doc = this.document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    if (reduce || !doc.startViewTransition || !view) {
      apply();
      return;
    }

    // circular reveal of the new theme, expanding from the toggle button
    const { clientX: x, clientY: y } = event;
    const radius = Math.hypot(
      Math.max(x, view.innerWidth - x),
      Math.max(y, view.innerHeight - y)
    );
    doc.startViewTransition(apply).ready.then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 550,
          easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }
}
