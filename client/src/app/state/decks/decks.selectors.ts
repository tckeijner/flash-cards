import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DeckState } from "./decks.reducer";

export const selectDeckState = createFeatureSelector<DeckState>('decks');

export const selectDecks = createSelector(
    selectDeckState,
    state => state?.decks
)
