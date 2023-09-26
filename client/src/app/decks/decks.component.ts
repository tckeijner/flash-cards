import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DecksService } from "./decks.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { createIsDeckNameTakenValidator } from "./decks.validators";
import { Observable } from "rxjs";
import { Deck } from "./deck.model";
import { Store } from "@ngrx/store";
import { selectDecks } from "../state/decks/decks.selectors";
import { DecksActions } from "../state/decks/decks.actions";

@Component({
    selector: 'app-decks',
    templateUrl: 'decks.component.html',
    styleUrls: ['decks.component.scss']
})
export class DecksComponent implements OnInit {
    form: FormGroup;
    wasValidated = false;
    deckCreatedResult: string;
    deckDeletedResult: string;
    errorMessage: string;
    decks$: Observable<Deck[]>;

    constructor(
        private fb: FormBuilder,
        private decksService: DecksService,
        private modalService: NgbModal,
        private store: Store
    ) {
        this.form = this.fb.group({
            name: [null, [
                Validators.required,
            ], [
                createIsDeckNameTakenValidator(decksService)
            ]]
        });
    };

    ngOnInit() {
        // Dispatching loadDecks will start the action chain that retrieves decks from the API and stores it.
        this.store.dispatch(DecksActions.loadDecks());
        // Selector is an observable, will automatically update on changes/reload
        this.decks$ = this.store.select(selectDecks);
    }

    onClickAddDeck(content: any) {
        this.modalService.open(content, { ariaLabelledBy: 'add-deck-modal' }).result.then(
            result => {
                if (result === 'SAVE') {
                    this.wasValidated = true;
                    if (this.form.invalid) { return; }
                    this.decksService.createDeck(this.form.value).subscribe({
                        next: (res => {
                            this.modalService.dismissAll(res);
                            this.form.reset();
                            this.deckCreatedResult = res;
                        }),
                        error: (error: Error) => this.errorMessage = error.message
                    });
                }
            }
        )
    }

    onClickDelete(content: any, id: string) {
        this.modalService.open(content, { ariaLabelledBy: 'delete-deck-modal' }).result.then(
            result => {
                if (result === 'CONFIRM') {
                    this.decksService.deleteDeck(id).subscribe({
                        next: (res => this.deckDeletedResult = res),
                        error: (error: Error) => this.errorMessage = error.message
                    })
                }
            }
        )
    }
}
