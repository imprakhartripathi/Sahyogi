import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { GetCurrentUserService } from '../get-current-user.service/get-current-user.service';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root', // Provide the service at the root level
})
export class AuthenticatorService {
  user: any;
  iat: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private getCurrentUser: GetCurrentUserService
  ) {}

  // Method to check if the token is 30 days old or older
  checkTokenAge(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false; // No token found
    }

    // Decode the token to get the payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    const iat = payload.iat; // Get the "iat" claim from the token

    if (!iat) {
      return false; // No "iat" claim found
    }

    // Convert iat (seconds) to a Date object
    const issuedAt = new Date(iat * 1000);
    const now = new Date();

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = now.getTime() - issuedAt.getTime();

    // Convert milliseconds to days
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    // If the token is 30 days or older, log the user out
    if (differenceInDays >= 30) {
      this.logout();
      return true; // Token is expired
    }

    return false; // Token is still valid
  }

  // Login method
  login(email: string, password: string) {
    return this.http.post(`${environment.backendUrl}/login`, { email, password });
  }

  // Signup method
  signup(fullName: string, email: string, password: string) {
    return this.http.post(`${environment.backendUrl}/signup`, {
      fullName,
      email,
      password,
    });
  }

  // Logout method
  logout() {
    localStorage.removeItem('token'); // Remove the token from localStorage
    this.router.navigate(['/auth']); // Redirect to the login page
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Returns true if a token exists
  }
}
