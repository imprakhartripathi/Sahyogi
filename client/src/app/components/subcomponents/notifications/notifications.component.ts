import { NgModule, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetCurrentUserService } from '../../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../../services/user.service/user.service';
import { Router } from '@angular/router';
import { TaskManagerService } from '../../../services/task-manager.service/task-manager.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroments/enviroment';

export enum NotificationType {
  System = "system",
  Task = "task",
  Project = "project",
  ProjectTask = "project-task"
}

@Component({
  selector: 'app-notifications',
  standalone: false,
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  user: any;
  userData: any;
  notifications: any[] = [];

  constructor(
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    private router: Router,
    private taskService: TaskManagerService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.initializeNotifications();
  }

  initializeNotifications() {
    this.getCurrentUser.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.fetchNotifications(this.user.email);
      },
      error: (error) => {
        console.error('Error fetching current user:', error);
        this.snackBar.open('Failed to load user data', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  fetchNotifications(email: string) {
    this.http
      .get<any>(`${environment.backendUrl}/user/notifications/get`, {
        params: { email },
      })
      .subscribe({
        next: (res) => {
          this.notifications = res.notifications.sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        },
        error: (err) => {
          console.error('Error fetching notifications:', err);
          this.snackBar.open('Failed to load notifications', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  markAsRead(email: string, id: string, isRead: boolean) {
    if (isRead) return;

    this.http
      .put(
        `${environment.backendUrl}/user/notifications/read`,
        { isRead: true },
        {
          params: { email, notificationId: id },
        }
      )
      .subscribe({
        next: () => {
          const notif = this.notifications.find((n) => n._id === id);
          if (notif) notif.isRead = true;
        },
        error: (err) => {
          console.error('Error marking notification as read:', err);
          this.snackBar.open('Failed to update notification', 'Close', {
            duration: 3000,
          });
        },
      });
  }

  formatNotificationType(type: string): string {
    const values = Object.values(NotificationType);
    if (values.includes(type as NotificationType)) {
      return type
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'Unknown';
  }
}
