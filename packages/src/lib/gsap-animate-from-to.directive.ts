import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { GsapService, TweenVars } from './gsap.service';

@Directive({
  selector: '[ngsapAnimateFromTo]',
  standalone: true,
})
export default class GsapAnimateFromToDirective implements OnInit {
  #GSAPService = inject(GsapService);
  #elementRef = inject(ElementRef, { host: true });

  @Input() animationConfigFrom!: TweenVars;
  @Input() animationConfigTo!: TweenVars;

  ngOnInit(): void {
    this.#GSAPService.getStatus.subscribe((isLoaded) => {
      if (isLoaded) {
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
