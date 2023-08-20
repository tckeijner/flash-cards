import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AccountService, AccountServiceErrors } from "../account.service";

@Component({
    selector: 'app-create-account',
    templateUrl: 'create-account.component.html',
    styles: []
})
export class CreateAccountComponent {
    createAccountForm: FormGroup;
    showUsernameTaken = false;
    accountCreatedMessage: null | string = null;

    constructor(
        private accountService: AccountService
    ) {
        this.createAccountForm = new FormGroup({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        });
    }

    submitForm() {
        this.accountService.createUser(this.createAccountForm.value).subscribe({
            next: (() => {
                this.accountCreatedMessage = `Account created with username ${this.createAccountForm.value.username}`
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
