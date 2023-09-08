import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AccountService } from "../account.service";
import { confirmPasswordValidator, createIsUsernameTakenValidator } from "./create-account.validators";

@Component({
    selector: 'app-create-account',
    templateUrl: 'create-account.component.html',
})
export class CreateAccountComponent {
    form: FormGroup;
    showUsernameTaken = false;
    accountCreatedMessage: null | string = null;
    wasValidated = false;
    errorMessage: null | string = null;

    constructor(
        private accountService: AccountService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            username: [null, [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20)
            ], [
                createIsUsernameTakenValidator(this.accountService)
            ]],
            password: [null, [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20)
            ]],
            passwordConfirm: [null, [
                Validators.required,
                confirmPasswordValidator
            ]]
        });
    }

    submitForm() {
        this.wasValidated = true;
        if (this.form.invalid) { return; }

        this.accountService.createUser(this.form.value).subscribe({
            next: (() => {
                this.accountCreatedMessage = `Account created with username ${this.form.value.username}`
                this.showUsernameTaken = false;
            }),
            error: (error: Error) => {
                this.errorMessage = error.message;
            }
        })
    }
}
