import { Component, OnInit } from '@angular/core';
import { TaskManagerService, TaskState, Task } from '../../services/task-manager.service/task-manager.service';
import { GetCurrentUserService } from '../../services/get-current-user.service/get-current-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDetailsComponent } from '../subcomponents/task-details/task-details.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskCreatorComponent } from '../subcomponents/task-creator/task-creator.component';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

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

  dateSortOrder: 'newest' | 'oldest' = 'newest';
  complexitySortOrder: 'highToLow' | 'lowToHigh' = 'highToLow';

  constructor(
    private taskService: TaskManagerService,
    private getCurrentUser: GetCurrentUserService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.loadTasks(this.user.email);
      },
      error: (error) => {
        console.error('Failed to load user:', error);
        this.snackBar.open('Failed to load user data', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  // Modify your loadTasks method to apply initial sorting
  loadTasks(email: string): void {
    this.taskService.getTasks(email).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.applySorting(); // Apply sorting when tasks are loaded
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
        this.snackBar.open('Failed to load tasks', 'Close', { duration: 3000 });
      },
    });
  }

  categorizeTasks(): void {
    this.todoTasks = this.tasks.filter(
      (task) => task.taskCompletionState === TaskState.ToDo
    );
    this.inProgressTasks = this.tasks.filter(
      (task) => task.taskCompletionState === TaskState.InProgress
    );
    this.doneTasks = this.tasks.filter(
      (task) => task.taskCompletionState === TaskState.Done
    );
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

  createTask(): void {
    this.dialog.open(TaskCreatorComponent, {
      panelClass: 'task-creator-dialog',
      maxWidth: 'none',
    });
  }

  onTaskDrop(
    event: CdkDragDrop<Task[]>,
    targetState: 'ToDo' | 'InProgress' | 'Done'
  ): void {
    if (event.previousContainer === event.container) {
      return; // Same container, no need to update
    }

    const movedTask = event.previousContainer.data[event.previousIndex];

    // Transfer task in UI
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    // Update task state
    let newState: TaskState;
    switch (targetState) {
      case 'ToDo':
        newState = TaskState.ToDo;
        break;
      case 'InProgress':
        newState = TaskState.InProgress;
        break;
      case 'Done':
        newState = TaskState.Done;
        break;
    }

    // Only update if the state actually changed
    if (movedTask.taskCompletionState !== newState) {
      movedTask.taskCompletionState = newState;
      this.taskService
        .editTask({
          email: this.user.email,
          taskId: movedTask._id!,
          updates: { taskCompletionState: newState },
        })
        .subscribe({
          next: () => {
            this.snackBar.open('Task updated successfully', 'Close', {
              duration: 2000,
            });
          },
          error: (err) => {
            console.error('Failed to update task:', err);
            this.snackBar.open('Failed to update task state', 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }

  sortByDate(order: 'newest' | 'oldest'): void {
    this.dateSortOrder = order;
    this.loadTasks(this.user.email); // Reload tasks to reset sorting
    // OR if you don't want to reload from server:
    this.applySorting();
  }

  sortByComplexity(order: 'highToLow' | 'lowToHigh'): void {
    this.complexitySortOrder = order;
    this.loadTasks(this.user.email); // Reload tasks to reset sorting
    // OR if you don't want to reload from server:
    this.applySorting();
  }

  private applySorting(): void {
    // Create a fresh copy of the tasks array to avoid mutating the original
    let sortedTasks = [...this.tasks];

    // Apply date sorting first
    sortedTasks.sort((a: Task, b: Task) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return this.dateSortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    // Then apply complexity sorting (this will maintain relative order from date sort)
    sortedTasks.sort((a: Task, b: Task) => {
      const complexityA = a.taskComplexityPoint ?? 0;
      const complexityB = b.taskComplexityPoint ?? 0;

      // Only sort by complexity if complexities are different
      if (complexityA !== complexityB) {
        return this.complexitySortOrder === 'highToLow'
          ? complexityB - complexityA
          : complexityA - complexityB;
      }
      // If complexities are equal, maintain the previous sort order (by date)
      return 0;
    });

    // Update the tasks array with the sorted results
    this.tasks = sortedTasks;
    this.categorizeTasks();
  }
}
