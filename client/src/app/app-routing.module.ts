import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from "./account/create-account/create-account.component";
import { LoginComponent } from "./account/login/login.component";
import { WelcomeComponent } from "./account/welcome/welcome.component";
import { DecksComponent } from "./decks/decks.component";
import { EditDeckComponent } from "./decks/edit-deck/edit-deck.component";
import { ReviewDeckComponent } from "./decks/review-deck/review-deck.component";
import { ManageAccountComponent } from "./account/manage-account/manage-account.component";

const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'create-account', component: CreateAccountComponent },
    { path: 'login', component: LoginComponent },
    { path: 'decks', component: DecksComponent },
    { path: 'decks/:id', component: EditDeckComponent },
    { path: 'decks/study/:id', component: ReviewDeckComponent },
    { path: 'account', component: ManageAccountComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
