import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { AccountActions } from '../../state/account/account.actions';
import { AccountState } from '../../state/account/account.reducer';

import { selectAccount } from '../../state/account/account.selectors';
import { AccountService } from '../account.service';
import { confirmPasswordValidator, createIsUsernameTakenValidator } from '../account.validators';

@Component({
    selector: 'app-manage-account',
    templateUrl: 'manage-account.component.html',
    standalone: false
})
export class ManageAccountComponent implements OnInit {
    account$: Observable<AccountState>;
    usernameForm: FormGroup;
    passwordForm: FormGroup;
    wasValidated: boolean;
    disableSave = true;

    constructor(
        private store: Store,
        private fb: FormBuilder,
        protected modalService: NgbModal,
        private accountService: AccountService) {
    }

    ngOnInit() {
        // Subscribe to the account info from the store:
        this.account$ = this.store.select(selectAccount).pipe(
            tap(account => {
                // Create a form with default value:
                this.usernameForm = this.fb.group({
                    username: [account.username, [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(20),
                    ], [
                        createIsUsernameTakenValidator(this.accountService, account.username),
                    ]],
                });

                // Password has no default value, since it shouldn't be stored locally
                this.passwordForm = this.fb.group({
                    password: [null, [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(20),
                    ]],
                    passwordConfirm: [null, [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(20),
                        confirmPasswordValidator,
                    ]],
                });

                // Disables the save button if the value in the username field == original name
                this.usernameForm.valueChanges.subscribe(value =>
                    this.disableSave = value.username === account.username,
                );
            }),
        );
    };

    saveForm(form: FormGroup) {
        this.wasValidated = true;
        // Break early when the form is invalid:
        if (form.invalid) {
            return;
        }

        // Dispatch update user action:
        this.store.dispatch(AccountActions.updateUser(form.value));
        // TODO subscribe to result
        this.modalService.dismissAll();
        this.wasValidated = false;
    }
}
