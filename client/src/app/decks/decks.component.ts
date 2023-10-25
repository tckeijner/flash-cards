import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { createIsDeckNameTakenValidator } from "./decks.validators";
import { filter, first, Observable } from "rxjs";
import { Deck } from "./deck.model";
import { Store } from "@ngrx/store";
import { isDeckCreated, isDeckRemoved, selectDecks } from "../state/decks/decks.selectors";
import { DecksActions } from "../state/decks/decks.actions";
import { Router } from "@angular/router";
import { ToastsService } from "../toasts/toasts.service";

@Component({
    selector: 'app-decks',
    templateUrl: 'decks.component.html',
    styleUrls: ['decks.component.scss']
})
export class DecksComponent implements OnInit {
    form: FormGroup;
    wasValidated = false;
    errorMessage: string | null;
    decks$: Observable<Deck[]>;

    constructor(
        private fb: FormBuilder,
        protected modalService: NgbModal,
        private store: Store,
        private router: Router,
        private toastsService: ToastsService
    ) {
    };

    ngOnInit() {
        // Selector is an observable, will automatically update on changes/reload
        this.decks$ = this.store.select(selectDecks);
        this.form = this.fb.group({
            name: [null, [
                Validators.required,
                Validators.maxLength(40),
            ], [
                createIsDeckNameTakenValidator(this.store, '')
            ]]
        });
    }

    onClickSave() {
        this.wasValidated = true;
        if (this.form.invalid) { return; }
        const name = this.form.value.name;
        this.store.dispatch(DecksActions.createDeck({ name }));
        this.store.select(isDeckCreated).pipe(
            filter((isCreated => isCreated)),
            first()
        ).subscribe(() => {
            this.modalService.dismissAll();
            this.form.reset();
            this.wasValidated = false;
            this.toastsService.addToastMessage('Deck successfully created');
        });
    }

    onClickDelete(content: any, id: string) {
        this.modalService.open(content, { ariaLabelledBy: 'delete-deck-modal' }).result.then(
            result => {
                if (result === 'CONFIRM') {
                    this.store.dispatch(DecksActions.removeDeck({ id }));
                    this.store.select(isDeckRemoved).pipe(
                        filter(isRemoved => isRemoved),
                        first()
                    ).subscribe(() => {
                        this.toastsService.addToastMessage('Deck successfully removed')
                    })
                }
            }
        )
    }

    onClickEdit(id: string) {
        this.router.navigate(['decks', id]);
    }

    onClickStudy(id: string) {
        this.router.navigate(['decks', 'study', id]);
    }
}
