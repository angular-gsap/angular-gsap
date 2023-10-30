import { Component } from '@angular/core';
import { DemoComponent } from './demo.component';

@Component({
  standalone: true,
  imports: [DemoComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Angular GSAP Demo';
}
