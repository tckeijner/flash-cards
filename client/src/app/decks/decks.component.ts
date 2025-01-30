import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { selectDecks } from '../state/decks/decks.selectors';
import { ToastsService } from '../toasts/toasts.service';
import { Deck } from './deck.model';
import { createIsDeckNameTakenValidator } from './decks.validators';
import { ImportDeckComponent } from './import-deck/import-deck.component';
import { CreateDeckComponent } from './create-deck/create-deck.component';
import { DeleteDeckComponent } from './delete-deck/delete-deck.component';

@Component({
    selector: 'app-decks',
    templateUrl: 'decks.component.html',
    styleUrls: ['decks.component.scss'],
})
export class DecksComponent implements OnInit {
    form: FormGroup;
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

    onClickDelete(id: string) {
        const modalRef = this.modalService.open(DeleteDeckComponent);
        modalRef.componentInstance.id = id;
        modalRef.result.then(
            result => {
                if (result === 'OK') {
                    this.toastsService.addToastMessage('Deck successfully removed');
                }
            },
        );
    }

    onClickCreate() {
        this.modalService.open(CreateDeckComponent).result.then(
            result => {
                if (result === 'OK') {
                    this.toastsService.addToastMessage('Deck successfully created');
                }
            }
        );
    }

    onClickImport() {
        this.modalService.open(ImportDeckComponent).result.then(
            result => {
                if (result === 'OK') {
                    this.toastsService.addToastMessage('Deck successfully imported');
                }
            }
        );
    }

    onClickEdit(id: string) {
        this.router.navigate(['decks', id]);
    }

    onClickStudy(id: string) {
        this.router.navigate(['decks', 'study', id]);
    }
}
