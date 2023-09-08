import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-login></app-login>
    <app-create-account></app-create-account>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'client';
}
