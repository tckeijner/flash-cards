import { Component, OnInit } from '@angular/core';
import { ToastsService } from "./toasts.service";

/**
 * Toasts component is a general component that is visible anywhere in the application, showing popup messages.
 */
@Component({
    selector: 'app-toasts',
    template: `
        <ngb-toast class="m-2 position-fixed top-0 end-0"
                   *ngFor="let toast of toasts; let i = index"
                   [autohide]="true" [delay]="5000"
                   (hidden)="toasts.splice(i, 1)">{{toast}}
        </ngb-toast>
    `
})
export class ToastsComponent implements OnInit {
    constructor(private toastsService: ToastsService) {}

    toasts: string[] = [];

    ngOnInit() {
        this.toasts = this.toastsService.toasts;
    }
}
