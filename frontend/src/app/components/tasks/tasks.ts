import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../services/authService';
import { Task } from '../../interfaces/task';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-tasks',
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit, AfterViewInit {
  taskList: Task[] = [];
  message?: string;
  taskForm: FormGroup;
  userId?: string;
  username?: string;
  isEditing: boolean = false;
  selectedTaskId?: string;

  // table properties
  displayedColumns: string[] = [
    'title',
    'startDate',
    'endDate',
    'isCompleted',
    'actions'
  ];
  tableData: MatTableDataSource<Task>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder, private service: TaskService, private auth: AuthService, private cdr: ChangeDetectorRef) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
    this.tableData = new MatTableDataSource(this.taskList);
    this.tableData.filterPredicate = (task: Task, filter: string) => {
      const searchText = `${task.title}`.toLowerCase();

      return searchText.includes(filter);
    };
  }

  ngOnInit(): void {
      this.userId = this.auth.userId.value.id;
      this.username = this.auth.userId.value.username;
      this.loadTasks();
  }

  ngAfterViewInit() {
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.tableData.filter = filterValue.trim().toLowerCase();
  }

  loadTasks(): void {
    this.service.getTasks(this.userId || '').subscribe({
        next: (response) => {
          this.taskList = response.tasks;
          this.tableData.data = this.taskList;
          this.tableData.paginator = this.paginator;
          this.tableData.sort = this.sort;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.message = err.error.message;
          this.cdr.detectChanges();
        }
      });
  }

  onSubmit(): void {
    if (this.isEditing) {
      return this.onUpdate(this.selectedTaskId || '');
    }
    const taskData: Task = this.taskForm.value;
    this.service.createTask(taskData, this.userId || '').subscribe({
      next: (response) => {
        this.message = response.message;
        this.cdr.detectChanges();
        this.taskForm.reset();
        this.loadTasks();
      },
      error: (err) => {
        this.message = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  onClick(task: Task): void {
    this.isEditing = true;
    this.selectedTaskId = task._id;
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      startDate: this.formatDate(task.startDate),
      endDate: this.formatDate(task.endDate)
    });
  }

  onUpdate(taskId: string): void {
    const taskData: Task = {
      ...this.taskForm.value,
      userId: this.userId
    };
    this.service.updateTask(taskData, taskId).subscribe({
      next: (response) => {
        this.message = response.message;
        this.cdr.detectChanges();
        this.taskForm.reset();
        this.isEditing = false;
        this.loadTasks();
      },
      error: (err) => {
        this.message = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  onDelete(taskId: string): void {
    this.service.deleteTask(taskId).subscribe({
      next: (response) => {
        this.message = response.message;
        this.cdr.detectChanges();
        this.loadTasks();
      },
      error: (err) => {
        this.message = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);

    return new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
  };

  onMark(taskId: string, isMark: boolean): void {
    this.service.markTask(taskId, isMark).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loadTasks();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.message = err.error.message;
        this.cdr.detectChanges();
      }
    });
  }
}
