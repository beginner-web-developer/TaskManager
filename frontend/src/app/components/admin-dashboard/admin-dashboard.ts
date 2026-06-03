import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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
import Papa from "papaparse";

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
    private adminService: AdminService, private cdr: ChangeDetectorRef) {
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
    this.adminService.getUsers(this.admin._id || '').subscribe({
      next: (response) => {
        this.userList = response.data;
        this.tableData.data = this.userList;
        this.tableData.paginator = this.paginator;
        this.tableData.sort = this.sort;
      },
      error: (err) => {
        this.message = err.error.message;
        this.cdr.detectChanges();
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

    const validUsers: User[] = [];
    const errors: string[] = [];
    const usernameSet = new Set<String>;
    // validations
    data.forEach((user, index) => {
      if (!user.email) {
        errors.push(`User ${index + 1}: Missing email`)
      }
      if (!user.username) {
        errors.push(`User ${index + 1}: Missing username`)
      }
      if (!user.password) {
        errors.push(`User ${index + 1}: Missing password`)
      }
      if (usernameSet.has(user.username)) {
        errors.push(`User ${index + 1} has duplicate username`);
      }
      if (user.email && user.username && user.password && 
        !usernameSet.has(user.username)) {
        validUsers.push(user);
        usernameSet.add(user.username);
      }
    });

    this.message = errors.join(', ');
    if (validUsers.length == 0) return;
    this.adminService.addUsers(validUsers).subscribe({
      next: (response) => {
        if (errors.length == 0) {
          this.message = response.message;
        } else {
          this.message += ` ${response.message}`;
        }
        this.loadUsers();
        this.users.clear();
        this.users.push(this.createForm());
      },
      error: (err) => {
        if (errors.length == 0) {
          this.message = err.error.message;
        } else {
          this.message += `\n${err.error.message}`;
        }
        this.cdr.detectChanges();
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
      error: (err) => {
        this.message = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  onDelete(userId: string): void {
    this.adminService.deleteUser(userId).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loadUsers();
      },
      error: (err) => {
        this.message = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    Papa.parse<User>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase().replace(/\s+/g, ''),
      complete: (result) => {
        const users: User[] = result.data.map((user: User) => 
          ({ ...user, company: this.admin.company })
        );
        const validUsers: User[] = [];
        const errors: string[] = [];
        const usernameSet = new Set<String>;
        // validations
        users.forEach((user, index) => {
          if (!user.email) {
            errors.push(`Row ${index + 2}: Missing email`)
          }
          if (!user.username) {
            errors.push(`Row ${index + 2}: Missing username`)
          }
          if (!user.password) {
            errors.push(`Row ${index + 2}: Missing password`)
          }
          if (usernameSet.has(user.username)) {
            errors.push(`Row ${index + 2} has duplicate username`);
          }
          if (user.email && user.username && user.password && 
            !usernameSet.has(user.username)) {
            validUsers.push(user);
            usernameSet.add(user.username);
          }
        });

        this.message = errors.join(', ');
        if (validUsers.length == 0) return;
        this.adminService.addUsers(validUsers).subscribe({
          next: (response) => {
            if (errors.length == 0) {
              this.message = response.message;
            } else {
              this.message += ` ${response.message}`;
            }
            this.loadUsers();
          },
          error: (err) => {
            if (errors.length == 0) {
              this.message = err.error.message;
            } else {
              this.message += `\n${err.error.message}`;
            }
            this.cdr.detectChanges();
          }
        });
      }
    });
  }
}