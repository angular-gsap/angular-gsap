import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Renderer2,
  inject,
} from '@angular/core';
import { GsapService, Timeline } from './gsap.service';
import GsapAnimateDirective from './gsap-animate.directive';

@Directive({
  selector: '[ngsapNgsapAbstract]',
  standalone: true,
})
export abstract class NgsapAbstractDirective implements OnDestroy {
  protected animateDirective = inject(GsapAnimateDirective, { optional: true });
  protected elementRef = inject(ElementRef, { host: true });
  protected renderer = inject(Renderer2);
  protected GSAPService = inject(GsapService);

  @Input() event!: keyof HTMLElementEventMap;
  @Input() eventElement!: HTMLElement;

  protected timeline!: Timeline;
  protected unlistener!: () => void;

  protected abstract animate(): void;

  ngOnDestroy() {
    if (this.unlistener) {
      this.unlistener();
    }
  }
}
