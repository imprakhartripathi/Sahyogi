import { Component, OnInit } from '@angular/core';
import { GetCurrentUserService } from '../../../services/get-current-user.service';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { AuthenticatorService } from '../../../services/authenticator.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: any; // Holds the current user data
  userData: any; // Holds additional user data fetched by email
  issuedate: string | null = null; // Holds the formatted "iat" date

  constructor(
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    private router: Router,
    private authservice: AuthenticatorService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.initialize(); // Call the method to initialize the dashboard
  }

  // Method to initialize the dashboard
  initialize() {
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
    this.dialog.closeAll();
  }
}
