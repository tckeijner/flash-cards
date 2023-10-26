import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";

import { AccountActions } from "./account.actions";
import { AuthService, TOKEN_KEY } from "../../account/auth.service";
import { AccountService } from "../../account/account.service";
import { ToastsService } from "../../toasts/toasts.service";

/**
 * Saves the retrieved token in the localStorage, if exists
 * @param token
 */
const setToken = (token?: string) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

/**
 * Effects are hooks that listen to specific actions and trigger an async side effect
 * A typical best practice is to divide actions into an initiator action, and a success and failure action,
 * for example: Login, LoginSucess and LoginFailure. The success or failure action is triggered
 * based on the outcome of the async logic. This structure can be made very consistent and maintainable,
 * while in the components it is very easy to subscribe to results.
 * Reference: https://ngrx.io/guide/effects
 */
@Injectable()
export class AccountEffects {

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.login),
            switchMap(props => this.authService.login(props)
                .pipe(
                    map(result => {
                        // Gets the token from the response and stores it in local storage
                        setToken(result.token);
                        return AccountActions.loginSuccessful(result);
                    }),
                    catchError(({ error }: HttpErrorResponse) => {
                        this.toastsService.addToastMessage(error);
                        return of(AccountActions.loginFailed({ error }))
                    })
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
                    catchError(({ error }: HttpErrorResponse) => {
                        this.toastsService.addToastMessage(error);
                        return of(AccountActions.loadAccountDataFailure({ error }))
                    })
                ))
        )
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.updateUser),
            switchMap(props => this.accountService.updateUser(props)
                .pipe(
                    map(result => {
                        // Gets the new token from the response and stores it in local storage
                        setToken(result.token);
                        return AccountActions.updateUserSuccess({ username: result.username })
                    }),
                    catchError(({ error }: HttpErrorResponse) => {
                        this.toastsService.addToastMessage(error);
                        return of(AccountActions.updateUserFailure({ error }))
                    })
                ))
        )
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private accountService: AccountService,
        private toastsService: ToastsService
    ) {}
}
