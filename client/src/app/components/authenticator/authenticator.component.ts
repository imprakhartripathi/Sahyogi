import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { AuthenticatorService } from '../../services/authenticator.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar

@Component({
  selector: 'app-authenticator',
  standalone: false,
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.scss'],
})
export class AuthenticatorComponent {
  loginForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticatorService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signupForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe(
        (response: any) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.token);

          // Show a welcome message
          this.snackBar.open(`Welcome Back!   Logged  In  Successfully,  Session  is  Active  for  30  Days`, 'Close', {
            duration: 5000, // Display for 3 seconds
            horizontalPosition: 'center', // Position the snackbar
            verticalPosition: 'bottom',
          });

          this.router.navigate(['/dashboard']); // Redirect to dashboard
        },
        (error) => {
          console.error('Login failed:', error);

          // Show an error message
          this.snackBar.open('Login failed. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'], // Optional: Add custom styling
          });
        }
      );
    }
  }

  onSignUp() {
    if (this.signupForm.valid) {
      const { fullName, email, password } = this.signupForm.value;
      this.authService.signup(fullName, email, password).subscribe(
        (response: any) => {
          console.log('Signup successful:', response);
          localStorage.setItem('token', response.token);

          // Show a welcome message
          this.snackBar.open(`Welcome to Sahyogi, ${fullName}!    Signed  Up  Successfully,  Session  is  Active  for  30  Days`, 'Close', {
            duration: 5000, // Display for 3 seconds
            horizontalPosition: 'center', // Position the snackbar
            verticalPosition: 'bottom',
          });

          this.router.navigate(['/dashboard']); // Redirect to dashboard
        },
        (error) => {
          console.error('Signup failed:', error);

          // Show an error message
          this.snackBar.open('Signup failed. Please try again.', 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar'], // Optional: Add custom styling
          });
        }
      );
    }
  }

  private passwordsMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }
}
