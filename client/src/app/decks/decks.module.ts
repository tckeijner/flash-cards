import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecksComponent } from './decks.component';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { DeckComponent } from "./deck/deck.component";


@NgModule({
    declarations: [
        DecksComponent,
        DeckComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        NgbToast,
    ],
    exports: [
        DecksComponent,
        DeckComponent
    ]
})
export class DecksModule {
}
