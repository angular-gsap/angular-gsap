import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { Reveal } from './directives';
import { Sequence } from './sequence';

@Component({
  imports: [Sequence, Reveal],
  template: `
    <section #seq sequence>
      <h1 reveal>one</h1>
      <p reveal>two</p>
      <p reveal [at]="'<0.2'">three</p>
    </section>
  `,
})
class SequenceHost {
  seq = viewChild.required('seq', { read: Sequence });
}

@Component({
  imports: [Reveal],
  template: `<h1 reveal>solo</h1>`,
})
class SoloHost {}

async function settle(fixture: ComponentFixture<unknown>) {
  await fixture.whenStable();
  gsap.ticker.tick();
}

describe('sequence', () => {
  it('collects child entrances into one timeline, in template order', async () => {
    const fixture = TestBed.createComponent(SequenceHost);
    await settle(fixture);
    const tl = fixture.componentInstance.seq().timeline;
    expect(tl).toBeDefined();
    expect(tl?.getChildren().length).toBe(3);
    // steps one and two run back to back (0.7s each); '<0.2' starts the
    // third 0.2s after the second begins: 0.9 + 0.7 = 1.6 total
    expect(tl?.duration()).toBeCloseTo(1.6, 5);
  });

  it('leaves entrances standalone without a parent sequence', async () => {
    const fixture = TestBed.createComponent(SoloHost);
    await settle(fixture);
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1');
    expect(Number((h1 as HTMLElement).style.opacity)).toBeLessThan(1);
  });
});
