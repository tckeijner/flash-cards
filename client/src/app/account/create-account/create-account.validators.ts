import { AbstractControl, AsyncValidatorFn, ValidatorFn } from "@angular/forms";
import { map } from "rxjs";

import { AccountService } from "../account.service";

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl) => {
    if (control.value && control.value !== control.parent?.value['password']) {
        return { passwordNotEqual: true };
    }
    return null;
}

/**
 * Factory function for a validator that asynchronously checks the availability of a username.
 * If it already exists, it will return a validation error.
 * @param accountService
 */
export const createIsUsernameTakenValidator = (accountService: AccountService): AsyncValidatorFn => (control: AbstractControl) => {
    return accountService.isUsernameAvailable(control.value).pipe(
        map(result => !result ? { usernameTaken: true } : null)
    );
}
