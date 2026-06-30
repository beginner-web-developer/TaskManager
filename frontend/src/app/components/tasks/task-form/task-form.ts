import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../services/task-service';
import { AuthService } from '../../../services/authService';
import { Task } from '../../../interfaces/task';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.html',
  styleUrl: '.././tasks.css',
})
export class TaskForm implements OnInit {
  taskForm: FormGroup;
  userId?: string;
  isEditing!: boolean;
  message?: string;

  constructor(private formBuilder: FormBuilder, private service: TaskService, private auth: AuthService) {
    this.taskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],

      enableRecurrence: [false],
      repeat: [{ value: 'weekly', disabled: true }],
      repeatCount: [{ value: 1, disabled: true }]
    })
  }

  ngOnInit(): void {
      this.userId = this.auth.userId.value._id;
      this.service.isEditing.subscribe(val => {
        this.isEditing = val;
        if (this.isEditing) {
          let task: Task = this.service.selectedTask.value;
          this.taskForm.patchValue({
            title: task.title,
            description: task.description,
            startDate: this.formatDate(task.startDate),
            endDate: this.formatDate(task.endDate)
          });
        }
      });
      this.service.message.subscribe(val => this.message = val);
      this.taskForm.get('enableRecurrence')?.valueChanges.subscribe(enabled => {
        if (enabled) {
          this.taskForm.get('repeat')?.enable();
          this.taskForm.get('repeat')?.setValue('weekly');
          this.taskForm.get('repeatCount')?.enable();
          this.taskForm.get('repeatCount')?.setValue(1);
        } else {
          this.taskForm.get('repeat')?.disable();
          this.taskForm.get('repeatCount')?.disable();
        }
      });
  }

  onSubmit(): void {
    if (this.isEditing) {
      return this.onUpdate(this.service.selectedTask.value._id || '');
    }
    const taskData: Task = this.taskForm.value;
    this.service.createTask(taskData, this.userId || '').subscribe({
      next: (response) => {
        this.service.message.next(response.message);  
        this.taskForm.reset();
        this.service.notifyRefresh();
      },
      error: (err) => this.service.message.next(err.error.message)
    });
  }

  onUpdate(taskId: string): void {
    const taskData: Task = {
      ...this.taskForm.value,
      userId: this.userId
    };
    this.service.updateTask(taskData, taskId).subscribe({
      next: (response) => {
        this.service.message.next(response.message);
        this.taskForm.reset();
        this.service.isEditing.next(false);
        this.service.notifyRefresh();
      },
      error: (err) => this.service.message.next(err.error.message)
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
