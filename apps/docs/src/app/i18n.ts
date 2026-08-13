import { InjectionToken, inject } from '@angular/core';

export type DocsLocale = 'en' | 'es';

export const LOCALE = new InjectionToken<DocsLocale>('DOCS_LOCALE');

/** Route-provided locale; English outside the /es tree. */
export function injectLocale(): DocsLocale {
  return inject(LOCALE, { optional: true }) ?? 'en';
}

/** Prefixes a root-relative path for the active locale. */
export function localePath(locale: DocsLocale, path: string): string {
  if (locale !== 'es') {
    return path;
  }
  return path === '/' ? '/es' : `/es${path}`;
}
