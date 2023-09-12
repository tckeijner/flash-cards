import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DecksService } from "./decks.service";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'app-decks',
    templateUrl: 'decks.component.html'
})
export class DecksComponent {
    form: FormGroup;
    closeResult = '';

    constructor(
        private fb: FormBuilder,
        private decksService: DecksService,
        private modalService: NgbModal
    ) {
        this.form = this.fb.group({
            name: [null, [Validators.required]]
        });
    };

    open(content: any) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
            (result) => {
                this.closeResult = `Closed with: ${result}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            },
        );
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    submitForm() {
        this.decksService.createDeck(this.form.value).subscribe({
            next: ((res) => {
                console.log(res)
            }),
            error: (error: Error) => {
                console.log(error)
            }
        });
    }
}
