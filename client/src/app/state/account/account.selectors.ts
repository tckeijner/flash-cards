import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AccountState } from "./account.reducer";

export const selectAccount = createFeatureSelector<AccountState>('account');

export const isLoggedOut = createSelector(
    selectAccount,
    (state) => state.loggedOut
);

export const isLoggedIn = createSelector(
    selectAccount,
    state => state.loggedIn
);

export const loginError = createSelector(
    selectAccount,
    state => state.error
);
