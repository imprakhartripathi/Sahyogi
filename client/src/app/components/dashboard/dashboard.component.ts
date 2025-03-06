import { Component, OnInit } from '@angular/core';
import { GetCurrentUserService } from '../../services/get-current-user.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../services/authenticator.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  user: any; // Holds the current user data
  userData: any; // Holds additional user data fetched by email
  issuedate: string | null = null; // Holds the formatted "iat" date

  recentTasks: any[] = [];
  aiTasks: any[] = [];
  projects: any[] = [];
  pagedTasks: { recentTasks: any[]; aiTasks: any[]; projects: any[] } = {
    recentTasks: [],
    aiTasks: [],
    projects: [],
  };
  currentPage = {
    recentTasks: 0,
    aiTasks: 0,
    projects: 0,
  };
  itemsPerPage = 4;

  constructor(
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    private router: Router,
    private authservice: AuthenticatorService
  ) {}

  ngOnInit() {
    this.initializeDashboard(); // Call the method to initialize the dashboard
  }

  // Method to initialize the dashboard
  initializeDashboard() {
    this.getCurrentUser.getCurrentUser().subscribe(
      (data) => {
        this.user = data;
        console.log('Current User:', this.user);

        // Fetch additional user data using the email
        this.fetchUser(this.user.email);

        // Format the "iat" timestamp
        if (this.user.iat) {
          this.issuedate = this.formatDate(this.user.iat);
          console.log('Formatted Issued Date:', this.issuedate);
        }

        // Fetch tasks and projects
        this.loadTasksAndProjects();
      },
      (error) => {
        console.error('Error fetching current user:', error);
      }
    );
  }

  // Method to fetch additional user data by email
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

  // Method to format the "iat" timestamp
  formatDate(iat: number): string {
    const date = new Date(iat * 1000); // Convert seconds to milliseconds
    return date.toLocaleString(); // Format the date as a readable string
  }

  // Method to log out the user
  logout() {
    this.authservice.logout();
  }

  // Load tasks and projects
  loadTasksAndProjects() {
    // Sample data (replace with API calls if needed)
    this.recentTasks = [
      { title: 'Task 1', description: 'Recent task description' },
      { title: 'Task 2', description: 'Recent task description' },
      { title: 'Task 3', description: 'Recent task description' },
      { title: 'Task 4', description: 'Recent task description' },
      { title: 'Task 5', description: 'Recent task description' },
    ];

    this.aiTasks = [
      { title: 'AI Task 1', description: 'AI prioritized task' },
      { title: 'AI Task 2', description: 'AI prioritized task' },
      { title: 'AI Task 3', description: 'AI prioritized task' },
      { title: 'AI Task 4', description: 'AI prioritized task' },
    ];

    this.projects = [
      { name: 'Project 1', details: 'Project description' },
      { name: 'Project 2', details: 'Project description' },
      { name: 'Project 3', details: 'Project description' },
      { name: 'Project 4', details: 'Project description' },
    ];

    this.updatePagedTasks();
  }

  updatePagedTasks() {
    this.pagedTasks.recentTasks = this.paginate(
      this.recentTasks,
      this.currentPage.recentTasks
    );
    this.pagedTasks.aiTasks = this.paginate(
      this.aiTasks,
      this.currentPage.aiTasks
    );
    this.pagedTasks.projects = this.paginate(
      this.projects,
      this.currentPage.projects
    );
  }

  paginate(items: any[], page: number): any[] {
    const start = page * this.itemsPerPage;
    return items.slice(start, start + this.itemsPerPage);
  }

  prevPage(type: 'recentTasks' | 'aiTasks' | 'projects') {
    if (this.currentPage[type] > 0) {
      this.currentPage[type]--;
      this.updatePagedTasks();
    }
  }

  nextPage(type: 'recentTasks' | 'aiTasks' | 'projects') {
    if ((this.currentPage[type] + 1) * this.itemsPerPage < this[type].length) {
      this.currentPage[type]++;
      this.updatePagedTasks();
    }
  }
}
