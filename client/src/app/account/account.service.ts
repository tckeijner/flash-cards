import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { catchError, map, throwError } from "rxjs";

export enum AccountServiceErrors {
    UsernameTaken = "USERNAME_TAKEN",
    Unknown = 'UNKNOWN'
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
    private baseUrl = 'http://localhost:5200';

    constructor(private httpClient: HttpClient) { }

    createUser(user: {username: string, password: string}) {
        return this.httpClient.post(`${this.baseUrl}/users`, user, { responseType: 'text' }).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 409) {
                    return throwError(() => new Error(AccountServiceErrors.UsernameTaken))
                }
                return throwError(() => new Error(AccountServiceErrors.Unknown))
            }),
        );
    }
}
