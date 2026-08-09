import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the brand and example navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain(
      'angular-gsap'
    );
    const links = Array.from(compiled.querySelectorAll('nav a')).map((a) =>
      a.textContent?.trim()
    );
    expect(links).toContain('Basics');
    expect(links).toContain('ScrollTrigger');
  });
});
