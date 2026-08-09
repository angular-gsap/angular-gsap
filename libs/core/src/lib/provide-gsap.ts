import { isPlatformBrowser } from '@angular/common';
import {
  EnvironmentProviders,
  InjectionToken,
  PLATFORM_ID,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
} from '@angular/core';
import { gsap } from 'gsap';
import type { GsapConfig, GsapTweenVars } from './types';

export interface GsapOptions {
  /**
   * GSAP plugins to register globally, e.g. `[ScrollTrigger, SplitText]`.
   * Import them statically from the `gsap` package; since GSAP 3.13 every
   * plugin (including the former Club plugins) ships free in the npm package.
   */
  plugins?: object[];
  /** Passed to `gsap.config()`. */
  config?: GsapConfig;
  /** Passed to `gsap.defaults()`: default vars for every tween. */
  defaults?: GsapTweenVars;
}

export const GSAP_OPTIONS = new InjectionToken<GsapOptions>('GSAP_OPTIONS');

/**
 * Configures GSAP for the application: registers plugins and applies global
 * config/defaults. Registration is skipped on the server.
 *
 * `provideGsap()` is optional; `injectGsap()` works without it. Use it when
 * you need plugins or global configuration:
 *
 * ```ts
 * import { ScrollTrigger } from 'gsap/ScrollTrigger';
 *
 * bootstrapApplication(App, {
 *   providers: [provideGsap({ plugins: [ScrollTrigger] })],
 * });
 * ```
 */
export function provideGsap(options: GsapOptions = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: GSAP_OPTIONS, useValue: options },
    provideEnvironmentInitializer(() => {
      if (!isPlatformBrowser(inject(PLATFORM_ID))) {
        return;
      }
      const { plugins, config, defaults } = inject(GSAP_OPTIONS);
      if (plugins?.length) {
        gsap.registerPlugin(...plugins);
      }
      if (config) {
        gsap.config(config);
      }
      if (defaults) {
        gsap.defaults(defaults);
      }
    }),
  ]);
}
