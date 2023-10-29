import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { filter, first, Observable, tap } from 'rxjs';
import { DecksActions } from '../state/decks/decks.actions';
import { isDeckCreated, isDeckRemoved, selectDecks } from '../state/decks/decks.selectors';
import { ToastsService } from '../toasts/toasts.service';
import { Deck } from './deck.model';
import { createIsDeckNameTakenValidator } from './decks.validators';

@Component({
    selector: 'app-decks',
    templateUrl: 'decks.component.html',
    styleUrls: ['decks.component.scss'],
})
export class DecksComponent implements OnInit {
    form: FormGroup;
    wasValidated = false;
    errorMessage: string | null;
    decks$: Observable<Deck[]>;
    noDecks = false;

    constructor(
        private fb: FormBuilder,
        protected modalService: NgbModal,
        private store: Store,
        private router: Router,
        private toastsService: ToastsService,
    ) {
    };

    ngOnInit() {
        // Selector is an observable, will automatically update on changes/reload
        this.decks$ = this.store.select(selectDecks).pipe(tap(decks => this.noDecks = !decks || decks?.length < 1));
        // Create the form group
        this.form = this.fb.group({
            name: [null, [
                Validators.required,
                Validators.maxLength(40),
            ], [
                createIsDeckNameTakenValidator(this.store, ''),
            ]],
        });
    }

    onClickSave() {
        // Set wasvalidatod to true is used for the bootstrap form functionality
        this.wasValidated = true;

        // Break off early when form is invalid
        if (this.form.invalid) {
            return;
        }
        const name = this.form.value.name;
        // Trigger createDeck action
        this.store.dispatch(DecksActions.createDeck({ name }));
        // Subscribe to results of the action
        this.store.select(isDeckCreated).pipe(
            filter((isCreated => isCreated)),
            first(),
        ).subscribe(() => {
            this.modalService.dismissAll();
            this.form.reset();
            this.wasValidated = false;
            this.toastsService.addToastMessage('Deck successfully created');
        });
    }

    onClickDelete(content: any, id: string) {
        // Opens the modal, and wait for the close result CONFIRM to continue
        this.modalService.open(content, { ariaLabelledBy: 'delete-deck-modal' }).result.then(
            result => {
                // If modal is closed with CONFIRM it will start the action
                if (result === 'CONFIRM') {
                    // Trigger remove deck action
                    this.store.dispatch(DecksActions.removeDeck({ id }));
                    // Subscribe to result
                    this.store.select(isDeckRemoved).pipe(
                        filter(isRemoved => isRemoved),
                        first(),
                    ).subscribe(() => {
                        this.toastsService.addToastMessage('Deck successfully removed');
                    });
                }
            },
        );
    }

    onClickEdit(id: string) {
        this.router.navigate(['decks', id]);
    }

    onClickStudy(id: string) {
        this.router.navigate(['decks', 'study', id]);
    }
}
