import { RouteMeta } from '@analogjs/router';
import { LOCALE } from '../../i18n';

export const routeMeta: RouteMeta = {
  title: 'SVG · angular-gsap',
  providers: [{ provide: LOCALE, useValue: 'es' }],
};

export { default } from '../svg.page';
