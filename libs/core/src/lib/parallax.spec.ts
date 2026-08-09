import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Parallax } from './parallax';

@Component({
  imports: [Parallax],
  template: `<div style="height:3000px"></div><img parallax="0.3" alt="" />`,
})
class ParallaxHost {}

async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  await fixture.whenStable();
  gsap.ticker.tick();
}

describe('parallax', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: false,
      media: q,
      onchange: null,
      addListener: () => void 0,
      removeListener: () => void 0,
      addEventListener: () => void 0,
      removeEventListener: () => void 0,
      dispatchEvent: () => false,
    }));
    gsap.registerPlugin(ScrollTrigger);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('creates a scrubbed ScrollTrigger spanning the viewport crossing', async () => {
    const fixture = TestBed.createComponent(ParallaxHost);
    await settle(fixture);
    const triggers = ScrollTrigger.getAll();
    expect(triggers).toHaveLength(1);
    expect(triggers[0].vars['scrub']).toBe(true);
    fixture.destroy();
    expect(ScrollTrigger.getAll()).toHaveLength(0); // reverted with the context
  });

  it('does nothing without ScrollTrigger-style motion under reduced motion', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    const fixture = TestBed.createComponent(ParallaxHost);
    await settle(fixture);
    expect(ScrollTrigger.getAll()).toHaveLength(0);
  });
});
