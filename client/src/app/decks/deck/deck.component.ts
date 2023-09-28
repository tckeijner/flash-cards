import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Card, Deck } from "../deck.model";
import { Store } from "@ngrx/store";
import { selectDeckById } from "../../state/decks/decks.selectors";
import { Observable } from "rxjs";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DecksService } from "../decks.service";
import { DecksActions } from "../../state/decks/decks.actions";

@Component({
    selector: 'app-cards',
    templateUrl: 'deck.component.html'
})
export class DeckComponent implements OnInit {
    deck$: Observable<Deck | undefined>;
    deck?: Deck;
    form: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private store: Store,
        private fb: FormBuilder,
    ) {}


    ngOnInit() {
        const deckId = this.route.snapshot.paramMap.get('id');
        if (deckId) {
            this.deck$ = this.store.select(selectDeckById(deckId))
            this.store.select(selectDeckById(deckId)).subscribe(deck => {
                this.deck = deck;
                this.initForm();
            })
        }
    }

    private initForm() {
        this.form = this.fb.group({
            name: [this.deck?.name, [
                Validators.required
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

    addCard(card?: Card) {
        const cardForm = this.fb.group({
            front: [card?.front ?? null, [Validators.required]],
            back: [card?.back ?? null, [Validators.required]]
        })
        this.cards.push(cardForm);
    }

    onClickSave() {
        const deck = { ...this.deck, ...this.form.value } as Deck;
        this.store.dispatch(DecksActions.updateDeck({ deck }));
    }

    deleteCard(index: number) {
        this.cards.removeAt(index);
    }

    protected readonly FormGroup = FormGroup;
}
