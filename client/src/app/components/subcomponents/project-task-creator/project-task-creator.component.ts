import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ProjectTaskManagerService,
  CreateProjectTaskData,
  ProjectTaskState,
} from '../../../services/project-task-manager.service/project-task-manager.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-task-creator',
  standalone: false,
  templateUrl: './project-task-creator.component.html',
  styleUrls: ['./project-task-creator.component.scss'],
})
export class ProjectTaskCreatorComponent {
  taskForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  taskStates = [
    { label: 'To Do', value: ProjectTaskState.ToDo },
    { label: 'In Progress', value: ProjectTaskState.InProgress },
    { label: 'Done', value: ProjectTaskState.Done },
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: ProjectTaskManagerService,
    private dialogRef: MatDialogRef<ProjectTaskCreatorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { email: string; projectId: string }
  ) {
    this.taskForm = this.fb.group({
      taskTitle: ['', Validators.required],
      taskDesc: ['', Validators.required],
      taskComplexityPoint: [1, [Validators.required, Validators.min(1)]],
      taskCompletionState: [ProjectTaskState.ToDo, Validators.required],
      dateDeadline: [null],
    });
  }

  createTask() {
    if (this.taskForm.invalid) return;

    const taskData: CreateProjectTaskData = {
      ...this.taskForm.value,
      email: this.data.email,
      projectId: this.data.projectId,
    };

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.taskService.createProjectTask(taskData).subscribe({
      next: () => {
        this.successMessage = 'Task created successfully!';
        this.dialogRef.close(true); // Notify parent
      },
      error: (err) => {
        this.errorMessage = err.message || 'Failed to create task.';
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }
}
