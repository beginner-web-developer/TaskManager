import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserResponse, UserResponseList } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiAdminUrl: string = "http://localhost:4000/api/v1/admin";
  constructor(private httpClient: HttpClient) {}

  getUsers(adminId: string): Observable<UserResponseList> {
    return this.httpClient.get<UserResponseList>(`${this.apiAdminUrl}/getUsers/${adminId}`);
  }

  addUsers(users: User[]): Observable<UserResponseList> {
    return this.httpClient.post<UserResponseList>(`${this.apiAdminUrl}/addUsers`, users);
  }

  updateUser(userId: string, updated: User): Observable<UserResponse> {
    return this.httpClient.patch<UserResponse>(
      `${this.apiAdminUrl}/updateUser/${userId}`, 
      updated);
  }

  deleteUser(userId: string): Observable<UserResponse> {
    return this.httpClient.delete<UserResponse>(`${this.apiAdminUrl}/deleteUser/${userId}`);
  }
}
