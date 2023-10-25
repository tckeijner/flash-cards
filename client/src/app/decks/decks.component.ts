import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DecksService } from "./decks.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { createIsDeckNameTakenValidator } from "./decks.validators";
import { filter, Observable } from "rxjs";
import { Deck } from "./deck.model";
import { Store } from "@ngrx/store";
import { isDeckCreated, selectDecks } from "../state/decks/decks.selectors";
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
        private decksService: DecksService,
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
        // this.decksService.createDeck(this.form.value).subscribe(res => {
        //     this.modalService.dismissAll(res);
        //     this.form.reset();
        //     this.wasValidated = false;
        //     this.toastsService.addToastMessage(res);
        // });
        const name = this.form.value.name;
        this.store.dispatch(DecksActions.createDeck({ name }));
        this.store.select(isDeckCreated).pipe(filter((isCreated => isCreated))).subscribe(() => {
            this.modalService.dismissAll();
            this.form.reset();
            this.wasValidated = false;
            this.toastsService.addToastMessage('Deck created');
        });
    }

    onClickDelete(content: any, id: string) {
        this.modalService.open(content, { ariaLabelledBy: 'delete-deck-modal' }).result.then(
            result => {
                if (result === 'CONFIRM') {
                    this.store.dispatch(DecksActions.removeDeck({ id }));
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
