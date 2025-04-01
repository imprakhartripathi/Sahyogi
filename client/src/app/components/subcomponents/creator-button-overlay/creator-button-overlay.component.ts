// creator-overlay.component.ts
import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TaskCreatorComponent } from '../task-creator/task-creator.component';
import { ProjectCreatorComponent } from '../project-creator/project-creator.component';

@Component({
  selector: 'app-creator-button-overlay',
  standalone: false,
  template: `
    <div class="creator-overlay">
      <h2>Create New</h2>
      <div class="options-container">
        <button mat-flat-button (click)="createTask()">
          <mat-icon>task</mat-icon>
          Task
        </button>
        <button mat-flat-button (click)="createProject()">
          <mat-icon>business_center</mat-icon>
          Project
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .creator-overlay {
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      h2 {
        margin-bottom: 20px;
        color: #3f51b5;
      }
      .options-container {
        display: flex;
        gap: 16px;
        width: 100%;
        justify-content: center;
      }
      button {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 75px;
        width: 200px;
        font-size: 18px;
        gap: 10px;
      }
      mat-icon {
        scale: 1.75;
        font-size: 36px;
        height: 20px;
        width: 36px;
      }
    `,
  ],
})
export class CreatorButtonOverlayComponent {
  constructor(
    private dialogRef: MatDialogRef<CreatorButtonOverlayComponent>,
    private dialog: MatDialog,
    private router: Router
  ) {}

  createTask(): void {
    this.dialogRef.close();
    this.dialog.open(TaskCreatorComponent, {
      panelClass: 'task-creator-dialog',
      maxWidth: 'none',
    });
  }

  createProject(): void {
    this.dialogRef.close();
    this.dialog.open(ProjectCreatorComponent, {
      width: '800px',
      panelClass: 'custom-dialog-container',
      // Add any other configuration you need for the project creator dialog
    });
  }
}
