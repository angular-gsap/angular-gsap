import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="top">
      <a routerLink="/" class="brand"
        >angular<span class="brand-tick">-</span>gsap</a
      >
      <nav aria-label="Examples">
        <a routerLink="/basics" routerLinkActive="on">Basics</a>
        <a routerLink="/directives" routerLinkActive="on">Directives</a>
        <a routerLink="/timeline" routerLinkActive="on">Timeline</a>
        <a routerLink="/scroll" routerLinkActive="on">ScrollTrigger</a>
        <a routerLink="/text" routerLinkActive="on">SplitText</a>
        <a routerLink="/flip" routerLinkActive="on">Flip</a>
        <a routerLink="/pointer" routerLinkActive="on">quickTo</a>
        <a
          class="gh"
          href="https://github.com/angular-gsap/angular-gsap"
          target="_blank"
          rel="noreferrer"
          >GitHub</a
        >
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="bottom">
      <span>MIT licensed</span>
      <span>animated by &#64;angular-gsap/core</span>
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
      padding: 0.9rem 1.5rem;
      background: color-mix(in srgb, var(--paper) 88%, transparent);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--hairline);
    }

    .brand {
      font-family: var(--font-display);
      font-stretch: 120%;
      font-weight: 800;
      font-size: 1.05rem;
      color: var(--ink);
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

      .gh {
        border: 1px solid var(--hairline);
        border-radius: 999px;
        padding: 0.25rem 0.85rem;
        color: var(--ink);
      }
    }

    .bottom {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-top: 1px solid var(--hairline);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--ink-soft);
    }
  `,
})
export class AppComponent {}
