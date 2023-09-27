import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Deck } from "../deck.model";
import { Store } from "@ngrx/store";
import { selectDeckById } from "../../state/decks/decks.selectors";
import { Observable } from "rxjs";

@Component({
    selector: 'app-cards',
    templateUrl: 'deck.component.html'
})
export class DeckComponent implements OnInit {
    deck$: Observable<Deck | undefined>;

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit() {
        const deckId = this.route.snapshot.paramMap.get('id');
        if (deckId) {
            this.deck$ = this.store.select(selectDeckById(deckId))
        }
    }
}
