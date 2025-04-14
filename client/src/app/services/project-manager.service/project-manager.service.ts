import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Task } from '../task-manager.service/task-manager.service';
import { environment } from '../../../enviroments/enviroment';

export enum ProjectCompletionState {
  YetToPickUp = 'Yet To Pick Up',
  PikedUp = 'Piked Up',
  InImplementation = 'In Implementation Phase',
  InTesting = 'In Testing Phase',
  Finished = 'Finished',
}

export interface Project {
  _id: string;
  projectTitle: string;
  projectDesc: string;
  projectComplexityPoint: number;
  projectDeadline: string;
  createdAt: Date | string;
  projectCompletionState: string;
  projectTasks: any[];

  totalTasksCreated?: number;
  totalTasksCompleted?: number;
  completionRate?: number;
}

export interface CreateProjectData {
  email: string;
  projectTitle: string;
  projectDesc: string;
  projectComplexityPoint: number;
  projectCompletionState: string;
  projectDeadline?: Date;
  projectTasks: Task[];
}

@Injectable({
  providedIn: 'root',
})
export class ProjectManagerService {
  private baseUrl = `${environment.backendUrl}/projects`; // Match your backend path
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  // ✅ Get projects by email
  getProjects(email: string): Observable<Project[]> {
    const params = new HttpParams().set('email', email);
    return this.http.get<Project[]>(`${this.baseUrl}/get`, { params }).pipe(
      tap((response) => console.log('Fetched Projects:', response)),
      catchError(this.handleError)
    );
  }

  // ✅ Create a project
  createProject(projectData: CreateProjectData): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/create`, projectData, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  // ✅ Edit a project
  editProject(projectData: {
    email: string;
    projectId: string;
    updates: Partial<Omit<Project, '_id' | 'createdAt' | 'updatedAt'>>;
  }): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/edit`, projectData, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  // ✅ Delete a project
  deleteProject(projectData: {
    email: string;
    projectId: string;
  }): Observable<any> {
    return this.http
      .request<any>('DELETE', `${this.baseUrl}/delete`, {
        body: projectData,
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  // 🛑 Error Handler
  private handleError(error: HttpErrorResponse) {
    console.error('Project Service Error:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
