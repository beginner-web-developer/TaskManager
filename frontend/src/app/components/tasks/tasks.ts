import { Component } from '@angular/core';
import { AuthService } from '../../services/authService';
import { TaskForm } from './task-form/task-form';
import { TaskTable } from './task-table/task-table';

@Component({
  selector: 'app-tasks',
  imports: [TaskForm, TaskTable],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  username?: string;
  
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
      this.username = this.auth.userId.value.username;
  }
}
