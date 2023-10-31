import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { GsapService, TweenVars } from './gsap.service';

@Directive({
  selector: '[ngsapAnimateFrom]',
  standalone: true,
})
export default class GsapAnimateFromDirective implements OnInit {
  #GSAPService = inject(GsapService);
  #elementRef = inject(ElementRef, { host: true });

  @Input() animationConfig!: TweenVars;

  ngOnInit(): void {
    this.#GSAPService.getStatus.subscribe((isLoaded) => {
      if (isLoaded) {
        this.startAnimation();
      }
    });
  }

  private startAnimation() {
    this.#GSAPService.from(this.#elementRef, this.animationConfig);
  }
}
