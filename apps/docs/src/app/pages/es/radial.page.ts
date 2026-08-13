import { RouteMeta } from '@analogjs/router';
import { LOCALE } from '../../i18n';

export const routeMeta: RouteMeta = {
  title: 'Menú radial · angular-gsap',
  providers: [{ provide: LOCALE, useValue: 'es' }],
};

export { default } from '../radial.page';
