import { Deck } from "../../decks/deck.model";
import { createReducer, on } from "@ngrx/store";
import { DecksActions } from "./decks.actions";

export interface DeckState {
    decks: Deck[];
    loading: boolean;
    loaded: boolean;
    error: string | null;
    creatingDeck: boolean;
    deckCreated: boolean;
}

export const initialState: DeckState = {
    decks: [],
    loading: false,
    loaded: false,
    error: null,
    creatingDeck: false,
    deckCreated: false
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

    // Reducers for Create Deck
    on(DecksActions.createDeck, (state) => {
        return ({
            ...state,
            loading: true,
            loaded: false,
            error: null,
            creatingDeck: true,
            deckCreated: false
        })
    }),
    on(DecksActions.createDeckSuccess, (state, action) => {
        return ({
            ...state,
            decks: action.decks,
            loading: false,
            loaded: true,
            error: null,
            creatingDeck: false,
            deckCreated: true
        })
    }),
    on(DecksActions.createDeckFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            creatingDeck: false,
            deckCreated: false,
            error
        })
    }),

    // Reducers for Update Deck
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

    // Reducers for Remove Deck
    on(DecksActions.removeDeck, (state) => {
        return ({
            ...state,
            loading: true,
            loaded: false,
            error: null
        })
    }),
    on(DecksActions.removeDeckSuccess, (state, { decks }) => {
        return ({
            ...state,
            decks,
            loading: false,
            loaded: true,
            error: null
        })
    }),
    on(DecksActions.removeDeckFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            error
        })
    }),
);
