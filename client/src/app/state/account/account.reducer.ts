import { createReducer, on } from '@ngrx/store';
import { AccountActions } from './account.actions';

export interface AccountState {
    username: string | null,
    userId: string | null,
    loggedOut: boolean;
    loading: boolean;
    loaded: boolean;
    loggedIn: boolean;
    error: string | null;
}

export const initialState: AccountState = {
    username: null,
    userId: null,
    loading: false,
    loaded: false,
    loggedIn: false,
    loggedOut: false,
    error: null,
};

/**
 * the reducer is the collections functions which contain the logic that must be performed on the state.
 * The general principle of the Redux pattern is that the state is immutable. We never edit the state directly. Instead,
 * we make a copy of the state using the spread (...) operator and combining it with the updated properties. The internal
 * logic then replaced the whole state with the updated state.
 *
 * The on() function indicated which logic must be peformed on which action
 */
export const accountReducer = createReducer(
    initialState,
    on(AccountActions.loadAccountData, (state) => {
        return ({
            ...state,
            loading: true,
            error: null,
        });
    }),
    on(AccountActions.loadAccountDataSuccess, (state, accountData) => {
        return ({
            ...state,
            ...accountData,
            loading: false,
            loaded: true,
            error: null,
            loggedIn: true,
            loggedOut: false,
        });
    }),
    on(AccountActions.loadAccountDataFailure, (state, { error }) => {
        return ({
            ...state,
            error,
        });
    }),
    on(AccountActions.logout, (state) => {
        return ({
            ...state,
            ...initialState,
            loggedOut: true,
        });
    }),
    on(AccountActions.login, (state) => {
        return ({
            ...state,
            loading: true,
            loggedIn: false,
            error: null,
        });
    }),
    on(AccountActions.loginSuccessful, (state, { username, userId }) => {
        return ({
            ...state,
            username,
            userId,
            loading: false,
            loggedIn: true,
        });
    }),
    on(AccountActions.loginFailed, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            error,
        });
    }),
    on(AccountActions.updateUser, (state) => {
        return ({
            ...state,
            loading: true,
            error: null,
            loaded: false,
        });
    }),
    on(AccountActions.updateUserSuccess, (state, { username }) => {
        return ({
            ...state,
            username,
            loading: false,
            loaded: true,
        });
    }),
    on(AccountActions.updateUserFailure, (state, { error }) => {
        return ({
            ...state,
            loading: false,
            loaded: false,
            error,
        });
    }),
);
