import { AccountDataModel } from "../../account/account.model";
import { createReducer, on } from "@ngrx/store";
import { AccountActions } from "./account.actions";

export const initialState: AccountDataModel = {
    username: null,
    userId: null,
    token: null
}
 export const accountReducer = createReducer(
     initialState,
     on(AccountActions.loadAccountData, (state, accountData) => {
         return ({
             ...state,
             ...accountData
         })
     })
 )
