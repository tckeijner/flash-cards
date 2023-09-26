import { Deck } from "../../decks/deck.model";
import { createReducer, on } from "@ngrx/store";
import { DecksActions } from "./decks.actions";

export interface DeckState {
    decks: Deck[];
}

export const initialState: DeckState = {
    decks: []
};

export const deckReducer = createReducer(
    initialState,
    on(DecksActions.loadDecksSuccess, (state, { decks }) => {
        return ({
            ...state,
            decks
        })
    })
);
