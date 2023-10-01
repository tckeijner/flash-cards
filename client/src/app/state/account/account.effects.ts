import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AccountActions } from "./account.actions";
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";
import { AuthService, TOKEN_KEY } from "../../account/auth.service";
import { HttpErrorResponse } from "@angular/common/http";
import { AccountService } from "../../account/account.service";

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

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.login),
            switchMap(props => this.authService.login(props)
                .pipe(
                    map(result => {
                        localStorage.setItem(TOKEN_KEY, result.token);
                        return AccountActions.loginSuccessful(result);
                    }),
                    catchError((error: HttpErrorResponse) =>
                        of(AccountActions.loginFailed({ error: error.error }))
                    )
                )
            )
        )
    );

    loadAccountData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.loadAccountData),
            exhaustMap(() => this.accountService.loadAccountData()
                .pipe(
                    map(result =>
                        AccountActions.loadAccountDataSuccess({ username: result.username, userId: result._id })),
                    catchError((error: HttpErrorResponse) =>
                        of(AccountActions.loadAccountDataFailure({ error: error.error })))
                ))
        )
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private accountService: AccountService
    ) {}
}
