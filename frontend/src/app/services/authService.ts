import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string = "http://localhost:4000/api/v1/users";
  constructor(private httpClient: HttpClient) {}

  register(userData: User): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUrl}/register`, userData);
  }

  login(userData: User): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUrl}/login`, userData);
  }

  logout(userId: string): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUrl}/logout`, userId);
  }
}
