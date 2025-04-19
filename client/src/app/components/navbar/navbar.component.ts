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
import { AuthenticatorService } from '../../services/authenticator.service/authenticator.service';
import { CreatorButtonOverlayComponent } from '../subcomponents/creator-button-overlay/creator-button-overlay.component';
import { Location } from '@angular/common';
import { TaskDetailsComponent } from '../subcomponents/task-details/task-details.component';
import { Task } from '../../services/task-manager.service/task-manager.service';
import { FormControl } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { Project } from '../../services/project-manager.service/project-manager.service';


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
  private creatorDialog: MatDialogRef<CreatorButtonOverlayComponent> | null =
    null;

  imgURL: string = '';
  value: any;
  user: any;
  tasks: any;
  projects: any;
  userData: any;
  isCollapsed: boolean = false;
  hideBadge: boolean = true;

  searchControl = new FormControl('');
  filteredOptions: any[] = [];

  constructor(
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    public router: Router,
    private http: HttpClient,
    private dialog: MatDialog,
    private authService: AuthenticatorService,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Fetch user data and extract tasks/projects
    this.getCurrentUser.getCurrentUser().subscribe((data) => {
      this.user = data;
      console.log(this.user);
      console.log(this.user.email);
      this.fetchUser(this.user.email);
    });
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
        this.badgeVisibility();
        this.imgURL = this.userData.imageURL;

        this.tasks = data.tasks || [];
        this.projects = data.projects || [];

        console.log('Tasks:', this.tasks);
        console.log('Projects:', this.projects);

        // Setup filtering logic
        this.searchControl.valueChanges
          .pipe(
            startWith(''),
            debounceTime(300),
            filter((value): value is string => value !== null), // <-- this line fixes the type issue
            map((value: string) => this._filter(value))
          )
          .subscribe((filtered) => {
            this.filteredOptions = filtered;
          });
      },
      (error) => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  private _filter(value: string): (Task | Project)[] {
    const filterValue = value?.toLowerCase() ?? '';

    // Create an array of task results with a 'type' key
    const taskResults = (this.tasks ?? []).map((task: Task) => ({
      ...task,
      name: task.taskTitle, // Ensure we normalize 'title' to 'name'
      type: 'Task' as const, // Temporarily add 'type' as 'Task'
    }));

    // Create an array of project results with a 'type' key
    const projectResults = (this.projects ?? []).map((project: Project) => ({
      ...project,
      name: project.projectTitle, // Normalize 'name' to 'name'
      type: 'Project' as const, // Temporarily add 'type' as 'Project'
    }));

    // Combine both task and project results
    const allResults = [...taskResults, ...projectResults];

    // If no filter value is provided, return all results
    if (!filterValue) {
      return allResults;
    }

    // Filter based on the 'name' property (task title or project name)
    return allResults.filter((item) =>
      item.name?.toLowerCase().includes(filterValue)
    );
  }

  onOptionSelected(selected: Task | Project): void {
    // Clear the search input field
    this.searchControl.setValue('');

    // Type guards to check if the selected item is a Task or Project
    if ((selected as Task).taskTitle) {
      // It's a Task, open the TaskDetailsComponent
      this.dialog.open(TaskDetailsComponent, {
        width: '500px',
        panelClass: 'task-creator-dialog',
        maxWidth: 'none',
        data: { task: selected, email: this.user.email },
      });
    } else if ((selected as Project).projectTitle) {
      // It's a Project, navigate to the project details page
      console.log(
        'Redirecting to the detailed Project Page with data: ',
        selected
      );
      this.router.navigate(['/project', selected._id]);
    }
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
        maxWidth: 'none',
        panelClass: 'custom-dialog-container',
      });

      this.notificationDialog.afterClosed().subscribe(() => {
        this.notificationDialog = null;
        window.location.reload(); // ✅ Reload happens AFTER dialog closes
      });
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
      this.creatorDialog = this.dialog.open(CreatorButtonOverlayComponent, {
        width: '400px',
        panelClass: 'creator-overlay-container',
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

  badgeVisibility(): void {
    if (
      this.userData?.notifications &&
      this.userData.notifications.some((notif: any) => notif.isRead === false)
    ) {
      this.hideBadge = false;
    } else {
      this.hideBadge = true;
    }
  }

  getUnreadNotificationCount(): number {
    if (!this.userData?.notifications) return 0;

    return this.userData.notifications.filter(
      (notif: any) => notif.isRead === false
    ).length;
  }

  getNotificationTooltip(): string {
    const count = this.getUnreadNotificationCount();
    return count > 0
      ? `${count} unread notification${count > 1 ? 's' : ''}`
      : 'No notifications';
  }
}
