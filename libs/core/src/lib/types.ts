import type { gsap } from 'gsap';

/** The GSAP instance type (`typeof gsap`). */
export type Gsap = typeof gsap;

/** Re-exported GSAP types so consumers rarely need to import from `gsap` directly. */
export type GsapTweenVars = gsap.TweenVars;
export type GsapTimelineVars = gsap.TimelineVars;
export type GsapTween = gsap.core.Tween;
export type GsapTimeline = gsap.core.Timeline;
export type GsapContext = gsap.Context;
export type GsapConfig = gsap.GSAPConfig;

/** Accepted by the `scroller` inputs: selector, element, or an ElementRef. */
export type { ScrollerLike } from './internal';
