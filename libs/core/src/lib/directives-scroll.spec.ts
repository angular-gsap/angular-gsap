import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Reveal } from './directives';

@Component({
  imports: [Reveal],
  template: `<div style="height:3000px"></div><p reveal="fade-up" on="scroll">hi</p>`,
})
class ScrollHost {}

@Component({
  imports: [Reveal],
  template: `
    <div #frame style="height:200px;overflow:auto">
      <div style="height:1000px"></div>
      <p reveal="fade-up" on="scroll" [scroller]="frame">hi</p>
    </div>
  `,
})
class ContainerScrollHost {}

describe('reveal on scroll', () => {
  it('creates a ScrollTrigger when the plugin is registered', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: false, media: q, onchange: null,
      addListener: () => void 0, removeListener: () => void 0,
      addEventListener: () => void 0, removeEventListener: () => void 0,
      dispatchEvent: () => false,
    }));
    gsap.registerPlugin(ScrollTrigger);
    const warn = vi.spyOn(console, 'warn');
    const fixture = TestBed.createComponent(ScrollHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    gsap.ticker.tick();
    expect(warn).not.toHaveBeenCalled();
    expect(ScrollTrigger.getAll().length).toBe(1);
    expect(ScrollTrigger.getAll()[0].vars['toggleActions']).toBe(
      'play none none reset'
    );
  });

  it('passes a container scroller through to ScrollTrigger', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: false, media: q, onchange: null,
      addListener: () => void 0, removeListener: () => void 0,
      addEventListener: () => void 0, removeEventListener: () => void 0,
      dispatchEvent: () => false,
    }));
    gsap.registerPlugin(ScrollTrigger);
    const fixture = TestBed.createComponent(ContainerScrollHost);
    fixture.detectChanges();
    await fixture.whenStable();
    gsap.ticker.tick();
    const frame = (fixture.nativeElement as HTMLElement).querySelector('div');
    const all = ScrollTrigger.getAll();
    const trigger = all[all.length - 1];
    expect(trigger?.vars['scroller']).toBe(frame);
  });
});
