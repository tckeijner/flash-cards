import { createActionGroup, props } from "@ngrx/store";
import { AccountDataModel } from "../../account/account.model";

export const AccountActions = createActionGroup({
    source: 'Account',
    events: {
        'Load Account Data': props<AccountDataModel>()
    }
})
