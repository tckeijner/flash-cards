import { FormBuilder, FormGroup } from '@angular/forms';
import { inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

export abstract class BaseModal {
    activeModal = inject(NgbActiveModal);
    fb = inject(FormBuilder);
    store = inject(Store);

    form: FormGroup;
    wasValidated = false;

    abstract onClickSave(): void;

    validateForm() {
        this.wasValidated = true;
        return this.form.valid;
    }
}