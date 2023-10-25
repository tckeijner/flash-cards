import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ToastsService {
    toasts: string[] = [];

    addToastMessage(message: string) {
        this.toasts.push(message);
    }
}
