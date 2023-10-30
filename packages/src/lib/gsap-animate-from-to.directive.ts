import { Directive, ElementRef, Input, effect, inject } from '@angular/core';
import { GsapService, TweenVars } from './gsap.service';

@Directive({
  selector: '[ngsapAnimateFromTo]',
  standalone: true,
})
export default class GsapAnimateFromToDirective {
  #GSAPService = inject(GsapService);
  #elementRef = inject(ElementRef, { host: true });

  @Input() animationConfigFrom!: TweenVars;
  @Input() animationConfigTo!: TweenVars;

  constructor() {
    effect(() => {
      if (this.#GSAPService.getStatus()) {
        this.startAnimation();
      }
    });
  }

  private startAnimation() {
    this.#GSAPService.fromTo(
      this.#elementRef,
      this.animationConfigFrom,
      this.animationConfigTo
    );
  }
}
