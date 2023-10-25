import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Card, Deck } from "../deck.model";
import { Store } from "@ngrx/store";
import { selectDeckById, selectDeckState } from "../../state/decks/decks.selectors";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DecksActions } from "../../state/decks/decks.actions";
import { filter, first } from "rxjs";
import { createIsDeckNameTakenValidator } from "../decks.validators";
import { ToastsService } from "../../toasts/toasts.service";

@Component({
    selector: 'app-edit-deck',
    templateUrl: 'edit-deck.component.html'
})
export class EditDeckComponent implements OnInit {
    deck?: Deck;
    form: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store,
        private fb: FormBuilder,
        private toastsService: ToastsService
    ) {}


    ngOnInit() {
        // Get the deckId from the url parameters
        const deckId = this.route.snapshot.paramMap.get('id');
        if (deckId) {
            // Use the deckId to get the correct deck from the store
            this.store.select(selectDeckById(deckId)).subscribe(deck => {
                this.deck = deck;
                this.initForm();
            })
        }
    }

    /**
     * Use the formbuilder to build the formGroup
     * @private
     */
    private initForm() {
        this.form = this.fb.group({
            name: [this.deck?.name, [
                Validators.required,
                Validators.maxLength(40)
            ], [
                createIsDeckNameTakenValidator(this.store, this.deck?.name || '')
            ]],
            cards: this.fb.array([])
        })

        if (this.deck?.cards) {
            for (let card of this.deck?.cards) {
                this.addCard(card);
            }
        }
    }

    get cards() {
        return this.form.get('cards') as FormArray;
    }

    /**
     * Adds a formControl for a card to the cards formArray.
     * Can be used for both existing and new cards.
     * @param card
     */
    addCard(card?: Card) {
        const cardForm = this.fb.group({
            front: [card?.front ?? null, [Validators.required]],
            back: [card?.back ?? null, [Validators.required]]
        })
        this.cards.push(cardForm);
    }

    /**
     * Updates the deck through the store, will also trigger a request to save
     * it in the database
     */
    onClickSave() {
        if (this.form.invalid) { return ; }
        this.form.disable();

        const deck = { ...this.deck, ...this.form.value } as Deck;
        this.store.dispatch(DecksActions.updateDeck({ deck }));
        this.store.select(selectDeckState).pipe(
            filter(state => state.loaded),
            first()
        ).subscribe(() => {
            this.toastsService.addToastMessage('Deck successfully saved');
            this.router.navigate(['decks']);
        });
    }

    /**
     * Go back to the decks page without saving
     */
    onClickCancel() {
        this.router.navigate(['decks']);
    }

    deleteCard(index: number) {
        this.cards.removeAt(index);
    }
}
