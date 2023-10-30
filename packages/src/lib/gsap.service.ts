import { from } from 'rxjs';
import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ElementRef,
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  NgZone,
  PLATFORM_ID,
  inject,
  makeEnvironmentProviders,
  signal,
} from '@angular/core';

@Injectable()
export class GsapService {
  private zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly config = inject(GSAP_CONFIG_TOKEN, { optional: true });
  private readonly defaults = inject(GSAP_DEFAULTS_TOKEN, { optional: true });
  private gsap!: typeof globalThis.gsap;
  private loaded = signal<boolean>(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.gsap = gsap;
      if (this.config) {
        this.gsap.config(this.config);
      }
      if (this.defaults) {
        this.gsap.defaults(this.defaults);
      }
      this.loadGsapPlugins(import('gsap/CSSPlugin'));
    }
  }

  get getStatus() {
    return this.loaded;
  }

  //Expose the registerPlugin method
  get registerPlugin() {
    return this.gsap.registerPlugin;
  }

  // Core GSAP APIs
  to(target: ElementRef, vars: gsap.TweenVars): gsap.core.Tween {
    return this.gsap.to(target.nativeElement, vars);
  }

  from(target: ElementRef, vars: gsap.TweenVars): gsap.core.Tween {
    return this.gsap.from(target.nativeElement, vars);
  }

  fromTo(
    target: ElementRef,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars
  ): gsap.core.Tween {
    return this.gsap.fromTo(target.nativeElement, fromVars, toVars);
  }

  private loadGsapPlugins(
    gsapImport: Promise<typeof import('gsap/CSSPlugin')>
  ) {
    this.zone.runOutsideAngular(() =>
      from(gsapImport)
        .pipe(takeUntilDestroyed())
        .subscribe((plugin) => {
          this.gsap.registerPlugin(plugin.CSSPlugin);
          this.loaded.set(true);
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

// export gsap.TweenVars as TweenVars;
export type TweenVars = gsap.TweenVars;
