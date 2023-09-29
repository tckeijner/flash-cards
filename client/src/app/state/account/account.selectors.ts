import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AccountState } from "./account.reducer";

export const selectAccount = createFeatureSelector<AccountState>('account');

export const selectToken = createSelector(
    selectAccount,
    (state) => state.token
)

export const isLoggedOut = createSelector(
    selectAccount,
    (state) => state.loggedOut
)
