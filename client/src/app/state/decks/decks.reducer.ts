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

    // Reducers for Load Decks
    on(DecksActions.loadDecks, (state) => {
        return ({
            ...state,
            loading: true,
            loaded: false,
            error: null
        })
    }),
    on(DecksActions.loadDecksSuccess, (state, { decks }) => {
        return ({
            ...state,
            decks,
            loading: false,
            loaded: true,
            error: null
        })
    }),
    on(DecksActions.loadDecksFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            error
        })
    }),

    // Reducers for Update Decks
    on(DecksActions.updateDeck, (state) => {
        return ({
            ...state,
            loading: true,
            loaded: false,
            error: null
        })
    }),
    on(DecksActions.updateDeckSuccess, (state, { decks }) => {
        return ({
            ...state,
            decks,
            loading: false,
            loaded: true,
            error: null
        })
    }),
    on(DecksActions.updateDeckFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            error
        })
    }),
);
