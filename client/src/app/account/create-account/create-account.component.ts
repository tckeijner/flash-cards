import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AccountService} from "../account.service";

@Component({
    selector: 'app-create-account',
    template: `
        <div>
            <form [formGroup]="createAccountForm" (ngSubmit)="submitForm()">
                <label for="username">Username</label>
                <input type="text" id="username" formControlName="username" required>
                <label for="password">Password</label>
                <input type="password" id="password" formControlName="password" required>
                <button type="submit">Submit</button>
            </form>
        </div>
    `,
    styles: [
    ]
})
export class CreateAccountComponent {
    createAccountForm: FormGroup;

    constructor(
        private accountService: AccountService
    ) {
        this.createAccountForm = new FormGroup<any>({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
        })
    }

    submitForm() {
        this.accountService.createUser(this.createAccountForm.value).subscribe(result => {
            console.log(result);
        });
    }
}
