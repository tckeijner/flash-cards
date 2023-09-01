import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AccountService, AccountServiceErrors } from "../account.service";
import { confirmPasswordValidator } from "./create-account.validators";

@Component({
    selector: 'app-create-account',
    templateUrl: 'create-account.component.html',
    styles: []
})
export class CreateAccountComponent {
    form: FormGroup;
    showUsernameTaken = false;
    accountCreatedMessage: null | string = null;
    wasValidated = false;

    constructor(
        private accountService: AccountService
    ) {
        this.form = new FormGroup({
            username: new FormControl(null, [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20)
            ]),
            password: new FormControl(null, [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(20)

            ]),
            passwordConfirm: new FormControl(null, [
                Validators.required
            ]),
        }, [confirmPasswordValidator]);
    }

    submitForm() {
        this.wasValidated = true;
        if (this.form.invalid) {
            return;
        }

        this.accountService.createUser(this.form.value).subscribe({
            next: (() => {
                this.accountCreatedMessage = `Account created with username ${this.form.value.username}`
                this.showUsernameTaken = false;
            }),
            error: (error: Error) => {
                if (error.message === AccountServiceErrors.UsernameTaken) {
                    this.showUsernameTaken = true
                }
            }
        })
    }
}
