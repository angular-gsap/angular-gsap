import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { Counter } from './counter';

@Component({
  imports: [Counter],
  template: `<span [counter]="1250" [duration]="0"></span>`,
})
class CounterHost {}

const fmt = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

async function settle(fixture: ComponentFixture<unknown>) {
  await fixture.whenStable();
  gsap.ticker.tick();
}

describe('counter', () => {
  it('counts to the target and formats with the locale', async () => {
    const fixture = TestBed.createComponent(CounterHost);
    await settle(fixture);
    gsap.ticker.tick(); // zero-duration tween completes on the next tick
    const span = (fixture.nativeElement as HTMLElement).querySelector('span');
    expect(span?.textContent).toBe(fmt.format(1250));
  });

  it('jumps straight to the target under reduced motion', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    try {
      const fixture = TestBed.createComponent(CounterHost);
      await settle(fixture);
      const span = (fixture.nativeElement as HTMLElement).querySelector('span');
      expect(span?.textContent).toBe(fmt.format(1250));
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
