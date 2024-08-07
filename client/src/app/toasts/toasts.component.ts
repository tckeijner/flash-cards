import { Component, OnInit } from '@angular/core';
import { ToastsService } from './toasts.service';

/**
 * Toasts component is a general component that is visible anywhere in the application, showing popup messages.
 */
@Component({
    selector: 'app-toasts',
    template: `
        @for (toast of toasts; track toast; let i = $index) {
          <ngb-toast class="m-2 position-fixed top-0 end-0"
            [autohide]="true" [delay]="5000"
            (hidden)="toasts.splice(i, 1)">{{toast}}
          </ngb-toast>
        }
        `,
})
export class ToastsComponent implements OnInit {
    toasts: string[] = [];

    constructor(private toastsService: ToastsService) {
    }

    ngOnInit() {
        this.toasts = this.toastsService.toasts;
    }
}
