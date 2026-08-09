import { Component, inject, input, resource } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Shiki-highlighted source snippet. Analog's content pipeline renders
 * markdown at build time for `.md` content files only, so inline snippets
 * in interactive pages call Shiki directly (lazily, code-split).
 */
@Component({
  selector: 'app-code',
  template: `<div class="snippet" [innerHTML]="html.value() ?? ''"></div>`,
})
export class CodeSnippet {
  readonly code = input.required<string>();
  readonly lang = input('ts');

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
