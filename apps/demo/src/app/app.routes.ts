import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./pages/home').then((m) => m.Home),
    title: 'angular-gsap — GSAP for Angular',
  },
  {
    path: 'basics',
    loadComponent: () => import('./pages/basics').then((m) => m.Basics),
    title: 'Basics — angular-gsap',
  },
  {
    path: 'timeline',
    loadComponent: () => import('./pages/timeline').then((m) => m.Timeline),
    title: 'Timeline — angular-gsap',
  },
  {
    path: 'scroll',
    loadComponent: () => import('./pages/scroll').then((m) => m.Scroll),
    title: 'ScrollTrigger — angular-gsap',
  },
  {
    path: 'text',
    loadComponent: () => import('./pages/text').then((m) => m.Text),
    title: 'SplitText — angular-gsap',
  },
];
