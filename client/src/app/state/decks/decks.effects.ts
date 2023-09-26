import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DecksService } from "../../decks/decks.service";
import { DecksActions } from "./decks.actions";
import { catchError, EMPTY, exhaustMap, map } from "rxjs";

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
    )

    constructor(
        private actions$: Actions,
        private decksService: DecksService
    ) {}
}
