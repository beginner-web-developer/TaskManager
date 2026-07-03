import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { defaultUser, User, UserResponseList } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private apiUrl: string = "http://localhost:4000/api/v1/manager";
  public selectedUser = new BehaviorSubject<User>(defaultUser);
  
  constructor(private httpClient: HttpClient) {}

  getEmployees(managerId: string): Observable<UserResponseList> {
    return this.httpClient.get<UserResponseList>(`${this.apiUrl}/getEmployees/${managerId}`);
  }
}
