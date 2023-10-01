import { createActionGroup, emptyProps, props } from "@ngrx/store";

export const AccountActions = createActionGroup({
    source: 'Account',
    events: {
        'Login': props<{ username: string, password: string }>(),
        'Login Successful': props<{ username: string, userId: string }>(),
        'Login Failed': props<{ error: string }>(),
        'Load Account Data': emptyProps(),
        'Load Account Data Success': props<{ username: string, userId: string }>(),
        'Load Account Data Failure': props<{ error: string }>(),
        'Logout': emptyProps(),
        'Logout Complete': emptyProps(),
        'Update User': props<{ username?: string, password?: string }>(),
        'Update User Success': props<{ username: string }>(),
        'Update User Failure': props<{ error: string }>(),
    }
})
