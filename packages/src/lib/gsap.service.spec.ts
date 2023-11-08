import { TestBed } from '@angular/core/testing';
import { GsapService, provideGsap } from './gsap.service';
import { ElementRef } from '@angular/core';
import { gsap } from 'gsap';

describe('GsapService', () => {
  let service: GsapService;
  let target: ElementRef;
  let vars: gsap.TweenVars;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GsapService],
    });
    service = TestBed.inject(GsapService);
    target = new ElementRef(document.createElement('div'));
    vars = { duration: 1, x: 100 };
  });

  it('should have getStatus property', () => {
    expect(service.getStatus).toBeDefined();
  });

  it('should have to method', () => {
    const tween = service.to(target.nativeElement, vars);
    expect(tween).toBeInstanceOf(gsap.core.Tween);
  });

  it('should have from method', () => {
    const tween = service.from(target.nativeElement, vars);
    expect(tween).toBeInstanceOf(gsap.core.Tween);
  });

  it('should have fromTo method', () => {
    const tween = service.fromTo(target.nativeElement, vars, vars);
    expect(tween).toBeInstanceOf(gsap.core.Tween);
  });

  it('should provide gsap', () => {
    const providers = provideGsap({}, {});
    expect(providers).toBeDefined();
  });
});
