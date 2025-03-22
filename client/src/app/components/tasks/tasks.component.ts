import { Component, OnInit } from '@angular/core';
import { TaskManagerService, TaskState, Task } from './../../services/task-manager.service/task-manager.service'
import { GetCurrentUserService } from '../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../services/user.service/user.service';

@Component({
  selector: 'app-tasks',
  standalone: false,
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  email: string = 'user@example.com'; // Replace with dynamic email if needed
  newTask: Task = {
    taskTitle: '',
    taskDesc: '',
    taskComplexityPoint: 1,
    taskCompletionState: TaskState.ToDo,
    aiPrioritizedID: null,
    reasonForPrioritizationID: null,
  };

  constructor(private taskService: TaskManagerService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  // Load tasks
  loadTasks() {
    this.taskService.getTasks(this.email).subscribe((response) => {
      this.tasks = response;
    });
  }

  // Create a new task
  createTask() {
    this.taskService
      .createTask({ ...this.newTask, email: this.email })
      .subscribe(() => {
        this.loadTasks();
        this.newTask = {
          // Reset input fields
          taskTitle: '',
          taskDesc: '',
          taskComplexityPoint: 1,
          taskCompletionState: TaskState.ToDo,
          aiPrioritizedID: null,
          reasonForPrioritizationID: null,
        };
      });
  }

  // Edit a task
  editTask(taskId: string, updatedTask: Partial<Task>) {
    this.taskService
      .editTask({ email: this.email, taskId, updates: updatedTask })
      .subscribe(() => {
        this.loadTasks();
      });
  }

  // Delete a task
  deleteTask(taskId: string) {
    this.taskService.deleteTask({ email: this.email, taskId }).subscribe(() => {
      this.loadTasks();
    });
  }
}
