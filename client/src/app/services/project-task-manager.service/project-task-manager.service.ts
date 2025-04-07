import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export enum ProjectTaskState {
  ToDo = 100,
  InProgress = 200,
  Done = 300,
}

export interface ProjectTask {
  _id?: string;
  taskTitle: string;
  taskDesc: string;
  taskComplexityPoint: number;
  taskCompletionState: number;
  dateDeadline?: Date;
  createdAt?: Date;
  aiPrioritizedID?: number | null;
  reasonForPrioritizationID?: string | null;
}

export interface CreateProjectTaskData {
  email: string;
  projectId: string;
  taskTitle: string;
  taskDesc: string;
  taskComplexityPoint: number;
  taskCompletionState: number;
  dateDeadline?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectTaskManagerService {
  private baseUrl = 'http://localhost:4200/projects/tasks';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  // ✅ Get tasks for a user
  getProjectTasks(email: string): Observable<ProjectTask[]> {
    const params = new HttpParams().set('email', email);
    return this.http.get<ProjectTask[]>(`${this.baseUrl}/get`, { params }).pipe(
      tap((response) => console.log('API Response:', response)),
      catchError(this.handleError)
    );
  }

  // ✅ Create a new task (needs projectId)
  createProjectTask(taskData: CreateProjectTaskData): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/create`, taskData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // ✅ Edit a task (requires email, projectId, taskId, and updates)
  editProjectTask(taskData: {
    email: string;
    projectId: string;
    taskId: string;
    updates: Partial<ProjectTask>;
  }): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/edit`, taskData, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  // ✅ Delete a task (requires email, projectId, and taskId)
  deleteProjectTask(taskData: {
    email: string;
    projectId: string;
    taskId: string;
  }): Observable<any> {
    return this.http
      .request<any>('DELETE', `${this.baseUrl}/delete`, {
        headers: this.headers,
        body: taskData,
      })
      .pipe(catchError(this.handleError));
  }

  // ❌ Error handling
  private handleError(error: HttpErrorResponse) {
    console.error('Error occurred:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
