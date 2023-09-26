import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AccountModule } from "./account/account.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StoreModule } from '@ngrx/store';
import { accountReducer } from "./state/account/account.reducer";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { DecksModule } from "./decks/decks.module";
import { AuthInterceptor } from "./account/auth.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { EffectsModule } from '@ngrx/effects';
import { deckReducer } from "./state/decks/decks.reducer";
import { DecksEffects } from "./state/decks/decks.effects";

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        AccountModule,
        DecksModule,
        NgbModule,
        StoreModule.forRoot({ account: accountReducer, decks: deckReducer }, {}),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
        EffectsModule.forRoot(DecksEffects)
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
