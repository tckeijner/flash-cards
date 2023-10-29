import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AccountModule } from './account/account.module';
import { AuthInterceptor } from './account/auth.interceptor';
import { AuthService } from './account/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initAuthentication } from './app.providers';
import { DecksModule } from './decks/decks.module';
import { AccountEffects } from './state/account/account.effects';
import { accountReducer } from './state/account/account.reducer';
import { DecksEffects } from './state/decks/decks.effects';
import { deckReducer } from './state/decks/decks.reducer';
import { ToastsComponent } from './toasts/toasts.component';

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
        EffectsModule.forRoot(DecksEffects, AccountEffects),
    ],
    providers: [
        // AuthInterceptor manipulates any http request, adding a token
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        // Checks for authenticationtoken on initialization:
        {
            provide: APP_INITIALIZER,
            useFactory: initAuthentication,
            deps: [AuthService, Store, Router],
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
