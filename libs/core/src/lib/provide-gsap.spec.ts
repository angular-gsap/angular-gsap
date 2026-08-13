import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { gsap } from 'gsap';
import { provideGsap } from './provide-gsap';

const fakePlugin = { name: 'fake', init: () => void 0 };

describe('provideGsap', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('registers plugins and applies config and defaults in the browser', () => {
    const registerPlugin = vi
      .spyOn(gsap, 'registerPlugin')
      .mockImplementation(() => void 0);
    const config = vi.spyOn(gsap, 'config');
    const defaults = vi.spyOn(gsap, 'defaults');

    TestBed.configureTestingModule({
      providers: [
        provideGsap({
          plugins: [fakePlugin],
          config: { nullTargetWarn: false },
          defaults: { duration: 2 },
        }),
      ],
    });
    TestBed.inject(PLATFORM_ID); // force environment initialization

    expect(registerPlugin).toHaveBeenCalledWith(fakePlugin);
    expect(config).toHaveBeenCalledWith({ nullTargetWarn: false });
    expect(defaults).toHaveBeenCalledWith({ duration: 2 });
  });

  it('does nothing on the server', () => {
    const registerPlugin = vi
      .spyOn(gsap, 'registerPlugin')
      .mockImplementation(() => void 0);

    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'server' },
        provideGsap({ plugins: [fakePlugin] }),
      ],
    });
    TestBed.inject(PLATFORM_ID);

    expect(registerPlugin).not.toHaveBeenCalled();
  });

  it('is optional configuration: an empty call provides without side effects', () => {
    const registerPlugin = vi
      .spyOn(gsap, 'registerPlugin')
      .mockImplementation(() => void 0);
    const config = vi.spyOn(gsap, 'config');

    TestBed.configureTestingModule({ providers: [provideGsap()] });
    TestBed.inject(PLATFORM_ID);

    expect(registerPlugin).not.toHaveBeenCalled();
    expect(config).not.toHaveBeenCalled();
  });
});
