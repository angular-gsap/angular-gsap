import { TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GsapService } from './gsap.service';

describe('GsapService', () => {
  let service: GsapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GsapService],
    });
    service = TestBed.inject(GsapService);
  });

  it('should create a tween using the to() method', () => {
    const target = new ElementRef(document.createElement('div'));
    const tween = service.to(target, { duration: 1, x: 100 });
    expect(tween).toBeDefined();
  });

  it('should create a tween using the from() method', () => {
    const target = new ElementRef(document.createElement('div'));
    const tween = service.from(target, { duration: 1, x: 100 });
    expect(tween).toBeDefined();
  });

  it('should create a tween using the fromTo() method', () => {
    const target = new ElementRef(document.createElement('div'));
    const tween = service.fromTo(
      target,
      { duration: 1, x: 0 },
      { duration: 1, x: 100 }
    );
    expect(tween).toBeDefined();
  });
});
