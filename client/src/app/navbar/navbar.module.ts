import { NgModule } from "@angular/core";
import { NavbarComponent } from "./navbar.component";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";
import { RouterLink } from "@angular/router";

@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        StoreModule,
        RouterLink
    ],
    exports: [
        NavbarComponent
    ]
})
export class NavbarModule {}
