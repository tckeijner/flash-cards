import { NgModule, isDevMode, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule } from '@ngrx/store';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { Router } from "@angular/router";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountModule } from "./account/account.module";
import { accountReducer } from "./state/account/account.reducer";
import { DecksModule } from "./decks/decks.module";
import { AuthInterceptor } from "./account/auth.interceptor";
import { deckReducer } from "./state/decks/decks.reducer";
import { DecksEffects } from "./state/decks/decks.effects";
import { AuthService } from "./account/auth.service";
import { AccountEffects } from "./state/account/account.effects";
import { ToastsComponent } from './toasts/toasts.component';
import { initAuthentication } from "./app.providers";

@NgModule({
    declarations: [
        AppComponent,
        ToastsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AccountModule,
        DecksModule,
        NgbModule,
        StoreModule.forRoot({ account: accountReducer, decks: deckReducer }, {}),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
        EffectsModule.forRoot(DecksEffects, AccountEffects)
    ],
    providers: [
        // AuthInterceptor manipulates any http request, adding a token
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        // Checks for authenticationtoken on initialization:
        {
            provide: APP_INITIALIZER,
            useFactory: initAuthentication,
            deps: [AuthService, Store, Router],
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
