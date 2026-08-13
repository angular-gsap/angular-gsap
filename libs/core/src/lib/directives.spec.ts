import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { Reveal, Stagger } from './directives';

@Component({
  imports: [Reveal],
  template: `<h1 [reveal]="preset()" [duration]="2">Hello</h1>`,
})
class RevealHost {
  preset = signal<'fade-up' | 'scale-in' | ''>('');
}

@Component({
  imports: [Stagger],
  template: `
    <ul stagger [duration]="2">
      <li>one</li>
      <li>two</li>
      <li>three</li>
    </ul>
  `,
})
class StaggerHost {}

async function settle(fixture: ComponentFixture<unknown>) {
  await fixture.whenStable();
  // gsap.from() defers its first style write to the next ticker tick (lazy
  // rendering); force one so start values are observable synchronously.
  gsap.ticker.tick();
}

function q(fixture: ComponentFixture<unknown>, sel: string): HTMLElement {
  const el = (fixture.nativeElement as HTMLElement).querySelector(sel);
  if (!el) throw new Error(`${sel} not found`);
  return el as HTMLElement;
}

describe('sugar directives', () => {
  describe('reveal', () => {
    it('applies the entrance start values after first render', async () => {
      const fixture = TestBed.createComponent(RevealHost);
      await settle(fixture);
      const h1 = q(fixture, 'h1');
      // gsap.from() renders the start state immediately; default preset is fade-up
      expect(Number(h1.style.opacity)).toBeLessThan(1);
      expect(h1.style.transform).toContain('translate');
    });

    it('re-runs with revert when the preset input changes', async () => {
      const fixture = TestBed.createComponent(RevealHost);
      await settle(fixture);
      fixture.componentInstance.preset.set('scale-in');
      await settle(fixture);
      const h1 = q(fixture, 'h1');
      expect(h1.style.transform).toContain('scale');
    });

    it('reverts on destroy', async () => {
      const fixture = TestBed.createComponent(RevealHost);
      await settle(fixture);
      const h1 = q(fixture, 'h1');
      fixture.destroy();
      expect(h1.style.transform).toBe('');
      expect(h1.style.opacity).toBe('');
    });

    it('does not animate when the user prefers reduced motion', async () => {
      vi.stubGlobal(
        'matchMedia',
        vi.fn().mockReturnValue({ matches: true })
      );
      try {
        const fixture = TestBed.createComponent(RevealHost);
        await settle(fixture);
        const h1 = q(fixture, 'h1');
        expect(h1.style.opacity).toBe('');
        expect(h1.style.transform).toBe('');
      } finally {
        vi.unstubAllGlobals();
      }
    });
  });

  describe('stagger', () => {
    it('applies entrance start values to every child', async () => {
      const fixture = TestBed.createComponent(StaggerHost);
      await settle(fixture);
      const items = Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('li')
      );
      expect(items).toHaveLength(3);
      for (const li of items) {
        expect(Number(li.style.opacity)).toBeLessThan(1);
      }
    });

    it('reverts all children on destroy', async () => {
      const fixture = TestBed.createComponent(StaggerHost);
      await settle(fixture);
      const items = Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('li')
      );
      fixture.destroy();
      for (const li of items) {
        expect(li.style.opacity).toBe('');
      }
    });
  });
});
