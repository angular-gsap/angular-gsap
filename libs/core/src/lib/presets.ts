import type { GsapTweenVars } from './types';

/** Entrance presets shared by the sugar directives. */
export type GsapRevealPreset =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-in';

/** `gsap.from()` vars for a preset. `distance` is the travel in px. */
export function presetFromVars(
  preset: GsapRevealPreset,
  distance: number
): GsapTweenVars {
  switch (preset) {
    case 'fade':
      return { opacity: 0 };
    case 'fade-up':
      return { opacity: 0, y: distance };
    case 'fade-down':
      return { opacity: 0, y: -distance };
    case 'fade-left':
      return { opacity: 0, x: distance };
    case 'fade-right':
      return { opacity: 0, x: -distance };
    case 'scale-in':
      return { opacity: 0, scale: 0.85 };
  }
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
