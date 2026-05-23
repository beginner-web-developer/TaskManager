import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GetTasksResponse, Task, TaskResponse } from '../interfaces/task';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl: string = "http://localhost:4000/api/v1/tasks";
  constructor(private httpClient: HttpClient) {}

  getTasks(userid: string): Observable<GetTasksResponse> {
    return this.httpClient.get<GetTasksResponse>(`${this.apiUrl}/readTasks/${userid}`);
  }

  createTask(task: Task, userid: string): Observable<TaskResponse> {
    return this.httpClient.post<TaskResponse>(`${this.apiUrl}/createTask/${userid}`, task);
  }

  deleteTask(taskId: string): Observable<TaskResponse> {
    return this.httpClient.delete<TaskResponse>(`${this.apiUrl}/deleteTask/${taskId}`);
  }

  updateTask(task: Task, taskId: string): Observable<TaskResponse> {
    return this.httpClient.patch<TaskResponse>(`${this.apiUrl}/updateTask/${taskId}`, task);
  }
}
