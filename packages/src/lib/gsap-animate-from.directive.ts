import { Directive, ElementRef, Input, effect, inject } from '@angular/core';
import { GsapService, TweenVars } from './gsap.service';

@Directive({
  selector: '[ngsapAnimateFrom]',
  standalone: true,
})
export default class GsapAnimateFromDirective {
  #GSAPService = inject(GsapService);
  #elementRef = inject(ElementRef, { host: true });

  @Input() animationConfig!: TweenVars;

  constructor() {
    effect(() => {
      if (this.#GSAPService.getStatus()) {
        this.startAnimation();
      }
    });
  }

  private startAnimation() {
    this.#GSAPService.from(this.#elementRef, this.animationConfig);
  }
}
