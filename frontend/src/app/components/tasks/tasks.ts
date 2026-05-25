import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../services/authService';
import { Task } from '../../interfaces/task';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.css',
})
export class Tasks implements OnInit {
  taskList: Task[] = [];
  message?: string;
  taskForm: FormGroup;
  userId?: string;
  username?: string;
  isEditing: boolean = false;
  selectedTaskId?: string;

  constructor(private formBuilder: FormBuilder, private service: TaskService, private auth: AuthService, private cdr: ChangeDetectorRef) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    })
  }

  ngOnInit(): void {
      this.userId = this.auth.userId.value.id;
      this.username = this.auth.userId.value.username;
      this.loadTasks();
  }

  loadTasks(): void {
    this.service.getTasks(this.userId || '').subscribe({
        next: (response) => {
          this.taskList = response.tasks;
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
}
