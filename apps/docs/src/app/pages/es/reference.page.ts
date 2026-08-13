import { RouteMeta } from '@analogjs/router';
import { LOCALE } from '../../i18n';

export const routeMeta: RouteMeta = {
  title: 'API · angular-gsap',
  providers: [{ provide: LOCALE, useValue: 'es' }],
};

export { default } from '../reference.page';
