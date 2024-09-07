import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '../state/account/account.effects';
import {environment} from "../../environments/environment";

export interface UserAccount {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private baseUrl = environment.apiBaseUrl;

    constructor(private httpClient: HttpClient) {
    }

    isUsernameAvailable(username: string) {
        return this.httpClient.get(
            `${this.baseUrl}/checkAvailability/${username}`,
        );
    };

    createUser(user: UserAccount) {
        return this.httpClient.post(`${this.baseUrl}`, user, { responseType: 'text' });
    };

    loadAccountData() {
        return this.httpClient.get<{
            username: string,
            _id: string
        }>(`${this.baseUrl}/getAccountData`, { responseType: 'json' });
    };

    updateUser(user: { username?: string, password?: string }) {
        return this.httpClient.put<{ username: string, token: string, refreshToken: string }>(
            `${this.baseUrl}/updateUser`, user, { responseType: 'json' },
        ).pipe(tap(res => {
            localStorage.setItem(REFRESH_TOKEN_KEY, res.refreshToken);
            localStorage.setItem(TOKEN_KEY, res.token);
        }));
    };
}
