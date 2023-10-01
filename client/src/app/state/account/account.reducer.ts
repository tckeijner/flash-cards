import { createReducer, on } from "@ngrx/store";
import { AccountActions } from "./account.actions";

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
    error: null
}
 export const accountReducer = createReducer(
     initialState,
     on(AccountActions.loadAccountData, (state) => {
         return ({
             ...state,
             loading: true,
             error: null
         })
     }),
     on(AccountActions.loadAccountDataSuccess, (state, accountData) => {
         return ({
             ...state,
             ...accountData,
             loading: false,
             loaded: true,
             error: null,
             loggedIn: true,
             loggedOut: false
         })
     }),
     on(AccountActions.loadAccountDataFailure, (state, { error }) => {
         return ({
             ...state,
             error
         })
     }),
     on(AccountActions.logoutComplete, (state) => {
         return ({
             ...state,
             ...initialState,
             loggedOut: true
         })
     }),
     on(AccountActions.login, (state) => {
         return ({
             ...state,
             loading: true,
             loggedIn: false,
             error: null
         })
     }),
     on(AccountActions.loginSuccessful, (state, { username, userId }) => {
         return ({
             ...state,
             username,
             userId,
             loading: false,
             loggedIn: true
         })
     }),
     on(AccountActions.loginFailed, (state, { error }) => {
         return ({
             ...state,
             loading: false,
             error
         })
     })
 )
