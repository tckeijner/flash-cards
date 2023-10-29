import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NavbarComponent } from './navbar.component';

@NgModule({
    declarations: [
        NavbarComponent,
    ],
    imports: [
        CommonModule,
        StoreModule,
        RouterLink,
    ],
    exports: [
        NavbarComponent,
    ],
})
export class NavbarModule {
}
