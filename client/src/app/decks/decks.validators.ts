import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { first, map } from "rxjs";
import { Store } from "@ngrx/store";
import { selectDecks } from "../state/decks/decks.selectors";

/**
 * Factory function for a validator that returns a validation error deckNameTaken when the deckname
 * is already present in the store.
 * @param store
 * @param originalName
 */
export const createIsDeckNameTakenValidator = (store: Store, originalName: string): AsyncValidatorFn => (control: AbstractControl) => {
    return store.select(selectDecks).pipe(
        first(),
        map(decks =>
            control.value !== originalName && decks.some(({ name }) => name === control.value)
                ? { deckNameTaken: true }
                : null
        )
    )
}
