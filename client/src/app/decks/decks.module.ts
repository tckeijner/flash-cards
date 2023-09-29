import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecksComponent } from './decks.component';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { EditDeckComponent } from "./edit-deck/edit-deck.component";
import { ReviewDeckComponent } from './review-deck/review-deck.component';


@NgModule({
    declarations: [
        DecksComponent,
        EditDeckComponent,
        ReviewDeckComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        NgbToast,
    ],
    exports: [
        DecksComponent,
        EditDeckComponent
    ]
})
export class DecksModule {
}
