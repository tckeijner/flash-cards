import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { Observable, tap } from "rxjs";
import { Deck } from "./deck.model";
import { DecksActions } from "../state/decks/decks.actions";

@Injectable({
    providedIn: 'root'
})
export class DecksService {
    private baseUrl = 'http://localhost:5200/decks';

    constructor(
        private httpClient: HttpClient,
        private store: Store
    ) {
    }

    getAllDecks() {
        return this.httpClient.get<Deck[]>(this.baseUrl, { responseType: 'json' })
    }

    createDeck(deck: Deck) {
        return this.httpClient.post(
            this.baseUrl,
            { deck },
            { responseType: 'text' }
        ).pipe(
            tap(() => this.store.dispatch(DecksActions.loadDecks()))
        )
    }

    isDecknameAvailable(deckname: string) {
        return this.httpClient.get(
            `${this.baseUrl}/checkAvailability/${deckname}`
        )
    }

    deleteDeck(id: string) {
        return this.httpClient.delete<Deck[]>(
            `${this.baseUrl}/${id}`,
            { responseType: 'json' }
        ).pipe(
            tap(() => this.store.dispatch(DecksActions.loadDecks()))
        )
    }

    updateDeck(deck: Deck): Observable<Deck[]> {
        return this.httpClient.put<Deck[]>(
            `${this.baseUrl}`,
            deck,
            { responseType: 'json' }
        );
    }
}
