import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CodeSnippet } from './code-snippet';

@Component({
  imports: [CodeSnippet],
  template: `<app-code [code]="code" />`,
})
class SnippetHost {
  code = `const x = injectGsap(({ gsap }) => gsap.to('.a', {}));`;
}

describe('CodeSnippet', () => {
  it('renders source through shiki with token colors', async () => {
    const fixture = TestBed.createComponent(SnippetHost);
    fixture.detectChanges();
    await fixture.whenStable();

    await vi.waitFor(
      () => {
        fixture.detectChanges();
        const el = fixture.nativeElement as HTMLElement;
        if (!el.querySelector('pre.shiki')) {
          throw new Error('shiki output not rendered yet');
        }
      },
      { timeout: 10000 }
    );

    const el = fixture.nativeElement as HTMLElement;
    const spans = el.querySelectorAll('pre.shiki code span[style]');
    expect(spans.length).toBeGreaterThan(3); // token-level coloring, not plain text
    expect(el.textContent).toContain('injectGsap');
  });
});
