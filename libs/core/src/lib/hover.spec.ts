import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { Hover } from './hover';

@Component({
  imports: [Hover],
  template: `<a hover="grow" [duration]="0">link</a>`,
})
class HoverHost {}

async function settle(fixture: ComponentFixture<unknown>) {
  await fixture.whenStable();
  gsap.ticker.tick();
}

describe('hover', () => {
  it('tweens in on pointerenter and back on pointerleave', async () => {
    const fixture = TestBed.createComponent(HoverHost);
    await settle(fixture);
    const link = (fixture.nativeElement as HTMLElement).querySelector('a') as HTMLElement;

    link.dispatchEvent(new Event('pointerenter'));
    gsap.ticker.tick();
    gsap.ticker.tick();
    expect(link.style.transform).toContain('scale(1.07');

    link.dispatchEvent(new Event('pointerleave'));
    gsap.ticker.tick();
    gsap.ticker.tick();
    expect(link.style.transform).not.toContain('1.07'); // back to identity
  });

  it('does nothing under reduced motion', async () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    try {
      const fixture = TestBed.createComponent(HoverHost);
      await settle(fixture);
      const link = (fixture.nativeElement as HTMLElement).querySelector('a') as HTMLElement;
      link.dispatchEvent(new Event('pointerenter'));
      gsap.ticker.tick();
      expect(link.style.transform).toBe('');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
