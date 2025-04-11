import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import {
  ProjectManagerService,
  CreateProjectData,
  ProjectCompletionState,
} from '../../../services/project-manager.service/project-manager.service';
import { GetCurrentUserService } from '../../../services/get-current-user.service/get-current-user.service';

@Component({
  selector: 'app-project-creator',
  standalone: false,
  templateUrl: './project-creator.component.html',
  styleUrl: './project-creator.component.scss',
})
export class ProjectCreatorComponent {
  project: CreateProjectData = {
    email: '',
    projectTitle: '',
    projectDesc: '',
    projectComplexityPoint: 1,
    projectCompletionState: ProjectCompletionState.YetToPickUp,
    projectDeadline: undefined,
    projectTasks: [],
  };

  projectStates = Object.values(ProjectCompletionState);

  constructor(
    private projectService: ProjectManagerService,
    private snackBar: MatSnackBar,
    private getCurrentUser: GetCurrentUserService,
    private dialog: MatDialog
  ) {
    this.initializeUser();
  }

  initializeUser() {
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.project.email = data.email;
      },
      error: () => {
        this.snackBar.open('Failed to load user data', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onSubmit() {
    if (!this.project.email) {
      this.snackBar.open('User email is required', 'Close', { duration: 3000 });
      return;
    }

    this.projectService.createProject(this.project).subscribe({
      next: () => {
        this.snackBar.open('Project created successfully!', 'Close', {
          duration: 3000,
        });
        this.resetForm();
        this.dialog.closeAll();
        window.location.reload();
      },
      error: (error) => {
        console.error('Error creating project:', error);
        this.snackBar.open('Failed to create project', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  onCancel() {
    this.dialog.closeAll();
  }

  private resetForm() {
    this.project = {
      email: this.project.email,
      projectTitle: '',
      projectDesc: '',
      projectComplexityPoint: 1,
      projectCompletionState: ProjectCompletionState.YetToPickUp,
      projectDeadline: undefined,
      projectTasks: [],
    };
  }
}
