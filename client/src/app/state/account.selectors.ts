import { createFeatureSelector } from "@ngrx/store";
import { AccountDataModel } from "../account/account.model";

export const selectAccount = createFeatureSelector<AccountDataModel>('account');
