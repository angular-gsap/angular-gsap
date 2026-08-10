import { Component, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Drag } from './drag';
import { Observe } from './observe';
import { provideGsap } from './provide-gsap';
import { ScrambleText } from './scramble-text';
import { ScrollTo } from './scroll-to';

@Component({
  imports: [Drag],
  template: `<div class="arena"><div class="brick" drag [snap]="96"></div></div>`,
})
class DragHost {}

@Component({
  imports: [Observe],
  template: `<section observe [preventDefault]="true" (up)="ups = ups + 1"></section>`,
})
class ObserveHost {
  ups = 0;
}

@Component({
  imports: [ScrambleText],
  template: `<h1 scrambleText [duration]="0">TARGET</h1>`,
})
class ScrambleHost {}

@Component({
  imports: [ScrollTo],
  template: `
    <button scrollTo="#dest">go</button>
    <div id="dest"></div>
  `,
})
class ScrollToHost {}

async function settle(fixture: ComponentFixture<unknown>) {
  await fixture.whenStable();
  gsap.ticker.tick();
}

function stubMatchMedia(matches = false) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches,
    media: q,
    onchange: null,
    addListener: () => void 0,
    removeListener: () => void 0,
    addEventListener: () => void 0,
    removeEventListener: () => void 0,
    dispatchEvent: () => false,
  }));
}

describe('extra directives', () => {
  beforeEach(() => stubMatchMedia());
  afterEach(() => vi.unstubAllGlobals());

  it('drag creates a Draggable and kills it on destroy', async () => {
    TestBed.configureTestingModule({
      providers: [provideGsap({ plugins: [Draggable] })],
    });
    const fixture = TestBed.createComponent(DragHost);
    await settle(fixture);
    const brick = (fixture.nativeElement as HTMLElement).querySelector('.brick');
    expect(Draggable.get(brick as Element)).toBeTruthy();
    fixture.destroy();
    expect(Draggable.get(brick as Element)).toBeFalsy();
  });

  it('observe wires Observer callbacks to outputs and kills on destroy', async () => {
    TestBed.configureTestingModule({
      providers: [provideGsap({ plugins: [Observer] })],
    });
    const before = Observer.getAll().length;
    const fixture = TestBed.createComponent(ObserveHost);
    await settle(fixture);
    expect(Observer.getAll().length).toBe(before + 1);
    const observers = Observer.getAll();
    const instance = observers[observers.length - 1] as Observer & {
      vars: { preventDefault?: boolean };
    };
    expect(instance.vars.preventDefault).toBe(true);
    fixture.destroy();
    expect(Observer.getAll().length).toBe(before);
  });

  it('scrambleText lands on the target text', async () => {
    TestBed.configureTestingModule({
      providers: [provideGsap({ plugins: [ScrambleTextPlugin] })],
    });
    const fixture = TestBed.createComponent(ScrambleHost);
    await settle(fixture);
    gsap.ticker.tick(); // zero-duration tween completes on the next tick
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1?.textContent).toBe('TARGET');
  });

  it('scrollTo tweens the window scroll through the plugin', async () => {
    TestBed.configureTestingModule({
      providers: [provideGsap({ plugins: [ScrollToPlugin] })],
    });
    const fixture = TestBed.createComponent(ScrollToHost);
    await settle(fixture);
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    const tweens = gsap.globalTimeline
      .getChildren()
      .filter((t) => (t as { targets?: () => unknown[] }).targets?.().includes(window));
    expect(tweens.length).toBeGreaterThan(0);
    tweens.forEach((t) => t.kill());
  });

  it('scrollTo falls back to scrollIntoView without the plugin', async () => {
    const fixture = TestBed.createComponent(ScrollToHost);
    await settle(fixture);
    const dest = (fixture.nativeElement as HTMLElement).querySelector('#dest');
    const spy = vi.fn();
    (dest as HTMLElement).scrollIntoView = spy;
    (fixture.nativeElement as HTMLElement).querySelector('button')?.click();
    expect(spy).toHaveBeenCalledWith({ behavior: 'smooth' });
  });
});

describe('provideGsap effects', () => {
  it('registers effects usable as gsap.effects.name()', () => {
    TestBed.configureTestingModule({
      providers: [
        provideGsap({
          effects: [
            {
              name: 'testFade',
              effect: (targets: unknown) => gsap.set(targets as Element, {}),
            },
          ],
        }),
      ],
    });
    TestBed.inject(PLATFORM_ID); // force environment initialization
    expect(
      (gsap.effects as Record<string, unknown>)['testFade']
    ).toBeTypeOf('function');
  });
});
