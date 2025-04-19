import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../enviroments/enviroment';

export enum TaskState {
  ToDo = 100,
  InProgress = 200,
  Done = 300,
}

export interface Task {
  _id?: string;  // Make optional if it might not exist in all cases
  taskTitle: string;
  taskDesc: string;
  taskComplexityPoint: number;
  taskCompletionState: number;
  dateDeadline?: Date;
  createdAt: Date;
  aiPrioritizedID?: number | null;
  reasonForPrioritizationID?: string | null;
}

// Add a specific interface for create task payload
export interface CreateTaskData {
  email: string;
  taskTitle: string;
  taskDesc: string;
  taskComplexityPoint: number;
  taskCompletionState: number;
  dateDeadline?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class TaskManagerService {
  private baseUrl = `${environment.backendUrl}/tasks`; // Relative path
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  // ✅ Get tasks by email (updated to match Postman working request)
  getTasks(email: string): Observable<Task[]> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Task[]>(`${this.baseUrl}/get`, { params }).pipe(
      tap((response) => console.log('API Response:', response)),
      catchError(this.handleError)
    );
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
