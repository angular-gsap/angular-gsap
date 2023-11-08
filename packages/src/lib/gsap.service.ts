import { BehaviorSubject, from } from 'rxjs';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  NgZone,
  PLATFORM_ID,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';

@Injectable()
export class GsapService {
  private zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config = inject(GSAP_CONFIG_TOKEN, { optional: true });
  private readonly defaults = inject(GSAP_DEFAULTS_TOKEN, { optional: true });
  private gsapInstance!: typeof globalThis.gsap;
  private readonly loaded$ = new BehaviorSubject<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.gsapInstance = gsap;
      if (this.config) {
        this.gsapInstance.config(this.config);
      }
      if (this.defaults) {
        this.gsapInstance.defaults(this.defaults);
      }
      this.loadGsapPlugins(import('gsap/CSSPlugin'));
    }
  }

  /**
   * Get the status of GSAP plugin
   * @returns true if GSAP plugin is loaded
   */
  get getStatus() {
    return this.loaded$;
  }

  /**
   * Gsap instance
   * @returns GSAP instance
   */
  get gsap() {
    return this.gsapInstance;
  }

  // Core GSAP APIs
  to(target: HTMLElement, vars: gsap.TweenVars): gsap.core.Tween {
    return this.gsapInstance.to(target, vars);
  }

  from(target: HTMLElement, vars: gsap.TweenVars): gsap.core.Tween {
    return this.gsapInstance.from(target, vars);
  }

  fromTo(
    target: HTMLElement,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars
  ): gsap.core.Tween {
    return this.gsapInstance.fromTo(target, fromVars, toVars);
  }

  private loadGsapPlugins(
    gsapImport: Promise<typeof import('gsap/CSSPlugin')>
  ) {
    this.zone.runOutsideAngular(() =>
      from(gsapImport)
        .pipe(takeUntilDestroyed())
        .subscribe((plugin) => {
          this.gsapInstance.registerPlugin(plugin.CSSPlugin);
          this.loaded$.next(true);
        })
    );
  }
}

export function provideGsap(
  config?: gsap.GSAPConfig,
  defaults?: gsap.TweenVars
): EnvironmentProviders {
  return makeEnvironmentProviders([
    config ? { provide: GSAP_CONFIG_TOKEN, useValue: config } : [],
    defaults ? { provide: GSAP_DEFAULTS_TOKEN, useValue: defaults } : [],
    GsapService,
  ]);
}

export const GSAP_CONFIG_TOKEN = new InjectionToken<gsap.GSAPConfig>('config');
export const GSAP_DEFAULTS_TOKEN = new InjectionToken<gsap.TweenVars>(
  'defaults'
);

export type TweenVars = gsap.TweenVars;
export type Tween = gsap.core.Tween;
export type Timeline = gsap.core.Timeline;
