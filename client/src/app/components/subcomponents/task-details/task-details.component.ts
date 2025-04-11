import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Task,
  TaskManagerService,
} from '../../../services/task-manager.service/task-manager.service';

interface TaskDialogData {
  task: Task;
  email: string;
}

@Component({
  selector: 'app-task-details',
  standalone: false,
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit {
  taskForm!: FormGroup;
  isEditing = false;
  hasChanges = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskManagerService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData // Use a structured data object
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      taskTitle: [{ value: this.data.task.taskTitle, disabled: true }],
      taskDesc: [{ value: this.data.task.taskDesc, disabled: true }],
      taskComplexityPoint: [
        { value: this.data.task.taskComplexityPoint, disabled: true },
      ],
      taskCompletionState: [
        { value: this.data.task.taskCompletionState, disabled: true },
      ],
      dateDeadline: [{ value: this.data.task.dateDeadline, disabled: true }],
    });

    this.taskForm.valueChanges.subscribe(() => {
      this.hasChanges = this.taskForm.dirty;
    });
  }

  enableEditing(): void {
    this.isEditing = true;
    this.taskForm.enable();
  }

  saveChanges(): void {
    if (this.taskForm.valid) {
      const updatedTask = { ...this.data.task, ...this.taskForm.getRawValue() };

      this.taskService
        .editTask({
          email: this.data.email, // Use the passed email
          taskId: this.data.task._id!,
          updates: updatedTask,
        })
        .subscribe({
          next: () => {
            this.snackBar.open('Task updated successfully!', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close(updatedTask);
          },
          error: (error) => {
            console.error('Error updating task:', error);
            this.snackBar.open('Failed to update task', 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }

  deleteTask(): void {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this task? This action CANNOT be undone!'
    );

    if (confirmDelete) {
      this.taskService
        .deleteTask({
          email: this.data.email, // Use the passed email
          taskId: this.data.task._id!,
        })
        .subscribe({
          next: () => {
            this.snackBar.open('Task deleted successfully!', 'Close', {
              duration: 3000,
            });
            this.dialogRef.close({ deleted: true, taskId: this.data.task._id });
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            this.snackBar.open('Failed to delete task', 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
