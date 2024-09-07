import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '../state/account/account.effects';

import { AccountDataModel } from './account.model';
import { UserAccount } from './account.service';
import { BYPASS_REFRESH } from './auth.interceptor';
import {environment} from "../../environments/environment";


@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private baseUrl = environment.apiBaseUrl;

    constructor(
        private httpClient: HttpClient,
    ) {
    }

    /**
     * Sends a login request to the server, returning a token if valid
     * @param user
     */
    login(user: UserAccount): Observable<AccountDataModel> {
        return this.httpClient.post<AccountDataModel>(
            `${this.baseUrl}/login`, user, { responseType: `json`, context: new HttpContext().set(BYPASS_REFRESH, true) },
        ).pipe(tap(res => {
            localStorage.setItem(TOKEN_KEY, res.token);
            localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
        }));
    }

    /**
     * Sends the token to the server to check if it is still valid.
     */
    isAuthenticated() {
        return this.httpClient.get<boolean>(`${this.baseUrl}/isAuthenticated`,
            { context: new HttpContext().set(BYPASS_REFRESH, true) }) }

    /**
     * Request a new access token from the server when it is expired. Will also return a new refreshToken
     * Will set both tokens in local storage
     */
    refreshToken() {
        return this.httpClient.post<{ token: string, refreshToken: string }>(`${this.baseUrl}/refreshToken`,
            { refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) }).pipe(
            tap(res => {
                localStorage.setItem(TOKEN_KEY, res.token);
                localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
            }),
        );
    }
}
