import { AbstractControl, ValidatorFn } from "@angular/forms";

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl) => {
    if (control.value.password !== control.value.passwordConfirm) {
        return { passwordNotEqual: true };
    }
    return null;
}
