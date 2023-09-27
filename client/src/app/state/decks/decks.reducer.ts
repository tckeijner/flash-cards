import { Deck } from "../../decks/deck.model";
import { createReducer, on } from "@ngrx/store";
import { DecksActions } from "./decks.actions";

export interface DeckState {
    decks: Deck[];
    loading: boolean;
    loaded: boolean;
    error: string | null;
}

export const initialState: DeckState = {
    decks: [],
    loading: false,
    loaded: false,
    error: null
};

export const deckReducer = createReducer(
    initialState,
    on(DecksActions.loadDecks, (state) => {
        return ({
            ...state,
            loading: true,
            loaded: false
        })
    }),
    on(DecksActions.loadDecksSuccess, (state, { decks }) => {
        return ({
            ...state,
            decks,
            loading: false,
            loaded: true
        })
    }),
    on(DecksActions.loadDecksFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            error
        })
    })
);
