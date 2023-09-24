import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable } from "rxjs";
import { AccountDataModel } from "./account.model";

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
    }

    createUser(user: UserAccount) {
        return this.httpClient.post(`${this.baseUrl}`, user, { responseType: 'text' });
    }

    login(user: UserAccount): Observable<AccountDataModel> {
        return this.httpClient.post<{token: string, expiresIn: number, userId: string, username: string}>(
            `${this.baseUrl}/login`, user, { responseType: `json` }) as Observable<AccountDataModel>;
    }
}
