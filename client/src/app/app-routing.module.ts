import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from "./account/create-account/create-account.component";
import { LoginComponent } from "./account/login/login.component";
import { WelcomeComponent } from "./account/welcome/welcome.component";
import { DecksComponent } from "./decks/decks.component";
import { DeckComponent } from "./decks/deck/deck.component";

const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'create-account', component: CreateAccountComponent },
    { path: 'login', component: LoginComponent },
    { path: 'decks', component: DecksComponent },
    { path: 'decks/:id', component: DeckComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
