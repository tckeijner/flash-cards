import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseModal } from '../../modal/base-modal';
import { createIsDeckNameTakenValidator } from '../decks.validators';
import { DecksActions } from '../../state/decks/decks.actions';
import { isDeckCreated } from '../../state/decks/decks.selectors';
import { filter, first } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-create-deck',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgClass
    ],
    templateUrl: 'create-deck.component.html'
})
export class CreateDeckComponent extends BaseModal implements OnInit {
    ngOnInit() {
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
        if (!this.validateForm()) {
            return;
        }

        const deck = { name: this.form.value.name, cards: [] };
        // Trigger createDeck action
        this.store.dispatch(DecksActions.createDeck({ deck }));
        // Subscribe to results of the action
        this.store.select(isDeckCreated).pipe(
            filter((isCreated => isCreated)),
            first(),
        ).subscribe(() => {
            this.form.reset();
            this.wasValidated = false;
            this.activeModal.close('OK')
        });
    }
}
