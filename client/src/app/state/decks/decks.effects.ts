import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { HttpErrorResponse } from "@angular/common/http";
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";

import { DecksService } from "../../decks/decks.service";
import { DecksActions } from "./decks.actions";
import { ToastsService } from "../../toasts/toasts.service";

/**
 * Effects are hooks that listen to specific actions and trigger an async side effect
 * A typical best practice is to divide actions into an initiator action, and a success and failure action,
 * for example: Login, LoginSuccess and LoginFailure. The success or failure action is triggered
 * based on the outcome of the async logic. This structure can be made very consistent and maintainable,
 * while in the components it is very easy to subscribe to results.
 * Reference: https://ngrx.io/guide/effects
 */
@Injectable()
export class DecksEffects {
    loadDecks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DecksActions.loadDecks.type),
            exhaustMap(() => this.decksService.getAllDecks()
                .pipe(
                    map(decks => (DecksActions.loadDecksSuccess({ decks }))),
                    catchError(({ error }: HttpErrorResponse) => {
                        this.toastsService.addToastMessage(error);
                        return of(DecksActions.loadDecksFailed({ error }))
                    })
                )
            )
        )
    );
    createDeck$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DecksActions.createDeck),
            switchMap(action => this.decksService.createDeck(action.name)
                .pipe(
                    map((decks) => (DecksActions.createDeckSuccess({ decks }))),
                    catchError(({ error }: HttpErrorResponse) => {
                        this.toastsService.addToastMessage(error);
                        return of(DecksActions.updateDeckFailed({ error }))
                    })
                )
            )
        )
    );
    updateDeck$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DecksActions.updateDeck),
            switchMap(action => this.decksService.updateDeck(action.deck)
                .pipe(
                    map(decks => (DecksActions.updateDeckSuccess({ decks }))),
                    catchError(({ error }: HttpErrorResponse) => {
                        this.toastsService.addToastMessage(error);
                        return of(DecksActions.updateDeckFailed({ error }))
                    })
                )
            )
        )
    );
    removeDeck$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DecksActions.removeDeck),
            switchMap(action => this.decksService.deleteDeck(action.id)
                .pipe(
                    map(decks => (DecksActions.removeDeckSuccess({ decks }))),
                    catchError(({ error }: HttpErrorResponse) => {
                        this.toastsService.addToastMessage(error);
                        return of(DecksActions.removeDeckFailed({ error }))
                    })
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private decksService: DecksService,
        private toastsService: ToastsService
    ) {}
}
