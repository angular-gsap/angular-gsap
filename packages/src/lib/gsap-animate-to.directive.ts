import { Directive, ElementRef, Input, effect, inject } from '@angular/core';
import { GsapService, TweenVars } from './gsap.service';

@Directive({
  selector: '[ngsapAnimateTo]',
  standalone: true,
})
export default class GsapAnimateToDirective {
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
    this.#GSAPService.to(this.#elementRef, this.animationConfig);
  }
}
