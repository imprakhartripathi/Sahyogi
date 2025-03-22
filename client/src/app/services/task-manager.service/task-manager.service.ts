import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export enum TaskState {
  ToDo = 100,
  InProgress = 200,
  Done = 300,
}

export interface Task {
  taskTitle: string;
  taskDesc: string;
  taskComplexityPoint: number;
  taskCompletionState: number;
  dateDeadline?: Date;
  aiPrioritizedID: number | null;
  reasonForPrioritizationID: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TaskManagerService {
  private baseUrl = 'http://localhost:4200/tasks'; // Base API URL

  constructor(private http: HttpClient) {}

  // ✅ Get tasks by email
  getTasks(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/get`, { email });
  }

  // ✅ Create a task
  createTask(taskData: {
    email: string;
    taskTitle: string;
    taskDesc: string;
    taskComplexityPoint: number;
    taskCompletionState: number;
    dateDeadline?: Date;
  }): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/create`, taskData)
      .pipe(catchError(this.handleError));
  }

  // ✅ Edit a task
  editTask(taskData: {
    email: string;
    taskId: string;
    updates: Partial<any>;
  }): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/edit`, taskData)
      .pipe(catchError(this.handleError));
  }

  // ✅ Delete a task (fixed method for DELETE)
  deleteTask(taskData: { email: string; taskId: string }): Observable<any> {
    return this.http
      .request<any>('DELETE', `${this.baseUrl}/delete`, { body: taskData })
      .pipe(catchError(this.handleError));
  }

  // 🛑 Error Handling
  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
