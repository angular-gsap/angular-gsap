import { RouteMeta } from '@analogjs/router';
import { LOCALE } from '../../i18n';

export const routeMeta: RouteMeta = {
  title: 'angular-gsap · GSAP para Angular',
  providers: [{ provide: LOCALE, useValue: 'es' }],
};

export { default } from '../(home).page';
