import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { NavbarModule } from '../navbar/navbar.module';
import { DecksComponent } from './decks.component';
import { EditDeckComponent } from './edit-deck/edit-deck.component';
import { ReviewDeckComponent } from './review-deck/review-deck.component';


@NgModule({
    declarations: [
        DecksComponent,
        EditDeckComponent,
        ReviewDeckComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        NgbToast,
        NavbarModule,
    ],
    exports: [
        DecksComponent,
        EditDeckComponent,
    ],
})
export class DecksModule {
}
