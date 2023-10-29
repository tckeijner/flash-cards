import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, of, switchMap } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { AuthService } from '../../account/auth.service';
import { ToastsService } from '../../toasts/toasts.service';

import { AccountActions } from './account.actions';

export const TOKEN_KEY = 'authenticationToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

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
                        return AccountActions.loginSuccessful(result);
                    }),
                    catchError(({ error }: HttpErrorResponse) => {
                        this.toastsService.addToastMessage(error);
                        return of(AccountActions.loginFailed({ error }));
                    }),
                ),
            ),
        ),
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
                        return of(AccountActions.loadAccountDataFailure({ error }));
                    }),
                )),
        ),
    );

    updateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AccountActions.updateUser),
            switchMap(props => this.accountService.updateUser(props)
                .pipe(
                    map(result => {
                        return AccountActions.updateUserSuccess({ username: result.username });
                    }),
                    catchError(({ error }: HttpErrorResponse) => {
                        this.toastsService.addToastMessage(error);
                        return of(AccountActions.updateUserFailure({ error }));
                    }),
                )),
        ),
    );

    constructor(
        private actions$: Actions,
        private authService: AuthService,
        private accountService: AccountService,
        private toastsService: ToastsService,
    ) {
    }
}
