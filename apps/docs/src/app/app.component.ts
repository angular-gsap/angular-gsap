import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="top">
      <a routerLink="/" class="brand-wrap">
        <img class="brand-logo" src="/favicon-192.png" alt="" width="30" height="30" />
        <span class="brand"
          >angular<span class="brand-tick">-</span>gsap</span
        >
      </a>
      <nav aria-label="Examples">
        <a routerLink="/basics" routerLinkActive="on">Basics</a>
        <a routerLink="/directives" routerLinkActive="on">Directives</a>
        <a routerLink="/timeline" routerLinkActive="on">Timeline</a>
        <a routerLink="/scroll" routerLinkActive="on">ScrollTrigger</a>
        <a routerLink="/text" routerLinkActive="on">SplitText</a>
        <a routerLink="/flip" routerLinkActive="on">Flip</a>
        <a routerLink="/pointer" routerLinkActive="on">quickTo</a>
        <a routerLink="/svg" routerLinkActive="on">SVG</a>
        <a routerLink="/webgl" routerLinkActive="on">WebGL</a>
        <a routerLink="/reference" routerLinkActive="on">API</a>
        <a
          class="gh"
          href="https://github.com/angular-gsap/angular-gsap"
          target="_blank"
          rel="noreferrer"
          ><svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
          GitHub</a
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
export class AppComponent {}
