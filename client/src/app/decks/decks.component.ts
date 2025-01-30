import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { selectDecks } from '../state/decks/decks.selectors';
import { ToastsService } from '../toasts/toasts.service';
import { Deck } from './deck.model';
import { ImportDeckComponent } from './import-deck/import-deck.component';
import { CreateDeckComponent } from './create-deck/create-deck.component';
import { DeleteDeckComponent } from './delete-deck/delete-deck.component';

@Component({
    selector: 'app-decks',
    templateUrl: 'decks.component.html',
    styleUrls: ['decks.component.scss'],
})
export class DecksComponent implements OnInit {
    errorMessage: string | null;
    decks$: Observable<Deck[]>;
    noDecks = false;

    constructor(
        protected modalService: NgbModal,
        private store: Store,
        private router: Router,
        private toastsService: ToastsService,
    ) {
    };

    ngOnInit() {
        this.decks$ = this.store.select(selectDecks).pipe(tap(decks => this.noDecks = !decks || decks?.length < 1));
    }

    onClickDelete(id: string) {
        const modalRef = this.modalService.open(DeleteDeckComponent);
        modalRef.componentInstance.id = id;
        this.handleModalResult(modalRef, 'Deck successfully removed');
    }

    onClickCreate() {
        this.handleModalResult(this.modalService.open(CreateDeckComponent), 'Deck successfully created');
    }

    onClickImport() {
        this.handleModalResult(this.modalService.open(ImportDeckComponent), 'Deck successfully imported');
    }

    onClickEdit(id: string) {
        this.router.navigate(['decks', id]);
    }

    onClickStudy(id: string) {
        this.router.navigate(['decks', 'study', id]);
    }

    private handleModalResult(modalRef: NgbModalRef, message: string) {
        modalRef.result.then(
            result => {
                if (result === 'OK') {
                    this.toastsService.addToastMessage(message);
                }
            }
        );
    }
}
