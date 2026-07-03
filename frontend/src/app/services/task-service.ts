import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { defaultTask, GetTasksResponse, Task, TaskResponse } from '../interfaces/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl: string = "http://localhost:4000/api/v1/tasks";
  private refreshSource = new Subject<void>();
  public isEditing = new BehaviorSubject<boolean>(false);
  public selectedTask = new BehaviorSubject<Task>(defaultTask);
  public message = new BehaviorSubject<string>('');

  constructor(private httpClient: HttpClient) {}
  
  refresh$ = this.refreshSource.asObservable();

  notifyRefresh() {
    this.refreshSource.next();
  }

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

  markTask(taskId: string, isCompleted: boolean): Observable<TaskResponse> {
    return this.httpClient.patch<TaskResponse>(`${this.apiUrl}/markTask/${taskId}`, {
      isCompleted: isCompleted
    });
  }
}
