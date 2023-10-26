import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";

import { Deck } from "../deck.model";
import { selectDeckById } from "../../state/decks/decks.selectors";

@Component({
    selector: 'app-review-deck',
    templateUrl: 'review-deck.component.html',
    styleUrls: ['review-deck.component.scss']
})
export class ReviewDeckComponent implements OnInit {
    deck?: Deck;
    blur = true;
    currentCardIndex = 0;

    get currentCard() {
        return this.deck?.cards?.[this.currentCardIndex];
    }

    constructor(
        private route: ActivatedRoute,
        private store: Store
    ) {}

    ngOnInit() {
        const deckId = this.route.snapshot.paramMap.get('id');
        if (deckId) {
            this.store.select(selectDeckById(deckId)).subscribe(deck => {
                this.deck = deck;
            })
        }
    }

    nextCard() {
        this.currentCardIndex += 1;
        this.blur = true;
    }

    previousCard() {
        this.currentCardIndex -= 1;
        this.blur = true
    }

    toggleBlur() {
        this.blur = !this.blur;
    }
}
