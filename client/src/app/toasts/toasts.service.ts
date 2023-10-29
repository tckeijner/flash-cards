import { Injectable } from '@angular/core';

/**
 * The ToastsService is accessible from anywhere in the application.
 * It interacts with the toastcomponent to show messages. They are independent from
 * which component is visible.
 */
@Injectable({
    providedIn: 'root',
})
export class ToastsService {
    toasts: string[] = [];

    addToastMessage(message: string) {
        this.toasts.push(message);
    }
}
