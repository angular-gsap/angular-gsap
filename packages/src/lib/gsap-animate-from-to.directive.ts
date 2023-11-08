import { EMPTY, switchMap, tap } from 'rxjs';
import { TweenVars } from './gsap.service';
import { NgsapAbstractDirective } from './ngsap-abstract.directive';
import { AfterViewInit, Directive, Input } from '@angular/core';

@Directive({
  selector: '[ngsapAnimateFromTo]',
  standalone: true,
})
export default class GsapAnimateFromToDirective
  extends NgsapAbstractDirective
  implements AfterViewInit
{
  @Input() animationFromConfig!: TweenVars;
  @Input() animationToConfig!: TweenVars;
  @Input() animationEvent!: keyof HTMLElementEventMap;

  ngAfterViewInit() {
    this.GSAPService.getStatus
      .pipe(
        switchMap((isLoaded) => {
          if (isLoaded) {
            if (this.animateDirective) {
              return this.animateDirective.animateChildren.pipe(
                tap((timeline) => {
                  timeline.fromTo(
                    this.elementRef.nativeElement,
                    this.animationFromConfig,
                    this.animationToConfig
                  );
                })
              );
            } else {
              if (this.animationEvent) {
                this.unlistener = this.renderer.listen(
                  this.elementRef.nativeElement,
                  this.animationEvent,
                  () => this.animate()
                );
              } else {
                this.animate();
              }
              // If there is no `animateChildren`, we need to return an empty Observable
              // since switchMap expects an Observable to be returned.
              return EMPTY;
            }
          } else {
            // If `isLoaded` is false, again, we return an empty Observable.
            return EMPTY;
          }
        })
      )
      .subscribe({
        error: (err) => {
          throw `Error loading GSAP: ${err}`;
        },
      });
  }

  protected override animate(): void {
    this.GSAPService.fromTo(
      this.eventElement ? this.eventElement : this.elementRef.nativeElement,
      this.animationFromConfig,
      this.animationToConfig
    );
  }
}
