import { gsap } from 'gsap';
import { isPlatformBrowser } from '@angular/common';
import { PLUGIN_IMPORTS_ARRAY, SupportedPlugin } from './plugins-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  concat,
  filter,
  from,
  map,
  mergeMap,
} from 'rxjs';
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
  private readonly plugins = inject(GSAP_PLUGINS_TOKEN, { optional: true });
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
      // Load CSSPlugin first, then any additional plugins
      this.loadGsapPlugins(['CSSPlugin', ...(this.plugins || [])]);
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

  // Method to load and register plugins
  private loadGsapPlugins(plugins: SupportedPlugin[]) {
    // Observable for loading CSSPlugin
    const loadCSSPlugin$ = from(PLUGIN_IMPORTS_ARRAY['CSSPlugin']()).pipe(
      catchError((error) => {
        console.error('Error loading CSSPlugin:', error);
        return from([]); // Emit an empty array to continue the observable chain.
      })
    );

    // Observable for loading other plugins
    const loadOtherPlugins$ = from(plugins).pipe(
      filter((plugin) => plugin !== 'CSSPlugin'), // Exclude CSSPlugin to prevent double loading.
      mergeMap((plugin) => PLUGIN_IMPORTS_ARRAY[plugin]()),
      catchError((error, caught) => {
        console.error('Error loading additional plugins:', error);
        return caught; // Continue the observable chain.
      })
    );

    // Concatenate the two observables to ensure order
    const loadPlugins$ = concat(loadCSSPlugin$, loadOtherPlugins$).pipe(
      map((pluginModule) => pluginModule.default) // Assuming each plugin has a default export
    );

    // Subscribe to the concatenated observable to execute the loading process
    this.zone.runOutsideAngular(() => {
      loadPlugins$.pipe(takeUntilDestroyed()).subscribe({
        next: (plugin) => {
          if (plugin) {
            // Register the plugin with gsap
            this.gsapInstance.registerPlugin(plugin);
          }
        },
        complete: () => {
          this.loaded$.next(true); // Signal that all plugins are loaded
        },
        error: (error) => {
          console.error('An error occurred while loading GSAP plugins:', error);
        },
      });
    });
  }
}

export function provideGsap(
  plugins?: SupportedPlugin[],
  config?: gsap.GSAPConfig,
  defaults?: gsap.TweenVars
): EnvironmentProviders {
  return makeEnvironmentProviders([
    plugins ? { provide: GSAP_PLUGINS_TOKEN, useValue: plugins } : [],
    config ? { provide: GSAP_CONFIG_TOKEN, useValue: config } : [],
    defaults ? { provide: GSAP_DEFAULTS_TOKEN, useValue: defaults } : [],
    GsapService,
  ]);
}

export const GSAP_CONFIG_TOKEN = new InjectionToken<gsap.GSAPConfig>('config');
export const GSAP_DEFAULTS_TOKEN = new InjectionToken<gsap.TweenVars>(
  'defaults'
);
export const GSAP_PLUGINS_TOKEN = new InjectionToken<SupportedPlugin[]>(
  'plugins'
);

export type TweenVars = gsap.TweenVars;
export type Tween = gsap.core.Tween;
export type Timeline = gsap.core.Timeline;
