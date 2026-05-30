import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserResponse } from '../interfaces/user';
import { Admin, AdminResponse } from '../interfaces/admin';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUserUrl: string = "http://localhost:4000/api/v1/users";
  private apiAdminUrl: string = "http://localhost:4000/api/v1/admin";
  public userId = new BehaviorSubject<User>({
    id: '',
    username: '',
    email: '',
    password: ''
  });
  constructor(private httpClient: HttpClient) {}

  register(userData: User): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUserUrl}/register`, userData);
  }

  login(userData: User): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUserUrl}/login`, userData);
  }

  logout(userId: string): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${this.apiUserUrl}/logout`, userId);
  }

  registerAdmin(adminData: Admin): Observable<AdminResponse> {
    return this.httpClient.post<AdminResponse>(`${this.apiAdminUrl}/register`, adminData);
  }

  loginAdmin(adminData: Admin): Observable<AdminResponse> {
    return this.httpClient.post<AdminResponse>(`${this.apiAdminUrl}/login`, adminData);
  }

  logoutAdmin(adminId: string): Observable<AdminResponse> {
    return this.httpClient.post<AdminResponse>(`${this.apiAdminUrl}/logout`, adminId);
  }
}
