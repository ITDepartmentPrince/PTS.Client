import { Component } from '@angular/core';

@Component({
  selector: 'app-print-layout',
  template: '<router-outlet></router-outlet>',
  styles: ['@media screen { :host { display: none; } }']
})
export class PrintLayoutComponent {
}
