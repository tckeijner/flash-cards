import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { importDeckValidator } from './import-deck.validator';
import { DecksActions } from '../../state/decks/decks.actions';
import { isDeckCreated } from '../../state/decks/decks.selectors';
import { filter, first } from 'rxjs';
import { Deck } from '../deck.model';
import { BaseModal } from '../../modal/base-modal';

@Component({
    selector: 'app-import-deck',
    imports: [
        ReactiveFormsModule,
        NgClass
    ],
    templateUrl: 'import-deck.component.html'
})
export class ImportDeckComponent extends BaseModal implements OnInit {
    ngOnInit() {
        this.form = this.fb.group({
            importText: [null, [Validators.required, importDeckValidator]]
        });
    }

    override onClickSave() {
        if (!this.validateForm()) {
            return;
        }
        // get the deck as json value from the input text
        const { importText } = this.form.value;
        const deck = JSON.parse(importText) as Partial<Deck>;

        this.store.dispatch(DecksActions.createDeck({ deck }));
        this.store.select(isDeckCreated).pipe(
            filter(isCreated => isCreated),
            first()
        ).subscribe(() => {
            this.activeModal.close('OK');
        });
    }
}
