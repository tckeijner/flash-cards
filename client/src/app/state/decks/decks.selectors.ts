import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DeckState } from "./decks.reducer";

export const selectDeckState = createFeatureSelector<DeckState>('decks');

export const selectDecks = createSelector(
    selectDeckState,
    state => state?.decks
);

export const selectDeckById = (id: string) => createSelector(
    selectDeckState,
    state => state.decks.find(deck => deck._id === id)
);

export const isDecksLoaded = createSelector(
    selectDeckState,
    state => state.loaded
);

export const isDeckCreated = createSelector(
    selectDeckState,
    state => state.deckCreated
);

export const isDeckRemoved = createSelector(
    selectDeckState,
    state => state.deckRemoved
);
