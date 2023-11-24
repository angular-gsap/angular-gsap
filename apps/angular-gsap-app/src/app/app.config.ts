import { provideGsap } from '@angular-gsap/core';
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideGsap(['ScrollTo'])],
};
