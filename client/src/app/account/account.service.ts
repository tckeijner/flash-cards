import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private baseUrl = 'http://localhost:5200';

  constructor(private httpClient: HttpClient) { }

  createUser(user: {username: string, password: string}) {
    return this.httpClient.post(`${this.baseUrl}/users`, user, { responseType: 'text' })
  }
}
