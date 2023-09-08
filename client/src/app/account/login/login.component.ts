import { Component } from '@angular/core';
import { AccountService } from "../account.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AccountActions } from "../../state/account.actions";
import { AccountDataModel } from "../account.model";
import { Router } from "@angular/router";

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
        private accountService: AccountService,
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

        this.accountService.login(this.form.value).subscribe({
            next: ((accountData) => {
                // Load account data (username, token) into the store.
                this.store.dispatch(AccountActions.loadAccountData(accountData))
                // navigate to the Collections page after login
                this.router.navigate(['collections']);
            }),
            error: (error) => {
                this.errorMessage = error.error;
            }
        })
    }
}
