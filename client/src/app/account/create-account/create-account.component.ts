import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AccountService } from '../account.service';
import { confirmPasswordValidator, createIsUsernameTakenValidator } from '../account.validators';

@Component({
    selector: 'app-create-account',
    templateUrl: 'create-account.component.html',
})
export class CreateAccountComponent {
    form: FormGroup;
    accountCreatedMessage: null | string = null;
    accountCreated = false;
    errorMessage: null | string = null;

    constructor(
        private accountService: AccountService,
        private fb: FormBuilder,
    ) {
        // Create a formgroup with the required validators
        this.form = this.fb.group({
            username: [null, [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
            ], [
                createIsUsernameTakenValidator(this.accountService),
            ]],
            password: [null, [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(20),
            ]],
            passwordConfirm: [null, [
                Validators.required,
                confirmPasswordValidator,
            ]],
        });
    }

    submitForm() {
        // Cancel submission if form is invalid
        if (this.form.invalid) {
            return;
        }
        // disable the form before sending the request
        this.form.disable();

        // When the form is valid, trigger a create user request.
        this.accountService.createUser(this.form.value).subscribe({
            // successful:
            next: (() => {
                this.accountCreatedMessage = `Account created with username ${this.form.value.username}`;
                this.accountCreated = true;
            }),
            // unsuccessful:
            error: (error: Error) => {
                this.errorMessage = error.message;
            },
        });
    }
}
