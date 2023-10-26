import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterLink } from "@angular/router";

import { CreateAccountComponent } from "./create-account/create-account.component";
import { AccountService } from "./account.service";
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { NavbarModule } from "../navbar/navbar.module";


@NgModule({
    declarations: [
        CreateAccountComponent,
        LoginComponent,
        WelcomeComponent,
        ManageAccountComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterLink,
        NavbarModule,
    ],
    providers: [
        AccountService,
    ],
    exports: [
        CreateAccountComponent,
        LoginComponent
    ]
})
export class AccountModule { }
