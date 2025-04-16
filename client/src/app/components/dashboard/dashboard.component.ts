import { Component, OnInit } from '@angular/core';
import { GetCurrentUserService } from '../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../services/user.service/user.service';
import { Router } from '@angular/router';
import {
  TaskManagerService,
  TaskState,
  Task,
} from '../../services/task-manager.service/task-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDetailsComponent } from '../subcomponents/task-details/task-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: any;
  userData: any;
  tasks: Task[] = [];
  recentTasks: Task[] = []; // Add this property

  isLoading: boolean = false;

  // Task metrics
  totalTasksCreated: number = 0;
  totalTasksCompleted: number = 0;
  tasksInProgress: number = 0;
  completionVelocity: number = 0;
  completionRate: number = 0;

  // Progress values
  taskCompletionPercentage: number = 0;
  tasksInProgressPercentage: number = 0;
  tasksNotPickedPercentage: number = 0;

  constructor(
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    private router: Router,
    private taskService: TaskManagerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initializeDashboard();
  }

  initializeDashboard() {
    this.isLoading = true;
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.fetchUser(this.user.email);
        this.fetchTasks(this.user.email);

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.snackBar.open('Failed to load user data', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  fetchUser(email: string) {
    this.isLoading = true;
    this.userService.getUserByEmail(email).subscribe({
      next: (data) => {
        this.userData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.snackBar.open('Failed to load user details', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  fetchTasks(email: string) {
    this.isLoading = true;
    this.taskService.getTasks(email).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.calculateTaskMetrics();
        this.updateRecentTasks();

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
        this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
        this.isLoading = false;
      },
    });
  }

  private updateRecentTasks() {
    // Sort tasks by createdAt date (newest first)
    const sortedTasks = [...this.tasks].sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    // Take the first 2 tasks
    this.recentTasks = sortedTasks.slice(0, 3);
  }

  getStatusText(status: number): string {
    switch (status) {
      case TaskState.ToDo:
        return 'To Do';
      case TaskState.InProgress:
        return 'In Progress';
      case TaskState.Done:
        return 'Done';
      default:
        return 'Unknown';
    }
  }

  getStatusClass(status: number): string {
    switch (status) {
      case TaskState.ToDo:
        return 'todo';
      case TaskState.InProgress:
        return 'in-progress';
      case TaskState.Done:
        return 'done';
      default:
        return '';
    }
  }

  openTaskDetails(task: Task): void {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '500px',
      panelClass: 'task-creator-dialog',
      maxWidth: 'none',
      data: { task, email: this.user.email }, // Pass email separately
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.deleted) {
          // Remove the deleted task from the list
          this.tasks = this.tasks.filter((t) => t._id !== result.taskId);
        } else {
          // Update the edited task in the list
          this.tasks = this.tasks.map((t) =>
            t._id === result._id ? result : t
          );
        }
        window.location.reload();
        this.calculateTaskMetrics();
      }
    });
  }

  // createTask(
  //   taskData: Omit<Task, 'aiPrioritizedID' | 'reasonForPrioritizationID'> & {
  //     email: string;
  //   }
  // ) {
  //   this.taskService.createTask(taskData).subscribe({
  //     next: () => {
  //       this.snackBar.open('Task created successfully!', 'Close', {
  //         duration: 3000,
  //       });
  //       this.fetchTasks(this.user.email);
  //     },
  //     error: (error) => {
  //       console.error('Error creating task:', error);
  //       this.snackBar.open('Failed to create task', 'Close', {
  //         duration: 3000,
  //       });
  //     },
  //   });
  // }

  updateTask(taskId: string, updates: Partial<Task>) {
    if (!this.user?.email) return;
    this.isLoading = true;
    this.taskService
      .editTask({
        email: this.user.email,
        taskId,
        updates,
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Task updated successfully!', 'Close', {
            duration: 3000,
          });
          this.fetchTasks(this.user.email);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.snackBar.open('Failed to update task', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
  }

  deleteTask(taskId: string) {
    if (!this.user?.email) return;
    this.isLoading = true;
    this.taskService
      .deleteTask({
        email: this.user.email,
        taskId,
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Task deleted successfully!', 'Close', {
            duration: 3000,
          });
          this.fetchTasks(this.user.email);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.snackBar.open('Failed to delete task', 'Close', {
            duration: 3000,
          });
          this.isLoading = false;
        },
      });
  }

  calculateTaskMetrics() {
    // Overall metrics
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(
      (task) => task.taskCompletionState === TaskState.Done
    ).length;
    this.tasksInProgress = this.tasks.filter(
      (task) => task.taskCompletionState === TaskState.InProgress
    ).length;
    const notPickedTasks = this.tasks.filter(
      (task) => task.taskCompletionState === TaskState.ToDo
    ).length;

    // Calculate values
    this.totalTasksCreated = totalTasks;
    this.totalTasksCompleted = completedTasks;
    this.completionVelocity = completedTasks; // You might want to calculate this differently for all-time metrics
    this.completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    this.animateProgress(
      completedTasks,
      this.tasksInProgress,
      notPickedTasks,
      totalTasks
    );
  }

  private animateProgress(
    completed: number,
    inProgress: number,
    notPicked: number,
    total: number
  ) {
    if (total === 0) {
      this.taskCompletionPercentage = 0;
      this.tasksInProgressPercentage = 0;
      this.tasksNotPickedPercentage = 0;
      return;
    }

    const steps = 100;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      this.taskCompletionPercentage = Math.min(
        (completed / total) * 100,
        (step / steps) * 100
      );
      this.tasksInProgressPercentage = Math.min(
        (inProgress / total) * 100,
        (step / steps) * 100
      );
      this.tasksNotPickedPercentage = Math.min(
        (notPicked / total) * 100,
        (step / steps) * 100
      );

      if (step >= steps) {
        clearInterval(interval);
      }
    }, 20);
  }
}
