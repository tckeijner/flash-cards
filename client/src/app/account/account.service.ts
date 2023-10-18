import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

export interface UserAccount {
    username: string;
    password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
    private baseUrl = 'http://localhost:5200/users';

    constructor(private httpClient: HttpClient) { }

    isUsernameAvailable(username: string) {
        return this.httpClient.get(
            `${this.baseUrl}/checkAvailability/${username}`,
        );
    };

    createUser(user: UserAccount) {
        return this.httpClient.post(`${this.baseUrl}`, user, { responseType: 'text' });
    };

    loadAccountData() {
        return this.httpClient.get<{ username: string, _id: string }>(`${this.baseUrl}/getAccounData`, { responseType: 'json' });
    };

    updateUser(user: { username?: string, password?: string }) {
        return this.httpClient.put<{username: string, token: string}>(`${this.baseUrl}/updateUser`, user, { responseType: 'json' });
    };
}
