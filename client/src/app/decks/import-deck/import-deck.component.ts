import { Component, inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { importDeckValidator } from './import-deck.validator';
import { Store } from '@ngrx/store';
import { DecksActions } from '../../state/decks/decks.actions';
import { isDeckCreated } from '../../state/decks/decks.selectors';
import { filter, first } from 'rxjs';
import { Deck } from '../deck.model';

@Component({
    selector: 'app-import-deck',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        NgClass
    ],
    template: `
        <div class="modal-header">
            <h4 class="modal-title" id="add-deck-modal">Create new deck</h4>
            <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.close('CANCEL')"></button>
        </div>
        <div class="modal-body">
            <form class="col needs-validation" [formGroup]="form">
                <div class="mb-3">
                    <div class="input-group has-validation">
                      <textarea class="form-control"
                                [ngClass]="{ 'is-invalid': form.controls['importText'].dirty && form.controls['importText'].errors }"
                                type="text" id="importText" formControlName="importText" placeholder="Paste text here">
                      </textarea>
                        @if (form.controls['importText'].errors?.['invalidJson']; as jsonError) {
                            <div class="invalid-feedback">
                                {{ jsonError }}
                            </div>
                        }
                    </div>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="onClickSave()">Save</button>
        </div>
    `
})
export class ImportDeckComponent implements OnInit {
    activeModal = inject(NgbActiveModal);
    form: FormGroup;
    wasValidated = false;

    constructor(private fb: FormBuilder,
                private store: Store) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            importText: [null, [Validators.required, importDeckValidator]]
        });
    }

    onClickSave() {
        this.wasValidated = true;

        if (this.form.invalid) {
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
