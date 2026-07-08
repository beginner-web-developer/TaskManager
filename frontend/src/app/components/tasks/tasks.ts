import { Component } from '@angular/core';
import { AuthService } from '../../services/authService';
import { TaskForm } from './task-form/task-form';
import { TaskTable } from './task-table/task-table';
import { ManagerNavbar } from '../manager/manager-navbar/manager-navbar';
import { CommonModule } from '@angular/common';
import { ManagerService } from '../../services/manager-service';
import { defaultUser, User } from '../../interfaces/user';
import { ManagerTaskForm } from '../manager/manager-task-form/manager-task-form';

@Component({
  selector: 'app-tasks',
  imports: [TaskForm, TaskTable, ManagerNavbar, ManagerTaskForm ,CommonModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks {
  username?: string;
  isManager!: boolean;
  selectedEmployee!: User;
  isCurrentUserPage!: boolean;
  
  constructor(private auth: AuthService, private managerService: ManagerService) {}

  ngOnInit(): void {
    this.username = this.auth.userId.value.username;
    this.isManager = this.auth.userId.value.isManager;
    this.managerService.selectedUser.subscribe(val => this.selectedEmployee = val);
    this.isCurrentUserPage = (this.selectedEmployee == defaultUser);
  }
}
