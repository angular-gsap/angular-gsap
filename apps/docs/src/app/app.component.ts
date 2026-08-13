import {
  Component,
  DOCUMENT,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, map } from 'rxjs';
import {
  Hover,
  injectGsap,
  prefersReducedMotion,
  target,
} from '@angular-gsap/core';
import type { DocsLocale } from './i18n';

interface NavGroup {
  label: string;
  links: { path: string; label: string }[];
}

const NAV = {
  en: {
    skip: 'Skip to content',
    menu: 'Toggle navigation',
    navLabel: 'Documentation',
    mit: 'MIT licensed',
    animatedBy: 'animated by @angular-gsap/core',
    theme: 'Toggle theme',
    lang: 'ES',
    langLabel: 'Leer en español',
    groups: [
      {
        label: 'Learn',
        links: [
          { path: '/', label: 'Home' },
          { path: '/start', label: 'Start' },
          { path: '/directives', label: 'Directives' },
        ],
      },
      {
        label: 'Core',
        links: [
          { path: '/timeline', label: 'Timeline' },
          { path: '/pointer', label: 'quickTo' },
        ],
      },
      {
        label: 'Plugins',
        links: [
          { path: '/scroll', label: 'ScrollTrigger' },
          { path: '/text', label: 'SplitText' },
          { path: '/svg', label: 'SVG' },
          { path: '/flip', label: 'Flip' },
          { path: '/drag', label: 'Draggable' },
          { path: '/loop', label: 'Observer & Inertia' },
        ],
      },
      {
        label: 'Advanced',
        links: [
          { path: '/sections', label: 'Sections' },
          { path: '/radial', label: 'Radial menu' },
          { path: '/webgl', label: 'WebGL' },
        ],
      },
      {
        label: 'Reference',
        links: [{ path: '/reference', label: 'API' }],
      },
    ] as NavGroup[],
  },
  es: {
    skip: 'Saltar al contenido',
    menu: 'Abrir o cerrar la navegación',
    navLabel: 'Documentación',
    mit: 'Licencia MIT',
    animatedBy: 'animado por @angular-gsap/core',
    theme: 'Cambiar tema',
    lang: 'EN',
    langLabel: 'Read in English',
    groups: [
      {
        label: 'Aprende',
        links: [
          { path: '/', label: 'Inicio' },
          { path: '/start', label: 'Empezar' },
          { path: '/directives', label: 'Directivas' },
        ],
      },
      {
        label: 'Núcleo',
        links: [
          { path: '/timeline', label: 'Timeline' },
          { path: '/pointer', label: 'quickTo' },
        ],
      },
      {
        label: 'Plugins',
        links: [
          { path: '/scroll', label: 'ScrollTrigger' },
          { path: '/text', label: 'SplitText' },
          { path: '/svg', label: 'SVG' },
          { path: '/flip', label: 'Flip' },
          { path: '/drag', label: 'Draggable' },
          { path: '/loop', label: 'Observer e Inertia' },
        ],
      },
      {
        label: 'Avanzado',
        links: [
          { path: '/sections', label: 'Secciones' },
          { path: '/radial', label: 'Menú radial' },
          { path: '/webgl', label: 'WebGL' },
        ],
      },
      {
        label: 'Referencia',
        links: [{ path: '/reference', label: 'API' }],
      },
    ] as NavGroup[],
  },
} as const;

const DESKTOP = '(min-width: 64rem)';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Hover],
  template: `
    <a class="skip" href="#main">{{ t().skip }}</a>

    <header class="top">
      <button
        #menuBtn
        type="button"
        class="pill menu-btn"
        (click)="toggle()"
        [attr.aria-expanded]="open()"
        aria-controls="sidebar"
        [attr.aria-label]="t().menu"
      >
        <span class="bar" #bar1></span>
        <span class="bar" #bar2></span>
        <span class="bar" #bar3></span>
      </button>
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
      <div class="top-actions">
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
          <span class="gh-text">GitHub</span></a
        >
      </div>
    </header>

    <div class="shell">
      <aside
        #panel
        id="sidebar"
        class="sidebar"
        [class.open]="open()"
      >
        <nav class="side-nav" [attr.aria-label]="t().navLabel">
          @for (group of t().groups; track group.label) {
            <p class="group">{{ group.label }}</p>
            @for (link of group.links; track link.path) {
              <a
                class="side-link"
                [routerLink]="p(link.path)"
                routerLinkActive="on"
                [routerLinkActiveOptions]="{ exact: link.path === '/' }"
                ariaCurrentWhenActive="page"
                hover
                (click)="closeOnMobile()"
                >{{ link.label }}</a
              >
            }
          }
        </nav>
      </aside>
      <div
        #backdrop
        class="backdrop"
        (click)="close()"
        aria-hidden="true"
      ></div>
      <main id="main" tabindex="-1">
        <router-outlet></router-outlet>
      </main>
    </div>

    <footer class="bottom">
      <span>{{ t().mit }}</span>
      <span>{{ t().animatedBy }}</span>
    </footer>
  `,
  host: { '(document:keydown.escape)': 'onEscape()' },
  styles: `
    :host {
      display: block;
      min-height: 100dvh;
    }

    .skip {
      position: absolute;
      top: -100%;
      left: 1rem;
      z-index: 40;
      background: var(--ink);
      color: var(--paper);
      border-radius: 0 0 10px 10px;
      padding: 0.5rem 1rem;
      font-weight: 600;

      &:focus-visible {
        top: 0;
      }
    }

    .top {
      position: sticky;
      top: 0;
      z-index: 30;
      display: flex;
      align-items: center;
      gap: 0.9rem;
      padding: 0.7rem 1rem;
      background: var(--paper);
      border-bottom: var(--bw) solid var(--ink);
    }

    .menu-btn {
      display: grid;
      gap: 5px;
      padding: 0.62rem 0.55rem;

      .bar {
        display: block;
        width: 18px;
        height: 3px;
        border-radius: 2px;
        background: var(--ink);
      }
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
    }

    .brand-tick {
      color: var(--kinetic);
    }

    .top-actions {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.7rem;
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
      text-decoration: none;
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
      text-decoration: none;
    }

    .shell {
      display: flex;
      min-height: calc(100dvh - 8rem);
    }

    .sidebar {
      flex: none;
      width: 0;
      overflow: hidden;
      border-right: 0 solid var(--ink);
      background: var(--paper);
    }

    .side-nav {
      width: 15.5rem;
      padding: 1.5rem 1.1rem 2rem;
      display: grid;
      align-content: start;
      gap: 0.15rem;
    }

    .group {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--paper);
      background: var(--ink);
      justify-self: start;
      padding: 0.12rem 0.5rem;
      margin: 1.1rem 0 0.45rem;

      &:first-child {
        margin-top: 0;
      }
    }

    .side-link {
      display: block;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--ink-soft);
      text-decoration: none;
      border: 2px solid transparent;
      border-radius: 8px;
      padding: 0.32rem 0.6rem;

      &:hover {
        color: var(--ink);
        text-decoration: none;
      }

      &.on {
        color: var(--ink);
        font-weight: 700;
        border-color: var(--ink);
        background: var(--card);
        box-shadow: 3px 3px 0 var(--ink);
      }
    }

    .backdrop {
      display: none;
    }

    main {
      flex: 1;
      min-width: 0;

      &:focus-visible {
        outline: none;
      }
    }

    @media (min-width: 64rem) {
      .sidebar.open {
        width: 15.5rem;
        border-right-width: var(--bw);
      }

      .sidebar {
        position: sticky;
        top: 4.3rem;
        height: calc(100dvh - 4.3rem);
        overflow-y: auto;
      }
    }

    @media (max-width: 63.99rem) {
      .sidebar {
        position: fixed;
        top: 4.3rem;
        bottom: 0;
        left: 0;
        z-index: 25;
        width: min(19rem, 86vw);
        border-right: var(--bw) solid var(--ink);
        transform: translateX(-104%);
        overflow-y: auto;

        &.open {
          box-shadow: var(--shadow);
        }
      }

      .side-nav {
        width: 100%;
      }

      .backdrop {
        display: block;
        position: fixed;
        inset: 4.3rem 0 0 0;
        z-index: 20;
        background: color-mix(in srgb, var(--code-bg) 45%, transparent);
        opacity: 0;
        visibility: hidden;
      }

      .gh-text {
        display: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .sidebar {
        transition: none;

        &.open {
          transform: none;
        }
      }

      .backdrop {
        // class-driven when animations are off
      }

      .sidebar.open ~ .backdrop,
      .backdrop.show {
        opacity: 1;
        visibility: visible;
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

  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private readonly backdrop =
    viewChild.required<ElementRef<HTMLElement>>('backdrop');
  private readonly menuBtn =
    viewChild.required<ElementRef<HTMLButtonElement>>('menuBtn');
  private readonly bar1 = viewChild.required<ElementRef<HTMLElement>>('bar1');
  private readonly bar2 = viewChild.required<ElementRef<HTMLElement>>('bar2');
  private readonly bar3 = viewChild.required<ElementRef<HTMLElement>>('bar3');

  protected readonly open = signal(true);

  // the user's desktop preference: open until they close it
  private desktopOpen = true;

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

  private isDesktop(): boolean {
    return !!this.document.defaultView?.matchMedia(DESKTOP).matches;
  }

  // sidebar: starts open on desktop, closed on mobile; GSAP owns the motion.
  // Inline styles from one mode break the other, so crossing the breakpoint
  // re-normalizes the panel, backdrop, and hamburger for the new mode.
  readonly ctx = injectGsap(({ gsap }) => {
    const applyMode = (desktop: boolean) => {
      const panel = target(this.panel);
      const backdrop = target(this.backdrop);
      const bars = [target(this.bar1), target(this.bar2), target(this.bar3)];
      gsap.killTweensOf([panel, backdrop, ...bars]);
      // open by default on desktop, but respect an explicit close
      const show = desktop && this.desktopOpen;
      this.open.set(show);
      if (desktop) {
        gsap.set(panel, { clearProps: 'transform' });
        gsap.set(panel, {
          width: show ? '15.5rem' : 0,
          borderRightWidth: show ? 'var(--bw)' : '0rem',
        });
        gsap.set(backdrop, { clearProps: 'all' });
      } else {
        gsap.set(panel, { clearProps: 'width,borderRightWidth' });
        // normalize: GSAP parses the CSS translateX(-104%) as x, so zero it
        gsap.set(panel, { x: 0, xPercent: -104 });
        gsap.set(backdrop, { autoAlpha: 0 });
      }
      gsap.set(bars, { clearProps: 'all' });
      this.backdrop().nativeElement.classList.remove('show');
    };

    applyMode(this.isDesktop());

    const media = this.document.defaultView?.matchMedia(DESKTOP);
    const onChange = (event: MediaQueryListEvent) => applyMode(event.matches);
    media?.addEventListener('change', onChange);
    return () => media?.removeEventListener('change', onChange);
  });

  private animate = this.ctx.contextSafe((show: boolean) => {
    const gsap = this.ctx.gsap;
    const panel = target(this.panel);
    const links = panel?.querySelectorAll('.side-link, .group') ?? [];
    const bars = [target(this.bar1), target(this.bar2), target(this.bar3)];
    const reduce = prefersReducedMotion();
    const desktop = this.isDesktop();

    if (reduce) {
      // the .open class and CSS handle it instantly
      gsap.set(panel, { clearProps: 'all' });
      if (!desktop) {
        this.backdrop().nativeElement.classList.toggle('show', show);
      }
      return;
    }

    const ease = 'power4.out';
    if (desktop) {
      gsap.to(panel, {
        width: show ? '15.5rem' : 0,
        borderRightWidth: show ? 'var(--bw)' : '0rem',
        duration: 0.5,
        ease,
        overwrite: 'auto',
      });
    } else {
      gsap.to(panel, {
        x: 0,
        xPercent: show ? 0 : -104,
        duration: 0.45,
        ease,
        overwrite: 'auto',
      });
      gsap.to(target(this.backdrop), {
        autoAlpha: show ? 1 : 0,
        duration: 0.3,
        overwrite: 'auto',
      });
    }
    if (show) {
      gsap.fromTo(
        links,
        { x: -18, autoAlpha: 0 },
        {
          x: 0,
          autoAlpha: 1,
          duration: 0.35,
          delay: 0.08,
          stagger: 0.025,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      );
    }
    // hamburger morphs to an X
    gsap.to(bars[0], { rotate: show ? 45 : 0, y: show ? 8 : 0, duration: 0.35, ease });
    gsap.to(bars[1], { autoAlpha: show ? 0 : 1, duration: 0.25 });
    gsap.to(bars[2], { rotate: show ? -45 : 0, y: show ? -8 : 0, duration: 0.35, ease });
  });

  protected toggle(): void {
    const next = !this.open();
    this.open.set(next);
    if (this.isDesktop()) {
      this.desktopOpen = next;
    }
    this.animate(next);
    if (next && !this.isDesktop()) {
      // move focus into the drawer for keyboard users
      setTimeout(() => {
        this.panel().nativeElement.querySelector<HTMLElement>('.side-link')?.focus();
      }, 120);
    }
  }

  protected close(): void {
    if (this.open()) {
      this.open.set(false);
      this.animate(false);
    }
  }

  protected closeOnMobile(): void {
    if (!this.isDesktop()) {
      this.close();
    }
  }

  protected onEscape(): void {
    if (this.open() && !this.isDesktop()) {
      this.close();
      this.menuBtn().nativeElement.focus();
    }
  }

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

    const reduce = view?.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
