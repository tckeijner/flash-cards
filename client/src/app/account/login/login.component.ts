import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, first } from 'rxjs';

import { AccountActions } from '../../state/account/account.actions';
import { isLoggedIn, loginError } from '../../state/account/account.selectors';
import { DecksActions } from '../../state/decks/decks.actions';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styles: [],
})
export class LoginComponent {
    form: FormGroup;
    errorMessage: null | string = null;
    loginSuccessfulMessage: null | string = null;

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private router: Router,
    ) {
        // create a formgroup
        this.form = this.fb.group({
            username: [null, [Validators.required]],
            password: [null, [Validators.required]],
        });
    }

    submitForm() {
        // Cancel submission if the form is invalid
        if (this.form.invalid) {
            return;
        }

        // Dispatch the login action...
        this.store.dispatch(AccountActions.login(this.form.value));
        // ...then subscribe to the result
        this.store.select(isLoggedIn).pipe(
            filter(isLoggedIn => isLoggedIn),
            first(),
        ).subscribe(() => {
            // When login is successful, start loading the decks...
            this.store.dispatch(DecksActions.loadDecks());
            // ...and navigate to the decks page
            this.router.navigate(['decks']);
        });

        // also subscribe to login errors, which will be displayed on the page.
        this.store.select(loginError).pipe(
            filter(error => !!error),
            first(),
        ).subscribe(error => {
            this.errorMessage = error;
        });

    }
}
