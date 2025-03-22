import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticatorService } from '../services/authenticator.service/authenticator.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticatorService // Inject the AuthenticatorService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token'); // Check if JWT exists

    if (!token) {
      this.router.navigate(['/auth']); // Redirect to login if not authenticated
      return false;
    }

    // Check if the token is 30 days old or older
    if (this.authService.checkTokenAge()) {
      // If the token is expired, the user is already logged out by the service
      this.router.navigate(['/auth']); // Redirect to login
      return false;
    }

    return true; // Allow access to the route
  }
}
