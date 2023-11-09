import { GsapService, Timeline } from './gsap.service';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  inject,
} from '@angular/core';

@Directive({
  selector: '[ngsapAnimate]',
  standalone: true,
})
export default class GsapAnimateDirective implements AfterViewInit, OnDestroy {
  #GSAPService = inject(GsapService);
  #renderer = inject(Renderer2);
  #elementRef = inject(ElementRef, { host: true });

  timeline!: Timeline;
  private unlistener!: () => void;

  @Input() animationEvent!: keyof HTMLElementEventMap;
  @Output() animateChildren = new EventEmitter<Timeline>();

  ngAfterViewInit() {
    this.#GSAPService.getStatus.subscribe({
      next: (isLoaded) => {
        if (isLoaded) {
          this.timeline = this.#GSAPService.gsap.timeline({ paused: true });
          this.animateChildren.emit(this.timeline);
          if (this.animationEvent) {
            this.unlistener = this.#renderer.listen(
              this.#elementRef.nativeElement,
              this.animationEvent,
              () => {
                this.timeline.play();
              }
            );
          } else {
            this.timeline.play();
          }
        }
      },
      error: (err) => {
        throw `Error loading GSAP: ${err}`;
      },
    });
  }

  ngOnDestroy() {
    if (this.unlistener) {
      this.unlistener();
    }
  }
}
