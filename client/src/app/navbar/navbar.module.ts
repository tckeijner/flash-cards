import { NgModule } from "@angular/core";
import { NavbarComponent } from "./navbar.component";
import { CommonModule } from "@angular/common";
import { StoreModule } from "@ngrx/store";

@NgModule({
    declarations: [
        NavbarComponent
    ],
    imports: [
        CommonModule,
        StoreModule
    ],
    exports: [
        NavbarComponent
    ]
})
export class NavbarModule {}
