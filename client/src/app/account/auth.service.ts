import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, tap } from "rxjs";
import { AccountDataModel } from "./account.model";
import { UserAccount } from "./account.service";

export const TOKEN_KEY = 'authenticationToken';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:5200/users';

    constructor(
        private httpClient: HttpClient,
    ) {}

    /**
     * Sends a login request to the server, returning a token if valid
     * @param user
     */
    login(user: UserAccount): Observable<AccountDataModel> {
        return this.httpClient.post<{token: string, expiresIn: number, userId: string, username: string}>(
            `${this.baseUrl}/login`, user, { responseType: `json` }).pipe(
                // The token is saved in the localStorage. This way it can re-authenticate when reinitializing the app
                tap(result => localStorage.setItem(TOKEN_KEY, result.token))
        ) as Observable<AccountDataModel>;
    }

    /**
     * Sends the token to the server to check if it is still valid.
     */
    isAuthenticated() {
        return this.httpClient.get<boolean>(`http://localhost:5200/users/isAuthenticated`, {})
    }
}
