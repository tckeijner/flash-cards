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

    login(user: UserAccount): Observable<AccountDataModel> {
        return this.httpClient.post<{token: string, expiresIn: number, userId: string, username: string}>(
            `${this.baseUrl}/login`, user, { responseType: `json` }).pipe(
                tap(result => localStorage.setItem(TOKEN_KEY, result.token))
        ) as Observable<AccountDataModel>;
    }

    isAuthenticated() {
        return this.httpClient.get<boolean>(`http://localhost:5200/users/isAuthenticated`, {})
    }
}
