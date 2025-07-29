import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { DecksActions } from '../../state/decks/decks.actions';
import { selectedDeck } from '../../state/decks/decks.selectors';
import { Deck } from '../deck.model';

@Component({
    selector: 'app-review-deck',
    templateUrl: 'review-deck.component.html',
    styleUrls: ['review-deck.component.scss'],
    standalone: false
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
        private store: Store,
    ) {
    }

    ngOnInit() {
        const deckId = this.route.snapshot.paramMap.get('id');
        if (deckId) {
            this.store.dispatch(DecksActions.selectDeck({ id: deckId }))
            this.store.select(selectedDeck).subscribe(deck => {
                this.deck = deck;
            });
        }
    }

    nextCard() {
        this.currentCardIndex += 1;
        this.blur = true;
    }

    previousCard() {
        this.currentCardIndex -= 1;
        this.blur = true;
    }

    toggleBlur() {
        this.blur = !this.blur;
    }
}
