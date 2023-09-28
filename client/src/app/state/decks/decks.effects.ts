import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DecksService } from "../../decks/decks.service";
import { DecksActions } from "./decks.actions";
import { catchError, EMPTY, exhaustMap, map, switchMap } from "rxjs";

@Injectable()
export class DecksEffects {
    loadDecks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DecksActions.loadDecks.type),
            exhaustMap(() => this.decksService.getAllDecks()
                .pipe(
                    map(decks => (DecksActions.loadDecksSuccess({ decks }))),
                    catchError(error => EMPTY)
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
                    catchError(error => EMPTY)
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
                    catchError(error => EMPTY)
                )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private decksService: DecksService
    ) {}
}
