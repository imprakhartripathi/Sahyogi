import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ProjectTaskManagerService,
  ProjectTask,
  ProjectTaskState,
} from '../../../services/project-task-manager.service/project-task-manager.service';

@Component({
  selector: 'app-project-task-details',
  standalone: false,
  templateUrl: './project-task-details.component.html',
  styleUrls: ['./project-task-details.component.scss'],
})
export class ProjectTaskDetailsComponent implements OnInit {
  taskForm!: FormGroup;
  taskStates = Object.values(ProjectTaskState).filter(
    (v) => typeof v === 'number'
  );
  stateEnum = ProjectTaskState;

  constructor(
    private fb: FormBuilder,
    private taskService: ProjectTaskManagerService,
    private dialogRef: MatDialogRef<ProjectTaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      email: string;
      projectId: string;
      task: ProjectTask;
    }
  ) {}

  ngOnInit(): void {
    const task = this.data.task;

    this.taskForm = this.fb.group({
      taskTitle: [task.taskTitle, Validators.required],
      taskDesc: [task.taskDesc],
      taskComplexityPoint: [
        task.taskComplexityPoint,
        [Validators.required, Validators.min(1)],
      ],
      taskCompletionState: [task.taskCompletionState, Validators.required],
      dateDeadline: [task.dateDeadline],
    });
  }

  onSave(): void {
    if (this.taskForm.invalid) return;

    this.taskService
      .editProjectTask({
        email: this.data.email,
        projectId: this.data.projectId,
        taskId: this.data.task._id!,
        updates: this.taskForm.value,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(`Failed to update task: ${err.message}`),
      });
  }

  onDelete(): void {
    this.taskService
      .deleteProjectTask({
        email: this.data.email,
        projectId: this.data.projectId,
        taskId: this.data.task._id!,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(`Failed to delete task: ${err.message}`),
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
