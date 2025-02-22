import { Component, OnInit } from '@angular/core';
import { GetCurrentUserService } from '../../services/get-current-user.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router'; // Import Router
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  user: any;
  userData: any;
  issuedate: any;
  constructor(
    private getCurrentUser: GetCurrentUserService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.getCurrentUser.getCurrentUser().subscribe(
      (data) => {
        this.user = data;
        console.log(this.user.email);
        this.fetchUser(this.user.email);
        this.issuedate = new Date(this.user.iat * 1000)
        console.log("Date: ", this.issuedate)
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
    
  }

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

  logout() {
    this.http.post('http://localhost:4200/logout', {}).subscribe(
      () => {
        localStorage.removeItem('token'); // Remove JWT from storage
        this.router.navigate(['/']); // Redirect to login page
      },
      (error) => {
        console.error('Logout failed:', error);
      }
    );
  }
}
