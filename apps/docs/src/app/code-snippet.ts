import { Component, inject, input, resource } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Shiki-highlighted source snippet with an optional filename-style caption.
 * Analog's content pipeline renders markdown at build time for `.md` content
 * files only, so inline snippets call Shiki directly (lazily, code-split).
 */
@Component({
  selector: 'app-code',
  template: `
    <figure class="snippet-panel">
      @if (label()) {
        <figcaption>{{ label() }}</figcaption>
      }
      <div class="snippet" [innerHTML]="html.value() ?? ''"></div>
    </figure>
  `,
})
export class CodeSnippet {
  readonly code = input.required<string>();
  readonly lang = input('ts');
  readonly label = input('');

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly html = resource({
    params: () => ({ code: this.code(), lang: this.lang() }),
    loader: async ({ params }): Promise<SafeHtml> => {
      const { codeToHtml } = await import('shiki');
      const rendered = await codeToHtml(params.code, {
        lang: params.lang,
        theme: 'github-dark',
      });
      return this.sanitizer.bypassSecurityTrustHtml(rendered);
    },
  });
}
