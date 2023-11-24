import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, first } from 'rxjs';

import { AuthService } from './account/auth.service';
import { AccountActions } from './state/account/account.actions';
import { selectAccount } from './state/account/account.selectors';
import { DecksActions } from './state/decks/decks.actions';
import { selectDeckState } from './state/decks/decks.selectors';

/**
 * This custom provider will perform an authentication check on init.
 * If there is a token present in the storage it will check if it is valid,
 * then it will load the required data and navigate to the decks page.
 * Otherwise, it will navigate to the login page.
 * @param authService
 * @param store
 * @param router
 */
export function initAuthentication(authService: AuthService, store: Store, router: Router) {
    return () => new Promise(resolve => {
        // If there is no token, just navigate to the login (home) page:
        if (!localStorage['refreshToken']) {
            router.navigateByUrl('/');
            resolve(true);
            return;
        }
        // Otherwise, the isAuthenticated request will try to validate the token:
        authService.isAuthenticated().subscribe({
            next: isAuthenticated => {
                // If it is valid, it will load the decks
                if (isAuthenticated) {
                    store.dispatch(DecksActions.loadDecks());
                    store.dispatch(AccountActions.loadAccountData());
                    combineLatest([
                        store.select(selectDeckState).pipe(filter(({ loaded }) => loaded)),
                        store.select(selectAccount).pipe(filter(({ loaded }) => loaded)),
                    ]).pipe(first()).subscribe(() => {
                        resolve(true);
                    });
                } else {
                    router.navigateByUrl('/');
                    resolve(true);
                }
            },
            error: () => {
                router.navigateByUrl('/');
                resolve(true);
            }
        });
    });
}
