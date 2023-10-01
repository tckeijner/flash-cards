import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
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
            `${this.baseUrl}/login`, user, { responseType: `json` }) as Observable<AccountDataModel>;
    }

    /**
     * Sends the token to the server to check if it is still valid.
     */
    isAuthenticated() {
        return this.httpClient.get<boolean>(`${this.baseUrl}/isAuthenticated`, {});
    }

    /**
     * Sends a logout request to the server.
     */
    logout() {
        return this.httpClient.put(`${this.baseUrl}/logout`, {}, { responseType: 'text'} );
    }
}
