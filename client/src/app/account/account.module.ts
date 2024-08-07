import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarModule } from '../navbar/navbar.module';
import { AccountService } from './account.service';

import { CreateAccountComponent } from './create-account/create-account.component';
import { LoginComponent } from './login/login.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { WelcomeComponent } from './welcome/welcome.component';


@NgModule({ declarations: [
        CreateAccountComponent,
        LoginComponent,
        WelcomeComponent,
        ManageAccountComponent,
    ],
    exports: [
        CreateAccountComponent,
        LoginComponent,
    ], imports: [CommonModule,
        ReactiveFormsModule,
        RouterLink,
        NavbarModule], providers: [
        AccountService,
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AccountModule {
}
