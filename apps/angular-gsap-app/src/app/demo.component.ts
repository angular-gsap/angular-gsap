import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsapAnimateToDirective } from '@angular-gsap/core';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule, GsapAnimateToDirective],
  template: `<nav class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div class="relative flex h-16 items-center justify-between">
          <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button-->
            <button
              type="button"
              class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span class="absolute -inset-0.5"></span>
              <span class="sr-only">Open main menu</span>
              <!--
            Icon when menu is closed.

            Menu open: "hidden", Menu closed: "block"
          -->
              <svg
                class="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <!--
            Icon when menu is open.

            Menu open: "block", Menu closed: "hidden"
          -->
              <svg
                class="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start"
          >
            <div class="flex flex-shrink-0 items-center">
              <img
                class="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
              />
            </div>
            <div class="hidden sm:ml-6 sm:block">
              <div class="flex space-x-4">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <a
                  href="#"
                  [ngClass]="{
                    'bg-gray-900 text-white': showDemo() === 'to',
                    'text-gray-300 hover:bg-gray-700 hover:text-white':
                      showDemo() !== 'to'
                  }"
                  class="rounded-md px-3 py-2 text-sm font-medium"
                  aria-current="page"
                  (click)="showDemo.set('to')"
                  >To</a
                >
                <a
                  href="#"
                  [ngClass]="{
                    'bg-gray-900 text-white': showDemo() === 'from',
                    'text-gray-300 hover:bg-gray-700 hover:text-white':
                      showDemo() !== 'from'
                  }"
                  class="rounded-md px-3 py-2 text-sm font-medium"
                  (click)="showDemo.set('from')"
                  >From</a
                >
                <a
                  href="#"
                  [ngClass]="{
                    'bg-gray-900 text-white': showDemo() === 'fromTo',
                    'text-gray-300 hover:bg-gray-700 hover:text-white':
                      showDemo() !== 'fromTo'
                  }"
                  class="rounded-md px-3 py-2 text-sm font-medium"
                  (click)="showDemo.set('fromTo')"
                  >FromTo</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile menu, show/hide based on menu state. -->
      <div class="sm:hidden" id="mobile-menu">
        <div class="space-y-1 px-2 pb-3 pt-2">
          <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
          <a
            href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >To</a
          >
          <a
            href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >From</a
          >
          <a
            href="#"
            class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
            >FromTo</a
          >
        </div>
      </div>
    </nav>
    <main
      class="flex flex-col items-center justify-center min-h-screen py-6 bg-gray-100"
    >
      <div *ngIf="showDemo() === 'to'">
        <p ngsapAnimateTo [animationConfig]="{ duration: 1, x: 100 }">
          To Demo
        </p>
      </div>
      <div *ngIf="showDemo() === 'from'"><p>From Demo</p></div>
      <div *ngIf="showDemo() === 'fromTo'"><p>FromTo Demo</p></div>
    </main>`,
  styles: [],
})
export class DemoComponent {
  showDemo = signal<'to' | 'from' | 'fromTo'>('to');
}
