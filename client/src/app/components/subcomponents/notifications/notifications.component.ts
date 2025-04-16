import { NgModule, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetCurrentUserService } from '../../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../../services/user.service/user.service';
import { Router } from '@angular/router';
import { TaskManagerService } from '../../../services/task-manager.service/task-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  user: any;
  userData: any;
  constructor(
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    private router: Router,
    private taskService: TaskManagerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.initializeDashboard();
  }

  initializeDashboard() {
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.fetchUser(this.user.email);
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.snackBar.open('Failed to load user data', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  fetchUser(email: string) {
    this.userService.getUserByEmail(email).subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.snackBar.open('Failed to load user details', 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
