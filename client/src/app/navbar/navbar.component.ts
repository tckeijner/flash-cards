import { Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { filter } from "rxjs";

import { AccountActions } from "../state/account/account.actions";
import { isLoggedOut } from "../state/account/account.selectors";

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
        // Trigger logout action:
        this.store.dispatch(AccountActions.logout());
        // Subscribe to result and navigate to login page
        this.store.select(isLoggedOut).pipe(filter(isLoggedOut => isLoggedOut))
            .subscribe(() => this.router.navigate(['login']))
    }
}
