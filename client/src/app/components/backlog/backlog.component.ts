import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { GetCurrentUserService } from '../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../services/user.service/user.service';
import { Router } from '@angular/router';
import {
  Task,
  TaskManagerService,
} from '../../services/task-manager.service/task-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-backlog',
  standalone: false,
  templateUrl: './backlog.component.html',
  styleUrls: ['./backlog.component.scss'],
  providers: [DatePipe],
})
export class BacklogComponent implements OnInit {
  selectedDate: Date | null = null;
  selectedFilter: 'created' | 'deadline' = 'created';
  tasks: Task[] = [];
  user: any;
  userData: any;

  constructor(
    private datePipe: DatePipe,
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    private router: Router,
    private taskService: TaskManagerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initializeDashboard();
  }

  initializeDashboard(): void {
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.fetchUser(data.email);
        this.fetchTasks(data.email);
      },
      error: () => {
        this.snackBar.open('Failed to load user data', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  fetchUser(email: string): void {
    this.userService.getUserByEmail(email).subscribe({
      next: (data) => (this.userData = data),
      error: () => {
        this.snackBar.open('Failed to load user details', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  fetchTasks(email: string): void {
    this.taskService.getTasks(email).subscribe({
      next: (data) => (this.tasks = data),
      error: () => {
        this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
      },
    });
  }

  onDateSelected(date: Date | null): void {
    this.selectedDate = date;
  }

  dateClass = (date: Date): string[] => {
    const dateStr = this.datePipe.transform(date, 'yyyy-MM-dd');
    const hasCreated = this.tasks.some(
      (task) =>
        this.datePipe.transform(task.createdAt, 'yyyy-MM-dd') === dateStr
    );
    const hasDeadline = this.tasks.some(
      (task) =>
        this.datePipe.transform(task.dateDeadline, 'yyyy-MM-dd') === dateStr
    );

    if (hasCreated && hasDeadline) return ['both-dates'];
    if (hasCreated) return ['created-date'];
    if (hasDeadline) return ['deadline-date'];
    return [];
  };

  get filteredTasks(): Task[] {
    if (!this.selectedDate) return [];

    const selectedDateStr = this.datePipe.transform(
      this.selectedDate,
      'yyyy-MM-dd'
    );
    return this.tasks.filter((task) => {
      const dateToCheck =
        this.selectedFilter === 'created' ? task.createdAt : task.dateDeadline;
      return (
        this.datePipe.transform(dateToCheck, 'yyyy-MM-dd') === selectedDateStr
      );
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high':
        return 'warn';
      case 'medium':
        return 'accent';
      default:
        return 'primary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'done':
        return 'check_circle';
      case 'in-progress':
        return 'hourglass_empty';
      default:
        return 'radio_button_unchecked';
    }
  }
}
