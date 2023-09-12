import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Store } from "@ngrx/store";
import { selectAccount } from "../state/account.selectors";
import { map, switchMap } from "rxjs";
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

    createDeck(deck: Deck) {
        return this.createBaseRequest().pipe(
            switchMap(baseRequest =>
                this.httpClient.post(`${this.baseUrl}`, {
                    ...baseRequest,
                    deck
                }, { responseType: 'text' })
            )
        );
    }

    isDecknameAvailable(deckname: string) {
        return this.createBaseRequest().pipe(
            switchMap(baseRequest =>
                this.httpClient.post(`${this.baseUrl}/checkAvailability/${deckname}`, baseRequest)
            )
        )
    }

    createBaseRequest() {
        return this.store.select(selectAccount).pipe(
            map(accountData =>
                ({ username: accountData.username, token: accountData.token })
            )
        );
    }
}
