import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Deck } from './deck.model';
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class DecksService {
    private baseUrl = environment.apiBaseUrl + '/decks';

    constructor(private httpClient: HttpClient) {
    }

    getAllDecks() {
        return this.httpClient.get<Deck[]>(this.baseUrl, { responseType: 'json' });
    }

    createDeck(name: string) {
        return this.httpClient.post<Deck[]>(this.baseUrl, { name }, { responseType: 'json' });
    }

    deleteDeck(id: string) {
        return this.httpClient.delete<Deck[]>(`${this.baseUrl}/${id}`, { responseType: 'json' });
    }

    updateDeck(deck: Deck): Observable<Deck[]> {
        return this.httpClient.put<Deck[]>(`${this.baseUrl}`, { deck }, { responseType: 'json' });
    }
}
