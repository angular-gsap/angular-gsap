import { Directive, ElementRef, inject, Input, OnInit } from '@angular/core';
import { GsapService, TweenVars } from './gsap.service';

@Directive({
  selector: '[ngsapAnimateTo]',
  standalone: true,
})
export default class GsapAnimateToDirective implements OnInit {
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
    this.#GSAPService.to(this.#elementRef, this.animationConfig);
  }
}
