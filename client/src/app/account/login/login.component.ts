import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AccountActions } from "../../state/account/account.actions";
import { Router } from "@angular/router";
import { isLoggedIn, loginError } from "../../state/account/account.selectors";
import { filter, first } from "rxjs";
import { DecksActions } from "../../state/decks/decks.actions";

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styles: []
})
export class LoginComponent {
    form: FormGroup;
    wasValidated = false;
    errorMessage: null | string = null;
    loginSuccessfulMessage: null | string = null;

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private router: Router
    ) {
        // create a formgroup
        this.form = this.fb.group({
            username: [null],
            password: [null],
        });
    }

    submitForm() {
        this.wasValidated = true;
        // Cancel submission if the form is invalid
        if (this.form.invalid) { return; }

        this.store.dispatch(AccountActions.login(this.form.value));
        this.store.select(isLoggedIn).pipe(
            filter(isLoggedIn => isLoggedIn),
            first()
        ).subscribe(() => {
            this.store.dispatch(DecksActions.loadDecks());
            this.router.navigate(['decks']);
        });

        this.store.select(loginError).pipe(
            filter(error => !!error),
            first()
        ).subscribe(error => {
            this.errorMessage = error;
        })

    }
}
