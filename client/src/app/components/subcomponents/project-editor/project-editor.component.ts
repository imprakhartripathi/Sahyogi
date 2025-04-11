import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Project,
  ProjectManagerService,
  ProjectCompletionState,
} from '../../../services/project-manager.service/project-manager.service';

@Component({
  selector: 'app-project-editor',
  standalone: false,
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.scss'],
})
export class ProjectEditorComponent implements OnInit {
  projectForm!: FormGroup;
  completionStates = Object.values(ProjectCompletionState);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectManagerService,
    private dialogRef: MatDialogRef<ProjectEditorComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      email: string;
      project: Project;
    }
  ) {}

  ngOnInit(): void {
    const project = this.data.project;

    this.projectForm = this.fb.group({
      projectTitle: [project.projectTitle, Validators.required],
      projectDesc: [project.projectDesc],
      projectComplexityPoint: [
        project.projectComplexityPoint,
        [Validators.required, Validators.min(1)],
      ],
      projectDeadline: [project.projectDeadline],
      projectCompletionState: [
        project.projectCompletionState,
        Validators.required,
      ],
    });
  }

  onSave(): void {
    if (this.projectForm.invalid) return;

    this.projectService
      .editProject({
        email: this.data.email,
        projectId: this.data.project._id,
        updates: this.projectForm.value,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(`Failed to update project: ${err.message}`),
      });
  }

  onDelete(): void {
    this.projectService
      .deleteProject({
        email: this.data.email,
        projectId: this.data.project._id,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => alert(`Failed to delete project: ${err.message}`),
      });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
