import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AccountDataModel } from "../account/account.model";

export const selectAccount = createFeatureSelector<AccountDataModel>('account');

export const selectToken = createSelector(
    selectAccount,
    (state) => state.token
)
