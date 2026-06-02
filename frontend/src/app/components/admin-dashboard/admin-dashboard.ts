import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../services/authService';
import { User } from '../../interfaces/user';
import { Admin } from '../../interfaces/admin';
import { AdminService } from '../../services/admin-service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  imports: [ReactiveFormsModule, CommonModule, MatTableModule,
    MatPaginatorModule, MatSortModule, MatInputModule, MatFormFieldModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit, AfterViewInit {
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  admin!: Admin;
  userList: User[] = [];
  message: string = '';
  isEditing: boolean = false;
  selectedId?: string;

  // table properties
  displayedColumns: string[] = ['username', 'email', 'actions'];
  tableData: MatTableDataSource<User>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private formBuilder: FormBuilder, private service: AuthService, 
    private adminService: AdminService) {
    this.addUserForm = this.formBuilder.group({
      users: this.formBuilder.array([this.createForm()])
    });

    this.editUserForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]]
    });

    this.tableData = new MatTableDataSource(this.userList);
    this.tableData.filterPredicate = (user: User, filter: string) => {
      return user.username.toLowerCase().includes(filter);
    };
  }

  ngOnInit(): void {
    this.admin = this.service.adminId.value;
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }

  applyFilter(filterValue: string): void {
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  loadUsers(): void {
    this.adminService.getUsers(this.admin.id || '').subscribe({
      next: (response) => {
        this.userList = response.data;
        this.tableData.data = this.userList;
        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;
      },
      error: (err) => {
        this.message = err.error.message;
      }
    });
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get users(): FormArray {
    return this.addUserForm.get('users') as FormArray;
  }

  addUser(): void{
    this.users.push(this.createForm());
  }

  removeUser(index: number) {
    this.users.removeAt(index);
  }

  onSubmit(): void {
    const data: User[] = this.addUserForm.value['users'].map(
      (user: User) => ({...user, company: this.admin.company})
    );
    this.adminService.addUsers(data).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loadUsers();
        this.users.clear();
        this.users.push(this.createForm());
      },
      error: (err) => {
        this.message = err.error.message;
      }
    });
  }

  onClick(user: User): void {
    this.isEditing = true;
    this.selectedId = user._id;
    this.editUserForm.patchValue({
      email: user.email,
      username: user.username
    });
  }

  onUpdate(): void {
    const data: User = this.editUserForm.value;
    this.adminService.updateUser(this.selectedId || '', data).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loadUsers();
        this.editUserForm.reset();
        this.isEditing = false;
        this.selectedId = '';
      },
      error: (err) => this.message = err.error.message
    });
  }

  onDelete(userId: string): void {
    this.adminService.deleteUser(userId).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loadUsers();
      },
      error: (err) => this.message = err.error.message
    });
  }
}