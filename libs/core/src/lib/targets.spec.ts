import {
  Component,
  ElementRef,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { injectGsap } from './inject-gsap';
import { target, targets } from './targets';

@Component({
  template: `
    <div #box class="box"></div>
    @for (i of items(); track i) {
      <span #dot class="dot"></span>
    }
  `,
})
class Host {
  items = signal([1, 2, 3]);
  box = viewChild.required<ElementRef<HTMLDivElement>>('box');
  dots = viewChildren<ElementRef<HTMLSpanElement>>('dot');
  runs = 0;

  ref = injectGsap(({ gsap }) => {
    this.runs++;
    gsap.set(target(this.box), { x: 10 });
    gsap.set(targets(this.dots), { y: 5 });
  });
}

async function settle(fixture: ComponentFixture<unknown>) {
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  await fixture.whenStable();
}

describe('target / targets', () => {
  it('unwraps ElementRefs, elements, signals, and empty values', () => {
    const div = document.createElement('div');
    expect(target(div)).toBe(div);
    expect(target(new ElementRef(div))).toBe(div);
    expect(target(signal(new ElementRef(div)))).toBe(div);
    expect(target(null)).toBeNull();
    expect(target(undefined)).toBeNull();
    expect(targets([div, new ElementRef(div), null])).toEqual([div, div]);
    expect(targets(signal([new ElementRef(div)]))).toEqual([div]);
  });

  it('animates viewChild and viewChildren queries', async () => {
    const fixture = TestBed.createComponent(Host);
    await settle(fixture);
    const host = fixture.nativeElement as HTMLElement;
    const box = host.querySelector('.box') as HTMLElement;
    expect(box.style.transform).toContain('10px');
    for (const dot of Array.from(host.querySelectorAll('.dot'))) {
      expect((dot as HTMLElement).style.transform).toContain('5px');
    }
  });

  it('re-runs when a viewChildren query picks up new elements', async () => {
    const fixture = TestBed.createComponent(Host);
    await settle(fixture);
    expect(fixture.componentInstance.runs).toBe(1);

    fixture.componentInstance.items.set([1, 2, 3, 4, 5]);
    await settle(fixture);

    expect(fixture.componentInstance.runs).toBe(2);
    const dots = (fixture.nativeElement as HTMLElement).querySelectorAll('.dot');
    expect(dots).toHaveLength(5);
    for (const dot of Array.from(dots)) {
      expect((dot as HTMLElement).style.transform).toContain('5px');
    }
  });
});
