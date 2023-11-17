import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DeckState } from './decks.reducer';

export const selectDeckState = createFeatureSelector<DeckState>('decks');

// Get the decks form the DeckState
export const selectDecks = createSelector(
    selectDeckState,
    state => state?.decks,
);

// Select one deck by id
export const selectedDeck = createSelector(
    selectDeckState,
    state => state.decks.find(deck => deck._id === state.selectedDeckId),
);

// Emits true when deck creation is complete
export const isDeckCreated = createSelector(
    selectDeckState,
    state => state.deckCreated,
);

// Emits true when deck removal is complete
export const isDeckRemoved = createSelector(
    selectDeckState,
    state => state.deckRemoved,
);
