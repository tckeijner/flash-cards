import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { CreateAccountComponent } from "./create-account/create-account.component";
import { AccountService } from "./account.service";
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { RouterLink } from "@angular/router";


@NgModule({
    declarations: [
        CreateAccountComponent,
        LoginComponent,
        WelcomeComponent,
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterLink,
    ],
    providers: [
        AccountService,
    ],
    exports: [
        CreateAccountComponent,
        LoginComponent
    ]
})
export class AccountModule {
}
