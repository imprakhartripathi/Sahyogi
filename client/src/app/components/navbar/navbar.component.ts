import { Component, OnInit } from '@angular/core';
import { GetCurrentUserService } from '../../services/get-current-user.service';
import { UserService } from '../../services/user.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,

  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {
  imgURL: string = 'user.png';
  value: any;
  user: any;
  userData: any;
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
        console.log(this.user);
        console.log(this.user.email);
        this.fetchUser(this.user.email);
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

  search() {
    throw new Error('Method not implemented.');
  }
}
