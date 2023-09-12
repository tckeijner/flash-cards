import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DecksComponent } from './decks.component';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";


@NgModule({
    declarations: [
        DecksComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink
    ],
    exports: [
        DecksComponent
    ]
})
export class DecksModule {
}
