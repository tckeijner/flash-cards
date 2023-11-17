import { createReducer, on } from '@ngrx/store';
import { Deck } from '../../decks/deck.model';
import { DecksActions } from './decks.actions';

export interface DeckState {
    decks: Deck[];
    selectedDeckId: string;
    loading: boolean;
    loaded: boolean;
    error: string | null;
    creatingDeck: boolean;
    deckCreated: boolean;
    removingDeck: boolean;
    deckRemoved: boolean;
}

export const initialState: DeckState = {
    decks: [],
    selectedDeckId: '',
    loading: false,
    loaded: false,
    error: null,
    creatingDeck: false,
    deckCreated: false,
    removingDeck: false,
    deckRemoved: false,
};

/**
 * the reducer is the collections functions which contain the logic that must be performed on the state.
 * The general principle of the Redux pattern is that the state is immutable. We never edit the state directly. Instead,
 * we make a copy of the state using the spread (...) operator and combining it with the updated properties. The internal
 * logic then replaced the whole state with the updated state.
 *
 * The on() function indicated which logic must be peformed on which action
 */
export const deckReducer = createReducer(
    initialState,

    // Reducers for Load Decks
    on(DecksActions.loadDecks, (state) => {
        return ({
            ...state,
            loading: true,
            loaded: false,
            error: null,
        });
    }),
    on(DecksActions.loadDecksSuccess, (state, { decks }) => {
        return ({
            ...state,
            decks,
            loading: false,
            loaded: true,
            error: null,
        });
    }),
    on(DecksActions.loadDecksFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            error,
        });
    }),

    // Reducers for Create Deck
    on(DecksActions.createDeck, (state) => {
        return ({
            ...state,
            loading: true,
            loaded: false,
            error: null,
            creatingDeck: true,
            deckCreated: false,
        });
    }),
    on(DecksActions.createDeckSuccess, (state, { decks }) => {
        return ({
            ...state,
            decks,
            loading: false,
            loaded: true,
            error: null,
            creatingDeck: false,
            deckCreated: true,
        });
    }),
    on(DecksActions.createDeckFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            creatingDeck: false,
            deckCreated: false,
            error,
        });
    }),

    // Reducers for Update Deck
    on(DecksActions.updateDeck, (state) => {
        return ({
            ...state,
            loading: true,
            loaded: false,
            error: null,
        });
    }),
    on(DecksActions.updateDeckSuccess, (state, { decks }) => {
        return ({
            ...state,
            decks,
            loading: false,
            loaded: true,
            error: null,
        });
    }),
    on(DecksActions.updateDeckFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            error,
        });
    }),

    // Reducers for Remove Deck
    on(DecksActions.removeDeck, (state) => {
        return ({
            ...state,
            loading: true,
            loaded: false,
            error: null,
            removingDeck: true,
            deckRemoved: false,
        });
    }),
    on(DecksActions.removeDeckSuccess, (state, { decks }) => {
        return ({
            ...state,
            decks,
            loading: false,
            loaded: true,
            error: null,
            removingDeck: false,
            deckRemoved: true,
        });
    }),
    on(DecksActions.removeDeckFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            removingDeck: false,
            deckRemoved: false,
            error,
        });
    }),
    on(DecksActions.clearDeckState, () => {
        return initialState;
    }),

    on(DecksActions.selectDeck, (state, { id }) => {
        return ({
            ...state,
            selectedDeckId: id
        })
    })
);
