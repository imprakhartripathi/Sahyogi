import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../../../services/task-manager.service/task-manager.service';

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
    public dialogRef: MatDialogRef<TaskDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public task: Task
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      taskTitle: [{ value: this.task.taskTitle, disabled: true }],
      taskDesc: [{ value: this.task.taskDesc, disabled: true }],
      taskComplexityPoint: [
        { value: this.task.taskComplexityPoint, disabled: true },
      ],
      taskCompletionState: [
        { value: this.task.taskCompletionState, disabled: true },
      ],
      dateDeadline: [{ value: this.task.dateDeadline, disabled: true }],
    });

    this.taskForm.valueChanges.subscribe(() => {
      this.hasChanges = this.taskForm.dirty;
    });
  }

  enableEditing(): void {
    this.isEditing = true;
    this.taskForm.enable();
    this.taskForm.controls['email'].disable(); // Keep email disabled
  }

  saveChanges(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.getRawValue());
    }
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
