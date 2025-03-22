import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetCurrentUserService } from '../../services/get-current-user.service/get-current-user.service';
import { UserService } from '../../services/user.service/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SettingsComponent } from '../subcomponents/settings/settings.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProfileComponent } from '../subcomponents/profile/profile.component';
import { AiPrioritizationComponent } from '../subcomponents/ai-prioritization/ai-prioritization.component';
import { NotificationsComponent } from '../subcomponents/notifications/notifications.component';
import { CreatorButtonComponent } from '../subcomponents/creator-button/creator-button.component';
import { AuthenticatorService } from '../../services/authenticator.service/authenticator.service';

@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  private settingsDialog: MatDialogRef<SettingsComponent> | null = null;
  private profileDialog: MatDialogRef<ProfileComponent> | null = null;
  private AIDialog: MatDialogRef<AiPrioritizationComponent> | null = null;
  private notificationDialog: MatDialogRef<NotificationsComponent> | null =
    null;
  private creatorDialog: MatDialogRef<CreatorButtonComponent> | null = null;
  imgURL: string = 'user.png';
  value: any;
  user: any;
  userData: any;
  isCollapsed: boolean = false;
  constructor(
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    public router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthenticatorService
  ) {}

  ngOnInit() {
    this.getCurrentUser.getCurrentUser().subscribe(
      (data) => {
        this.user = data;
        console.log(this.user);
        console.log(this.user.email);
        this.fetchUser(this.user.email);
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // isActive(url: string): boolean {
  //   return this.router.url === url;
  // }

  fetchUser(email: string) {
    this.userService.getUserByEmail(email).subscribe(
      (data) => {
        this.userData = data;
        console.log('User Data:', this.userData);
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  openProfileDialog(): void {
    if (!this.profileDialog) {
      this.profileDialog = this.dialog.open(ProfileComponent, {
        // width: '90%',
        // height: '80%',
        maxWidth: 'none',
        panelClass: 'custom-dialog-container',
      });
      this.profileDialog
        .afterClosed()
        .subscribe(() => (this.profileDialog = null));
    }
  }

  openSettingsDialog(): void {
    if (!this.settingsDialog) {
      this.settingsDialog = this.dialog.open(SettingsComponent, {
        // width: '1000px',
        // height: '90%',
        maxWidth: 'none',
        panelClass: 'custom-dialog-container',
      });
      this.settingsDialog
        .afterClosed()
        .subscribe(() => (this.settingsDialog = null));
    }
  }

  openNotificationsDialog(): void {
    if (!this.notificationDialog) {
      this.notificationDialog = this.dialog.open(NotificationsComponent, {
        // width: '1000px',
        // height: '90%',
        maxWidth: 'none',
        panelClass: 'custom-dialog-container',
      });
      this.notificationDialog
        .afterClosed()
        .subscribe(() => (this.notificationDialog = null));
    }
  }

  openSupport(): void {
    this.router.navigate(['/support']);
  }

  openAIPrioritizationDialog(): void {
    if (!this.AIDialog) {
      this.AIDialog = this.dialog.open(AiPrioritizationComponent, {
        // width: '1000px',
        // height: '90%',
        maxWidth: 'none',
        panelClass: 'custom-dialog-container',
      });
      this.AIDialog.afterClosed().subscribe(() => (this.AIDialog = null));
    }
  }

  openCreatorButtonDialog(): void {
    if (!this.creatorDialog) {
      this.creatorDialog = this.dialog.open(CreatorButtonComponent, {
        // width: '1000px',
        // height: '90%',
        maxWidth: 'none',
        panelClass: 'custom-dialog-container',
      });
      this.creatorDialog
        .afterClosed()
        .subscribe(() => (this.creatorDialog = null));
    }
  }

  search() {
    throw new Error('Method not implemented.');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }
}
