import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { selectAccount } from "../state/account.selectors";
import { map, Observable, switchMap } from "rxjs";
import { Deck } from "./deck.model";

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
        )
    }

    isDecknameAvailable(deckname: string) {
        return this.httpClient.get(
            `${this.baseUrl}/checkAvailability/${deckname}`
        )
    }
}
