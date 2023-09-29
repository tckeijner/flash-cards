import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AccountActions } from "./account.actions";
import { exhaustMap, map } from "rxjs";
import { AuthService, TOKEN_KEY } from "../../account/auth.service";

@Injectable()
export class AccountEffects {
    unloadAccountData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.logout),
            exhaustMap(() => this.authService.logout()
                .pipe(
                    map(() => {
                        localStorage.removeItem(TOKEN_KEY);
                        return AccountActions.logoutComplete();
                    })
                ))
        )
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService
    ) {}
}
