import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  _id?: string;
  taskNumber?: number;
  taskTitle: string;
  taskDesc: string;
  taskComplexityPoint: number;
  taskCompletionState: TaskState;
  dateDeadline?: Date;
  aiPrioritizedID?: number | null;
  reasonForPrioritizationID?: string | null;
}

export enum TaskState {
  ToDo = 100,
  InProgress = 200,
  Done = 300,
}

@Injectable({
  providedIn: 'root',
})
export class TaskManagerService {
  private apiUrl = 'http://localhost:4200/tasks'; // Express server running on port 4200

  constructor(private http: HttpClient) {}

  // Fetch all tasks for a user
  getTasks(email: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/get`, {
      params: { email },
    });
  }

  // Create a new task
  createTask(
    email: string,
    task: Omit<
      Task,
      '_id' | 'taskNumber' | 'aiPrioritizedID' | 'reasonForPrioritizationID'
    >
  ): Observable<Task> {
    console.log('Sending Task Data:', task);
    return this.http.post<Task>(`${this.apiUrl}/create`, { email, ...task });
  }

  // Edit an existing task (Partial update)
  editTask(
    email: string,
    taskId: string,
    updates: Partial<
      Omit<Task, 'taskNumber' | 'aiPrioritizedID' | 'reasonForPrioritizationID'>
    >
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/edit`, {
      email,
      taskId,
      ...updates,
    });
  }

  // Delete a task
  deleteTask(email: string, taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, {
      body: { email, taskId },
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
}
