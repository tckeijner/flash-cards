import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAccountComponent } from "./create-account/create-account.component";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { AccountService } from "./account.service";


@NgModule({
    declarations: [
        CreateAccountComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
    ],
    providers: [
        AccountService,
    ],
    exports: [
        CreateAccountComponent
    ]
})
export class AccountModule {
}
