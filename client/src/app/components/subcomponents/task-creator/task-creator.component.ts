// task-creator.component.ts
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskManagerService, CreateTaskData } from '../../../services/task-manager.service/task-manager.service';
import { GetCurrentUserService } from '../../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../../services/user.service/user.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-task-creator',
  standalone: false,
  templateUrl: './task-creator.component.html',
  styleUrl: './task-creator.component.scss',
})
export class TaskCreatorComponent {
  task: CreateTaskData = {
    email: '',
    taskTitle: '',
    taskDesc: '',
    taskComplexityPoint: 1,
    taskCompletionState: 100, // Default to To Do
    dateDeadline: undefined,
  };

  constructor(
    private taskService: TaskManagerService,
    private snackBar: MatSnackBar,
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    private dialog: MatDialog
  ) {
    this.initializeUser();
  }

  initializeUser() {
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.task.email = data.email;
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.snackBar.open('Failed to load user data', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onSubmit() {
    if (!this.task.email) {
      this.snackBar.open('User email is required', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.taskService.createTask(this.task).subscribe({
      next: () => {
        this.snackBar.open('Task created successfully!', 'Close', {
          duration: 3000,
        });
        this.resetForm();
        this.dialog.closeAll();
        window.location.reload();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.snackBar.open('Failed to create task', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onCancel() {
    this.dialog.closeAll();
  }

  private resetForm() {
    this.task = {
      email: this.task.email, // Keep the same email
      taskTitle: '',
      taskDesc: '',
      taskComplexityPoint: 1,
      taskCompletionState: 100,
      dateDeadline: undefined,
    };
  }
}
