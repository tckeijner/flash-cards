import { Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { AccountActions } from "../state/account/account.actions";
import { isLoggedOut } from "../state/account/account.selectors";
import { filter } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: 'navbar.component.html'
})
export class NavbarComponent {
    @Input() title = 'Flash Cards';

    constructor(
        private store: Store,
        private router: Router
    ) {}

    logout() {
        this.store.dispatch(AccountActions.logout());
        this.store.select(isLoggedOut).pipe(filter(isLoggedOut => isLoggedOut))
            .subscribe(() => this.router.navigate(['login']))
    }
}
