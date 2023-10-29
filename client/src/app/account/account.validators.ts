import { AbstractControl, AsyncValidatorFn, ValidatorFn } from '@angular/forms';
import { map, of } from 'rxjs';

import { AccountService } from './account.service';

/**
 * Checks if the value in Confirm password is equal the to password field.
 * @param control
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl) => {
    if (control.value && control.value !== control.parent?.value['password']) {
        return { passwordNotEqual: true };
    }
    return null;
};

/**
 * Factory function for a validator that asynchronously checks the availability of a username.
 * If it already exists, it will return a validation error.
 * If a current username is given, it will not trigger, since this is the users own username
 * @param accountService
 * @param currentUsername
 */
export const createIsUsernameTakenValidator = (accountService: AccountService, currentUsername?: string | null): AsyncValidatorFn => (control: AbstractControl) => {
    if (currentUsername && control.value === currentUsername) {
        return of(null);
    }
    return accountService.isUsernameAvailable(control.value).pipe(
        map(result => !result ? { usernameTaken: true } : null),
    );
};
