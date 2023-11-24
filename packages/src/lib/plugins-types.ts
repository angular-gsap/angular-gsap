const SUPPORTED_PLUGINS = [
  'CSSPlugin',
  'Draggable',
  'Easel',
  'Flip',
  'MotionPath',
  'Observer',
  'Pixi',
  'ScrollTo',
  'ScrollTrigger',
  'Text',
] as const;

export type SupportedPlugin = (typeof SUPPORTED_PLUGINS)[number];

export const PLUGIN_IMPORTS_ARRAY: Record<
  SupportedPlugin,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => Promise<any>
> = {
  CSSPlugin: () => {
    return import('gsap/CSSPlugin');
  },
  Draggable: () => {
    return import('gsap/Draggable');
  },
  Easel: () => {
    return import('gsap/EaselPlugin');
  },
  Flip: () => {
    return import('gsap/Flip');
  },
  MotionPath: () => {
    return import('gsap/MotionPathPlugin');
  },
  Observer: () => {
    return import('gsap/ScrollTrigger');
  },
  Pixi: () => {
    return import('gsap/PixiPlugin');
  },
  ScrollTo: () => {
    return import('gsap/ScrollToPlugin');
  },
  ScrollTrigger: () => {
    return import('gsap/ScrollTrigger');
  },
  Text: () => {
    return import('gsap/TextPlugin');
  },
};
