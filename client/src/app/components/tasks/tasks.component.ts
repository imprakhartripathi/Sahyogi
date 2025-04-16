import { Component, OnInit } from '@angular/core';
import { TaskManagerService, TaskState, Task } from '../../services/task-manager.service/task-manager.service';
import { GetCurrentUserService } from '../../services/get-current-user.service/get-current-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDetailsComponent } from '../subcomponents/task-details/task-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  user: any;
  tasks: Task[] = [];

  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(
    private taskService: TaskManagerService,
    private getCurrentUser: GetCurrentUserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.loadTasks(this.user.email);
      },
      error: (error) => {
        console.error('Failed to load user:', error);
        this.snackBar.open('Failed to load user data', 'Close', { duration: 3000 });
      }
    });
  }

  loadTasks(email: string): void {
    this.taskService.getTasks(email).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.categorizeTasks();
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
      }
    });
  }

  categorizeTasks(): void {
    this.todoTasks = this.tasks.filter(task => task.taskCompletionState === TaskState.ToDo);
    this.inProgressTasks = this.tasks.filter(task => task.taskCompletionState === TaskState.InProgress);
    this.doneTasks = this.tasks.filter(task => task.taskCompletionState === TaskState.Done);
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
        }
      });
    }
}
