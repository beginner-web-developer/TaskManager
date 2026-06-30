import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../../services/task-service';
import { AuthService } from '../../../services/authService';
import { Task } from '../../../interfaces/task';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-table',
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatInputModule, MatTooltipModule, MatCheckboxModule, ReactiveFormsModule
  ],
  templateUrl: './task-table.html',
  styleUrl: '.././tasks.css',
})
export class TaskTable implements OnInit, AfterViewInit {
  taskList: Task[] = [];
  userId?: string;
  filterCompleted = new FormControl(true); // true = show completed, false = hide completed
  searchValue: string = '';

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

  constructor(private service: TaskService, private auth: AuthService, private route: ActivatedRoute) {
    this.tableData = new MatTableDataSource(this.taskList);
    this.tableData.filterPredicate = (task: Task, filter: string) => {
      const parsed = JSON.parse(filter);
      const matchSearch = task.title.toLowerCase().includes(parsed.search);
      const matchCompleted = parsed.completed || !task.isCompleted;
      return matchSearch && matchCompleted;
    };

    this.route.paramMap.subscribe(params => {
      const userId = params.get('employeeId');
      this.loadTasks(userId);
    });
  }

  ngOnInit(): void {
      this.userId = this.auth.userId.value._id;
      this.service.refresh$.subscribe(() => {
        this.loadTasks(null);
      });
  }

  ngAfterViewInit() {
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }

  applyFilter(): void {
    const filterObj = {
      search: this.searchValue.trim().toLowerCase(),
      completed: this.filterCompleted.value
    };
    this.tableData.filter = JSON.stringify(filterObj);
    if (this.tableData.paginator) {
      this.tableData.paginator.firstPage();
    }
  }

  loadTasks(userId: string | null): void {
    let currUser: string;
    if (userId) {
      currUser = userId;
    } else {
      currUser = this.userId || '';
    }
    this.service.getTasks(currUser).subscribe({
        next: (response) => {
          this.taskList = response.tasks;
          this.tableData.data = this.taskList;
          this.tableData.paginator = this.paginator;
          this.tableData.sort = this.sort;
        },
        error: (err) => this.service.message.next(err.error.message)
      });
  }

  onClick(task: Task): void {
    this.service.isEditing.next(true);
    this.service.selectedTask.next(task);
  }

  onDelete(taskId: string): void {
    this.service.deleteTask(taskId).subscribe({
      next: (response) => {
        this.service.message.next(response.message);
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

  onMark(taskId: string, isMark: boolean): void {
    this.service.markTask(taskId, isMark).subscribe({
      next: (response) => {
        this.service.message.next(response.message);
        this.service.notifyRefresh();
      },
      error: (err) => this.service.message.next(err.error.message)
    });
  }
}
