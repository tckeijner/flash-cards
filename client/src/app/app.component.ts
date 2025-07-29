import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    template: `
        <router-outlet></router-outlet>
        <app-toasts></app-toasts>
    `,
    styles: [],
    standalone: false
})
export class AppComponent {
}
