import { Component, PLATFORM_ID, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { injectGsap } from './inject-gsap';

@Component({
  template: '<div class="box"></div>',
})
class Host {
  runs = 0;
  x = signal(10);
  ref = injectGsap(({ gsap }) => {
    this.runs++;
    gsap.set('.box', { x: this.x() });
  });
}

@Component({
  template: '<div class="box"></div>',
})
class NonReactiveHost {
  runs = 0;
  x = signal(10);
  ref = injectGsap(
    ({ gsap }) => {
      this.runs++;
      gsap.set('.box', { x: this.x() });
    },
    { reactive: false }
  );
}

@Component({
  template: '<div class="box"></div>',
})
class NoCallbackHost {
  ref = injectGsap();
}

async function settle(fixture: ComponentFixture<unknown>) {
  await fixture.whenStable();
}

function boxOf(fixture: ComponentFixture<unknown>): HTMLElement {
  const el = (fixture.nativeElement as HTMLElement).querySelector('.box');
  if (!el) throw new Error('.box not found');
  return el as HTMLElement;
}

describe('injectGsap', () => {
  it('runs the callback once after the first render', async () => {
    const fixture = TestBed.createComponent(Host);
    expect(fixture.componentInstance.runs).toBe(0);
    expect(fixture.componentInstance.ref.ready()).toBe(false);

    await settle(fixture);

    expect(fixture.componentInstance.runs).toBe(1);
    expect(fixture.componentInstance.ref.ready()).toBe(true);
    expect(fixture.componentInstance.ref.context).toBeDefined();
    expect(boxOf(fixture).style.transform).toContain('10px');
  });

  it('scopes selector text to the host element', async () => {
    const outside = document.createElement('div');
    outside.className = 'box';
    document.body.appendChild(outside);
    try {
      const fixture = TestBed.createComponent(Host);
      await settle(fixture);

      expect(boxOf(fixture).style.transform).toContain('10px');
      expect(outside.style.transform).toBe('');
    } finally {
      outside.remove();
    }
  });

  it('re-runs the callback with revert when a read signal changes', async () => {
    const fixture = TestBed.createComponent(Host);
    await settle(fixture);
    expect(fixture.componentInstance.runs).toBe(1);

    fixture.componentInstance.x.set(50);
    await settle(fixture);

    expect(fixture.componentInstance.runs).toBe(2);
    expect(boxOf(fixture).style.transform).toContain('50px');
  });

  it('does not track signals when reactive is false', async () => {
    const fixture = TestBed.createComponent(NonReactiveHost);
    await settle(fixture);
    expect(fixture.componentInstance.runs).toBe(1);

    fixture.componentInstance.x.set(50);
    await settle(fixture);

    expect(fixture.componentInstance.runs).toBe(1);
    expect(boxOf(fixture).style.transform).toContain('10px');
  });

  it('reverts the context when the component is destroyed', async () => {
    const fixture = TestBed.createComponent(Host);
    await settle(fixture);
    const box = boxOf(fixture);
    expect(box.style.transform).toContain('10px');

    fixture.destroy();

    expect(box.style.transform).toBe('');
  });

  it('records contextSafe animations in the context for cleanup', async () => {
    const fixture = TestBed.createComponent(NoCallbackHost);
    await settle(fixture);
    const box = boxOf(fixture);

    const handler = fixture.componentInstance.ref.contextSafe(() =>
      gsap.set('.box', { x: 99 })
    );
    handler();
    expect(box.style.transform).toContain('99px');

    fixture.componentInstance.ref.revert();
    expect(box.style.transform).toBe('');
  });

  it('exposes the gsap instance', () => {
    const fixture = TestBed.createComponent(NoCallbackHost);
    expect(fixture.componentInstance.ref.gsap).toBe(gsap);
  });

  describe('on the server', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
    });

    it('never runs the callback and stays inert', async () => {
      const fixture = TestBed.createComponent(Host);
      await settle(fixture);

      expect(fixture.componentInstance.runs).toBe(0);
      expect(fixture.componentInstance.ref.ready()).toBe(false);
      expect(fixture.componentInstance.ref.context).toBeUndefined();
      expect(boxOf(fixture).style.transform).toBe('');
    });

    it('contextSafe passes functions through unchanged', () => {
      const fixture = TestBed.createComponent(NoCallbackHost);
      const fn = () => 42;
      expect(fixture.componentInstance.ref.contextSafe(fn)).toBe(fn);
    });
  });
});

describe('injectGsap cleanup functions', () => {
  @Component({ template: '<div class="box"></div>' })
  class CleanupHost {
    cleanups = 0;
    tick = signal(0);
    ref = injectGsap(() => {
      this.tick();
      return () => this.cleanups++;
    });
  }

  it('runs a returned cleanup on re-run and on destroy', async () => {
    const fixture = TestBed.createComponent(CleanupHost);
    await settle(fixture);
    expect(fixture.componentInstance.cleanups).toBe(0);

    fixture.componentInstance.tick.set(1);
    await settle(fixture);
    expect(fixture.componentInstance.cleanups).toBe(1); // reverted previous cycle

    fixture.destroy();
    expect(fixture.componentInstance.cleanups).toBe(2);
  });
});
