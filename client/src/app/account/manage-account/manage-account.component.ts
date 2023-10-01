import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { selectAccount } from "../../state/account/account.selectors";
import { Observable, tap } from "rxjs";
import { AccountState } from "../../state/account/account.reducer";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AccountActions } from "../../state/account/account.actions";
import { confirmPasswordValidator, createIsUsernameTakenValidator } from "../account.validators";
import { AccountService } from "../account.service";

@Component({
    selector: 'app-manage-account',
    templateUrl: 'manage-account.component.html',
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
        this.account$ = this.store.select(selectAccount).pipe(
            tap(account => {
                this.usernameForm = this.fb.group({
                    username: [account.username, [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(20)
                    ], [
                        createIsUsernameTakenValidator(this.accountService, account.username)
                    ]]
                });

                this.passwordForm = this.fb.group({
                    password: [null, [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(20)
                    ]],
                    passwordConfirm: [null, [
                        Validators.required,
                        Validators.minLength(6),
                        Validators.maxLength(20),
                        confirmPasswordValidator
                    ]]
                });

                // Disables the save button if the value in the username field == original name
                this.usernameForm.valueChanges.subscribe(value =>
                    this.disableSave = value.username === account.username
                )
            })
        );
    };

    saveForm(form: FormGroup) {
        this.wasValidated = true;
        if (form.invalid) { return; }
        this.store.dispatch(AccountActions.updateUser(form.value));
        this.modalService.dismissAll();
        this.wasValidated = false;
    }
}
