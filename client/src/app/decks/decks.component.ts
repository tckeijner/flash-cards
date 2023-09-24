import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DecksService } from "./decks.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { createIsDeckNameTakenValidator } from "./decks.validators";
import { Observable } from "rxjs";
import { Deck } from "./deck.model";

@Component({
    selector: 'app-decks',
    templateUrl: 'decks.component.html'
})
export class DecksComponent implements OnInit {
    form: FormGroup;
    closeResult = '';
    wasValidated = false;
    deckCreatedResult: null | string = null
    decks$: Observable<Deck[]>;

    constructor(
        private fb: FormBuilder,
        private decksService: DecksService,
        private modalService: NgbModal
    ) {
        this.form = this.fb.group({
            name: [null, [
                Validators.required,
            ], [
                createIsDeckNameTakenValidator(decksService)
            ]]
        });

        this.decks$ = this.decksService.getAllDecks();
    };

    ngOnInit() {

    }

    open(content: any) {
        this.modalService.open(content, { ariaLabelledBy: 'add-deck-modal' })
    }

    submitForm() {
        this.wasValidated = true;
        this.decksService.createDeck(this.form.value).subscribe({
            next: ((res) => {
                this.modalService.dismissAll(res);
            }),
            error: (error: Error) => {
                console.log(error)
            }
        });
    }
}
