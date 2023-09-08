import { Component } from '@angular/core';
import { AccountService } from "../account.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { AccountActions } from "../../state/account.actions";
import { AccountDataModel } from "../account.model";

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
        private store: Store
    ) {
        this.form = this.fb.group({
            username: [null],
            password: [null],
        });
    }

    submitForm() {
        this.wasValidated = true;
        if (this.form.invalid) { return; }

        this.accountService.login(this.form.value).subscribe({
            next: ((accountData) => {
                this.store.dispatch(AccountActions.loadAccountData(accountData))
                this.loginSuccessfulMessage = `User logged in`
            }),
            error: (error) => {
                this.errorMessage = error.error;
            }
        })
    }
}
