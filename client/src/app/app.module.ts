import { NgModule, isDevMode, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountModule } from "./account/account.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store, StoreModule } from '@ngrx/store';
import { accountReducer } from "./state/account/account.reducer";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DecksModule } from "./decks/decks.module";
import { AuthInterceptor } from "./account/auth.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { EffectsModule } from '@ngrx/effects';
import { deckReducer } from "./state/decks/decks.reducer";
import { DecksEffects } from "./state/decks/decks.effects";
import { DecksActions } from "./state/decks/decks.actions";
import { selectDeckState } from "./state/decks/decks.selectors";
import { AuthService } from "./account/auth.service";
import { combineLatest, filter } from "rxjs";
import { Router } from "@angular/router";
import { AccountEffects } from "./state/account/account.effects";
import { AccountActions } from "./state/account/account.actions";
import { selectAccount } from "./state/account/account.selectors";
import { ToastsComponent } from './toasts/toasts.component';

/**
 * This custom provider will perform an authentication check on init.
 * If there is a token present in the storage it will check if it is valid,
 * then it will load the required data and navigate to the decks page.
 * Otherwise, it will navigate to the login page.
 * @param authService
 * @param store
 * @param router
 */
export function initAuthentication (authService: AuthService, store: Store, router: Router) {
    return () => new Promise(resolve => {
        if (!localStorage['authenticationToken']) {
            router.navigateByUrl('/');
            resolve(true);
            return;
        }
        authService.isAuthenticated().subscribe(isAuthenticated => {
            if (isAuthenticated) {
                store.dispatch(DecksActions.loadDecks());
                store.dispatch(AccountActions.loadAccountData());
                combineLatest([
                    store.select(selectDeckState).pipe(filter(({ loaded }) => loaded)),
                    store.select(selectAccount).pipe(filter(({ loaded }) => loaded))
                ])
                .subscribe(() => {
                    resolve(true);
                })
            } else {
                router.navigateByUrl('/');
                resolve(true);
            }
        })
    })
}

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
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
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
