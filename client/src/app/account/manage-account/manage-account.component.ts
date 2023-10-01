import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";
import { selectAccount } from "../../state/account/account.selectors";
import { first, Observable } from "rxjs";
import { AccountState } from "../../state/account/account.reducer";

@Component({
    selector: 'app-manage-account',
    templateUrl: 'manage-account.component.html',
})
export class ManageAccountComponent implements OnInit {
    account$: Observable<AccountState>;

    constructor(
        private store: Store) {
    }

    ngOnInit() {
        this.account$ = this.store.select(selectAccount).pipe(first());
    }

}
