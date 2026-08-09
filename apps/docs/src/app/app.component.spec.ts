import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the brand and example navigation', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain(
      'angular-gsap'
    );
    const links = Array.from(compiled.querySelectorAll('nav a')).map((a) =>
      a.textContent?.trim()
    );
    expect(links).toContain('Directives');
    expect(links).toContain('ScrollTrigger');
  });
});
