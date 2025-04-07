import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProjectManagerService } from '../../services/project-manager.service/project-manager.service';
import { GetCurrentUserService } from '../../services/get-current-user.service/get-current-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectTransferService } from '../../services/project-transfer.service/project-transfer.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from '../subcomponents/task-details/task-details.component';
import {
  ProjectTaskManagerService,
  ProjectTaskState,
  ProjectTask,
} from '../../services/project-task-manager.service/project-task-manager.service';

@Component({
  selector: 'app-project-details',
  standalone: false,
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss',
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
  project: any;
  user: any;
  projectTasks: ProjectTask[] = [];

  // Metrics
  totalTasksCreated = 0;
  totalTasksCompleted = 0;
  tasksInProgress = 0;
  taskCompletionPercentage = 0;
  tasksInProgressPercentage = 0;
  tasksNotPickedPercentage = 0;
  completionVelocity = 0;

  constructor(
    private projectService: ProjectManagerService,
    private taskService: ProjectTaskManagerService,
    private projectTransferService: ProjectTransferService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private getCurrentUser: GetCurrentUserService
  ) {}

  ngOnInit(): void {
    this.project = this.projectTransferService.getProject();
    if (this.project) {
      this.getCurrentUser.getCurrentUser().subscribe({
        next: (data) => {
          this.user = data;
          this.fetchProjectTasks(this.user.email); // Use dynamic email from logged-in user
        },
        error: (error) => {
          console.error('Error fetching current user:', error);
          this.snackBar.open('Failed to load user data', 'Close', {
            duration: 3000,
          });
        },
      });
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        console.warn('No project in service, fallback to ID:', id);
        // Optional: fetch project and tasks using ID
      }
    }
  }

  ngOnDestroy(): void {
    this.projectTransferService.clearProject();
  }

  fetchProjectTasks(email: string) {
    this.taskService.getProjectTasks(email).subscribe({
      next: (tasks) => {
        console.log("Project Tasks: ", tasks)
        this.projectTasks = tasks;
        this.calculateTaskMetrics(tasks);
      },
      error: () => {
        this.snackBar.open('Failed to load project tasks', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  calculateTaskMetrics(tasks: ProjectTask[]) {
    const total = tasks.length;
    const completed = tasks.filter(
      (t) => t.taskCompletionState === ProjectTaskState.Done
    ).length;
    const inProgress = tasks.filter(
      (t) => t.taskCompletionState === ProjectTaskState.InProgress
    ).length;
    const notPicked = tasks.filter(
      (t) => t.taskCompletionState === ProjectTaskState.ToDo
    ).length;

    this.totalTasksCreated = total;
    this.totalTasksCompleted = completed;
    this.tasksInProgress = inProgress;
    this.completionVelocity = completed;

    this.animateProgress(completed, inProgress, notPicked, total);
  }

  animateProgress(
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

      if (step >= steps) clearInterval(interval);
    }, 20);
  }

  openTaskDetails(task: ProjectTask): void {
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '500px',
      panelClass: 'task-creator-dialog',
      maxWidth: 'none',
      data: { task, projectId: this.project._id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.deleted) {
          this.projectTasks = this.projectTasks.filter(
            (t) => t._id !== result.taskId
          );
        } else {
          this.projectTasks = this.projectTasks.map((t) =>
            t._id === result._id ? result : t
          );
        }
        this.calculateTaskMetrics(this.projectTasks);
      }
    });
  }

  getStatusText(status: number): string {
    return ['To Do', 'In Progress', 'Done'][status] ?? 'Unknown';
  }

  getStatusClass(status: number): string {
    return ['todo', 'in-progress', 'done'][status] ?? '';
  }
}
