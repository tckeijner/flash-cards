import { AccountDataModel } from "../../account/account.model";
import { createReducer, on } from "@ngrx/store";
import { AccountActions } from "./account.actions";

export interface AccountState extends AccountDataModel {
    loggedOut: boolean;
}

export const initialState: AccountState = {
    username: null,
    userId: null,
    token: null,
    loggedOut: false
}
 export const accountReducer = createReducer(
     initialState,
     on(AccountActions.loadAccountData, (state, accountData) => {
         return ({
             ...state,
             ...accountData
         })
     }),
     on(AccountActions.logoutComplete, (state) => {
         return ({
             ...state,
             ...initialState,
             loggedOut: true
         })
     })
 )
