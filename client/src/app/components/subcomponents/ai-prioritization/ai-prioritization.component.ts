import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GetCurrentUserService } from '../../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../../services/user.service/user.service';
import { timer } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ai-prioritization',
  standalone: false,
  templateUrl: './ai-prioritization.component.html',
  styleUrls: ['./ai-prioritization.component.scss'],
})
export class AiPrioritizationComponent {
  isLoading = false;
  isProcessingAI = false; // New loader specifically for AI processing
  user: any;
  userData: any;
  prioritizedTasks: any;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.initializeDashboard();
  }

  initializeDashboard() {
    this.isLoading = true;
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.fetchUser(this.user.email);
        this.callAIPrioritization(this.user.email);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.snackBar.open('Failed to load user data', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  fetchUser(email: string) {
    this.isLoading = true;
    this.userService.getUserByEmail(email).subscribe({
      next: (data) => {
        this.userData = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.snackBar.open('Failed to load user details', 'Close', {
          duration: 3000,
        });
        this.isLoading = false;
      },
    });
  }

  callAIPrioritization(email: string) {
    this.isProcessingAI = true; // Show AI processing loader

    // Create a 5-second delay before making the actual call
    timer(5000)
      .pipe(
        finalize(() => {
          this.isProcessingAI = false; // Hide loader when done
        })
      )
      .subscribe(() => {
        this.http
          .get(`${environment.backendUrl}/ai/call`, {
            params: { email },
          })
          .subscribe({
            next: (response: any) => {
              this.prioritizedTasks = response;
              this.snackBar.open('Tasks prioritized successfully!', 'Close', {
                duration: 3000,
              });
            },
            error: (error) => {
              console.error('Error calling AI prioritization:', error);
              this.snackBar.open('Failed to prioritize tasks', 'Close', {
                duration: 3000,
              });
            },
          });
      });
  }
}
