import { Component, computed, input, signal } from '@angular/core';
import { CodeSnippet } from './code-snippet';

export interface CodeFile {
  label: string;
  code: string;
  lang?: string;
}

/** Tabbed file viewer: one container, one tab per file. */
@Component({
  selector: 'app-code-tabs',
  imports: [CodeSnippet],
  template: `
    <div class="tabs" role="tablist">
      @for (file of files(); track file.label; let i = $index) {
        <button
          type="button"
          role="tab"
          [id]="'tab-' + file.label"
          [attr.aria-selected]="i === index()"
          [attr.tabindex]="i === index() ? 0 : -1"
          [class.on]="i === index()"
          (click)="active.set(i)"
          (keydown.arrowright)="step(1)"
          (keydown.arrowleft)="step(-1)"
        >
          {{ file.label }}
        </button>
      }
    </div>
    <div role="tabpanel" [attr.aria-labelledby]="'tab-' + current().label">
      <app-code [code]="current().code" [lang]="current().lang ?? 'ts'" />
    </div>
  `,
  styles: `
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;

      button {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        border: 2px solid var(--ink);
        border-bottom: none;
        border-radius: 8px 8px 0 0;
        background: var(--paper);
        color: var(--ink-soft);
        padding: 0.25rem 0.7rem;
        cursor: pointer;

        &.on {
          background: var(--ink);
          color: var(--paper);
        }
      }
    }

    [role='tabpanel'] ::ng-deep .snippet pre {
      border-radius: 0 10px 10px 10px;
    }
  `,
})
export class CodeTabs {
  readonly files = input.required<CodeFile[]>();

  protected readonly active = signal(0);
  protected readonly index = computed(() =>
    Math.min(this.active(), this.files().length - 1)
  );
  protected readonly current = computed(() => this.files()[this.index()]);

  protected step(delta: number): void {
    const count = this.files().length;
    this.active.set((this.index() + delta + count) % count);
  }
}
