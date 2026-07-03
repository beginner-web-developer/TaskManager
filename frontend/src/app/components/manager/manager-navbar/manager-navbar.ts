import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { defaultUser, User } from '../../../interfaces/user';
import { ManagerService } from '../../../services/manager-service';
import { AuthService } from '../../../services/authService';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-manager-navbar',
  imports: [
    CommonModule, MatToolbarModule, MatMenuModule, MatButtonModule, RouterLink, 
    MatIconModule
  ],
  templateUrl: './manager-navbar.html',
  styleUrl: './manager-navbar.css',
})
export class ManagerNavbar implements OnInit {
  employees: User[] = [];
  id?: string = '';
  selectedEmployee!: User;
  
  constructor(private service: ManagerService, private auth: AuthService) {
    this.id = this.auth.userId.value._id;
  }

  ngOnInit(): void {
    this.service.getEmployees(this.id || '').subscribe({
      next: (response) => this.employees = response.data
    });
    this.service.selectedUser.subscribe(val => this.selectedEmployee = val);
  }

  onClick(employee: User): void {
    this.service.selectedUser.next(employee);
  }

  clearEmployee(): void {
    this.service.selectedUser.next(defaultUser);
  }
}
