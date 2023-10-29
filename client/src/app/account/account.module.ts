import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarModule } from '../navbar/navbar.module';
import { AccountService } from './account.service';

import { CreateAccountComponent } from './create-account/create-account.component';
import { LoginComponent } from './login/login.component';
import { ManageAccountComponent } from './manage-account/manage-account.component';
import { WelcomeComponent } from './welcome/welcome.component';


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
        LoginComponent,
    ],
})
export class AccountModule {
}
