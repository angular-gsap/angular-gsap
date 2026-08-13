import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { provideGsap } from './provide-gsap';
import { SplitReveal } from './split-reveal';

@Component({
  imports: [SplitReveal],
  template: `<h1 splitReveal [duration]="2">hello wide world</h1>`,
})
class SplitHost {}

async function settle(fixture: ComponentFixture<unknown>) {
  await fixture.whenStable();
  gsap.ticker.tick();
}

describe('splitReveal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideGsap({ plugins: [SplitText] })],
    });
  });

  it('splits into words and applies entrance start values', async () => {
    const fixture = TestBed.createComponent(SplitHost);
    await settle(fixture);
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    const pieces = h1?.querySelectorAll('div, span') ?? [];
    expect(pieces.length).toBeGreaterThanOrEqual(3); // one per word
    expect(Number((pieces[0] as HTMLElement).style.opacity)).toBeLessThan(1);
  });

  it('restores the original markup on destroy', async () => {
    const fixture = TestBed.createComponent(SplitHost);
    await settle(fixture);
    fixture.destroy();
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(h1?.children.length).toBe(0);
    expect(h1?.textContent).toBe('hello wide world');
  });
});
