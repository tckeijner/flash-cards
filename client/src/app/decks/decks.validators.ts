import { DecksService } from "./decks.service";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { map } from "rxjs";

export const createIsDeckNameTakenValidator = (decksService: DecksService): AsyncValidatorFn => (control: AbstractControl) => {
    return decksService.isDecknameAvailable(control.value).pipe(
        map(result => !result ? { deckNameTaken: true } : null)
    )
}
